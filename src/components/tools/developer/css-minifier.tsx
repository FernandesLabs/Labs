'use client'
import * as React from 'react'
import { Eraser, FileCode2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'
// ---------------------------------------------------------------------------
// Tokenizer — split CSS into opaque chunks so we never mutate string/url
// content. Quoted strings and url() bodies are preserved verbatim.
// ---------------------------------------------------------------------------
type CssToken =
  | { type: 'comment'; value: string }
  | { type: 'string'; value: string }
  | { type: 'url'; inner: string }
  | { type: 'raw'; value: string }
function tokenizeCss(input: string): CssToken[] {
  const tokens: CssToken[] = []
  const n = input.length
  let i = 0
  let buf = ''
  const flush = () => {
    if (buf.length > 0) {
      tokens.push({ type: 'raw', value: buf })
      buf = ''
    }
  }
  while (i < n) {
    const ch = input[i]
    const next = input[i + 1]
    // Block comment /* ... */
    if (ch === '/' && next === '*') {
      flush()
      let j = i + 2
      while (j < n && !(input[j] === '*' && input[j + 1] === '/')) j++
      j = Math.min(n, j + 2)
      tokens.push({ type: 'comment', value: input.slice(i, j) })
      i = j
      continue
    }
    // Quoted string ("..." or '...')
    if (ch === '"' || ch === "'") {
      flush()
      const quote = ch
      let j = i + 1
      while (j < n) {
        if (input[j] === '\\') {
          j += 2
          continue
        }
        if (input[j] === quote) {
          j++
          break
        }
        if (input[j] === '\n') {
          // Unterminated string literal — bail at the line break.
          j++
          break
        }
        j++
      }
      tokens.push({ type: 'string', value: input.slice(i, j) })
      i = j
      continue
    }
    // url( ... ) — preserve content verbatim, but tolerate quoted ")" inside.
    if ((ch === 'u' || ch === 'U') && input.slice(i, i + 4).toLowerCase() === 'url(') {
      flush()
      let j = i + 4
      let inner = ''
      while (j < n && input[j] !== ')') {
        if (input[j] === '"' || input[j] === "'") {
          const quote = input[j]
          inner += input[j]
          j++
          while (j < n) {
            if (input[j] === '\\') {
              inner += input[j]
              inner += input[j + 1] ?? ''
              j += 2
              continue
            }
            if (input[j] === quote) {
              inner += input[j]
              j++
              break
            }
            inner += input[j]
            j++
          }
          continue
        }
        inner += input[j]
        j++
      }
      tokens.push({ type: 'url', inner })
      i = j < n ? j + 1 : n
      continue
    }
    buf += ch
    i++
  }
  flush()
  return tokens
}
// ---------------------------------------------------------------------------
// Minifier
// ---------------------------------------------------------------------------
type CssOptions = {
  removeComments: boolean
  collapseWhitespace: boolean
  removeLastSemicolons: boolean
}
function minifyCss(input: string, opts: CssOptions): string {
  if (!input.trim()) return ''
  // Pass 1 — drop comments (if option) and normalise url() bodies, while
  // preserving strings and url() content verbatim. Comments removed here mean
  // adjacent raw runs (e.g. `body /* c */ .cls`) get joined back together so
  // the second pass can collapse their whitespace correctly.
  const pass1 = tokenizeCss(input)
  let intermediate = ''
  for (const tok of pass1) {
    if (tok.type === 'comment' && opts.removeComments) continue
    if (tok.type === 'url') {
      intermediate += 'url(' + tok.inner.trim() + ')'
      continue
    }
    intermediate += tok.value
  }
  // Pass 2 — re-tokenise so whitespace minification only touches raw segments.
  const pass2 = tokenizeCss(intermediate)
  let result = ''
  for (const tok of pass2) {
    if (tok.type === 'comment') {
      result += tok.value
      continue
    }
    if (tok.type === 'string') {
      result += tok.value
      continue
    }
    if (tok.type === 'url') {
      result += 'url(' + tok.inner.trim() + ')'
      continue
    }
    // raw — collapse whitespace and strip spaces around CSS punctuation.
    let v = tok.value
    if (opts.collapseWhitespace) {
      v = v.replace(/\s+/g, ' ').trim()
      // Remove spaces around { } : ; , (the safe set per the task spec).
      v = v.replace(/\s*([{}:;,])\s*/g, '$1')
    }
    result += v
  }
  if (opts.removeLastSemicolons) {
    result = result.replace(/;\s*\}/g, '}')
  }
  // Remove empty rules — selector followed by an empty block. Iterate until
  // stable so empty @media / nested blocks collapse too.
  let prev: string
  do {
    prev = result
    result = result.replace(/[^{}]+\{\s*\}/g, '')
  } while (result !== prev)
  return result.trim()
}
// ---------------------------------------------------------------------------
const SAMPLE = `/* Fernandes Labs — button component */
.btn {
  /* Primary action button */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-family: "Helvetica Neue", sans-serif;
  background: url("/assets/btn-bg.png");
  color: #ffffff;
  border-radius: 0.375rem;
  transition: color 0.15s ease, background 0.15s ease;
}
.btn:hover {
  background: url('/assets/btn-bg-hover.png');
  color: #f5f5f5;
}
/* Empty rule — will be dropped */
.empty-rule {
}
@media (min-width: 768px) {
  .btn { padding: 0.75rem 1.5rem; }
}`
export default function CssMinifier() {
  const [input, setInput] = React.useState('')
  const [removeComments, setRemoveComments] = React.useState(true)
  const [collapseWhitespace, setCollapseWhitespace] = React.useState(true)
  const [removeLastSemicolons, setRemoveLastSemicolons] = React.useState(true)
  const output = React.useMemo(
    () => minifyCss(input, { removeComments, collapseWhitespace, removeLastSemicolons }),
    [input, removeComments, collapseWhitespace, removeLastSemicolons],
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
    toast.success('Sample CSS loaded')
  }
  const handleClear = () => {
    setInput('')
    toast.success('Input cleared')
  }
  return (
    <div className="space-y-5">
      <Field label="CSS input" htmlFor="css-input" hint={`${stats.inBytes} bytes`}>
        <Textarea
          id="css-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="font-mono text-sm"
          spellCheck={false}
          placeholder="Paste your CSS here…"
        />
      </Field>
      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-4"
        role="group"
        aria-label="CSS minification options"
      >
        <div className="flex items-center gap-2">
          <Switch
            id="css-comments"
            checked={removeComments}
            onCheckedChange={setRemoveComments}
          />
          <Label htmlFor="css-comments" className="text-sm">
            Strip comments
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="css-ws"
            checked={collapseWhitespace}
            onCheckedChange={setCollapseWhitespace}
          />
          <Label htmlFor="css-ws" className="text-sm">
            Collapse whitespace
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="css-semi"
            checked={removeLastSemicolons}
            onCheckedChange={setRemoveLastSemicolons}
          />
          <Label htmlFor="css-semi" className="text-sm">
            Drop trailing semicolons
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
        label="Minified CSS"
        rows={8}
        downloadName="styles.min.css"
        empty="Minified output will appear here."
      />
    </div>
  )
}