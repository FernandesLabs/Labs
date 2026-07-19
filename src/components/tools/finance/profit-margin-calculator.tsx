'use client'
import * as React from 'react'
import { ArrowRightLeft } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
/**
 * Profit Margin Calculator
 * Forward mode: revenue + cost → profit, margin %, markup %.
 * Reverse mode: revenue + desired margin % → required cost (plus implied
 * profit and markup). Live update.
 */
export default function ProfitMarginCalculator() {
  const [mode, setMode] = React.useState<'forward' | 'reverse'>('forward')
  // Forward inputs
  const [revenue, setRevenue] = React.useState('1000')
  const [cost, setCost] = React.useState('700')
  // Reverse inputs
  const [revReverse, setRevReverse] = React.useState('1000')
  const [marginPct, setMarginPct] = React.useState('30')
  // Forward calculations
  const revN = parseNum(revenue)
  const costN = parseNum(cost)
  const fwdValid =
    Number.isFinite(revN) &&
    revN > 0 &&
    Number.isFinite(costN) &&
    costN >= 0
  const profit = fwdValid ? revN - costN : NaN
  const margin = fwdValid ? (profit / revN) * 100 : NaN
  const markup = fwdValid && costN > 0 ? (profit / costN) * 100 : NaN
  // Reverse calculations
  const revRevN = parseNum(revReverse)
  const margN = parseNum(marginPct)
  const revValid =
    Number.isFinite(revRevN) &&
    revRevN > 0 &&
    Number.isFinite(margN) &&
    margN >= 0 &&
    margN <= 100
  const impliedCost = revValid ? revRevN * (1 - margN / 100) : NaN
  const impliedProfit = revValid ? revRevN - impliedCost : NaN
  const impliedMarkup =
    revValid && impliedCost > 0 ? (impliedProfit / impliedCost) * 100 : NaN
  return (
    <div className="space-y-5">
      <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="forward">
            <ArrowRightLeft className="mr-1.5 size-3.5" />
            Forward
          </TabsTrigger>
          <TabsTrigger value="reverse">
            <ArrowRightLeft className="mr-1.5 size-3.5" />
            Reverse
          </TabsTrigger>
        </TabsList>
        <TabsContent value="forward">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Forward: revenue &amp; cost → margin</CardTitle>
              <CardDescription>
                Compute profit, margin %, and markup % from a known revenue and
                cost.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Revenue" htmlFor="pm-revenue" hint="USD">
                  <Input
                    id="pm-revenue"
                    type="number"
                    min={0}
                    step="0.01"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    aria-label="Revenue"
                  />
                </Field>
                <Field label="Cost" htmlFor="pm-cost" hint="USD">
                  <Input
                    id="pm-cost"
                    type="number"
                    min={0}
                    step="0.01"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    aria-label="Cost"
                  />
                </Field>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Stat
              label="Profit"
              value={fmtCurrency(profit)}
              accent={Number.isFinite(profit) ? (profit >= 0 ? '#16a34a' : '#dc2626') : undefined}
            />
            <Stat
              label="Margin"
              value={fmtPct(margin)}
              accent={Number.isFinite(margin) ? (margin >= 0 ? '#16a34a' : '#dc2626') : undefined}
            />
            <Stat
              label="Markup"
              value={costN > 0 ? fmtPct(markup) : '—'}
              accent={Number.isFinite(markup) ? (markup >= 0 ? '#0ea5e9' : '#dc2626') : undefined}
            />
          </div>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Formulas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="font-mono text-xs text-muted-foreground">
                  Profit = Revenue − Cost
                </div>
                <div className="mt-1 font-mono text-xs text-foreground">
                  {fwdValid
                    ? `${fmtCurrency(revN)} − ${fmtCurrency(costN)} = ${fmtCurrency(profit)}`
                    : 'Enter valid revenue and cost.'}
                </div>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="font-mono text-xs text-muted-foreground">
                  Margin % = Profit / Revenue × 100
                </div>
                <div className="mt-1 font-mono text-xs text-foreground">
                  {fwdValid
                    ? `${fmtCurrency(profit)} / ${fmtCurrency(revN)} × 100 = ${fmtPct(margin)}`
                    : 'Enter valid revenue and cost.'}
                </div>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="font-mono text-xs text-muted-foreground">
                  Markup % = Profit / Cost × 100
                </div>
                <div className="mt-1 font-mono text-xs text-foreground">
                  {fwdValid && costN > 0
                    ? `${fmtCurrency(profit)} / ${fmtCurrency(costN)} × 100 = ${fmtPct(markup)}`
                    : 'Cost must be greater than zero to compute markup.'}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reverse">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Reverse: revenue &amp; margin → required cost
              </CardTitle>
              <CardDescription>
                Find the maximum cost that achieves a target margin at a given
                revenue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Revenue" htmlFor="pm-rev-reverse" hint="USD">
                  <Input
                    id="pm-rev-reverse"
                    type="number"
                    min={0}
                    step="0.01"
                    value={revReverse}
                    onChange={(e) => setRevReverse(e.target.value)}
                    aria-label="Revenue"
                  />
                </Field>
                <Field label="Desired margin" htmlFor="pm-margin" hint="%">
                  <Input
                    id="pm-margin"
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={marginPct}
                    onChange={(e) => setMarginPct(e.target.value)}
                    aria-label="Desired margin percentage"
                  />
                </Field>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Stat
              label="Required cost"
              value={fmtCurrency(impliedCost)}
              accent="#d97706"
            />
            <Stat
              label="Implied profit"
              value={fmtCurrency(impliedProfit)}
              accent="#16a34a"
            />
            <Stat
              label="Implied markup"
              value={impliedCost > 0 ? fmtPct(impliedMarkup) : '—'}
              accent="#0ea5e9"
            />
          </div>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Formula</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="font-mono text-xs text-muted-foreground">
                  Cost = Revenue × (1 − Margin / 100)
                </div>
                <div className="mt-1 font-mono text-xs text-foreground">
                  {revValid
                    ? `${fmtCurrency(revRevN)} × (1 − ${margN}% / 100) = ${fmtCurrency(impliedCost)}`
                    : 'Enter valid revenue (positive) and margin (0–100%).'}
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Margin is profit as a percentage of <span className="font-medium">revenue</span>;
                markup is profit as a percentage of <span className="font-medium">cost</span>.
                The same dollar profit gives a higher markup % than margin %.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Card>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setRevenue('1000')
              setCost('700')
              setRevReverse('1000')
              setMarginPct('30')
            }}
          >
            Reset to defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}