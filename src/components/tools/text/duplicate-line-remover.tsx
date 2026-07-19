'use client'
import * as React from 'react'
import { Eraser, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'
type KeepMode = 'first' | 'last'
interface Options {
  caseInsensitive: boolean
  trimBeforeCompare: boolean
  keep: KeepMode
}
function dedupe(
  input: string,
  opts: Options
): { output: string; total: number; removed: number } {
  if (!input) return { output: '', total: 0, removed: 0 }
  const lines = input.split('\n')
  const total = lines.length
  const seen = new Map<string, number>() // key -> output index
  const out: string[] = []
  const keyOf = (line: string) => {
    let k = line
    if (opts.trimBeforeCompare) k = k.trim()
    if (opts.caseInsensitive) k = k.toLowerCase()
    return k
  }
  if (opts.keep === 'first') {
    for (const line of lines) {
      const k = keyOf(line)
      if (seen.has(k)) continue
      seen.set(k, out.length)
      out.push(line)
    }
  } else {
    // keep === 'last': iterate forward, overwriting index for each duplicate.
    const indexByKey = new Map<string, number>()
    for (const line of lines) {
      const k = keyOf(line)
      const existing = indexByKey.get(k)
      if (existing === undefined) {
        indexByKey.set(k, out.length)
        out.push(line)
      } else {
        out[existing] = line
      }
    }
  }
  return {
    output: out.join('\n'),
    total,
    removed: total - out.length,
  }
}
export default function DuplicateLineRemover() {
  const [text, setText] = React.useState('')
  const [opts, setOpts] = React.useState<Options>({
    caseInsensitive: false,
    trimBeforeCompare: false,
    keep: 'first',
  })
  const [output, setOutput] = React.useState('')
  const [removed, setRemoved] = React.useState(0)
  const [total, setTotal] = React.useState(0)
  const handleRun = () => {
    if (!text) {
      toast.error('Enter lines to deduplicate')
      return
    }
    const result = dedupe(text, opts)
    setOutput(result.output)
    setRemoved(result.removed)
    setTotal(result.total)
  }
  const toggle = (key: 'caseInsensitive' | 'trimBeforeCompare') => (
    checked: boolean
  ) => setOpts((prev) => ({ ...prev, [key]: checked }))
  return (
    <div className="space-y-5">
      <Field
        label="Lines"
        htmlFor="dl-input"
        hint={`${(text ? text.split('\n').length : 0).toLocaleString()} lines`}
      >
        <Textarea
          id="dl-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={'One line per item:\napple\nbanana\napple\ncherry'}
          className="min-h-32 font-mono text-sm"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <Label
            htmlFor="dl-ci"
            className="pr-3 text-sm font-medium text-foreground"
          >
            Case-insensitive
            <span className="block text-xs font-normal text-muted-foreground">
              Treat “Apple” and “APPLE” as the same.
            </span>
          </Label>
          <Switch
            id="dl-ci"
            checked={opts.caseInsensitive}
            onCheckedChange={toggle('caseInsensitive')}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <Label
            htmlFor="dl-trim"
            className="pr-3 text-sm font-medium text-foreground"
          >
            Trim before compare
            <span className="block text-xs font-normal text-muted-foreground">
              Ignore leading and trailing whitespace.
            </span>
          </Label>
          <Switch
            id="dl-trim"
            checked={opts.trimBeforeCompare}
            onCheckedChange={toggle('trimBeforeCompare')}
          />
        </div>
      </div>
      <Field label="Keep" htmlFor="dl-keep">
        <RadioGroup
          id="dl-keep"
          value={opts.keep}
          onValueChange={(v) => setOpts((prev) => ({ ...prev, keep: v as KeepMode }))}
          className="grid grid-cols-2 gap-2"
        >
          <Label
            htmlFor="dl-keep-first"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
          >
            <RadioGroupItem id="dl-keep-first" value="first" />
            First occurrence
          </Label>
          <Label
            htmlFor="dl-keep-last"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
          >
            <RadioGroupItem id="dl-keep-last" value="last" />
            Last occurrence
          </Label>
        </RadioGroup>
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Input" value={total.toLocaleString()} />
        <Stat
          label="Output"
          value={(total - removed).toLocaleString()}
        />
        <Stat
          label="Removed"
          value={removed.toLocaleString()}
          accent={removed > 0 ? 'oklch(0.6 0.2 20)' : undefined}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setText('')
            setOutput('')
            setRemoved(0)
            setTotal(0)
          }}
          disabled={!text}
          className="text-muted-foreground"
        >
          <Eraser className="size-4" />
          Clear
        </Button>
        <Button
          type="button"
          onClick={handleRun}
          className="bg-primary text-primary-foreground"
        >
          <Filter className="size-4" />
          Remove duplicates
        </Button>
      </div>
      {output ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">{total.toLocaleString()} in</Badge>
          <span>→</span>
          <Badge variant="secondary">
            {(total - removed).toLocaleString()} unique
          </Badge>
          <span className="ml-1">
            ({removed.toLocaleString()} duplicates removed)
          </span>
        </div>
      ) : null}
      <ResultBox
        value={output}
        label="Unique lines"
        rows={8}
        downloadName="unique.txt"
        empty="Click Remove duplicates to filter your input."
      />
    </div>
  )
}