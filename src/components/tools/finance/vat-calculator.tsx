'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'] as const
type Currency = (typeof CURRENCIES)[number]

const CURRENCY_LOCALE: Record<Currency, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
  CAD: 'en-CA',
  AUD: 'en-AU',
  CHF: 'de-CH',
  CNY: 'zh-CN',
  INR: 'en-IN',
  BRL: 'pt-BR',
}

function formatCurrency(amount: number, currency: Currency): string {
  if (!Number.isFinite(amount)) return '—'
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

/**
 * VAT Calculator
 * Modes: add VAT (net → gross) or remove VAT (gross → net).
 * Auto-calculates on load and on every input change.
 */
export default function VatCalculator() {
  const [mode, setMode] = React.useState<'add' | 'remove'>('add')
  const [amount, setAmount] = React.useState('100')
  const [rate, setRate] = React.useState('20')
  const [currency, setCurrency] = React.useState<Currency>('USD')

  // Live computation — runs on every render so results update instantly.
  const a = parseNum(amount)
  const r = parseNum(rate)

  let net = NaN
  let vat = NaN
  let gross = NaN

  if (Number.isFinite(a) && Number.isFinite(r)) {
    if (mode === 'add') {
      net = a
      vat = a * (r / 100)
      gross = a + vat
    } else {
      gross = a
      net = a / (1 + r / 100)
      vat = gross - net
    }
  }

  return (
    <div className="space-y-5">
      <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="add">Add VAT</TabsTrigger>
          <TabsTrigger value="remove">Remove VAT</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <p className="text-sm text-muted-foreground">
            Enter a net amount to add VAT and see the gross total.
          </p>
        </TabsContent>
        <TabsContent value="remove">
          <p className="text-sm text-muted-foreground">
            Enter a gross amount to back out the VAT and see the net amount.
          </p>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Amount &amp; rate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label={mode === 'add' ? 'Net amount' : 'Gross amount'}
              htmlFor="vat-amount"
            >
              <Input
                id="vat-amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-label="Amount"
              />
            </Field>
            <Field label="VAT rate" htmlFor="vat-rate" hint="percent">
              <Input
                id="vat-rate"
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                aria-label="VAT rate in percent"
              />
            </Field>
            <Field label="Currency" htmlFor="vat-currency">
              <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                <SelectTrigger id="vat-currency" className="w-full" aria-label="Currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {Number.isFinite(a) && a < 0 ? (
            <p className="text-sm text-destructive">Amount must be non-negative.</p>
          ) : null}
          {Number.isFinite(r) && r < 0 ? (
            <p className="text-sm text-destructive">VAT rate must be non-negative.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {mode === 'add' ? 'VAT added' : 'VAT removed'}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Net" value={formatCurrency(net, currency)} />
            <Stat
              label={`VAT (${Number.isFinite(r) ? r : 0}%)`}
              value={formatCurrency(vat, currency)}
              accent="#0ea5e9"
            />
            <Stat
              label="Gross"
              value={formatCurrency(gross, currency)}
              accent="#16a34a"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Results update live as you type. Currency formatting is for display
            only.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
