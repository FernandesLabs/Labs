'use client'
import * as React from 'react'
import { Eraser, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'
const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?><note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body><p>Don't forget me this weekend!</p><p>Bring cake.</p></body></note>`
type Token =
  | { type: 'tag'; value: string; raw: string; start: number }
  | { type: 'text'; value: string; start: number }
/** Tokenize XML into tags + text. */
function tokenizeXml(xml: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < xml.length) {
    if (xml[i] === '<') {
      const end = xml.indexOf('>', i)
      if (end === -1) {
        throw new Error(`Unclosed '<' at position ${i}`)
      }
      tokens.push({
        type: 'tag',
        value: xml.slice(i + 1, end),
        raw: xml.slice(i, end + 1),
        start: i,
      })
      i = end + 1
    } else {
      const next = xml.indexOf('<', i)
      if (next === -1) {
        tokens.push({ type: 'text', value: xml.slice(i), start: i })
        i = xml.length
      } else {
        tokens.push({ type: 'text', value: xml.slice(i, next), start: i })
        i = next
      }
    }
  }
  return tokens
}
function tagName(tagInner: string): string {
  // strip leading "/", "!", "?"
  let s = tagInner.trim()
  if (s.startsWith('/')) s = s.slice(1)
  if (s.startsWith('!') || s.startsWith('?')) return s
  const m = s.match(/^([^\s/>]+)/)
  return m ? m[1] : s
}
function isProcessingOrDecl(tagInner: string): boolean {
  const t = tagInner.trim()
  return t.startsWith('?') || t.startsWith('!')
}
function isSelfClosing(tagInner: string): boolean {
  const t = tagInner.trim()
  return t.endsWith('/')
}
function isClosing(tagInner: string): boolean {
  return tagInner.trim().startsWith('/')
}
function validateWellFormed(tokens: Token[]): string | null {
  const stack: { name: string; pos: number }[] = []
  for (const t of tokens) {
    if (t.type !== 'tag') continue
    const inner = t.value
    if (isProcessingOrDecl(inner)) continue
    if (isSelfClosing(inner)) continue
    if (isClosing(inner)) {
      const name = tagName(inner)
      if (stack.length === 0) {
        return `Unexpected closing tag </${name}> at position ${t.start}`
      }
      const top = stack[stack.length - 1]
      if (top.name !== name) {
        return `Mismatched tag: expected </${top.name}> (opened at ${top.pos}) but found </${name}> at ${t.start}`
      }
      stack.pop()
    } else {
      stack.push({ name: tagName(inner), pos: t.start })
    }
  }
  if (stack.length > 0) {
    const top = stack[stack.length - 1]
    return `Unclosed tag <${top.name}> opened at position ${top.pos}`
  }
  return null
}
function formatXml(xml: string, indent = '  '): string {
  const tokens = tokenizeXml(xml)
  const err = validateWellFormed(tokens)
  if (err) throw new Error(err)
  const lines: string[] = []
  let depth = 0
  for (let k = 0; k < tokens.length; k++) {
    const t = tokens[k]
    if (t.type === 'tag') {
      const inner = t.value
      const closing = isClosing(inner)
      const selfClosing = isSelfClosing(inner) || isProcessingOrDecl(inner)
      if (closing) depth = Math.max(0, depth - 1)
      lines.push(indent.repeat(depth) + t.raw)
      if (!closing && !selfClosing) depth++
    } else {
      const text = t.value.trim()
      if (text) {
        lines.push(indent.repeat(depth) + text)
      }
    }
  }
  return lines.join('\n')
}
function minifyXml(xml: string): string {
  // Collapse whitespace between tags, trim each text node, drop empty text.
  const tokens = tokenizeXml(xml)
  const err = validateWellFormed(tokens)
  if (err) throw new Error(err)
  let out = ''
  for (const t of tokens) {
    if (t.type === 'tag') {
      out += t.raw
    } else {
      const trimmed = t.value.trim()
      if (trimmed) out += trimmed
    }
  }
  return out
}
export default function XmlFormatter() {
  const [input, setInput] = React.useState(SAMPLE)
  const [tab, setTab] = React.useState<'format' | 'minify'>('format')
  const [output, setOutput] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (!input.trim()) {
      setError(null)
      setOutput('')
      return
    }
    try {
      const result =
        tab === 'format' ? formatXml(input) : minifyXml(input)
      setOutput(result)
      setError(null)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      setOutput('')
      toast.error('XML formatting failed')
    }
  }, [input, tab])
  return (
    <div className="space-y-5">
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'format' | 'minify')}>
        <TabsList>
          <TabsTrigger value="format">
            <Maximize2 className="size-3.5" />
            Format
          </TabsTrigger>
          <TabsTrigger value="minify">
            <Minimize2 className="size-3.5" />
            Minify
          </TabsTrigger>
        </TabsList>
        <TabsContent value="format" className="space-y-5">
          <p className="text-xs text-muted-foreground">
            Pretty-prints XML with 2-space indentation. Validates basic
            well-formedness (matching opening/closing tags).
          </p>
        </TabsContent>
        <TabsContent value="minify" className="space-y-5">
          <p className="text-xs text-muted-foreground">
            Removes inter-tag whitespace and trims text nodes. Output is a
            single line.
          </p>
        </TabsContent>
      </Tabs>
      <Field label="XML input" htmlFor="xml-input">
        <Textarea
          id="xml-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="font-mono text-sm"
          spellCheck={false}
          placeholder="<root><item>value</item></root>"
        />
      </Field>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setInput('')}>
          <Eraser className="size-4" />
          Clear
        </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE)}>
          Load sample
        </Button>
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="font-mono text-xs">
            {error}
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Input bytes" value={new Blob([input]).size} />
        <Stat label="Output bytes" value={new Blob([output]).size} />
        <Stat label="Lines" value={output ? output.split('\n').length : 0} />
      </div>
      <ResultBox
        value={output}
        label={tab === 'format' ? 'Formatted XML' : 'Minified XML'}
        rows={12}
        downloadName={tab === 'format' ? 'formatted.xml' : 'minified.xml'}
        empty={error ? 'Fix the error above to see output.' : 'Formatted output will appear here.'}
      />
    </div>
  )
}