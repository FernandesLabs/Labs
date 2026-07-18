'use client'

import * as React from 'react'
import { Eraser, FileText, GitCompare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'

type DiffOpType = 'equal' | 'add' | 'remove'

interface DiffOp {
  type: DiffOpType
  value: string
}

interface DiffStats {
  added: number
  removed: number
  unchanged: number
}

interface CompareOptions {
  ignoreCase: boolean
  ignoreWhitespace: boolean
}

type DiffMode = 'line' | 'word' | 'char'

// --- Tokenizers / splitters ----------------------------------------------

function splitLines(text: string): string[] {
  if (text === '') return []
  return text.replace(/\r\n?/g, '\n').split('\n')
}

function splitWords(text: string, ignoreWhitespace: boolean): string[] {
  const normalized = text.replace(/\r\n?/g, '\n')
  if (ignoreWhitespace) {
    const collapsed = normalized.replace(/\s+/g, ' ').trim()
    return collapsed ? collapsed.split(' ').filter(Boolean) : []
  }
  const tokens: string[] = []
  const parts = normalized.split(/(\s+)/)
  for (const part of parts) {
    if (part === '') continue
    tokens.push(part)
  }
  return tokens
}

function splitChars(text: string, ignoreWhitespace: boolean): string[] {
  if (ignoreWhitespace) {
    return text.replace(/\s+/g, '').split('')
  }
  return text.replace(/\r\n?/g, '\n').split('')
}

// --- Normalization --------------------------------------------------------

function normalize(value: string, opts: CompareOptions): string {
  let s = value
  if (opts.ignoreCase) s = s.toLowerCase()
  return s
}

// --- LCS diff (iterative backtracking) ------------------------------------

function lcsDiff(aOrig: string[], bOrig: string[], opts: CompareOptions): DiffOp[] {
  if (aOrig.length === 0) {
    return bOrig.map((v) => ({ type: 'add' as DiffOpType, value: v }))
  }
  if (bOrig.length === 0) {
    return aOrig.map((v) => ({ type: 'remove' as DiffOpType, value: v }))
  }

  const a = aOrig.map((v) => normalize(v, opts))
  const b = bOrig.map((v) => normalize(v, opts))
  const m = a.length
  const n = b.length

  // dp[i][j] = LCS length of a[i..] and b[j..]
  const dp: Uint32Array[] = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1))
  for (let i = m - 1; i >= 0; i--) {
    const cur = dp[i]
    const next = dp[i + 1]
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        cur[j] = next[j + 1] + 1
      } else {
        cur[j] = Math.max(next[j], cur[j + 1])
      }
    }
  }

  const ops: DiffOp[] = []
  let i = 0
  let j = 0
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      ops.push({ type: 'equal', value: aOrig[i] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'remove', value: aOrig[i] })
      i++
    } else {
      ops.push({ type: 'add', value: bOrig[j] })
      j++
    }
  }
  while (i < m) {
    ops.push({ type: 'remove', value: aOrig[i] })
    i++
  }
  while (j < n) {
    ops.push({ type: 'add', value: bOrig[j] })
    j++
  }
  return ops
}

function computeStats(ops: DiffOp[]): DiffStats {
  let added = 0
  let removed = 0
  let unchanged = 0
  for (const op of ops) {
    if (op.type === 'add') added++
    else if (op.type === 'remove') removed++
    else unchanged++
  }
  return { added, removed, unchanged }
}

// --- Unified diff text output (line mode) ---------------------------------

function toUnifiedLineDiff(ops: DiffOp[], context = 3): string {
  const lines: string[] = ['--- a', '+++ b']
  const changeIdx: number[] = []
  for (let i = 0; i < ops.length; i++) {
    if (ops[i].type !== 'equal') changeIdx.push(i)
  }
  if (changeIdx.length === 0) return lines.join('\n')

  interface Hunk {
    start: number
    end: number
  }
  const hunks: Hunk[] = []
  let current: Hunk = {
    start: Math.max(0, changeIdx[0] - context),
    end: Math.min(ops.length - 1, changeIdx[0] + context),
  }
  for (let k = 1; k < changeIdx.length; k++) {
    const ci = changeIdx[k]
    if (ci - context <= current.end) {
      current.end = Math.min(ops.length - 1, ci + context)
    } else {
      hunks.push(current)
      current = {
        start: Math.max(0, ci - context),
        end: Math.min(ops.length - 1, ci + context),
      }
    }
  }
  hunks.push(current)

  for (const hunk of hunks) {
    let oi = 0
    let mi = 0
    for (let i = 0; i < hunk.start; i++) {
      const t = ops[i].type
      if (t === 'equal') {
        oi++
        mi++
      } else if (t === 'remove') {
        oi++
      } else {
        mi++
      }
    }
    const oldStart = oi + 1
    const newStart = mi + 1
    let oldCount = 0
    let newCount = 0
    for (let i = hunk.start; i <= hunk.end; i++) {
      const t = ops[i].type
      if (t === 'equal') {
        oldCount++
        newCount++
      } else if (t === 'remove') {
        oldCount++
      } else {
        newCount++
      }
    }
    lines.push(`@@ -${oldStart},${oldCount} +${newStart},${newCount} @@`)
    for (let i = hunk.start; i <= hunk.end; i++) {
      const op = ops[i]
      const prefix = op.type === 'equal' ? ' ' : op.type === 'remove' ? '-' : '+'
      lines.push(prefix + op.value)
    }
  }
  return lines.join('\n')
}

// --- Unified text diff for word/char modes -------------------------------

function toInlineUnified(ops: DiffOp[]): string {
  // For word/char mode, emit a single-stream unified text with prefixes.
  const lines: string[] = ['--- a', '+++ b']
  for (const op of ops) {
    const prefix = op.type === 'equal' ? ' ' : op.type === 'remove' ? '-' : '+'
    if (op.value === '\n') {
      lines.push(prefix === ' ' ? ' ' : prefix)
    } else {
      lines.push(prefix + op.value)
    }
  }
  return lines.join('\n')
}

// --- Constants ------------------------------------------------------------

const SAMPLE_A = `The quick brown fox
jumps over the lazy dog.
A classic pangram for testing.
Line four is unchanged.
Line five will be removed.`

const SAMPLE_B = `The quick red fox
jumps over the sleepy dog.
A classic pangram for testing.
A brand new line was added here.
Line four is unchanged.`

interface DiffResult {
  ops: DiffOp[]
  stats: DiffStats
  unified: string
}

export default function TextCompareDiff(): React.JSX.Element {
  const [textA, setTextA] = React.useState<string>(SAMPLE_A)
  const [textB, setTextB] = React.useState<string>(SAMPLE_B)
  const [mode, setMode] = React.useState<DiffMode>('line')
  const [ignoreCase, setIgnoreCase] = React.useState<boolean>(false)
  const [ignoreWhitespace, setIgnoreWhitespace] = React.useState<boolean>(false)

  const opts: CompareOptions = { ignoreCase, ignoreWhitespace }

  const result = React.useMemo<DiffResult>(() => {
    let aTokens: string[]
    let bTokens: string[]
    if (mode === 'line') {
      aTokens = splitLines(textA)
      bTokens = splitLines(textB)
    } else if (mode === 'word') {
      aTokens = splitWords(textA, ignoreWhitespace)
      bTokens = splitWords(textB, ignoreWhitespace)
    } else {
      aTokens = splitChars(textA, ignoreWhitespace)
      bTokens = splitChars(textB, ignoreWhitespace)
    }
    const ops = lcsDiff(aTokens, bTokens, opts)
    const stats = computeStats(ops)
    const unified =
      mode === 'line' ? toUnifiedLineDiff(ops, 3) : toInlineUnified(ops)
    return { ops, stats, unified }
  }, [textA, textB, mode, ignoreCase, ignoreWhitespace])

  const hasInput = textA.length > 0 || textB.length > 0
  const identical =
    result.stats.added === 0 &&
    result.stats.removed === 0 &&
    textA.length > 0 &&
    textB.length > 0

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCompare className="size-4" />
            Text Compare (Diff)
          </CardTitle>
          <CardDescription>
            Developer-focused diff with three granularities: line, word, and
            character. Real LCS-based comparison with unified diff output,
            color-coded visualization, and live stats.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="tcd-ignore-ws"
                checked={ignoreWhitespace}
                onCheckedChange={setIgnoreWhitespace}
                aria-label="Ignore whitespace"
              />
              <Label htmlFor="tcd-ignore-ws" className="text-xs">
                Ignore whitespace
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="tcd-ignore-case"
                checked={ignoreCase}
                onCheckedChange={setIgnoreCase}
                aria-label="Ignore case"
              />
              <Label htmlFor="tcd-ignore-case" className="text-xs">
                Ignore case
              </Label>
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTextA(SAMPLE_A)
                  setTextB(SAMPLE_B)
                }}
              >
                <FileText className="size-4" />
                Load sample
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTextA('')
                  setTextB('')
                }}
                disabled={!hasInput}
                className="text-muted-foreground"
              >
                <Eraser className="size-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Text A (original)"
          htmlFor="tcd-a"
          hint={`${splitLines(textA).length} lines`}
        >
          <Textarea
            id="tcd-a"
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            rows={10}
            className="font-mono text-sm"
            spellCheck={false}
            placeholder="Paste the original text here…"
          />
        </Field>
        <Field
          label="Text B (modified)"
          htmlFor="tcd-b"
          hint={`${splitLines(textB).length} lines`}
        >
          <Textarea
            id="tcd-b"
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            rows={10}
            className="font-mono text-sm"
            spellCheck={false}
            placeholder="Paste the modified text here…"
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Added" value={result.stats.added} accent="#16a34a" />
        <Stat label="Removed" value={result.stats.removed} accent="#dc2626" />
        <Stat label="Unchanged" value={result.stats.unchanged} />
      </div>

      {identical ? (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400"
        >
          <Badge variant="secondary">No differences</Badge>
          <span>
            Texts are identical
            {ignoreCase ? ' (case-insensitive)' : ''}
            {ignoreWhitespace ? ' (whitespace ignored)' : ''} under the current
            comparison mode.
          </span>
        </div>
      ) : null}

      <Tabs value={mode} onValueChange={(v) => setMode(v as DiffMode)}>
        <TabsList>
          <TabsTrigger value="line">Line diff</TabsTrigger>
          <TabsTrigger value="word">Word diff</TabsTrigger>
          <TabsTrigger value="char">Character diff</TabsTrigger>
        </TabsList>

        <TabsContent value="line" className="mt-3">
          <VisualDiff ops={result.ops} mode="line" />
        </TabsContent>
        <TabsContent value="word" className="mt-3">
          <VisualDiff ops={result.ops} mode="word" />
        </TabsContent>
        <TabsContent value="char" className="mt-3">
          <VisualDiff ops={result.ops} mode="char" />
        </TabsContent>
      </Tabs>

      <ResultBox
        value={result.unified}
        label="Unified diff"
        downloadName="diff.patch"
        rows={10}
        empty="Enter text on both sides to see the unified diff."
      />
    </div>
  )
}

// --- Visual diff renderer -------------------------------------------------

function VisualDiff({
  ops,
  mode,
}: {
  ops: DiffOp[]
  mode: DiffMode
}): React.JSX.Element {
  if (ops.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border/70 bg-muted/20 px-3 py-8 text-center text-sm text-muted-foreground">
        Enter text on both sides to see the {mode} diff.
      </div>
    )
  }

  if (mode === 'line') {
    return (
      <ScrollArea className="max-h-96 rounded-lg border border-border">
        <div className="font-mono text-xs">
          {ops.map((op, idx) => {
            const prefix = op.type === 'add' ? '+' : op.type === 'remove' ? '-' : ' '
            const cls =
              op.type === 'add'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : op.type === 'remove'
                  ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                  : 'text-muted-foreground'
            return (
              <div
                key={idx}
                className={`flex min-w-0 items-start gap-2 px-3 py-0.5 ${cls}`}
              >
                <span className="select-none opacity-70">{prefix}</span>
                <span className="whitespace-pre-wrap break-all">
                  {op.value || ' '}
                </span>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    )
  }

  // word / char: inline rendering
  return (
    <ScrollArea className="max-h-96 rounded-lg border border-border bg-background p-3">
      <p className="font-mono text-xs leading-6">
        {ops.map((op, idx) => {
          if (op.value === '\n') {
            return <br key={idx} />
          }
          const cls =
            op.type === 'add'
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded px-0.5'
              : op.type === 'remove'
                ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 line-through rounded px-0.5'
                : 'text-muted-foreground'
          return (
            <span key={idx} className={cls}>
              {op.value}
            </span>
          )
        })}
      </p>
    </ScrollArea>
  )
}
