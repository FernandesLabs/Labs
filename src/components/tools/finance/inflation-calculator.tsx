'use client'

import * as React from 'react'
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

function fmtFactor(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return `${n.toFixed(4)}×`
}

const CURRENT_YEAR = new Date().getFullYear()

/**
 * Inflation Calculator
 * Initial amount, start/end year, annual inflation rate (%).
 * Future value = amount · (1 + r)^years (nominal dollars needed to keep
 * the same purchasing power). Real purchasing power = amount / (1 + r)^years
 * (what the original amount — kept as cash — is worth in today's dollars).
 */
export default function InflationCalculator() {
  const [amount, setAmount] = React.useState('1000')
  const [startYear, setStartYear] = React.useState(String(CURRENT_YEAR))
  const [endYear, setEndYear] = React.useState(String(CURRENT_YEAR + 10))
  const [rate, setRate] = React.useState('3')

  const amt = parseNum(amount)
  const sy = parseNum(startYear)
  const ey = parseNum(endYear)
  const r = parseNum(rate)

  const years =
    Number.isFinite(sy) && Number.isFinite(ey) && Number.isInteger(sy) && Number.isInteger(ey)
      ? ey - sy
      : NaN

  const factor =
    Number.isFinite(r) && Number.isFinite(years) && years >= 0
      ? Math.pow(1 + r / 100, years)
      : NaN

  const futureValue =
    Number.isFinite(amt) && Number.isFinite(factor) ? amt * factor : NaN

  const realValue =
    Number.isFinite(amt) && Number.isFinite(factor) && factor > 0
      ? amt / factor
      : NaN

  const valid =
    Number.isFinite(amt) && amt > 0 &&
    Number.isFinite(r) && r >= 0 &&
    Number.isFinite(years) && years >= 0

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inflation details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Initial amount" htmlFor="inflation-amount" hint="today's dollars">
              <Input
                id="inflation-amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-label="Initial amount in today's dollars"
              />
            </Field>
            <Field label="Start year" htmlFor="inflation-start">
              <Input
                id="inflation-start"
                inputMode="numeric"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                aria-label="Start year"
              />
            </Field>
            <Field label="End year" htmlFor="inflation-end">
              <Input
                id="inflation-end"
                inputMode="numeric"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                aria-label="End year"
              />
            </Field>
            <Field label="Annual inflation" htmlFor="inflation-rate" hint="%">
              <Input
                id="inflation-rate"
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                aria-label="Annual inflation rate in percent"
              />
            </Field>
          </div>

          {Number.isFinite(amt) && amt <= 0 ? (
            <p className="text-sm text-destructive">Amount must be greater than zero.</p>
          ) : null}
          {Number.isFinite(r) && r < 0 ? (
            <p className="text-sm text-destructive">Inflation rate cannot be negative.</p>
          ) : null}
          {Number.isFinite(years) && years < 0 ? (
            <p className="text-sm text-destructive">End year must be on or after start year.</p>
          ) : null}
          {Number.isFinite(sy) && !Number.isInteger(sy) ? (
            <p className="text-sm text-destructive">Start year must be a whole number.</p>
          ) : null}
          {Number.isFinite(ey) && !Number.isInteger(ey) ? (
            <p className="text-sm text-destructive">End year must be a whole number.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div
            className="grid gap-3 sm:grid-cols-3"
            role="status"
            aria-live="polite"
            aria-label="Inflation calculation results"
          >
            <Stat
              label="Future value"
              value={valid ? fmtCurrency(futureValue) : '—'}
              accent="#16a34a"
            />
            <Stat
              label="Real purchasing power"
              value={valid ? fmtCurrency(realValue) : '—'}
              accent="#dc2626"
            />
            <Stat
              label="Inflation factor"
              value={valid ? fmtFactor(factor) : '—'}
            />
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Explanation
            </div>
            <p className="mt-1 text-foreground">
              Over{' '}
              <span className="font-mono font-semibold">
                {Number.isFinite(years) ? years : '—'}
              </span>{' '}
              year{years === 1 ? '' : 's'} at{' '}
              <span className="font-mono font-semibold">
                {Number.isFinite(r) ? r : '—'}%
              </span>{' '}
              annual inflation, <span className="font-mono">{fmtCurrency(amt)}</span> today
              equals{' '}
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {fmtCurrency(futureValue)}
              </span>{' '}
              in future nominal dollars. But cash kept under the mattress loses
              value — its real purchasing power falls to{' '}
              <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                {fmtCurrency(realValue)}
              </span>{' '}
              in today's terms.
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Future value uses <span className="font-mono">FV = A · (1 + r/100)^n</span> and
            real value uses{' '}
            <span className="font-mono">RV = A / (1 + r/100)^n</span>. Updates live.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
