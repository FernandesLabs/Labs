'use client'
import * as React from 'react'
import { Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
type Scope = 'line' | 'all'
type Delimiter = 'space' | 'comma' | 'newline'
const DELIMITER_CHAR: Record<Delimiter, string> = {
  space: ' ',
  comma: ', ',
  newline: '\n',
}
interface DedupeResult {
  output: string
  total: number
  unique: number
  removed: number
}
function dedupeWords(
  input: string,
  caseSensitive: boolean,
  scope: Scope,
  delim: Delimiter
): DedupeResult {
  const joiner = DELIMITER_CHAR[delim]
  const keyOf = (w: string) => (caseSensitive ? w : w.toLowerCase())
  if (scope === 'all') {
    const words = input.split(/\s+/).filter(Boolean)
    if (words.length === 0) {
      return { output: '', total: 0, unique: 0, removed: 0 }
    }
    const seen = new Set<string>()
    const out: string[] = []
    for (const w of words) {
      const k = keyOf(w)
      if (seen.has(k)) continue
      seen.add(k)
      out.push(w)
    }
    return {
      output: out.join(joiner),
      total: words.length,
      unique: out.length,
      removed: words.length - out.length,
    }
  }
  // within each line
  const lines = input.split('\n')
  const outLines: string[] = []
  let total = 0
  let unique = 0
  for (const line of lines) {
    const words = line.split(/\s+/).filter(Boolean)
    total += words.length
    if (words.length === 0) {
      outLines.push('')
      continue
    }
    const seen = new Set<string>()
    const kept: string[] = []
    for (const w of words) {
      const k = keyOf(w)
      if (seen.has(k)) continue
      seen.add(k)
      kept.push(w)
    }
    unique += kept.length
    outLines.push(kept.join(joiner))
  }
  return {
    output: outLines.join('\n'),
    total,
    unique,
    removed: total - unique,
  }
}
export default function RemoveDuplicateWords() {
  const [text, setText] = React.useState('')
  const [caseSensitive, setCaseSensitive] = React.useState(false)
  const [scope, setScope] = React.useState<Scope>('line')
  const [delim, setDelim] = React.useState<Delimiter>('space')
  const result = React.useMemo(
    () => dedupeWords(text, caseSensitive, scope, delim),
    [text, caseSensitive, scope, delim]
  )
  return (
    <div className="space-y-5">
      <Field
        label="Text"
        htmlFor="rdw-input"
        hint={`${result.total.toLocaleString()} words`}
      >
        <Textarea
          id="rdw-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            'Paste words with duplicates:\napple banana apple cherry\nBanana Cherry Date'
          }
          className="min-h-32 font-mono text-sm"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <Label
            htmlFor="rdw-cs"
            className="pr-3 text-sm font-medium text-foreground"
          >
            Case-sensitive
            <span className="block text-xs font-normal text-muted-foreground">
              Off: “Apple” and “apple” count as the same word.
            </span>
          </Label>
          <Switch
            id="rdw-cs"
            checked={caseSensitive}
            onCheckedChange={setCaseSensitive}
            aria-label="Toggle case-sensitive comparison"
          />
        </div>
        <Field label="Output delimiter" htmlFor="rdw-delim">
          <Select
            value={delim}
            onValueChange={(v) => setDelim(v as Delimiter)}
          >
            <SelectTrigger id="rdw-delim" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="space">Space</SelectItem>
              <SelectItem value="comma">Comma</SelectItem>
              <SelectItem value="newline">Newline</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Scope" htmlFor="rdw-scope">
        <RadioGroup
          id="rdw-scope"
          value={scope}
          onValueChange={(v) => setScope(v as Scope)}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          <Label
            htmlFor="rdw-scope-line"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
          >
            <RadioGroupItem id="rdw-scope-line" value="line" />
            Within each line
          </Label>
          <Label
            htmlFor="rdw-scope-all"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
          >
            <RadioGroupItem id="rdw-scope-all" value="all" />
            Across all text
          </Label>
        </RadioGroup>
      </Field>
      <div
        className="grid grid-cols-3 gap-3"
        role="status"
        aria-live="polite"
      >
        <Stat label="Original" value={result.total.toLocaleString()} />
        <Stat
          label="Unique"
          value={result.unique.toLocaleString()}
          accent={
            result.unique > 0 ? 'oklch(0.62 0.17 150)' : undefined
          }
        />
        <Stat
          label="Removed"
          value={result.removed.toLocaleString()}
          accent={result.removed > 0 ? 'oklch(0.6 0.2 20)' : undefined}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setText('')}
          disabled={!text}
          className="text-muted-foreground"
        >
          <Eraser className="size-4" />
          Clear
        </Button>
        {result.total > 0 ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{result.total.toLocaleString()} in</Badge>
            <span>→</span>
            <Badge variant="secondary">
              {result.unique.toLocaleString()} unique
            </Badge>
          </div>
        ) : null}
      </div>
      <ResultBox
        value={result.output}
        label="Unique words"
        rows={8}
        downloadName="unique-words.txt"
        empty="Enter text above — duplicates are removed live as you type."
      />
    </div>
  )
}