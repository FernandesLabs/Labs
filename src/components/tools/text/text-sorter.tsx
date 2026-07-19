'use client'
import * as React from 'react'
import { ArrowDownUp, Eraser } from 'lucide-react'
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
import { Field, ResultBox } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'
type SortBy = 'alphabetical' | 'numerical' | 'length' | 'natural'
type Direction = 'asc' | 'desc'
const NATIVE_COLLATOR = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
})
function sortLines(
  input: string,
  by: SortBy,
  direction: Direction,
  caseInsensitive: boolean,
  removeDuplicates: boolean,
  reverse: boolean
): string[] {
  let lines = input.split('\n')
  if (removeDuplicates) {
    const seen = new Set<string>()
    const keyOf = (line: string) =>
      caseInsensitive ? line.toLowerCase() : line
    lines = lines.filter((l) => {
      const k = keyOf(l)
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
  }
  const cmp = (a: string, b: string): number => {
    let result = 0
    switch (by) {
      case 'alphabetical': {
        if (caseInsensitive) {
          result = a.localeCompare(b, undefined, { sensitivity: 'base' })
        } else {
          result = a.localeCompare(b)
        }
        break
      }
      case 'numerical': {
        const na = parseFloat(a.replace(/^[^\d-]*(-?\d*\.?\d+).*/, '$1'))
        const nb = parseFloat(b.replace(/^[^\d-]*(-?\d*\.?\d+).*/, '$1'))
        const va = Number.isFinite(na) ? na : 0
        const vb = Number.isFinite(nb) ? nb : 0
        result = va - vb
        break
      }
      case 'length': {
        result = a.length - b.length
        if (result === 0) result = a.localeCompare(b)
        break
      }
      case 'natural': {
        result = NATIVE_COLLATOR.compare(a, b)
        break
      }
    }
    return result
  }
  lines.sort(cmp)
  if (direction === 'desc') lines.reverse()
  if (reverse) lines.reverse()
  return lines
}
export default function TextSorter() {
  const [text, setText] = React.useState('')
  const [sortBy, setSortBy] = React.useState<SortBy>('alphabetical')
  const [direction, setDirection] = React.useState<Direction>('asc')
  const [caseInsensitive, setCaseInsensitive] = React.useState(true)
  const [removeDuplicates, setRemoveDuplicates] = React.useState(false)
  const [reverse, setReverse] = React.useState(false)
  const [output, setOutput] = React.useState('')
  const handleSort = () => {
    if (!text) {
      toast.error('Enter lines to sort')
      return
    }
    const sorted = sortLines(
      text,
      sortBy,
      direction,
      caseInsensitive,
      removeDuplicates,
      reverse
    )
    setOutput(sorted.join('\n'))
  }
  const inputCount = text ? text.split('\n').length : 0
  const outputCount = output ? output.split('\n').length : 0
  return (
    <div className="space-y-5">
      <Field
        label="Lines to sort"
        htmlFor="ts-input"
        hint={`${inputCount.toLocaleString()} lines`}
      >
        <Textarea
          id="ts-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={'One item per line:\nbanana\napple\ncherry'}
          className="min-h-32 font-mono text-sm"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sort by" htmlFor="ts-by">
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortBy)}
          >
            <SelectTrigger id="ts-by" className="w-full">
              <SelectValue placeholder="Pick sort mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="numerical">Numerical</SelectItem>
              <SelectItem value="length">By length</SelectItem>
              <SelectItem value="natural">Natural</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Direction" htmlFor="ts-dir">
          <RadioGroup
            id="ts-dir"
            value={direction}
            onValueChange={(v) => setDirection(v as Direction)}
            className="grid grid-cols-2 gap-2"
          >
            <Label
              htmlFor="ts-dir-asc"
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
            >
              <RadioGroupItem id="ts-dir-asc" value="asc" />
              Ascending
            </Label>
            <Label
              htmlFor="ts-dir-desc"
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
            >
              <RadioGroupItem id="ts-dir-desc" value="desc" />
              Descending
            </Label>
          </RadioGroup>
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <Label
            htmlFor="ts-ci"
            className="pr-3 text-sm font-medium text-foreground"
          >
            Case-insensitive
          </Label>
          <Switch
            id="ts-ci"
            checked={caseInsensitive}
            onCheckedChange={setCaseInsensitive}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <Label
            htmlFor="ts-dup"
            className="pr-3 text-sm font-medium text-foreground"
          >
            Remove duplicates
          </Label>
          <Switch
            id="ts-dup"
            checked={removeDuplicates}
            onCheckedChange={setRemoveDuplicates}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <Label
            htmlFor="ts-rev"
            className="pr-3 text-sm font-medium text-foreground"
          >
            Reverse result
          </Label>
          <Switch
            id="ts-rev"
            checked={reverse}
            onCheckedChange={setReverse}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setText('')
            setOutput('')
          }}
          disabled={!text && !output}
          className="text-muted-foreground"
        >
          <Eraser className="size-4" />
          Clear
        </Button>
        <Button
          type="button"
          onClick={handleSort}
          className="bg-primary text-primary-foreground"
        >
          <ArrowDownUp className="size-4" />
          Sort lines
        </Button>
      </div>
      {output ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">{inputCount.toLocaleString()} in</Badge>
          <span>→</span>
          <Badge variant="secondary">
            {outputCount.toLocaleString()} out
          </Badge>
          {removeDuplicates && (
            <span className="ml-1">
              ({(inputCount - outputCount).toLocaleString()} duplicates removed)
            </span>
          )}
        </div>
      ) : null}
      <ResultBox
        value={output}
        label="Sorted output"
        rows={8}
        downloadName="sorted.txt"
        empty="Sort options are applied when you click Sort lines."
      />
    </div>
  )
}