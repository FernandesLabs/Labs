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

function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

function fmtCurrency(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n)
}

interface Amortization {
  monthly: number
  totalPaid: number
  totalInterest: number
  firstInterest: number
  firstPrincipal: number
  lastInterest: number
  lastPrincipal: number
}

function amortize(principal: number, annualRatePct: number, months: number): Amortization | null {
  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(annualRatePct) ||
    !Number.isFinite(months)
  )
    return null
  if (principal <= 0 || months <= 0) return null
  if (annualRatePct < 0) return null

  const r = annualRatePct / 100 / 12
  let monthly: number
  if (r === 0) {
    monthly = principal / months
  } else {
    const factor = Math.pow(1 + r, months)
    monthly = (principal * r * factor) / (factor - 1)
  }
  const totalPaid = monthly * months
  const totalInterest = totalPaid - principal

  // First payment breakdown
  const firstInterest = r === 0 ? 0 : principal * r
  const firstPrincipal = monthly - firstInterest

  // Last payment breakdown — iterate the balance down
  let balance = principal
  let lastInterest = 0
  let lastPrincipal = 0
  const cap = Math.min(months, 100000)
  for (let i = 0; i < cap; i++) {
    const interestPart = balance * r
    const principalPart = Math.min(monthly - interestPart, balance)
    if (i === cap - 1 || principalPart >= balance - 1e-9) {
      lastInterest = interestPart
      lastPrincipal = principalPart
      break
    }
    balance -= principalPart
    lastInterest = interestPart
    lastPrincipal = principalPart
  }

  return {
    monthly,
    totalPaid,
    totalInterest,
    firstInterest,
    firstPrincipal,
    lastInterest,
    lastPrincipal,
  }
}

/**
 * Loan Calculator
 * Principal, annual interest rate (%), term in months or years.
 * Standard amortization formula. Live calculation on every input change.
 */
export default function LoanCalculator() {
  const [principal, setPrincipal] = React.useState('20000')
  const [rate, setRate] = React.useState('7.5')
  const [termUnit, setTermUnit] = React.useState<'months' | 'years'>('years')
  const [term, setTerm] = React.useState('5')

  const p = parseNum(principal)
  const ar = parseNum(rate)
  const t = parseNum(term)
  const months =
    Number.isFinite(t) && t > 0 ? (termUnit === 'years' ? t * 12 : t) : NaN

  const result = amortize(
    Number.isFinite(p) ? p : 0,
    Number.isFinite(ar) ? ar : 0,
    Number.isFinite(months) ? months : 0,
  )

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Loan details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Principal" htmlFor="loan-principal" hint="amount borrowed">
              <Input
                id="loan-principal"
                inputMode="decimal"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                aria-label="Loan principal amount"
              />
            </Field>
            <Field label="Annual interest rate" htmlFor="loan-rate" hint="percent">
              <Input
                id="loan-rate"
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                aria-label="Annual interest rate in percent"
              />
            </Field>
            <Field label="Term" htmlFor="loan-term">
              <Input
                id="loan-term"
                inputMode="decimal"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                aria-label="Loan term"
              />
            </Field>
          </div>

          <Tabs value={termUnit} onValueChange={(v) => setTermUnit(v as typeof termUnit)}>
            <TabsList className="grid w-full grid-cols-2 sm:w-auto">
              <TabsTrigger value="years">Years</TabsTrigger>
              <TabsTrigger value="months">Months</TabsTrigger>
            </TabsList>
          </Tabs>

          {Number.isFinite(p) && p <= 0 ? (
            <p className="text-sm text-destructive">Principal must be greater than zero.</p>
          ) : null}
          {Number.isFinite(ar) && ar < 0 ? (
            <p className="text-sm text-destructive">Interest rate cannot be negative.</p>
          ) : null}
          {Number.isFinite(t) && t <= 0 ? (
            <p className="text-sm text-destructive">Term must be greater than zero.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat
              label="Monthly payment"
              value={result ? fmtCurrency(result.monthly) : '—'}
              accent="#16a34a"
            />
            <Stat
              label="Total paid"
              value={result ? fmtCurrency(result.totalPaid) : '—'}
            />
            <Stat
              label="Total interest"
              value={result ? fmtCurrency(result.totalInterest) : '—'}
              accent="#dc2626"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                First payment
              </div>
              <div className="mt-1 text-sm">
                Principal{' '}
                <span className="font-mono font-semibold">
                  {result ? fmtCurrency(result.firstPrincipal) : '—'}
                </span>
                {' · '}
                Interest{' '}
                <span className="font-mono font-semibold">
                  {result ? fmtCurrency(result.firstInterest) : '—'}
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Last payment
              </div>
              <div className="mt-1 text-sm">
                Principal{' '}
                <span className="font-mono font-semibold">
                  {result ? fmtCurrency(result.lastPrincipal) : '—'}
                </span>
                {' · '}
                Interest{' '}
                <span className="font-mono font-semibold">
                  {result ? fmtCurrency(result.lastInterest) : '—'}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Uses the standard amortization formula{' '}
            <span className="font-mono">M = P·r(1+r)ⁿ / ((1+r)ⁿ − 1)</span> with{' '}
            <span className="font-mono">r</span> = monthly rate,{' '}
            <span className="font-mono">n</span> = {fmt(months, 0)} months.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
