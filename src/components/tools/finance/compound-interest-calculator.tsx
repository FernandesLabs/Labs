'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const FREQ_OPTIONS = [
  { value: '1', label: 'Annually' },
  { value: '4', label: 'Quarterly' },
  { value: '12', label: 'Monthly' },
  { value: '365', label: 'Daily' },
] as const

/**
 * Compound Interest Calculator
 * Principal, annual rate (%), compounding frequency, years, optional
 * regular monthly contribution. Live calculation on every input change.
 */
export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = React.useState('10000')
  const [rate, setRate] = React.useState('7')
  const [freq, setFreq] = React.useState('12')
  const [years, setYears] = React.useState('10')
  const [contribution, setContribution] = React.useState('200')

  const p = parseNum(principal)
  const ar = parseNum(rate)
  const n = Number.parseInt(freq, 10)
  const y = parseNum(years)
  const c = parseNum(contribution)

  let finalAmount = NaN
  let totalContributions = NaN
  let interestEarned = NaN

  if (
    Number.isFinite(p) &&
    p >= 0 &&
    Number.isFinite(ar) &&
    Number.isFinite(y) &&
    y > 0 &&
    n > 0
  ) {
    const r = ar / 100 / n
    const periods = n * y
    const principalGrowth = p * Math.pow(1 + r, periods)

    // Regular contribution: treat as monthly contribution converted to per-period.
    const monthly = Number.isFinite(c) && c > 0 ? c : 0
    const perPeriod = (monthly * 12) / n
    let contribGrowth = 0
    if (monthly > 0) {
      if (r === 0) {
        contribGrowth = perPeriod * periods
      } else {
        contribGrowth = perPeriod * ((Math.pow(1 + r, periods) - 1) / r)
      }
    }

    finalAmount = principalGrowth + contribGrowth
    totalContributions = p + monthly * 12 * y
    interestEarned = finalAmount - totalContributions
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Investment details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Initial principal" htmlFor="ci-principal">
              <Input
                id="ci-principal"
                inputMode="decimal"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                aria-label="Initial principal"
              />
            </Field>
            <Field label="Annual rate" htmlFor="ci-rate" hint="percent">
              <Input
                id="ci-rate"
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                aria-label="Annual interest rate in percent"
              />
            </Field>
            <Field label="Compounding" htmlFor="ci-freq">
              <Select value={freq} onValueChange={setFreq}>
                <SelectTrigger id="ci-freq" className="w-full" aria-label="Compounding frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQ_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Years" htmlFor="ci-years">
              <Input
                id="ci-years"
                inputMode="decimal"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                aria-label="Number of years"
              />
            </Field>
            <Field
              label="Monthly contribution"
              htmlFor="ci-contrib"
              hint="optional"
              className="sm:col-span-2"
            >
              <Input
                id="ci-contrib"
                inputMode="decimal"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                aria-label="Optional monthly contribution"
              />
            </Field>
          </div>

          {Number.isFinite(ar) && ar < 0 ? (
            <p className="text-sm text-destructive">
              Interest rate cannot be negative.
            </p>
          ) : null}
          {Number.isFinite(y) && y <= 0 ? (
            <p className="text-sm text-destructive">
              Years must be greater than zero.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Projected balance
          </div>
          <div className="font-mono text-4xl font-bold tabular-nums">
            {fmtCurrency(finalAmount)}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat
              label="Final amount"
              value={fmtCurrency(finalAmount)}
              accent="#16a34a"
            />
            <Stat
              label="Total contributions"
              value={fmtCurrency(totalContributions)}
            />
            <Stat
              label="Interest earned"
              value={fmtCurrency(interestEarned)}
              accent="#0ea5e9"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Formula:{' '}
            <span className="font-mono">
              A = P(1 + r/n)ⁿᵗ + PMT · (((1 + r/n)ⁿᵗ − 1) / (r/n))
            </span>
            . Contributions are made at the end of each period.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
