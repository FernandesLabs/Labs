'use client'
import * as React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
// ---------------------------------------------------------------------------
// Tokenizer
// ---------------------------------------------------------------------------
type SqlToken =
  | { type: 'word'; value: string }
  | { type: 'string'; value: string }
  | { type: 'comment'; value: string }
  | { type: 'paren'; value: '(' | ')'; attached: boolean }
  | { type: 'punct'; value: string }
  | { type: 'other'; value: string }
const WORD_RE = /[A-Za-z0-9_$]/
const WS_RE = /\s/
function tokenizeSql(input: string): SqlToken[] {
  const tokens: SqlToken[] = []
  const n = input.length
  let i = 0
  let prevType: string | null = null
  let spaceBefore = false
  const push = (t: SqlToken) => {
    if (t.type === 'paren' && t.value === '(') {
      t.attached = prevType === 'word' && !spaceBefore
    }
    tokens.push(t)
    prevType = t.type
    spaceBefore = false
  }
  while (i < n) {
    const ch = input[i]
    if (WS_RE.test(ch)) {
      i++
      spaceBefore = true
      continue
    }
    // line comment -- ...
    if (ch === '-' && input[i + 1] === '-') {
      let j = i + 2
      while (j < n && input[j] !== '\n') j++
      push({ type: 'comment', value: input.slice(i, j) })
      i = j
      continue
    }
    // block comment /* ... */
    if (ch === '/' && input[i + 1] === '*') {
      let j = i + 2
      while (j < n && !(input[j] === '*' && input[j + 1] === '/')) j++
      j = Math.min(n, j + 2)
      push({ type: 'comment', value: input.slice(i, j) })
      i = j
      continue
    }
    // string literal (single quote, double quote, backtick)
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch
      let j = i + 1
      let value = quote
      while (j < n) {
        const cj = input[j]
        if (cj === quote) {
          // doubled quote = escaped
          if (input[j + 1] === quote) {
            value += quote + quote
            j += 2
            continue
          }
          value += quote
          j++
          break
        }
        value += cj
        j++
      }
      push({ type: 'string', value })
      i = j
      continue
    }
    // parentheses
    if (ch === '(' || ch === ')') {
      push({ type: 'paren', value: ch, attached: false })
      i++
      continue
    }
    // punctuation
    if (ch === ',' || ch === ';' || ch === '.') {
      push({ type: 'punct', value: ch })
      i++
      continue
    }
    // multi-char operators
    const two = input.slice(i, i + 2)
    if (two === '<>' || two === '!=' || two === '<=' || two === '>=' || two === '||' || two === ':=' || two === '::') {
      push({ type: 'other', value: two })
      i += 2
      continue
    }
    // word
    if (WORD_RE.test(ch)) {
      let j = i
      let value = ''
      while (j < n && WORD_RE.test(input[j])) {
        value += input[j]
        j++
      }
      push({ type: 'word', value })
      i = j
      continue
    }
    // single-char other
    push({ type: 'other', value: ch })
    i++
  }
  return tokens
}
// ---------------------------------------------------------------------------
// Multi-word keyword merger
// ---------------------------------------------------------------------------
function nextWordIndex(tokens: SqlToken[], from: number): number {
  for (let j = from; j < tokens.length; j++) {
    // The tokenizer discards whitespace, so the first token after a word is
    // either another word (multi-word keyword) or something else.
    if (tokens[j].type === 'word') return j
    return -1
  }
  return -1
}
function mergeMultiWord(tokens: SqlToken[]): SqlToken[] {
  const out: SqlToken[] = []
  let i = 0
  while (i < tokens.length) {
    const t = tokens[i]
    if (t.type === 'word') {
      const up = t.value.toUpperCase()
      const j1 = nextWordIndex(tokens, i + 1)
      if (j1 >= 0) {
        const up1 = tokens[j1].value.toUpperCase()
        const combos: Record<string, Record<string, string>> = {
          INNER: { JOIN: 'INNER JOIN' },
          LEFT: { JOIN: 'LEFT JOIN', OUTER: 'LEFT OUTER' },
          RIGHT: { JOIN: 'RIGHT JOIN', OUTER: 'RIGHT OUTER' },
          FULL: { JOIN: 'FULL JOIN', OUTER: 'FULL OUTER' },
          CROSS: { JOIN: 'CROSS JOIN' },
          GROUP: { BY: 'GROUP BY' },
          ORDER: { BY: 'ORDER BY' },
          INSERT: { INTO: 'INSERT INTO' },
          DELETE: { FROM: 'DELETE FROM' },
          UNION: { ALL: 'UNION ALL', DISTINCT: 'UNION DISTINCT' },
          INTERSECT: { ALL: 'INTERSECT ALL' },
          EXCEPT: { ALL: 'EXCEPT ALL' },
          IS: { NOT: 'IS NOT' },
          NOT: { IN: 'NOT IN', EXISTS: 'NOT EXISTS', LIKE: 'NOT LIKE', BETWEEN: 'NOT BETWEEN', NULL: 'NOT NULL' },
        }
        if (combos[up]?.[up1]) {
          const merged = combos[up][up1]
          // Try 3-word: LEFT OUTER JOIN etc.
          const j2 = nextWordIndex(tokens, j1 + 1)
          if (j2 >= 0 && (merged === 'LEFT OUTER' || merged === 'RIGHT OUTER' || merged === 'FULL OUTER')) {
            const up2 = tokens[j2].value.toUpperCase()
            if (up2 === 'JOIN') {
              out.push({ type: 'word', value: `${merged} JOIN` })
              i = j2 + 1
              continue
            }
          }
          out.push({ type: 'word', value: merged })
          i = j1 + 1
          continue
        }
      }
    }
    out.push(t)
    i++
  }
  return out
}
// ---------------------------------------------------------------------------
// Keyword sets
// ---------------------------------------------------------------------------
const NEWLINE_KEYWORDS = new Set<string>([
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
  'FULL JOIN', 'CROSS JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN',
  'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL',
  'UNION DISTINCT', 'INTERSECT', 'INTERSECT ALL', 'EXCEPT', 'EXCEPT ALL',
  'VALUES', 'SET', 'INSERT INTO', 'UPDATE', 'DELETE FROM', 'CREATE', 'ALTER',
  'DROP', 'WITH', 'RETURNING', 'AND', 'OR', 'ON', 'USING', 'CONNECT BY',
  'START WITH', 'QUALIFY', 'WINDOW',
])
const KEYWORDS = new Set<string>([
  // clause keywords
  ...NEWLINE_KEYWORDS,
  // other reserved words
  'AS', 'IN', 'EXISTS', 'NOT', 'NULL', 'IS', 'LIKE', 'BETWEEN', 'ALL',
  'DISTINCT', 'BY', 'INTO', 'OUTER', 'ASC', 'DESC', 'CASE', 'WHEN', 'THEN',
  'ELSE', 'END', 'BEGIN', 'COMMIT', 'ROLLBACK', 'TABLE', 'INDEX', 'VIEW',
  'DATABASE', 'SCHEMA', 'SEQUENCE', 'FUNCTION', 'PROCEDURE', 'TRIGGER',
  'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'DEFAULT', 'CHECK', 'UNIQUE',
  'CONSTRAINT', 'CAST', 'CONVERT', 'IF', 'ANY', 'SOME', 'TRUE', 'FALSE',
  'UNKNOWN', 'TOP', 'DISTINCT', 'NATURAL', 'RECURSIVE', 'TEMPORARY', 'TEMP',
  'IF EXISTS', 'IF NOT EXISTS', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS',
  'GROUP', 'ORDER', 'INSERT', 'DELETE', 'UNION', 'INTERSECT', 'EXCEPT',
  // common function names that are conventionally uppercased
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'NULLIF', 'GREATEST',
  'LEAST', 'CONCAT', 'SUBSTRING', 'SUBSTR', 'TRIM', 'LENGTH', 'LOWER',
  'UPPER', 'REPLACE', 'POSITION', 'EXTRACT', 'DATE', 'TIME', 'TIMESTAMP',
  'INTERVAL', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'NOW',
])
function isKeyword(word: string): boolean {
  return KEYWORDS.has(word.toUpperCase())
}
// Words that, when preceding `(`, indicate a grouping/subquery rather than a function call
const PAREN_CONTEXT_WORDS = new Set<string>([
  'IN', 'EXISTS', 'VALUES', 'ANY', 'SOME', 'WHERE', 'ON', 'HAVING', 'AND',
  'OR', 'NOT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'BY', 'JOIN',
])
// ---------------------------------------------------------------------------
// Formatter
// ---------------------------------------------------------------------------
type FormatOptions = {
  indent: number
}
function formatSql(input: string, opts: FormatOptions): string {
  if (!input.trim()) return ''
  const raw = tokenizeSql(input)
  const tokens = mergeMultiWord(raw)
  const indentUnit = ' '.repeat(opts.indent)
  let out = ''
  let depth = 0
  let atLineStart = true
  let firstToken = true
  let lastMeaningful: SqlToken | null = null
  const parenStack: boolean[] = [] // true = attached/function-call paren
  const indentStr = () => indentUnit.repeat(Math.max(0, depth))
  const newline = () => {
    if (!atLineStart) {
      out += '\n'
      atLineStart = true
    }
  }
  const startLine = () => {
    if (atLineStart) {
      out += indentStr()
      atLineStart = false
    }
  }
  const needsSpace = (prev: SqlToken | null, curr: SqlToken): boolean => {
    if (!prev) return false
    if (prev.type === 'paren' && prev.value === '(') return false
    if (curr.type === 'paren' && curr.value === ')') return false
    if (curr.type === 'punct' && (curr.value === ',' || curr.value === '.' || curr.value === ';')) return false
    if (prev.type === 'punct' && prev.value === '.') return false
    return true
  }
  for (const tok of tokens) {
    if (tok.type === 'comment') {
      newline()
      startLine()
      out += tok.value
      atLineStart = false
      newline()
      firstToken = false
      lastMeaningful = tok
      continue
    }
    if (tok.type === 'string') {
      startLine()
      if (!atLineStart && needsSpace(lastMeaningful, tok)) out += ' '
      out += tok.value
      atLineStart = false
      firstToken = false
      lastMeaningful = tok
      continue
    }
    if (tok.type === 'paren') {
      if (tok.value === '(') {
        const prevWord =
          lastMeaningful?.type === 'word' ? lastMeaningful.value.toUpperCase() : ''
        const isGrouping =
          !tok.attached ||
          PAREN_CONTEXT_WORDS.has(prevWord) ||
          NEWLINE_KEYWORDS.has(prevWord)
        parenStack.push(!isGrouping)
        if (isGrouping) {
          startLine()
          if (!atLineStart && needsSpace(lastMeaningful, tok)) out += ' '
          out += '('
          depth++
          newline()
        } else {
          startLine()
          out += '('
        }
        firstToken = false
        lastMeaningful = tok
        continue
      }
      // closing paren
      const wasAttached = parenStack.pop() ?? false
      if (wasAttached) {
        out += ')'
      } else {
        depth = Math.max(0, depth - 1)
        newline()
        startLine()
        out += ')'
      }
      atLineStart = false
      firstToken = false
      lastMeaningful = tok
      continue
    }
    if (tok.type === 'punct') {
      if (tok.value === ',') {
        out += ','
        newline()
      } else if (tok.value === ';') {
        out += ';'
        newline()
        newline()
        depth = 0
        atLineStart = true
      } else if (tok.value === '.') {
        out += '.'
      } else {
        out += tok.value
      }
      firstToken = false
      lastMeaningful = tok
      continue
    }
    if (tok.type === 'word') {
      const up = tok.value.toUpperCase()
      const isClause = NEWLINE_KEYWORDS.has(up)
      const render = isKeyword(up) ? up : tok.value
      if (isClause && !firstToken) {
        newline()
        startLine()
        out += render
      } else {
        startLine()
        if (!atLineStart && needsSpace(lastMeaningful, tok)) out += ' '
        out += render
      }
      atLineStart = false
      firstToken = false
      lastMeaningful = tok
      continue
    }
    // other (operators)
    startLine()
    if (!atLineStart && needsSpace(lastMeaningful, tok)) out += ' '
    out += tok.value
    atLineStart = false
    firstToken = false
    lastMeaningful = tok
  }
  return out.replace(/\n{3,}/g, '\n\n').trim()
}
// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const SAMPLE = `select u.id, u.name, count(o.id) as order_count, sum(o.total) as spent
from users u
left join orders o on o.user_id = u.id and o.status = 'paid'
where u.created_at >= '2024-01-01' and (u.country = 'US' or u.country = 'CA')
group by u.id, u.name
having count(o.id) > 0
order by spent desc
limit 10 offset 20;`
export default function SqlFormatter() {
  const [input, setInput] = React.useState('')
  const [indent, setIndent] = React.useState('2')
  const output = React.useMemo(() => {
    if (!input.trim()) return ''
    try {
      return formatSql(input, { indent: Number(indent) || 2 })
    } catch {
      return ''
    }
  }, [input, indent])
  const handleCopyError = () => {
    if (input.trim() && !output) {
      toast.error('Could not format SQL', {
        description: 'The input could not be parsed. Check for unterminated strings or comments.',
      })
    }
  }
  const stats = React.useMemo(() => {
    const lines = output ? output.split('\n').length : 0
    const keywords = output
      ? (output.match(/\b(SELECT|FROM|WHERE|JOIN|ON|GROUP BY|ORDER BY|HAVING|LIMIT|AND|OR|UNION)\b/g) || []).length
      : 0
    return { lines, keywords }
  }, [output])
  return (
    <div className="space-y-5">
      <Field
        label="SQL input"
        htmlFor="sql-input"
        hint={`${input.length} chars`}
      >
        <Textarea
          id="sql-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={handleCopyError}
          placeholder="Paste raw SQL here…"
          rows={7}
          className="font-mono"
          spellCheck={false}
        />
      </Field>
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Indent size" htmlFor="sql-indent" className="w-32">
          <Select value={indent} onValueChange={setIndent}>
            <SelectTrigger id="sql-indent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 spaces</SelectItem>
              <SelectItem value="4">4 spaces</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setInput(SAMPLE)}
        >
          Load sample
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setInput('')}
          disabled={!input}
        >
          Clear
        </Button>
      </div>
      {output ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Stat label="Lines" value={stats.lines} />
          <Stat label="Keywords" value={stats.keywords} />
          <Stat label="Indent" value={`${indent} sp`} />
        </div>
      ) : null}
      <ResultBox
        label="Formatted SQL"
        value={output}
        rows={10}
        downloadName="formatted.sql"
        empty="Formatted SQL will appear here."
      />
    </div>
  )
}