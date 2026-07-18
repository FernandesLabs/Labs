'use client'

import * as React from 'react'
import { CheckCircle2, Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Field, Stat } from '@/lib/tools/tool-ui'

interface DiffToken {
  type: 'common' | 'removed' | 'added'
  value: string
}

interface CompareOptions {
  ignoreCase: boolean
  ignoreWhitespace: boolean
}

function tokenize(text: string, ignoreWhitespace: boolean): string[] {
  const normalized = text.replace(/\r\n?/g, '\n')
  if (ignoreWhitespace) {
    // Collapse all whitespace (including newlines) to single spaces.
    const collapsed = normalized.replace(/\s+/g, ' ').trim()
    return collapsed ? collapsed.split(' ').filter(Boolean) : []
  }
  // Preserve newlines as explicit tokens so line-break changes appear in the diff.
  const tokens: string[] = []
  const parts = normalized.split(/(\n)/)
  for (const part of parts) {
    if (part === '\n') {
      tokens.push('\n')
    } else if (part) {
      const words = part.split(/[^\S\n]+/).filter(Boolean)
      tokens.push(...words)
    }
  }
  return tokens
}

function normalizeForCompare(token: string, opts: CompareOptions): string {
  return opts.ignoreCase ? token.toLowerCase() : token
}

function buildLcsTable(a: string[], b: string[]): number[][] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }
  return dp
}

function diffTokens(
  aOrig: string[],
  bOrig: string[],
  opts: CompareOptions
): DiffToken[] {
  const a = aOrig.map((t) => normalizeForCompare(t, opts))
  const b = bOrig.map((t) => normalizeForCompare(t, opts))
  const dp = buildLcsTable(a, b)
  const result: DiffToken[] = []
  let i = 0
  let j = 0
  const m = a.length
  const n = b.length
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      result.push({ type: 'common', value: aOrig[i] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: 'removed', value: aOrig[i] })
      i++
    } else {
      result.push({ type: 'added', value: bOrig[j] })
      j++
    }
  }
  while (i < m) {
    result.push({ type: 'removed', value: aOrig[i] })
    i++
  }
  while (j < n) {
    result.push({ type: 'added', value: bOrig[j] })
    j++
  }
  return result
}

function isWhitespaceToken(t: string): boolean {
  return t === '\n'
}

export default function TextCompare(): React.JSX.Element {
  const [textA, setTextA] = React.useState<string>(
    'The quick brown fox\njumps over the lazy dog.\nA classic pangram.'
  )
  const [textB, setTextB] = React.useState<string>(
    'The quick red fox\njumps over the sleepy dog.\nA famous pangram indeed.'
  )
  const [ignoreCase, setIgnoreCase] = React.useState<boolean>(false)
  const [ignoreWhitespace, setIgnoreWhitespace] = React.useState<boolean>(false)

  const opts: CompareOptions = { ignoreCase, ignoreWhitespace }

  const { diff, stats } = React.useMemo(() => {
    const aTokens = tokenize(textA, ignoreWhitespace)
    const bTokens = tokenize(textB, ignoreWhitespace)
    const tokens = diffTokens(aTokens, bTokens, opts)
    let common = 0
    let added = 0
    let removed = 0
    for (const t of tokens) {
      if (t.type === 'common') common++
      else if (t.type === 'added') added++
      else removed++
    }
    return {
      diff: tokens,
      stats: {
        aCount: aTokens.filter((t) => !isWhitespaceToken(t)).length,
        bCount: bTokens.filter((t) => !isWhitespaceToken(t)).length,
        common,
        added,
        removed,
      },
    }
  }, [textA, textB, ignoreCase, ignoreWhitespace])

  const identical =
    stats.added === 0 && stats.removed === 0 && textA !== '' && textB !== ''

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Text A" htmlFor="tc-a" hint={`${stats.aCount} words`}>
          <Textarea
            id="tc-a"
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="Paste the original text here."
            className="min-h-40 font-mono text-sm"
          />
        </Field>
        <Field label="Text B" htmlFor="tc-b" hint={`${stats.bCount} words`}>
          <Textarea
            id="tc-b"
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="Paste the modified text here."
            className="min-h-40 font-mono text-sm"
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border bg-muted/20 p-3">
        <div className="flex items-center gap-2">
          <Switch
            id="tc-ignore-case"
            checked={ignoreCase}
            onCheckedChange={setIgnoreCase}
          />
          <Label htmlFor="tc-ignore-case" className="cursor-pointer text-sm">
            Ignore case
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="tc-ignore-ws"
            checked={ignoreWhitespace}
            onCheckedChange={setIgnoreWhitespace}
          />
          <Label htmlFor="tc-ignore-ws" className="cursor-pointer text-sm">
            Ignore whitespace (collapse newlines &amp; spaces)
          </Label>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setTextA('')
            setTextB('')
          }}
          className="ml-auto text-muted-foreground"
        >
          <Eraser className="size-4" />
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Words in A" value={stats.aCount} />
        <Stat label="Words in B" value={stats.bCount} />
        <Stat label="Common" value={stats.common} accent="oklch(0.6 0.17 150)" />
        <Stat label="Added" value={stats.added} accent="oklch(0.6 0.17 150)" />
        <Stat label="Removed" value={stats.removed} accent="oklch(0.6 0.2 25)" />
      </div>

      {identical ? (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400"
        >
          <CheckCircle2 className="size-4" />
          Texts are identical
          {ignoreCase ? ' (case-insensitive match)' : ''}
          {ignoreWhitespace ? ' (whitespace ignored)' : ''}.
        </div>
      ) : null}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Word-level diff</h3>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-xs text-muted-foreground">
              <span className="mr-1 inline-block size-2 rounded-sm bg-muted-foreground/40" />
              common
            </Badge>
            <Badge variant="outline" className="text-xs text-emerald-600 dark:text-emerald-400">
              <span className="mr-1 inline-block size-2 rounded-sm bg-emerald-500" />
              added
            </Badge>
            <Badge variant="outline" className="text-xs text-rose-600 dark:text-rose-400">
              <span className="mr-1 inline-block size-2 rounded-sm bg-rose-500" />
              removed
            </Badge>
          </div>
        </div>
        <ScrollArea className="max-h-96 rounded-lg border border-border bg-background p-3">
          {diff.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Both texts are empty — nothing to compare.
            </p>
          ) : (
            <p className="text-sm leading-7">
              {diff.map((tok, i) => {
                if (tok.value === '\n') {
                  return <br key={i} />
                }
                const cls =
                  tok.type === 'added'
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded px-1'
                    : tok.type === 'removed'
                      ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 line-through rounded px-1'
                      : 'text-muted-foreground'
                return (
                  <React.Fragment key={i}>
                    <span className={cls}>{tok.value}</span>
                    {' '}
                  </React.Fragment>
                )
              })}
            </p>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
