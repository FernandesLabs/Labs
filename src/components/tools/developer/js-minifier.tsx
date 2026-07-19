'use client'
import * as React from 'react'
import { Eraser, FileCode2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'
// ---------------------------------------------------------------------------
// Tokenizer — state machine that distinguishes regex literals from division
// by inspecting the previous significant token, and preserves the content of
// strings, template literals, and regexes verbatim.
// ---------------------------------------------------------------------------
type JsToken =
  | { type: 'ws'; value: string }
  | { type: 'comment-line'; value: string }
  | { type: 'comment-block'; value: string }
  | { type: 'string'; value: string }
  | { type: 'template'; value: string }
  | { type: 'regex'; value: string }
  | { type: 'word'; value: string }
  | { type: 'number'; value: string }
  | { type: 'punct'; value: string }
  | { type: 'op'; value: string }
// Keywords after which a leading `/` must be a regex, not division.
const REGEX_AFTER_KEYWORDS = new Set<string>([
  'return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void',
  'throw', 'case', 'do', 'else', 'yield', 'await', 'if', 'while', 'for',
  'switch', 'catch',
])
// Keywords where a following newline can trigger ASI — preserve the newline so
// we don't silently change `return\n[1,2,3]` into `return [1,2,3]`.
const ASI_KEYWORDS = new Set<string>([
  'return', 'throw', 'yield', 'break', 'continue',
])
const MULTI_CHAR_OPS = new Set<string>([
  '==', '!=', '<=', '>=', '=>', '&&', '||', '++', '--', '+=', '-=', '*=',
  '/=', '%=', '**', '<<', '>>', '??', '?.', '&=', '|=', '^=', '<<=', '>>=',
])
const THREE_CHAR_OPS = new Set<string>([
  '...', '===', '!==', '**=', '>>>',
])
const PUNCT = '()[]{};,?:.'
function isWs(c: string): boolean {
  return c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f' || c === '\v'
}
function isIdentStart(c: string): boolean {
  return /[A-Za-z_$]/.test(c)
}
function isIdentPart(c: string): boolean {
  return /[A-Za-z0-9_$]/.test(c)
}
function isDigit(c: string): boolean {
  return c >= '0' && c <= '9'
}
function tokenizeJs(input: string): JsToken[] {
  const tokens: JsToken[] = []
  const n = input.length
  let i = 0
  const lastSignificant = (): JsToken | null => {
    for (let k = tokens.length - 1; k >= 0; k--) {
      const t = tokens[k]
      if (
        t.type !== 'ws' &&
        t.type !== 'comment-line' &&
        t.type !== 'comment-block'
      ) {
        return t
      }
    }
    return null
  }
  const regexAllowed = (): boolean => {
    const last = lastSignificant()
    if (!last) return true
    if (last.type === 'word') {
      return REGEX_AFTER_KEYWORDS.has(last.value)
    }
    if (last.type === 'punct') {
      // After `(`, `[`, `{`, `,`, `;`, `?`, `:` a regex is allowed.
      return '([{,;:?'.includes(last.value)
    }
    if (last.type === 'op') {
      // After any operator (incl. arrow `=>`) a regex is allowed.
      return true
    }
    // After string / template / number / regex / `)` / `]` / `}` → division.
    return false
  }
  while (i < n) {
    const ch = input[i]
    const next = input[i + 1]
    // Whitespace
    if (isWs(ch)) {
      let j = i
      while (j < n && isWs(input[j])) j++
      tokens.push({ type: 'ws', value: input.slice(i, j) })
      i = j
      continue
    }
    // Line comment //...
    if (ch === '/' && next === '/') {
      let j = i + 2
      while (j < n && input[j] !== '\n') j++
      tokens.push({ type: 'comment-line', value: input.slice(i, j) })
      i = j
      continue
    }
    // Block comment /* ... */
    if (ch === '/' && next === '*') {
      let j = i + 2
      while (j < n && !(input[j] === '*' && input[j + 1] === '/')) j++
      j = Math.min(n, j + 2)
      tokens.push({ type: 'comment-block', value: input.slice(i, j) })
      i = j
      continue
    }
    // String literal "..." or '...'
    if (ch === '"' || ch === "'") {
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
          // Unterminated string — bail at the line break.
          break
        }
        j++
      }
      tokens.push({ type: 'string', value: input.slice(i, j) })
      i = j
      continue
    }
    // Template literal `...` — track ${ } nesting and nested templates.
    if (ch === '`') {
      let j = i + 1
      while (j < n) {
        const cj = input[j]
        if (cj === '\\') {
          j += 2
          continue
        }
        if (cj === '`') {
          j++
          break
        }
        if (cj === '$' && input[j + 1] === '{') {
          // Skip the interpolation expression by tracking brace depth and
          // recursing into nested template literals.
          j += 2
          let depth = 1
          while (j < n && depth > 0) {
            const ck = input[j]
            if (ck === '\\') {
              j += 2
              continue
            }
            if (ck === '{') {
              depth++
              j++
              continue
            }
            if (ck === '}') {
              depth--
              j++
              continue
            }
            if (ck === '`') {
              // Nested template — consume it as opaque until its matching
              // backtick, respecting ${ } inside.
              j++
              let nested = 1
              while (j < n && nested > 0) {
                const cn = input[j]
                if (cn === '\\') {
                  j += 2
                  continue
                }
                if (cn === '`') {
                  nested--
                  j++
                  continue
                }
                if (cn === '$' && input[j + 1] === '{') {
                  j += 2
                  let inner = 1
                  while (j < n && inner > 0) {
                    if (input[j] === '\\') {
                      j += 2
                      continue
                    }
                    if (input[j] === '{') {
                      inner++
                      j++
                      continue
                    }
                    if (input[j] === '}') {
                      inner--
                      j++
                      continue
                    }
                    j++
                  }
                  continue
                }
                j++
              }
              continue
            }
            j++
          }
          continue
        }
        j++
      }
      tokens.push({ type: 'template', value: input.slice(i, j) })
      i = j
      continue
    }
    // Regex literal /.../flags — only when the context allows it.
    if (ch === '/' && regexAllowed()) {
      let j = i + 1
      let inClass = false
      while (j < n) {
        const cj = input[j]
        if (cj === '\\') {
          j += 2
          continue
        }
        if (cj === '[') {
          inClass = true
          j++
          continue
        }
        if (cj === ']') {
          inClass = false
          j++
          continue
        }
        if (cj === '/' && !inClass) {
          j++
          break
        }
        if (cj === '\n') break // unterminated
        j++
      }
      while (j < n && /[a-zA-Z]/.test(input[j])) j++
      tokens.push({ type: 'regex', value: input.slice(i, j) })
      i = j
      continue
    }
    // Number literal
    if (isDigit(ch) || (ch === '.' && isDigit(next))) {
      let j = i
      if (ch === '0' && (next === 'x' || next === 'X' || next === 'o' || next === 'O' || next === 'b' || next === 'B')) {
        j = i + 2
        while (j < n && /[0-9a-fA-F_]/.test(input[j])) j++
      } else {
        while (j < n && /[0-9._]/.test(input[j])) j++
        if (j < n && (input[j] === 'e' || input[j] === 'E')) {
          j++
          if (j < n && (input[j] === '+' || input[j] === '-')) j++
          while (j < n && /[0-9_]/.test(input[j])) j++
        }
      }
      if (j < n && input[j] === 'n') j++ // BigInt suffix
      tokens.push({ type: 'number', value: input.slice(i, j) })
      i = j
      continue
    }
    // Identifier / keyword
    if (isIdentStart(ch)) {
      let j = i
      while (j < n && isIdentPart(input[j])) j++
      tokens.push({ type: 'word', value: input.slice(i, j) })
      i = j
      continue
    }
    // 3-char operators
    const three = input.slice(i, i + 3)
    if (THREE_CHAR_OPS.has(three)) {
      tokens.push({ type: 'op', value: three })
      i += 3
      continue
    }
    // 2-char operators
    const two = input.slice(i, i + 2)
    if (MULTI_CHAR_OPS.has(two)) {
      tokens.push({ type: 'op', value: two })
      i += 2
      continue
    }
    // Punctuation
    if (PUNCT.includes(ch)) {
      tokens.push({ type: 'punct', value: ch })
      i++
      continue
    }
    // Single-char operator
    tokens.push({ type: 'op', value: ch })
    i++
  }
  return tokens
}
// ---------------------------------------------------------------------------
// Minifier
// ---------------------------------------------------------------------------
type JsOptions = {
  removeComments: boolean
  collapseWhitespace: boolean
  removeSemicolonsBeforeBrace: boolean
}
function isWordLike(t: JsToken): boolean {
  return t.type === 'word' || t.type === 'number'
}
function minifyJs(input: string, opts: JsOptions): string {
  if (!input.trim()) return ''
  const tokens = tokenizeJs(input)
  const out: string[] = []
  let prevSig: JsToken | null = null
  let pendingGap = false
  let pendingGapHasNewline = false
  for (let k = 0; k < tokens.length; k++) {
    const tok = tokens[k]
    if (tok.type === 'comment-line' || tok.type === 'comment-block') {
      if (opts.removeComments) {
        pendingGap = true
        if (tok.value.includes('\n')) pendingGapHasNewline = true
      } else {
        // Keep the comment text — it visually separates tokens so no extra
        // space is required. Restore the line break for `//` comments so the
        // following token does not get merged into the comment.
        out.push(tok.value)
        if (tok.type === 'comment-line') out.push('\n')
      }
      continue
    }
    if (tok.type === 'ws') {
      if (!opts.collapseWhitespace) {
        out.push(tok.value)
      } else {
        pendingGap = true
        if (tok.value.includes('\n')) pendingGapHasNewline = true
      }
      continue
    }
    // Significant token — maybe insert a separator first.
    if (opts.collapseWhitespace && pendingGap && prevSig) {
      if (
        prevSig.type === 'word' &&
        ASI_KEYWORDS.has(prevSig.value) &&
        pendingGapHasNewline
      ) {
        // Preserve a newline so ASI behaviour is unchanged.
        const last = out[out.length - 1]
        if (last !== '\n') out.push('\n')
      } else if (isWordLike(prevSig) && isWordLike(tok)) {
        const last = out[out.length - 1]
        if (last !== ' ' && last !== '\n') out.push(' ')
      }
    }
    pendingGap = false
    pendingGapHasNewline = false
    out.push(tok.value)
    prevSig = tok
  }
  let result = out.join('')
  if (opts.removeSemicolonsBeforeBrace) {
    result = result.replace(/;\s*\}/g, '}')
  }
  return result.trim()
}
// ---------------------------------------------------------------------------
const SAMPLE = `// Calculate the nth Fibonacci number.
function fib(n) {
  if (n < 2) {
    return n;
  }
  // Recursive case — small inputs only!
  return fib(n - 1) + fib(n - 2);
}
/* Demo constants */
const greeting = "Hello, world!";
const pattern = /\\d+/g;
const template = \`Result: \${fib(10)}\`;
const arr = [1, 2, 3];
const obj = { a: 1, b: 2 };
const isBig = (x) => x >= 100;
const double = (x) => x * 2;`
export default function JsMinifier() {
  const [input, setInput] = React.useState('')
  const [removeComments, setRemoveComments] = React.useState(true)
  const [collapseWhitespace, setCollapseWhitespace] = React.useState(true)
  const [removeSemicolonsBeforeBrace, setRemoveSemicolonsBeforeBrace] = React.useState(true)
  const output = React.useMemo(
    () =>
      minifyJs(input, {
        removeComments,
        collapseWhitespace,
        removeSemicolonsBeforeBrace,
      }),
    [input, removeComments, collapseWhitespace, removeSemicolonsBeforeBrace],
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
    toast.success('Sample JavaScript loaded')
  }
  const handleClear = () => {
    setInput('')
    toast.success('Input cleared')
  }
  return (
    <div className="space-y-5">
      <Alert>
        <AlertDescription>
          <strong className="font-semibold">Basic minifier</strong> — no
          variable renaming or dead code elimination. For production, use{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">terser</code>{' '}
          or{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">esbuild</code>.
          String, template, and regex literals are preserved; whitespace is
          collapsed where it is safe.
        </AlertDescription>
      </Alert>
      <Field label="JavaScript input" htmlFor="js-input" hint={`${stats.inBytes} bytes`}>
        <Textarea
          id="js-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={9}
          className="font-mono text-sm"
          spellCheck={false}
          placeholder="Paste your JavaScript here…"
        />
      </Field>
      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-4"
        role="group"
        aria-label="JavaScript minification options"
      >
        <div className="flex items-center gap-2">
          <Switch
            id="js-comments"
            checked={removeComments}
            onCheckedChange={setRemoveComments}
          />
          <Label htmlFor="js-comments" className="text-sm">
            Strip comments
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="js-ws"
            checked={collapseWhitespace}
            onCheckedChange={setCollapseWhitespace}
          />
          <Label htmlFor="js-ws" className="text-sm">
            Collapse whitespace
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="js-semi"
            checked={removeSemicolonsBeforeBrace}
            onCheckedChange={setRemoveSemicolonsBeforeBrace}
          />
          <Label htmlFor="js-semi" className="text-sm">
            Drop <code className="font-mono text-xs">;</code> before{' '}
            <code className="font-mono text-xs">{'}'}</code>
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
        label="Minified JavaScript"
        rows={9}
        downloadName="script.min.js"
        empty="Minified output will appear here."
      />
    </div>
  )
}