'use client'
import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, Stat } from '@/lib/tools/tool-ui'
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
function fmtPct(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—'
  return `${n.toFixed(digits)}%`
}
function fmtNum(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—'
  return `${n.toFixed(digits)}×`
}
/**
 * ROI Calculator
 * Computes total ROI %, annualized ROI (CAGR), total profit, and the
 * investment multiple from initial value, final value, and time period.
 * Live update.
 */
export default function RoiCalculator() {
  const [initial, setInitial] = React.useState('10000')
  const [finalValue, setFinalValue] = React.useState('18000')
  const [years, setYears] = React.useState('5')
  const initialN = parseNum(initial)
  const finalN = parseNum(finalValue)
  const yearsN = parseNum(years)
  const valid =
    Number.isFinite(initialN) &&
    initialN > 0 &&
    Number.isFinite(finalN) &&
    finalN >= 0 &&
    Number.isFinite(yearsN) &&
    yearsN > 0
  const profit = valid ? finalN - initialN : NaN
  const roiPct = valid ? (profit / initialN) * 100 : NaN
  const multiple = valid && initialN > 0 ? finalN / initialN : NaN
  const cagr =
    valid && finalN > 0
      ? (Math.pow(finalN / initialN, 1 / yearsN) - 1) * 100
      : NaN
  const isProfit = Number.isFinite(profit) && profit >= 0
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Investment details</CardTitle>
          <CardDescription>
            Calculate return on investment and annualized growth (CAGR).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Initial investment" htmlFor="roi-initial" hint="USD">
              <Input
                id="roi-initial"
                type="number"
                min={0}
                step="0.01"
                value={initial}
                onChange={(e) => setInitial(e.target.value)}
                aria-label="Initial investment amount"
              />
            </Field>
            <Field label="Final value" htmlFor="roi-final" hint="USD">
              <Input
                id="roi-final"
                type="number"
                min={0}
                step="0.01"
                value={finalValue}
                onChange={(e) => setFinalValue(e.target.value)}
                aria-label="Final value"
              />
            </Field>
            <Field label="Time period" htmlFor="roi-years" hint="years">
              <Input
                id="roi-years"
                type="number"
                min={0}
                step="0.1"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                aria-label="Time period in years"
              />
            </Field>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="ROI (total)"
          value={fmtPct(roiPct)}
          accent={Number.isFinite(roiPct) ? (isProfit ? '#16a34a' : '#dc2626') : undefined}
        />
        <Stat
          label="Annualized (CAGR)"
          value={fmtPct(cagr)}
          accent={Number.isFinite(cagr) ? (isProfit ? '#16a34a' : '#dc2626') : undefined}
        />
        <Stat
          label="Total profit"
          value={fmtCurrency(profit)}
          accent={Number.isFinite(profit) ? (isProfit ? '#16a34a' : '#dc2626') : undefined}
        />
        <Stat label="Multiple" value={fmtNum(multiple)} accent="#0ea5e9" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Formulas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <FormulaRow
            title="ROI (total)"
            formula="ROI = (Final − Initial) / Initial × 100"
            example={
              valid
                ? `(${fmtCurrency(finalN)} − ${fmtCurrency(initialN)}) / ${fmtCurrency(initialN)} × 100 = ${fmtPct(roiPct)}`
                : 'Enter valid inputs to see the calculation.'
            }
          />
          <FormulaRow
            title="CAGR (annualized)"
            formula="CAGR = (Final / Initial)^(1 / years) − 1"
            example={
              valid && finalN > 0
                ? `(${fmtCurrency(finalN)} / ${fmtCurrency(initialN)})^(1/${yearsN}) − 1 = ${fmtPct(cagr)}`
                : 'Requires a positive final value.'
            }
          />
          <FormulaRow
            title="Multiple"
            formula="Multiple = Final / Initial"
            example={
              valid
                ? `${fmtCurrency(finalN)} / ${fmtCurrency(initialN)} = ${fmtNum(multiple)}`
                : 'Enter valid inputs to see the calculation.'
            }
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setInitial('10000')
              setFinalValue('18000')
              setYears('5')
            }}
          >
            Reset to defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
function FormulaRow({
  title,
  formula,
  example,
}: {
  title: string
  formula: string
  example: string
}) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="mt-1 font-mono text-xs text-muted-foreground">{formula}</div>
      <div className="mt-1 font-mono text-xs text-foreground">{example}</div>
    </div>
  )
}