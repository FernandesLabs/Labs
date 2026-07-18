'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

function monthlyPI(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0 || annualRatePct < 0) return NaN
  const r = annualRatePct / 100 / 12
  if (r === 0) return principal / months
  const factor = Math.pow(1 + r, months)
  return (principal * r * factor) / (factor - 1)
}

/**
 * Mortgage Calculator
 * Home price, down payment ($ or %), loan term, interest rate,
 * property tax, home insurance, PMI. Computes monthly PITI.
 * Live calculation on every input change.
 */
export default function MortgageCalculator() {
  const [price, setPrice] = React.useState('400000')
  const [dpMode, setDpMode] = React.useState<'amount' | 'percent'>('percent')
  const [downPayment, setDownPayment] = React.useState('20')
  const [years, setYears] = React.useState('30')
  const [rate, setRate] = React.useState('6.8')
  const [propTax, setPropTax] = React.useState('6000')
  const [insurance, setInsurance] = React.useState('1400')
  const [pmi, setPmi] = React.useState('0.5')

  const priceN = parseNum(price)
  const dpRaw = parseNum(downPayment)
  const yN = parseNum(years)
  const rN = parseNum(rate)
  const ptN = parseNum(propTax)
  const insN = parseNum(insurance)
  const pmiN = parseNum(pmi)

  const downPaymentAmt =
    dpMode === 'percent'
      ? Number.isFinite(priceN) && Number.isFinite(dpRaw)
        ? priceN * (dpRaw / 100)
        : NaN
      : dpRaw

  const loanAmount =
    Number.isFinite(priceN) && Number.isFinite(downPaymentAmt)
      ? priceN - downPaymentAmt
      : NaN

  const months = Number.isFinite(yN) && yN > 0 ? yN * 12 : NaN
  const pi = monthlyPI(
    Number.isFinite(loanAmount) ? loanAmount : 0,
    Number.isFinite(rN) ? rN : 0,
    Number.isFinite(months) ? months : 0,
  )

  const monthlyTax = Number.isFinite(ptN) ? ptN / 12 : NaN
  const monthlyIns = Number.isFinite(insN) ? insN / 12 : NaN
  const monthlyPmi =
    Number.isFinite(loanAmount) && Number.isFinite(pmiN) && pmiN > 0
      ? (loanAmount * (pmiN / 100)) / 12
      : 0

  const piti =
    Number.isFinite(pi) && Number.isFinite(monthlyTax) && Number.isFinite(monthlyIns)
      ? pi + monthlyTax + monthlyIns + monthlyPmi
      : NaN

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Home &amp; loan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Home price" htmlFor="mtg-price">
              <Input
                id="mtg-price"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                aria-label="Home price"
              />
            </Field>
            <Field label="Loan term" htmlFor="mtg-years" hint="years">
              <Input
                id="mtg-years"
                inputMode="decimal"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                aria-label="Loan term in years"
              />
            </Field>
            <Field label="Interest rate" htmlFor="mtg-rate" hint="percent">
              <Input
                id="mtg-rate"
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                aria-label="Interest rate in percent"
              />
            </Field>
            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <label
                  htmlFor="mtg-down"
                  className="text-sm font-medium text-foreground"
                >
                  Down payment
                </label>
                <span className="text-xs text-muted-foreground">
                  {dpMode === 'percent' ? 'percent' : 'amount'}
                </span>
              </div>
              <div className="flex gap-2">
                <Input
                  id="mtg-down"
                  inputMode="decimal"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  aria-label="Down payment"
                />
                <Tabs value={dpMode} onValueChange={(v) => setDpMode(v as typeof dpMode)}>
                  <TabsList className="grid h-9 grid-cols-2">
                    <TabsTrigger value="percent">%</TabsTrigger>
                    <TabsTrigger value="amount">$</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Property tax" htmlFor="mtg-tax" hint="annual">
              <Input
                id="mtg-tax"
                inputMode="decimal"
                value={propTax}
                onChange={(e) => setPropTax(e.target.value)}
                aria-label="Annual property tax"
              />
            </Field>
            <Field label="Home insurance" htmlFor="mtg-ins" hint="annual">
              <Input
                id="mtg-ins"
                inputMode="decimal"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                aria-label="Annual home insurance"
              />
            </Field>
            <Field label="PMI rate" htmlFor="mtg-pmi" hint="percent / year">
              <Input
                id="mtg-pmi"
                inputMode="decimal"
                value={pmi}
                onChange={(e) => setPmi(e.target.value)}
                aria-label="PMI rate in percent per year"
              />
            </Field>
          </div>
          <p className="text-xs text-muted-foreground">
            PMI (private mortgage insurance) typically applies when your down
            payment is below 20%. Set the rate to 0 if it does not apply.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Monthly PITI
          </div>
          <div className="font-mono text-4xl font-bold tabular-nums">
            {fmtCurrency(piti)}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Principal + interest" value={fmtCurrency(pi)} />
            <Stat label="Property tax" value={fmtCurrency(monthlyTax)} />
            <Stat label="Insurance" value={fmtCurrency(monthlyIns)} />
            <Stat label="PMI" value={fmtCurrency(monthlyPmi)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Loan amount" value={fmtCurrency(loanAmount)} accent="#0ea5e9" />
            <Stat label="Down payment" value={fmtCurrency(downPaymentAmt)} />
            <Stat
              label="Total monthly"
              value={fmtCurrency(piti)}
              accent="#16a34a"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
