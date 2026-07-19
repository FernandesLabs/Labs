'use client'
import * as React from 'react'
import { FileText, GitCompare, Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
type DiffOpType = 'equal' | 'add' | 'remove'
interface DiffOp {
  type: DiffOpType
  line: string
}
interface DiffStats {
  added: number
  removed: number
  unchanged: number
}
function normalizeLine(
  line: string,
  ignoreWhitespace: boolean,
  ignoreCase: boolean
): string {
  let s = line
  if (ignoreCase) s = s.toLowerCase()
  if (ignoreWhitespace) s = s.replace(/\s+/g, '').trim()
  return s
}
function splitLines(text: string): string[] {
  if (text === '') return []
  // Preserve trailing newline behaviour: split on \n but drop final empty
  const lines = text.split('\n')
  return lines
}
/**
 * LCS-based line diff (dynamic programming).
 * Returns a sequence of operations that transform `original` into `modified`.
 */
function lcsDiff(
  original: string[],
  modified: string[],
  ignoreWhitespace: boolean,
  ignoreCase: boolean
): DiffOp[] {
  if (original.length === 0) {
    return modified.map((line) => ({ type: 'add' as DiffOpType, line }))
  }
  if (modified.length === 0) {
    return original.map((line) => ({ type: 'remove' as DiffOpType, line }))
  }
  // Normalize for comparison
  const a = original.map((l) =>
    normalizeLine(l, ignoreWhitespace, ignoreCase)
  )
  const b = modified.map((l) =>
    normalizeLine(l, ignoreWhitespace, ignoreCase)
  )
  const m = a.length
  const n = b.length
  // dp[i][j] = length of LCS of a[i..] and b[j..]
  // Use Uint32Array for memory efficiency (m, n ≤ ~5000 reasonable)
  const dp: Uint32Array[] = Array.from({ length: m + 1 }, () => {
    return new Uint32Array(n + 1)
  })
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
  // Backtrack to build the diff
  const ops: DiffOp[] = []
  let i = 0
  let j = 0
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      ops.push({ type: 'equal', line: original[i] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'remove', line: original[i] })
      i++
    } else {
      ops.push({ type: 'add', line: modified[j] })
      j++
    }
  }
  while (i < m) {
    ops.push({ type: 'remove', line: original[i] })
    i++
  }
  while (j < n) {
    ops.push({ type: 'add', line: modified[j] })
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
/**
 * Build a unified-diff text with proper @@ hunks and configurable context.
 */
function toUnifiedDiff(
  original: string[],
  modified: string[],
  ops: DiffOp[],
  context = 3
): string {
  const lines: string[] = ['--- original', '+++ modified']
  // Indices of changed ops
  const changeIdx: number[] = []
  for (let i = 0; i < ops.length; i++) {
    if (ops[i].type !== 'equal') changeIdx.push(i)
  }
  if (changeIdx.length === 0) {
    return lines.join('\n')
  }
  // Group into hunks (merge if windows overlap)
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
    // Walk ops[0..hunk.start-1] to find old/new line numbers at hunk.start
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
      if (op.type === 'equal') lines.push(' ' + op.line)
      else if (op.type === 'remove') lines.push('-' + op.line)
      else lines.push('+' + op.line)
    }
  }
  return lines.join('\n')
}
const SAMPLE_ORIGINAL = `The quick brown fox
jumps over the lazy dog.
Line three is here.
A line that will be removed.
Line five stays.
The end.`
const SAMPLE_MODIFIED = `The quick brown fox
jumps over the lazy dog.
Line three is here.
A brand new line was added.
Line five stays.
The end.`
export default function DiffChecker() {
  const [original, setOriginal] = React.useState(SAMPLE_ORIGINAL)
  const [modified, setModified] = React.useState(SAMPLE_MODIFIED)
  const [ignoreWhitespace, setIgnoreWhitespace] = React.useState(false)
  const [ignoreCase, setIgnoreCase] = React.useState(false)
  const { ops, stats, unified } = React.useMemo(() => {
    const origLines = splitLines(original)
    const modLines = splitLines(modified)
    const opsArr = lcsDiff(
      origLines,
      modLines,
      ignoreWhitespace,
      ignoreCase
    )
    const s = computeStats(opsArr)
    const u = toUnifiedDiff(origLines, modLines, opsArr, 3)
    return { ops: opsArr, stats: s, unified: u }
  }, [original, modified, ignoreWhitespace, ignoreCase])
  const hasInput = original.length > 0 || modified.length > 0
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCompare className="size-4" />
            Diff Checker
          </CardTitle>
          <CardDescription>
            Real LCS-based line diff (dynamic programming). Drop in two
            versions of a file to see what was added, removed, and kept.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="diff-ignore-ws"
                checked={ignoreWhitespace}
                onCheckedChange={setIgnoreWhitespace}
                aria-label="Ignore whitespace"
              />
              <Label htmlFor="diff-ignore-ws" className="text-xs">
                Ignore whitespace
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="diff-ignore-case"
                checked={ignoreCase}
                onCheckedChange={setIgnoreCase}
                aria-label="Ignore case"
              />
              <Label htmlFor="diff-ignore-case" className="text-xs">
                Ignore case
              </Label>
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOriginal(SAMPLE_ORIGINAL)
                  setModified(SAMPLE_MODIFIED)
                }}
              >
                Load sample
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOriginal('')
                  setModified('')
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
          label="Original"
          htmlFor="diff-original"
          hint={`${splitLines(original).length} lines`}
        >
          <Textarea
            id="diff-original"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            rows={10}
            className="font-mono text-sm"
            spellCheck={false}
            placeholder="Paste the original text here…"
          />
        </Field>
        <Field
          label="Modified"
          htmlFor="diff-modified"
          hint={`${splitLines(modified).length} lines`}
        >
          <Textarea
            id="diff-modified"
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            rows={10}
            className="font-mono text-sm"
            spellCheck={false}
            placeholder="Paste the modified text here…"
          />
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Added" value={stats.added} accent="#16a34a" />
        <Stat label="Removed" value={stats.removed} accent="#dc2626" />
        <Stat label="Unchanged" value={stats.unchanged} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4" />
            Visual diff
          </CardTitle>
          <CardDescription>
            Green lines were added, red lines were removed, gray lines are
            unchanged context.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ops.length === 0 ? (
            <div className="rounded-md border border-dashed border-border/70 bg-muted/20 px-3 py-8 text-center text-sm text-muted-foreground">
              Enter text on both sides to see the diff.
            </div>
          ) : (
            <ScrollArea className="max-h-96 rounded-lg border border-border">
              <div className="font-mono text-xs">
                {ops.map((op, idx) => {
                  const prefix =
                    op.type === 'add'
                      ? '+'
                      : op.type === 'remove'
                      ? '-'
                      : ' '
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
                        {op.line || ' '}
                      </span>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
          {stats.added === 0 && stats.removed === 0 && hasInput ? (
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="secondary">No differences</Badge>
              <span className="text-xs text-muted-foreground">
                The two inputs are identical
                {ignoreWhitespace || ignoreCase ? ' (under current options)' : ''}.
              </span>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <ResultBox
        value={unified}
        label="Unified diff"
        downloadName="diff.patch"
        rows={10}
        empty="No input yet — load a sample to see a unified diff."
      />
    </div>
  )
}