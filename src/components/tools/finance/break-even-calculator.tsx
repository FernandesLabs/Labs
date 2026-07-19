'use client'
import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
function fmtNum(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}
function fmtPct(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return '—'
  return `${n.toFixed(digits)}%`
}
/**
 * Break-Even Calculator
 * Compute the break-even point (units), break-even revenue, contribution
 * margin per unit, and contribution margin ratio. Live update.
 */
export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = React.useState('10000')
  const [pricePerUnit, setPricePerUnit] = React.useState('50')
  const [variableCost, setVariableCost] = React.useState('30')
  const fixedN = parseNum(fixedCosts)
  const priceN = parseNum(pricePerUnit)
  const varN = parseNum(variableCost)
  const valid =
    Number.isFinite(fixedN) &&
    fixedN >= 0 &&
    Number.isFinite(priceN) &&
    priceN > 0 &&
    Number.isFinite(varN) &&
    varN >= 0
  const contributionMargin = valid ? priceN - varN : NaN
  const contributionMarginRatio =
    valid && priceN > 0 ? (contributionMargin / priceN) * 100 : NaN
  // Edge case: contribution margin must be positive to break even
  const canBreakEven = Number.isFinite(contributionMargin) && contributionMargin > 0
  const breakEvenUnits =
    canBreakEven && Number.isFinite(fixedN) ? fixedN / contributionMargin : NaN
  const breakEvenRevenue =
    Number.isFinite(breakEvenUnits) && Number.isFinite(priceN)
      ? breakEvenUnits * priceN
      : NaN
  // Edge case: when CM = 0 and fixed costs are 0, you "break even" at zero units
  const zeroCostEdge =
    valid &&
    fixedN === 0 &&
    contributionMargin === 0
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cost &amp; pricing</CardTitle>
          <CardDescription>
            Find the sales volume at which total revenue equals total costs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Fixed costs" htmlFor="be-fixed" hint="USD">
              <Input
                id="be-fixed"
                type="number"
                min={0}
                step="0.01"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(e.target.value)}
                aria-label="Fixed costs"
              />
            </Field>
            <Field label="Price per unit" htmlFor="be-price" hint="USD">
              <Input
                id="be-price"
                type="number"
                min={0}
                step="0.01"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                aria-label="Price per unit"
              />
            </Field>
            <Field label="Variable cost per unit" htmlFor="be-variable" hint="USD">
              <Input
                id="be-variable"
                type="number"
                min={0}
                step="0.01"
                value={variableCost}
                onChange={(e) => setVariableCost(e.target.value)}
                aria-label="Variable cost per unit"
              />
            </Field>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Break-even (units)"
          value={
            zeroCostEdge
              ? '0'
              : Number.isFinite(breakEvenUnits)
                ? fmtNum(Math.ceil(breakEvenUnits))
                : '—'
          }
          accent="#16a34a"
        />
        <Stat
          label="Break-even revenue"
          value={
            zeroCostEdge
              ? fmtCurrency(0)
              : Number.isFinite(breakEvenRevenue)
                ? fmtCurrency(breakEvenRevenue)
                : '—'
          }
          accent="#16a34a"
        />
        <Stat
          label="Contribution margin / unit"
          value={
            Number.isFinite(contributionMargin)
              ? fmtCurrency(contributionMargin)
              : '—'
          }
          accent="#0ea5e9"
        />
        <Stat
          label="Contribution margin ratio"
          value={fmtPct(contributionMarginRatio)}
          accent="#d97706"
        />
      </div>
      {!canBreakEven && valid && !zeroCostEdge ? (
        <div className="flex items-start gap-2 rounded-md border border-amber-300/60 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div>
            <span className="font-medium">Cannot break even.</span>{' '}
            {contributionMargin === 0
              ? 'Your price equals your variable cost — every unit sold contributes nothing toward fixed costs.'
              : 'Your variable cost exceeds your price — every unit sold loses money. Raise the price or lower the variable cost.'}
          </div>
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Formulas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <FormulaRow
            title="Contribution margin per unit"
            formula="CM = Price − Variable Cost"
            example={
              valid
                ? `${fmtCurrency(priceN)} − ${fmtCurrency(varN)} = ${fmtCurrency(contributionMargin)}`
                : 'Enter valid inputs.'
            }
          />
          <FormulaRow
            title="Break-even point (units)"
            formula="BEP = Fixed Costs / Contribution Margin"
            example={
              canBreakEven
                ? `${fmtCurrency(fixedN)} / ${fmtCurrency(contributionMargin)} = ${Number.isFinite(breakEvenUnits) ? fmtNum(breakEvenUnits, 1) : '—'} units`
                : 'Requires a positive contribution margin.'
            }
          />
          <FormulaRow
            title="Break-even revenue"
            formula="BE Revenue = BEP × Price"
            example={
              Number.isFinite(breakEvenRevenue)
                ? `${Number.isFinite(breakEvenUnits) ? fmtNum(breakEvenUnits, 1) : '—'} × ${fmtCurrency(priceN)} = ${fmtCurrency(breakEvenRevenue)}`
                : 'Requires a positive contribution margin.'
            }
          />
          <FormulaRow
            title="Contribution margin ratio"
            formula="CM Ratio = CM / Price × 100"
            example={
              valid
                ? `${fmtCurrency(contributionMargin)} / ${fmtCurrency(priceN)} × 100 = ${fmtPct(contributionMarginRatio)}`
                : 'Enter valid inputs.'
            }
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Status:</span>
            {zeroCostEdge ? (
              <Badge variant="outline" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Already at break-even
              </Badge>
            ) : canBreakEven ? (
              <Badge variant="outline" className="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                Profitable above {fmtNum(Math.ceil(breakEvenUnits))} units
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                Loss-making at every volume
              </Badge>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFixedCosts('10000')
              setPricePerUnit('50')
              setVariableCost('30')
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