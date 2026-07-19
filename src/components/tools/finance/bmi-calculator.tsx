'use client'
import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Field, Stat } from '@/lib/tools/tool-ui'
function parseNum(value: string): number {
  if (value == null) return NaN
  const trimmed = value.trim()
  if (trimmed === '') return NaN
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : NaN
}
function fmt(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}
interface Category {
  label: string
  color: string
  bg: string
}
function categorize(bmi: number): Category | null {
  if (!Number.isFinite(bmi) || bmi <= 0) return null
  if (bmi < 18.5)
    return {
      label: 'Underweight',
      color: '#0ea5e9',
      bg: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    }
  if (bmi < 25)
    return {
      label: 'Normal',
      color: '#16a34a',
      bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    }
  if (bmi < 30)
    return {
      label: 'Overweight',
      color: '#d97706',
      bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    }
  return {
    label: 'Obese',
    color: '#dc2626',
    bg: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  }
}
/**
 * BMI Calculator
 * Metric (cm / kg) or Imperial (ft + in / lb) via Tabs.
 * Auto-calculates on every input change — no button press required.
 */
export default function BmiCalculator() {
  const [unit, setUnit] = React.useState<'metric' | 'imperial'>('metric')
  // Metric
  const [cm, setCm] = React.useState('170')
  const [kg, setKg] = React.useState('65')
  // Imperial
  const [ft, setFt] = React.useState('5')
  const [inch, setInch] = React.useState('7')
  const [lb, setLb] = React.useState('145')
  let bmi = NaN
  let heightM = NaN
  if (unit === 'metric') {
    const h = parseNum(cm)
    const w = parseNum(kg)
    if (h > 0 && w > 0) {
      heightM = h / 100
      bmi = w / (heightM * heightM)
    }
  } else {
    const f = parseNum(ft)
    const i = parseNum(inch)
    const p = parseNum(lb)
    const totalIn = (Number.isFinite(f) ? f * 12 : 0) + (Number.isFinite(i) ? i : 0)
    if (totalIn > 0 && p > 0) {
      bmi = (703 * p) / (totalIn * totalIn)
      heightM = totalIn * 0.0254
    }
  }
  const cat = categorize(bmi)
  const healthyLow =
    Number.isFinite(heightM) && heightM > 0 ? 18.5 * heightM * heightM : NaN
  const healthyHigh =
    Number.isFinite(heightM) && heightM > 0 ? 24.9 * heightM * heightM : NaN
  return (
    <div className="space-y-5">
      <Tabs value={unit} onValueChange={(v) => setUnit(v as typeof unit)}>
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="metric">Metric (cm / kg)</TabsTrigger>
          <TabsTrigger value="imperial">Imperial (ft / lb)</TabsTrigger>
        </TabsList>
        <TabsContent value="metric">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enter your measurements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Height" htmlFor="bmi-cm" hint="centimeters">
                  <Input
                    id="bmi-cm"
                    inputMode="decimal"
                    value={cm}
                    onChange={(e) => setCm(e.target.value)}
                    aria-label="Height in centimeters"
                  />
                </Field>
                <Field label="Weight" htmlFor="bmi-kg" hint="kilograms">
                  <Input
                    id="bmi-kg"
                    inputMode="decimal"
                    value={kg}
                    onChange={(e) => setKg(e.target.value)}
                    aria-label="Weight in kilograms"
                  />
                </Field>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="imperial">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enter your measurements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Height" htmlFor="bmi-ft" hint="feet">
                  <Input
                    id="bmi-ft"
                    inputMode="decimal"
                    value={ft}
                    onChange={(e) => setFt(e.target.value)}
                    aria-label="Height in feet"
                  />
                </Field>
                <Field label="Height" htmlFor="bmi-in" hint="inches">
                  <Input
                    id="bmi-in"
                    inputMode="decimal"
                    value={inch}
                    onChange={(e) => setInch(e.target.value)}
                    aria-label="Height in inches"
                  />
                </Field>
                <Field label="Weight" htmlFor="bmi-lb" hint="pounds">
                  <Input
                    id="bmi-lb"
                    inputMode="decimal"
                    value={lb}
                    onChange={(e) => setLb(e.target.value)}
                    aria-label="Weight in pounds"
                  />
                </Field>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Your BMI
              </div>
              <div
                className="mt-1 font-mono text-4xl font-bold tabular-nums"
                style={{ color: cat ? cat.color : undefined }}
              >
                {Number.isFinite(bmi) ? fmt(bmi, 1) : '—'}
              </div>
            </div>
            {cat ? (
              <Badge className={cat.bg} variant="outline">
                {cat.label}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Enter valid measurements
              </Badge>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat
              label="BMI"
              value={Number.isFinite(bmi) ? fmt(bmi, 1) : '—'}
              accent={cat?.color}
            />
            <Stat
              label="Healthy weight (low)"
              value={Number.isFinite(healthyLow) ? `${fmt(healthyLow, 1)} kg` : '—'}
            />
            <Stat
              label="Healthy weight (high)"
              value={Number.isFinite(healthyHigh) ? `${fmt(healthyHigh, 1)} kg` : '—'}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Healthy BMI range is 18.5 – 24.9. BMI is a screening tool and does
            not directly measure body fat; consult a healthcare professional for
            medical advice.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}