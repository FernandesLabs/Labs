'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Field, Stat } from '@/lib/tools/tool-ui'

const QUICK_TIPS = [15, 18, 20, 25] as const

const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function parseNum(value: string): number {
  const trimmed = value.trim()
  if (trimmed === '') return NaN
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : NaN
}

export default function TipCalculator() {
  const [bill, setBill] = React.useState('50')
  const [tipPct, setTipPct] = React.useState(18)
  const [people, setPeople] = React.useState('1')
  const [roundUp, setRoundUp] = React.useState(false)

  const billNum = parseNum(bill)
  const peopleNum = parseNum(people)

  const validBill = Number.isFinite(billNum) && billNum > 0
  const validPeople =
    Number.isFinite(peopleNum) && Number.isInteger(peopleNum) && peopleNum >= 1

  const tipAmount = validBill ? billNum * (tipPct / 100) : NaN
  let total = validBill ? billNum + tipAmount : NaN
  if (roundUp && Number.isFinite(total)) {
    total = Math.ceil(total)
  }
  const perPerson =
    validBill && validPeople ? total / peopleNum : NaN

  const display = (n: number) =>
    Number.isFinite(n) ? currencyFmt.format(n) : '—'

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Bill amount"
          htmlFor="tc-bill"
          hint="USD"
        >
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="tc-bill"
              inputMode="decimal"
              type="number"
              min={0}
              step="0.01"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              aria-label="Bill amount in USD"
              className="pl-7"
            />
          </div>
        </Field>

        <Field
          label="Number of people"
          htmlFor="tc-people"
          hint="Split the bill"
        >
          <Input
            id="tc-people"
            inputMode="numeric"
            type="number"
            min={1}
            step={1}
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            aria-label="Number of people splitting the bill"
          />
        </Field>
      </div>

      <Field
        label="Tip percentage"
        htmlFor="tc-tip"
        hint={`${tipPct}%`}
      >
        <Slider
          id="tc-tip"
          min={0}
          max={30}
          step={1}
          value={[tipPct]}
          onValueChange={(v) => setTipPct(v[0] ?? tipPct)}
        />
      </Field>

      <Field label="Quick tip">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {QUICK_TIPS.map((pct) => (
            <Button
              key={pct}
              type="button"
              variant={tipPct === pct ? 'default' : 'outline'}
              onClick={() => setTipPct(pct)}
              aria-pressed={tipPct === pct}
              className={
                tipPct === pct
                  ? 'bg-primary text-primary-foreground'
                  : undefined
              }
            >
              {pct}%
            </Button>
          ))}
        </div>
      </Field>

      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
        <Label
          htmlFor="tc-round"
          className="pr-3 text-sm font-medium text-foreground"
        >
          Round total up
          <span className="block text-xs font-normal text-muted-foreground">
            Round the grand total up to the nearest whole dollar.
          </span>
        </Label>
        <Switch
          id="tc-round"
          checked={roundUp}
          onCheckedChange={setRoundUp}
          aria-label="Round total up to nearest whole number"
        />
      </div>

      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        role="status"
        aria-live="polite"
      >
        <Stat
          label="Tip amount"
          value={display(tipAmount)}
          accent={validBill ? 'oklch(0.6 0.18 50)' : undefined}
        />
        <Stat
          label="Total"
          value={display(total)}
          accent={validBill ? 'oklch(0.62 0.17 150)' : undefined}
        />
        <Stat label="Per person" value={display(perPerson)} />
      </div>

      {!validBill && bill.trim() !== '' ? (
        <p className="text-sm text-destructive">
          Enter a bill amount greater than zero.
        </p>
      ) : null}
      {!validPeople && people.trim() !== '' ? (
        <p className="text-sm text-destructive">
          Enter at least one person to split the bill.
        </p>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Calculations update live as you type. Values are formatted in US
        dollars using <code className="font-mono">Intl.NumberFormat</code>.
      </p>
    </div>
  )
}
