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
    maximumFractionDigits: 0,
  }).format(n)
}
function fmtInt(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
}
interface Row {
  year: number
  age: number
  balance: number
  contributions: number
  real: number
}
/**
 * Retirement Calculator
 * Projects retirement savings using monthly compounding. Computes:
 *  - years to retirement
 *  - future value of current savings (lump sum)
 *  - future value of monthly contributions (annuity)
 *  - inflation-adjusted (real) value
 *  - year-by-year projection table (every 5 years + final year)
 * Live update.
 */
export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = React.useState('30')
  const [retireAge, setRetireAge] = React.useState('65')
  const [savings, setSavings] = React.useState('25000')
  const [monthlyContrib, setMonthlyContrib] = React.useState('500')
  const [annualReturn, setAnnualReturn] = React.useState('7')
  const [inflation, setInflation] = React.useState('3')
  const ageN = parseNum(currentAge)
  const retireN = parseNum(retireAge)
  const savingsN = parseNum(savings)
  const contribN = parseNum(monthlyContrib)
  const rateN = parseNum(annualReturn)
  const inflN = parseNum(inflation)
  const valid =
    Number.isFinite(ageN) &&
    ageN > 0 &&
    Number.isFinite(retireN) &&
    retireN > ageN &&
    Number.isFinite(savingsN) &&
    savingsN >= 0 &&
    Number.isFinite(contribN) &&
    contribN >= 0 &&
    Number.isFinite(rateN) &&
    Number.isFinite(inflN)
  const yearsToRetire = valid ? Math.floor(retireN - ageN) : NaN
  const monthlyRate = valid ? rateN / 100 / 12 : 0
  const months = valid ? yearsToRetire * 12 : 0
  // Build year-by-year projection
  const rows: Row[] = React.useMemo(() => {
    if (!valid) return []
    const out: Row[] = []
    let balance = savingsN
    let contributions = savingsN
    out.push({
      year: 0,
      age: ageN,
      balance,
      contributions,
      real: balance,
    })
    for (let y = 1; y <= yearsToRetire; y++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + monthlyRate) + contribN
        contributions += contribN
      }
      out.push({
        year: y,
        age: ageN + y,
        balance,
        contributions,
        real: balance / Math.pow(1 + inflN / 100, y),
      })
    }
    return out
  }, [
    valid,
    savingsN,
    ageN,
    contribN,
    monthlyRate,
    yearsToRetire,
    inflN,
  ])
  // Final values
  const finalRow = rows.length > 0 ? rows[rows.length - 1] : null
  const fvLumpSum =
    valid && monthlyRate !== 0
      ? savingsN * Math.pow(1 + monthlyRate, months)
      : valid
        ? savingsN
        : NaN
  const fvAnnuity =
    valid && monthlyRate !== 0
      ? contribN * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
      : valid
        ? contribN * months
        : NaN
  const totalFV = finalRow ? finalRow.balance : NaN
  const realFV = finalRow ? finalRow.real : NaN
  const totalContrib = finalRow ? finalRow.contributions : NaN
  const totalInterest = Number.isFinite(totalFV) ? totalFV - totalContrib : NaN
  // Display every 5 years + always show final year (if not on boundary)
  const displayRows: Row[] = React.useMemo(() => {
    if (rows.length === 0) return []
    const filtered = rows.filter((r) => r.year % 5 === 0)
    const last = rows[rows.length - 1]
    if (last && last.year % 5 !== 0 && !filtered.includes(last)) {
      filtered.push(last)
    }
    return filtered
  }, [rows])
  const downloadCsv = () => {
    if (rows.length === 0) {
      toast.error('Nothing to export — enter valid inputs first')
      return
    }
    const header = 'Year,Age,Balance,Contributions,Real (inflation-adjusted)'
    const lines = rows.map((r) =>
      [
        r.year,
        r.age,
        r.balance.toFixed(2),
        r.contributions.toFixed(2),
        r.real.toFixed(2),
      ].join(',')
    )
    const csv = [header, ...lines].join('\n')
    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'retirement-projection.csv')
    toast.success('Projection exported as CSV')
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Retirement inputs</CardTitle>
          <CardDescription>
            Monthly compounding. Returns and inflation are annual percentages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Current age" htmlFor="ret-current-age" hint="years">
              <Input
                id="ret-current-age"
                type="number"
                min={1}
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                aria-label="Current age in years"
              />
            </Field>
            <Field label="Retirement age" htmlFor="ret-retire-age" hint="years">
              <Input
                id="ret-retire-age"
                type="number"
                min={1}
                value={retireAge}
                onChange={(e) => setRetireAge(e.target.value)}
                aria-label="Retirement age in years"
              />
            </Field>
            <Field label="Years to retire" htmlFor="ret-years" hint="auto">
              <Input
                id="ret-years"
                readOnly
                value={Number.isFinite(yearsToRetire) ? `${yearsToRetire} yr` : '—'}
                aria-label="Years to retirement"
                className="bg-muted/50"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Current savings" htmlFor="ret-savings" hint="USD">
              <Input
                id="ret-savings"
                type="number"
                min={0}
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                aria-label="Current savings"
              />
            </Field>
            <Field label="Monthly contribution" htmlFor="ret-contrib" hint="USD">
              <Input
                id="ret-contrib"
                type="number"
                min={0}
                value={monthlyContrib}
                onChange={(e) => setMonthlyContrib(e.target.value)}
                aria-label="Monthly contribution"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Expected annual return" htmlFor="ret-return" hint="%">
              <Input
                id="ret-return"
                type="number"
                step="0.1"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                aria-label="Expected annual return percentage"
              />
            </Field>
            <Field label="Inflation" htmlFor="ret-inflation" hint="%">
              <Input
                id="ret-inflation"
                type="number"
                step="0.1"
                value={inflation}
                onChange={(e) => setInflation(e.target.value)}
                aria-label="Inflation percentage"
              />
            </Field>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Years to retirement"
          value={Number.isFinite(yearsToRetire) ? `${fmtInt(yearsToRetire)} yr` : '—'}
          accent="#0ea5e9"
        />
        <Stat
          label="Future value (nominal)"
          value={fmtCurrency(totalFV)}
          accent="#16a34a"
        />
        <Stat
          label="Inflation-adjusted"
          value={fmtCurrency(realFV)}
          accent="#d97706"
        />
        <Stat
          label="Total interest earned"
          value={fmtCurrency(totalInterest)}
          accent="#16a34a"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="FV of current savings" value={fmtCurrency(fvLumpSum)} />
        <Stat label="FV of contributions" value={fmtCurrency(fvAnnuity)} />
        <Stat label="Total contributions" value={fmtCurrency(totalContrib)} />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <div>
            <CardTitle className="text-base">Year-by-year projection</CardTitle>
            <CardDescription>Every 5 years (plus final year).</CardDescription>
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
          {displayRows.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Enter valid inputs to see the projection.
            </div>
          ) : (
            <ScrollArea className="fl-scroll max-h-96 rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Age</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Contributions</TableHead>
                    <TableHead className="text-right">Real value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayRows.map((r) => (
                    <TableRow key={r.year}>
                      <TableCell className="font-mono tabular-nums">{r.year}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {r.age}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {fmtCurrency(r.balance)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                        {fmtCurrency(r.contributions)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {fmtCurrency(r.real)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            &quot;Real value&quot; is the future balance discounted by inflation
            back to today&apos;s purchasing power.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}