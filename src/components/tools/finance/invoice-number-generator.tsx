'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'

type Separator = 'dash' | 'slash' | 'underscore' | 'none'

const SEP_CHAR: Record<Separator, string> = {
  dash: '-',
  slash: '/',
  underscore: '_',
  none: '',
}

function parseNum(value: string): number {
  if (value == null) return NaN
  const trimmed = value.trim()
  if (trimmed === '') return NaN
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : NaN
}

function todayStamp(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

const MIN_COUNT = 1
const MAX_COUNT = 1000
const MIN_PAD = 1
const MAX_PAD = 10

/**
 * Invoice Number Generator
 * Inputs: prefix, starting number, count, padding (digits), separator,
 * optional date stamp (YYYYMMDD). Generates a list of sequential invoice
 * numbers, live. Count is clamped to 1–1000 and padding to 1–10.
 */
export default function InvoiceNumberGenerator() {
  const [prefix, setPrefix] = React.useState('INV')
  const [start, setStart] = React.useState('1')
  const [count, setCount] = React.useState('10')
  const [padding, setPadding] = React.useState('4')
  const [sep, setSep] = React.useState<Separator>('dash')
  const [useDate, setUseDate] = React.useState(false)

  const startNum = parseNum(start)
  const countNum = parseNum(count)
  const padNum = parseNum(padding)

  const safeCount = Number.isFinite(countNum)
    ? Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.floor(countNum)))
    : MIN_COUNT
  const safePad = Number.isFinite(padNum)
    ? Math.min(MAX_PAD, Math.max(MIN_PAD, Math.floor(padNum)))
    : MIN_PAD

  const sepChar = SEP_CHAR[sep]
  const datePart = useDate ? todayStamp() : ''
  const trimmedPrefix = prefix.trim()

  const lines = React.useMemo(() => {
    if (!Number.isFinite(startNum) || startNum < 0) return []
    const out: string[] = []
    for (let i = 0; i < safeCount; i++) {
      const num = Math.floor(startNum) + i
      const padded = String(num).padStart(safePad, '0')
      const segments: string[] = []
      if (trimmedPrefix) segments.push(trimmedPrefix)
      if (datePart) segments.push(datePart)
      segments.push(padded)
      out.push(segments.join(sepChar))
    }
    return out
  }, [startNum, safeCount, safePad, sepChar, trimmedPrefix, datePart])

  const output = lines.join('\n')

  const countClamped = Number.isFinite(countNum) && (countNum < MIN_COUNT || countNum > MAX_COUNT)
  const padClamped = Number.isFinite(padNum) && (padNum < MIN_PAD || padNum > MAX_PAD)
  const startInvalid = !Number.isFinite(startNum) || startNum < 0

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Prefix" htmlFor="inv-prefix" hint="optional">
              <Input
                id="inv-prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="INV"
                aria-label="Invoice prefix"
              />
            </Field>
            <Field label="Starting number" htmlFor="inv-start">
              <Input
                id="inv-start"
                inputMode="numeric"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                placeholder="1"
                aria-label="Starting invoice number"
              />
            </Field>
            <Field
              label="Count"
              htmlFor="inv-count"
              hint={`${MIN_COUNT}–${MAX_COUNT}`}
            >
              <Input
                id="inv-count"
                inputMode="numeric"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="10"
                aria-label="Number of invoices to generate"
              />
            </Field>
            <Field
              label="Padding"
              htmlFor="inv-pad"
              hint={`${MIN_PAD}–${MAX_PAD} digits`}
            >
              <Input
                id="inv-pad"
                inputMode="numeric"
                value={padding}
                onChange={(e) => setPadding(e.target.value)}
                placeholder="4"
                aria-label="Number of padding digits"
              />
            </Field>
            <Field label="Separator" htmlFor="inv-sep">
              <Select value={sep} onValueChange={(v) => setSep(v as Separator)}>
                <SelectTrigger id="inv-sep" className="w-full" aria-label="Separator">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dash">Hyphen ( - )</SelectItem>
                  <SelectItem value="slash">Slash ( / )</SelectItem>
                  <SelectItem value="underscore">Underscore ( _ )</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Date stamp
              </span>
              <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-transparent px-3">
                <Checkbox
                  id="inv-date"
                  checked={useDate}
                  onCheckedChange={(v) => setUseDate(v === true)}
                  aria-label="Include YYYYMMDD date stamp"
                />
                <Label htmlFor="inv-date" className="text-sm text-muted-foreground">
                  Prepend YYYYMMDD
                </Label>
              </div>
            </div>
          </div>

          {startInvalid ? (
            <p className="text-sm text-destructive">
              Starting number must be a non-negative integer.
            </p>
          ) : null}
          {countClamped ? (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Count was clamped to {safeCount} (allowed {MIN_COUNT}–{MAX_COUNT}).
            </p>
          ) : null}
          {padClamped ? (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Padding was clamped to {safePad} digits (allowed {MIN_PAD}–{MAX_PAD}).
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Generated" value={lines.length} />
            <Stat label="Sample first" value={lines[0] ?? '—'} />
            <Stat label="Sample last" value={lines[lines.length - 1] ?? '—'} />
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {trimmedPrefix || '∅'}{sepChar || ''}
              {datePart ? `${datePart}${sepChar}` : ''}{'⟦'}
              {`0`.repeat(safePad)}
              {'⟧ …'}
            </Badge>
            {useDate ? (
              <Badge variant="outline">Date: {datePart}</Badge>
            ) : null}
          </div>

          <ResultBox
            value={output}
            label="Invoice numbers"
            mono
            rows={8}
            downloadName="invoice-numbers.txt"
            empty="Adjust the settings above to generate invoice numbers."
          />

          <p className="text-xs text-muted-foreground">
            Numbers are zero-padded to {safePad} digit{safePad === 1 ? '' : 's'} and
            joined with the chosen separator. Updates live as you edit.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
