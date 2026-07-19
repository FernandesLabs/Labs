'use client'
import * as React from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
/**
 * Hardcoded reference exchange rates relative to USD (1 USD = rate <currency>).
 * Reference rates, not live. For estimation only.
 */
const REF_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.5,
  AUD: 1.52,
  CAD: 1.36,
  CHF: 0.88,
  CNY: 7.2,
  INR: 83.2,
  BRL: 5.05,
  MXN: 17.1,
  ZAR: 18.6,
}
const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  INR: 'Indian Rupee',
  BRL: 'Brazilian Real',
  MXN: 'Mexican Peso',
  ZAR: 'South African Rand',
}
function formatAmount(amount: number, currency: string): string {
  if (!Number.isFinite(amount)) return '—'
  const minDigits = currency === 'JPY' ? 0 : 2
  const maxDigits = currency === 'JPY' ? 0 : 4
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
    }).format(amount)
  } catch {
    return `${amount.toFixed(maxDigits)} ${currency}`
  }
}
/**
 * Currency Converter
 * Uses BUNDLED static reference rates relative to USD (no external calls).
 * Live conversion on every input change. Swap button for from/to.
 */
export default function CurrencyConverter() {
  const [amount, setAmount] = React.useState('100')
  const [from, setFrom] = React.useState<string>('USD')
  const [to, setTo] = React.useState<string>('EUR')
  const a = parseNum(amount)
  const fromRate = REF_RATES[from]
  const toRate = REF_RATES[to]
  // amount in USD = a / fromRate; then to target = usd * toRate
  const converted =
    Number.isFinite(a) && fromRate > 0 && toRate > 0
      ? (a / fromRate) * toRate
      : NaN
  const unitRate = fromRate > 0 && toRate > 0 ? toRate / fromRate : NaN
  const swap = () => {
    setFrom(to)
    setTo(from)
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Convert</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Amount" htmlFor="cc-amount">
            <Input
              id="cc-amount"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-label="Amount to convert"
            />
          </Field>
          <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <Field label="From" htmlFor="cc-from">
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger id="cc-from" className="w-full" aria-label="From currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(REF_RATES).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c} — {CURRENCY_NAMES[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={swap}
              aria-label="Swap currencies"
              className="mb-0.5 h-9 w-9"
            >
              <ArrowLeftRight className="size-4" />
            </Button>
            <Field label="To" htmlFor="cc-to">
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger id="cc-to" className="w-full" aria-label="To currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(REF_RATES).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c} — {CURRENCY_NAMES[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          {Number.isFinite(a) && a < 0 ? (
            <p className="text-sm text-destructive">Amount must be non-negative.</p>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Converted amount
          </div>
          <div className="font-mono text-4xl font-bold tabular-nums">
            {formatAmount(converted, to)}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat
              label={`1 ${from} =`}
              value={Number.isFinite(unitRate) ? `${unitRate.toFixed(4)} ${to}` : '—'}
            />
            <Stat label="Amount" value={formatAmount(a, from)} />
            <Stat label="Result" value={formatAmount(converted, to)} accent="#16a34a" />
          </div>
          <p className="text-xs text-muted-foreground">
            Reference rates, not live. For estimation only. Rates are bundled
            relative to USD and updated periodically; do not use for
            transactions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}