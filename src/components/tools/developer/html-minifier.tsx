'use client'
import * as React from 'react'
import { Eraser, FileCode2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'
// Elements whose content is "raw text" — whitespace and inner markup must be
// preserved verbatim until the matching close tag.
const RAW_TEXT_ELEMENTS = new Set<string>([
  'pre', 'code', 'textarea', 'script', 'style',
])
// Void elements that never have a close tag.
const VOID_ELEMENTS = new Set<string>([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr',
])
type HtmlOptions = {
  removeComments: boolean
  collapseWhitespace: boolean
  removeEmptyAttributes: boolean
}
function tagNameOf(tagText: string): { name: string; selfClosing: boolean } {
  // tagText begins with `<` (opening) — extract the element name.
  const m = tagText.match(/^<\s*([a-zA-Z][a-zA-Z0-9-]*)/)
  const name = m ? m[1].toLowerCase() : ''
  const selfClosing = tagText.trimEnd().endsWith('/>') || VOID_ELEMENTS.has(name)
  return { name, selfClosing }
}
function removeEmptyAttributes(tagText: string): string {
  // Match ` attr=""` or ` attr=''` (with leading whitespace, empty value).
  // The backreference ensures the closing quote matches the opening one.
  return tagText.replace(
    /\s+[a-zA-Z_:][a-zA-Z0-9_.:-]*\s*=\s*("|')\s*\1/g,
    '',
  )
}
function minifyHtml(input: string, opts: HtmlOptions): string {
  if (!input.trim()) return ''
  const n = input.length
  const out: string[] = []
  let i = 0
  let rawTextTag: string | null = null
  // True when the last emitted chunk ended with `>` (closing tag, opening tag,
  // or doctype). Used to trim leading whitespace of the following text node.
  let prevEndedWithTag = false
  const pushText = (text: string) => {
    if (!text) return
    if (opts.collapseWhitespace) {
      let v = text.replace(/\s+/g, ' ')
      if (prevEndedWithTag) v = v.replace(/^ /, '')
      // The next chunk after a text node in HTML is always a tag, so trim the
      // trailing space too. (Document-end text is handled by the final trim.)
      v = v.replace(/ $/, '')
      if (v) out.push(v)
    } else {
      out.push(text)
    }
  }
  while (i < n) {
    // Raw text element mode — copy content verbatim until the close tag.
    if (rawTextTag) {
      const lower = input.toLowerCase()
      const closeIdx = lower.indexOf(`</${rawTextTag}`, i)
      if (closeIdx === -1) {
        out.push(input.slice(i))
        i = n
        rawTextTag = null
        break
      }
      out.push(input.slice(i, closeIdx))
      i = closeIdx
      rawTextTag = null
      // Fall through so the close tag itself is processed normally.
    }
    const ch = input[i]
    // HTML comment <!-- ... -->
    if (input.startsWith('<!--', i)) {
      const endIdx = input.indexOf('-->', i + 4)
      const end = endIdx === -1 ? n : endIdx + 3
      if (!opts.removeComments) {
        out.push(input.slice(i, end))
        prevEndedWithTag = false
      }
      i = end
      continue
    }
    // Doctype / declaration / processing instruction (<!...> or <?...>)
    if (input.startsWith('<!', i) || input.startsWith('<?', i)) {
      const endIdx = input.indexOf('>', i)
      const end = endIdx === -1 ? n : endIdx + 1
      out.push(input.slice(i, end))
      i = end
      prevEndedWithTag = true
      continue
    }
    // Closing tag </tag>
    if (input.startsWith('</', i)) {
      const endIdx = input.indexOf('>', i)
      const end = endIdx === -1 ? n : endIdx + 1
      out.push(input.slice(i, end))
      i = end
      prevEndedWithTag = true
      continue
    }
    // Opening tag <tag ...> — must be followed by a letter, otherwise treat
    // the lone `<` as text (e.g. `< 5` or `<` at EOF).
    if (ch === '<' && /[a-zA-Z]/.test(input[i + 1] ?? '')) {
      const endIdx = input.indexOf('>', i)
      const end = endIdx === -1 ? n : endIdx + 1
      let tagText = input.slice(i, end)
      const { name, selfClosing } = tagNameOf(tagText)
      if (opts.removeEmptyAttributes) {
        tagText = removeEmptyAttributes(tagText)
      }
      out.push(tagText)
      i = end
      prevEndedWithTag = true
      // Enter raw-text mode for pre/code/textarea/script/style.
      if (!selfClosing && RAW_TEXT_ELEMENTS.has(name)) {
        rawTextTag = name
      }
      continue
    }
    // Text node — copy until the next `<` (lone `<` becomes part of the text).
    let j = i
    while (j < n && input[j] !== '<') j++
    pushText(input.slice(i, j))
    i = j
    prevEndedWithTag = false
  }
  let result = out.join('')
  if (opts.collapseWhitespace) {
    result = result.trim()
  }
  return result
}
// ---------------------------------------------------------------------------
const SAMPLE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Fernandes Labs</title>
    <!-- main stylesheet -->
    <style>
      .btn { color: red; }
    </style>
  </head>
  <body>
    <!-- hero section -->
    <header>
      <h1>Welcome</h1>
      <p class="">Build tools that ship.</p>
    </header>
    <pre>
function greet(name) {
  return "Hi, " + name;
}
    </pre>
    <code>const x = 1 &lt; 2;</code>
    <input type="text" value="" placeholder="Search" disabled />
    <script>
      console.log("loaded");
    </script>
  </body>
</html>`
export default function HtmlMinifier() {
  const [input, setInput] = React.useState('')
  const [removeComments, setRemoveComments] = React.useState(true)
  const [collapseWhitespace, setCollapseWhitespace] = React.useState(true)
  const [removeEmptyAttributes, setRemoveEmptyAttributes] = React.useState(true)
  const output = React.useMemo(
    () =>
      minifyHtml(input, {
        removeComments,
        collapseWhitespace,
        removeEmptyAttributes,
      }),
    [input, removeComments, collapseWhitespace, removeEmptyAttributes],
  )
  const stats = React.useMemo(() => {
    const inBytes = new Blob([input]).size
    const outBytes = new Blob([output]).size
    const saved = Math.max(0, inBytes - outBytes)
    const pct = inBytes > 0 ? Math.round((1 - outBytes / inBytes) * 100) : 0
    return { inBytes, outBytes, saved, pct }
  }, [input, output])
  const handleLoadSample = () => {
    setInput(SAMPLE)
    toast.success('Sample HTML loaded')
  }
  const handleClear = () => {
    setInput('')
    toast.success('Input cleared')
  }
  return (
    <div className="space-y-5">
      <Field label="HTML input" htmlFor="html-input" hint={`${stats.inBytes} bytes`}>
        <Textarea
          id="html-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={9}
          className="font-mono text-sm"
          spellCheck={false}
          placeholder="Paste your HTML here…"
        />
      </Field>
      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-4"
        role="group"
        aria-label="HTML minification options"
      >
        <div className="flex items-center gap-2">
          <Switch
            id="html-comments"
            checked={removeComments}
            onCheckedChange={setRemoveComments}
          />
          <Label htmlFor="html-comments" className="text-sm">
            Strip comments
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="html-ws"
            checked={collapseWhitespace}
            onCheckedChange={setCollapseWhitespace}
          />
          <Label htmlFor="html-ws" className="text-sm">
            Collapse whitespace
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="html-empty-attrs"
            checked={removeEmptyAttributes}
            onCheckedChange={setRemoveEmptyAttributes}
          />
          <Label htmlFor="html-empty-attrs" className="text-sm">
            Remove empty attributes
          </Label>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleLoadSample}>
          <FileCode2 className="size-4" />
          Load sample
        </Button>
        <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input}>
          <Eraser className="size-4" />
          Clear
        </Button>
      </div>
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        role="status"
        aria-live="polite"
      >
        <Stat label="Original" value={`${stats.inBytes} B`} />
        <Stat label="Minified" value={`${stats.outBytes} B`} />
        <Stat
          label="Saved"
          value={`${stats.saved} B`}
          accent={stats.saved > 0 ? '#16a34a' : undefined}
        />
        <Stat
          label="Savings"
          value={stats.inBytes > 0 ? `${stats.pct}%` : '—'}
          accent={stats.pct > 0 ? '#16a34a' : undefined}
        />
      </div>
      <ResultBox
        value={output}
        label="Minified HTML"
        rows={9}
        downloadName="page.min.html"
        empty="Minified output will appear here."
      />
    </div>
  )
}