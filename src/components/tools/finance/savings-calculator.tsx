'use client'
import * as React from 'react'
import { Download } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'
function parseNum(value: string): number {
  if (value == null) return NaN
  const trimmed = value.trim()
  if (trimmed === '') return NaN
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : NaN
}
function fmtCurrency(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n)
}
interface FreqOption {
  value: string
  label: string
  periodsPerYear: number
}
const FREQ_OPTIONS: FreqOption[] = [
  { value: '1', label: 'Annually', periodsPerYear: 1 },
  { value: '2', label: 'Semiannually', periodsPerYear: 2 },
  { value: '4', label: 'Quarterly', periodsPerYear: 4 },
  { value: '12', label: 'Monthly', periodsPerYear: 12 },
  { value: '52', label: 'Weekly', periodsPerYear: 52 },
  { value: '365', label: 'Daily', periodsPerYear: 365 },
]
interface YearRow {
  year: number
  balance: number
  contributions: number
  interest: number
}
/**
 * Savings Calculator
 * Compound interest with regular monthly contributions.
 * Final balance, total contributions, total interest. Yearly growth table.
 * Live update.
 */
export default function SavingsCalculator() {
  const [initial, setInitial] = React.useState('5000')
  const [monthly, setMonthly] = React.useState('200')
  const [rate, setRate] = React.useState('5')
  const [years, setYears] = React.useState('10')
  const [freqValue, setFreqValue] = React.useState<string>('12')
  const initialN = parseNum(initial)
  const monthlyN = parseNum(monthly)
  const rateN = parseNum(rate)
  const yearsN = parseNum(years)
  const freq =
    FREQ_OPTIONS.find((f) => f.value === freqValue) ?? FREQ_OPTIONS[3]
  const periodsPerYear = freq.periodsPerYear
  const valid =
    Number.isFinite(initialN) &&
    initialN >= 0 &&
    Number.isFinite(monthlyN) &&
    monthlyN >= 0 &&
    Number.isFinite(rateN) &&
    Number.isFinite(yearsN) &&
    yearsN > 0 &&
    periodsPerYear > 0
  const ratePerPeriod = valid ? rateN / 100 / periodsPerYear : 0
  // Convert monthly contribution to per-period contribution
  const contribPerPeriod = valid ? (monthlyN * 12) / periodsPerYear : 0
  const rows: YearRow[] = React.useMemo(() => {
    if (!valid) return []
    const out: YearRow[] = []
    let balance = initialN
    let contributions = initialN
    out.push({
      year: 0,
      balance,
      contributions,
      interest: 0,
    })
    for (let y = 1; y <= Math.floor(yearsN); y++) {
      for (let p = 0; p < periodsPerYear; p++) {
        balance = balance * (1 + ratePerPeriod) + contribPerPeriod
        contributions += contribPerPeriod
      }
      out.push({
        year: y,
        balance,
        contributions,
        interest: balance - contributions,
      })
    }
    return out
  }, [
    valid,
    initialN,
    yearsN,
    periodsPerYear,
    ratePerPeriod,
    contribPerPeriod,
  ])
  const finalRow = rows.length > 0 ? rows[rows.length - 1] : null
  const finalBalance = finalRow ? finalRow.balance : NaN
  const totalContrib = finalRow ? finalRow.contributions : NaN
  const totalInterest = finalRow ? finalRow.interest : NaN
  const downloadCsv = () => {
    if (rows.length === 0) {
      toast.error('Nothing to export — enter valid inputs first')
      return
    }
    const header = 'Year,Balance,Contributions,Interest'
    const lines = rows.map((r) =>
      [r.year, r.balance.toFixed(2), r.contributions.toFixed(2), r.interest.toFixed(2)].join(
        ','
      )
    )
    const csv = [header, ...lines].join('\n')
    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'savings-growth.csv')
    toast.success('Growth table exported as CSV')
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Savings inputs</CardTitle>
          <CardDescription>
            Compounded interest with monthly contributions. Rate is annual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Initial deposit" htmlFor="sav-initial" hint="USD">
              <Input
                id="sav-initial"
                type="number"
                min={0}
                step="0.01"
                value={initial}
                onChange={(e) => setInitial(e.target.value)}
                aria-label="Initial deposit"
              />
            </Field>
            <Field label="Monthly contribution" htmlFor="sav-monthly" hint="USD">
              <Input
                id="sav-monthly"
                type="number"
                min={0}
                step="0.01"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                aria-label="Monthly contribution"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Annual interest rate" htmlFor="sav-rate" hint="%">
              <Input
                id="sav-rate"
                type="number"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                aria-label="Annual interest rate"
              />
            </Field>
            <Field label="Years" htmlFor="sav-years">
              <Input
                id="sav-years"
                type="number"
                min={1}
                value={years}
                onChange={(e) => setYears(e.target.value)}
                aria-label="Number of years"
              />
            </Field>
            <Field label="Compounding" htmlFor="sav-freq">
              <Select value={freqValue} onValueChange={setFreqValue}>
                <SelectTrigger id="sav-freq">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {FREQ_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label="Final balance"
          value={fmtCurrency(finalBalance)}
          accent="#16a34a"
        />
        <Stat label="Total contributions" value={fmtCurrency(totalContrib)} />
        <Stat
          label="Total interest earned"
          value={fmtCurrency(totalInterest)}
          accent="#0ea5e9"
        />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <div>
            <CardTitle className="text-base">Yearly growth</CardTitle>
            <CardDescription>Balance at the end of each year.</CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={downloadCsv}
            disabled={rows.length === 0}
          >
            <Download className="size-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Enter valid inputs to see the growth table.
            </div>
          ) : (
            <ScrollArea className="fl-scroll max-h-96 rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Contributions</TableHead>
                    <TableHead className="text-right">Interest</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.year}>
                      <TableCell className="font-mono tabular-nums">{r.year}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {fmtCurrency(r.balance)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                        {fmtCurrency(r.contributions)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {fmtCurrency(r.interest)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}