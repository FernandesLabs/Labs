'use client'
import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Field, Stat } from '@/lib/tools/tool-ui'
type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB'
const UNITS: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
const UNIT_LABELS: Record<Unit, string> = {
  B: 'Bytes',
  KB: 'Kilobytes',
  MB: 'Megabytes',
  GB: 'Gigabytes',
  TB: 'Terabytes',
  PB: 'Petabytes',
}
function unitToBytes(value: number, unit: Unit): number {
  const exp = UNITS.indexOf(unit)
  return value * Math.pow(1024, exp)
}
function bytesToUnit(bytes: number, unit: Unit): number {
  const exp = UNITS.indexOf(unit)
  return bytes / Math.pow(1024, exp)
}
function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '—'
  if (n === 0) return '0'
  const abs = Math.abs(n)
  if (abs >= 1e9 || abs < 1e-3) return n.toExponential(4)
  if (abs >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
  if (abs >= 1) return n.toLocaleString(undefined, { maximumFractionDigits: 4 })
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 })
}
function humanReadable(bytes: number): string {
  if (!Number.isFinite(bytes)) return '—'
  if (bytes === 0) return '0 B'
  const sign = bytes < 0 ? '-' : ''
  const abs = Math.abs(bytes)
  let unitIndex = 0
  let value = abs
  while (value >= 1024 && unitIndex < UNITS.length - 1) {
    value /= 1024
    unitIndex++
  }
  const unit = UNITS[unitIndex]
  const formatted = value >= 100 || unitIndex === 0
    ? value.toFixed(0)
    : value >= 10
      ? value.toFixed(1)
      : value.toFixed(2)
  return `${sign}${formatted} ${unit}`
}
const PRESETS: Array<{ label: string; value: string; unit: Unit }> = [
  { label: '1.44 MB floppy', value: '1.44', unit: 'MB' },
  { label: '700 MB CD', value: '700', unit: 'MB' },
  { label: '4.7 GB DVD', value: '4.7', unit: 'GB' },
  { label: '25 GB Blu-ray', value: '25', unit: 'GB' },
  { label: '1 TB HDD', value: '1', unit: 'TB' },
]
export default function FileSizeConverter(): React.JSX.Element {
  const [value, setValue] = React.useState('1536')
  const [unit, setUnit] = React.useState<Unit>('B')
  const numericValue = React.useMemo<number>(() => {
    const v = parseFloat(value.trim())
    return Number.isFinite(v) ? v : NaN
  }, [value])
  const isValid = Number.isFinite(numericValue)
  const isNegative = isValid && numericValue < 0
  const isZero = isValid && numericValue === 0
  const bytes = React.useMemo<number>(() => {
    if (!isValid) return NaN
    return unitToBytes(numericValue, unit)
  }, [numericValue, unit, isValid])
  const conversions = React.useMemo<Array<{ unit: Unit; value: number; label: string }>>(() => {
    if (!isValid) return []
    return UNITS.map((u) => ({
      unit: u,
      value: bytesToUnit(bytes, u),
      label: UNIT_LABELS[u],
    }))
  }, [bytes, isValid])
  const human = React.useMemo(() => (isValid ? humanReadable(bytes) : '—'), [bytes, isValid])
  const applyPreset = (preset: { value: string; unit: Unit }): void => {
    setValue(preset.value)
    setUnit(preset.unit)
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>File Size Converter</CardTitle>
          <CardDescription>
            Convert a file size between bytes, kilobytes, megabytes, gigabytes,
            terabytes and petabytes. Uses the binary base (1024). Includes a
            human-readable form that picks the most appropriate unit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Value" htmlFor="fs-value" hint={isNegative ? 'negative' : undefined}>
              <Input
                id="fs-value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="1536"
                inputMode="decimal"
                type="number"
                step="any"
                className={isNegative ? 'border-amber-500/60' : ''}
              />
            </Field>
            <Field label="Unit" htmlFor="fs-unit">
              <Select value={unit} onValueChange={(v) => setUnit(v as Unit)}>
                <SelectTrigger id="fs-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u} — {UNIT_LABELS[u]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {p.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      {isNegative ? (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400"
        >
          <AlertTriangle className="size-4" />
          Negative values are unusual for file sizes but are supported mathematically.
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Input value" value={isValid ? `${formatNumber(numericValue)} ${unit}` : '—'} />
        <Stat label="In bytes" value={isValid ? formatNumber(bytes) : '—'} accent="oklch(0.6 0.17 150)" />
        <Stat label="Human-readable" value={human} />
        <Stat
          label="Status"
          value={isZero ? 'Zero' : isNegative ? 'Negative' : 'Valid'}
          accent={isNegative ? 'oklch(0.7 0.18 75)' : 'oklch(0.6 0.17 150)'}
        />
      </div>
      {isValid ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All conversions</CardTitle>
            <CardDescription>
              Equivalent size in every unit (1024-based, binary).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Unit</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversions.map((c) => (
                    <TableRow key={c.unit}>
                      <TableCell>
                        <Badge
                          variant={c.unit === unit ? 'default' : 'outline'}
                          className="font-mono text-xs"
                        >
                          {c.unit}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{c.label}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatNumber(c.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Enter a numeric value above to see conversions.
        </div>
      )}
    </div>
  )
}