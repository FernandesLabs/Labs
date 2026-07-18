'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, Stat } from '@/lib/tools/tool-ui'

/** Safely parse a float from an input string. Returns NaN for invalid/empty. */
function parseNum(value: string): number {
  if (value == null) return NaN
  const trimmed = value.trim()
  if (trimmed === '') return NaN
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : NaN
}

function fmt(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  })
}

/**
 * Percentage Calculator
 * Three modes: "What is X% of Y", "X is what % of Y", "% change from X to Y".
 * Auto-calculates on every input change — no button press required.
 */
export default function PercentageCalculator() {
  const [mode, setMode] = React.useState<'of' | 'isWhat' | 'change'>('of')

  // Mode 1: what is X% of Y
  const [pct, setPct] = React.useState('15')
  const [ofValue, setOfValue] = React.useState('200')

  // Mode 2: X is what % of Y
  const [part, setPart] = React.useState('30')
  const [whole, setWhole] = React.useState('200')

  // Mode 3: % change from X to Y
  const [fromVal, setFromVal] = React.useState('200')
  const [toVal, setToVal] = React.useState('250')

  const p = parseNum(pct)
  const y = parseNum(ofValue)
  const resultOf = Number.isFinite(p) && Number.isFinite(y) ? (p / 100) * y : NaN

  const a = parseNum(part)
  const b = parseNum(whole)
  const resultIsWhat =
    Number.isFinite(a) && Number.isFinite(b) && b !== 0 ? (a / b) * 100 : NaN

  const f = parseNum(fromVal)
  const t = parseNum(toVal)
  const resultChange =
    Number.isFinite(f) && Number.isFinite(t) && f !== 0
      ? ((t - f) / Math.abs(f)) * 100
      : NaN

  return (
    <div className="space-y-5">
      <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
        <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:grid-flow-col">
          <TabsTrigger value="of">X% of Y</TabsTrigger>
          <TabsTrigger value="isWhat">X is what % of Y</TabsTrigger>
          <TabsTrigger value="change">% change</TabsTrigger>
        </TabsList>

        {/* Mode 1 */}
        <TabsContent value="of">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What is X% of Y?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Percentage (X)" htmlFor="pct-of">
                  <div className="relative">
                    <Input
                      id="pct-of"
                      inputMode="decimal"
                      value={pct}
                      onChange={(e) => setPct(e.target.value)}
                      aria-label="Percentage value"
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </Field>
                <Field label="Of value (Y)" htmlFor="of-y">
                  <Input
                    id="of-y"
                    inputMode="decimal"
                    value={ofValue}
                    onChange={(e) => setOfValue(e.target.value)}
                    aria-label="Value to take percentage of"
                  />
                </Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat label="Result" value={fmt(resultOf, 2)} />
                <Stat label="Percentage" value={`${fmt(p, 2)}%`} />
                <Stat label="Base" value={fmt(y, 2)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mode 2 */}
        <TabsContent value="isWhat">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">X is what % of Y?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Part (X)" htmlFor="iw-part">
                  <Input
                    id="iw-part"
                    inputMode="decimal"
                    value={part}
                    onChange={(e) => setPart(e.target.value)}
                    aria-label="Part value"
                  />
                </Field>
                <Field label="Whole (Y)" htmlFor="iw-whole">
                  <Input
                    id="iw-whole"
                    inputMode="decimal"
                    value={whole}
                    onChange={(e) => setWhole(e.target.value)}
                    aria-label="Whole value"
                  />
                </Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat label="Percentage" value={`${fmt(resultIsWhat, 4)}%`} />
                <Stat label="Part" value={fmt(a, 2)} />
                <Stat label="Whole" value={fmt(b, 2)} />
              </div>
              {Number.isFinite(b) && b === 0 ? (
                <p className="text-sm text-destructive">
                  Whole value cannot be zero.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mode 3 */}
        <TabsContent value="change">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                % increase / decrease from X to Y
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="From (X)" htmlFor="ch-from">
                  <Input
                    id="ch-from"
                    inputMode="decimal"
                    value={fromVal}
                    onChange={(e) => setFromVal(e.target.value)}
                    aria-label="Original value"
                  />
                </Field>
                <Field label="To (Y)" htmlFor="ch-to">
                  <Input
                    id="ch-to"
                    inputMode="decimal"
                    value={toVal}
                    onChange={(e) => setToVal(e.target.value)}
                    aria-label="New value"
                  />
                </Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat
                  label="Change"
                  value={`${resultChange >= 0 ? '+' : ''}${fmt(resultChange, 4)}%`}
                  accent={
                    Number.isFinite(resultChange)
                      ? resultChange >= 0
                        ? '#16a34a'
                        : '#dc2626'
                      : undefined
                  }
                />
                <Stat label="From" value={fmt(f, 2)} />
                <Stat label="To" value={fmt(t, 2)} />
              </div>
              {Number.isFinite(f) && f === 0 ? (
                <p className="text-sm text-destructive">
                  Original value cannot be zero.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
