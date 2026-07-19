'use client'
import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
function fmt(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}
type WeightUnit = 'kg' | 'lb'
type Climate = 'temperate' | 'hot' | 'cold'
const LB_TO_KG = 0.45359237
const ML_PER_KG = 35
const ML_PER_30MIN = 350
const CLIMATE_ADJUST: Record<Climate, number> = {
  temperate: 0,
  hot: 500,
  cold: -200,
}
const CLIMATE_OPTIONS: { value: Climate; label: string }[] = [
  { value: 'temperate', label: 'Temperate' },
  { value: 'hot', label: 'Hot / Humid' },
  { value: 'cold', label: 'Cold' },
]
/**
 * Water Intake Calculator
 * Daily water need = 35 ml/kg + 350 ml per 30 min activity + climate adj.
 * Shows ml, liters, and 250 ml cups. Live update.
 */
export default function WaterIntakeCalculator() {
  const [weightUnit, setWeightUnit] = React.useState<WeightUnit>('kg')
  const [weight, setWeight] = React.useState('70')
  const [activityMin, setActivityMin] = React.useState('30')
  const [climate, setClimate] = React.useState<Climate>('temperate')
  const wRaw = parseNum(weight)
  const kg = weightUnit === 'lb' ? wRaw * LB_TO_KG : wRaw
  const min = parseNum(activityMin)
  const climateAdj = CLIMATE_ADJUST[climate]
  const valid = Number.isFinite(kg) && kg > 0
  const validMin = Number.isFinite(min) && min >= 0
  let ml = NaN
  if (valid && validMin) {
    const base = kg * ML_PER_KG
    const activityAdd = Math.floor(min / 30) * ML_PER_30MIN
    ml = base + activityAdd + climateAdj
    if (ml < 0) ml = 0
  }
  const liters = Number.isFinite(ml) ? ml / 1000 : NaN
  const cups = Number.isFinite(ml) ? ml / 250 : NaN
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your details</CardTitle>
          <CardDescription>
            Base need is ~35 ml per kg of body weight. Add 350 ml per 30 min of
            activity, plus a climate adjustment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Weight" htmlFor="water-weight" hint={weightUnit}>
              <div className="flex gap-2">
                <Input
                  id="water-weight"
                  type="number"
                  min={0}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  aria-label={`Weight in ${weightUnit}`}
                  className="flex-1"
                />
                <div className="flex gap-1" role="group" aria-label="Weight unit">
                  <Button
                    type="button"
                    size="sm"
                    variant={weightUnit === 'kg' ? 'default' : 'outline'}
                    onClick={() => setWeightUnit('kg')}
                    aria-pressed={weightUnit === 'kg'}
                    className="px-3"
                  >
                    kg
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={weightUnit === 'lb' ? 'default' : 'outline'}
                    onClick={() => setWeightUnit('lb')}
                    aria-pressed={weightUnit === 'lb'}
                    className="px-3"
                  >
                    lb
                  </Button>
                </div>
              </div>
            </Field>
            <Field label="Activity" htmlFor="water-activity" hint="minutes/day">
              <Input
                id="water-activity"
                type="number"
                min={0}
                value={activityMin}
                onChange={(e) => setActivityMin(e.target.value)}
                aria-label="Daily activity in minutes"
              />
            </Field>
            <Field label="Climate" htmlFor="water-climate">
              <Select value={climate} onValueChange={(v) => setClimate(v as Climate)}>
                <SelectTrigger id="water-climate">
                  <SelectValue placeholder="Select climate" />
                </SelectTrigger>
                <SelectContent>
                  {CLIMATE_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label="Daily water need"
          value={Number.isFinite(ml) ? `${fmt(ml, 0)} ml` : '—'}
          accent="#0ea5e9"
        />
        <Stat
          label="In liters"
          value={Number.isFinite(liters) ? `${fmt(liters, 2)} L` : '—'}
          accent="#0ea5e9"
        />
        <Stat
          label="In cups (250 ml)"
          value={Number.isFinite(cups) ? `${fmt(cups, 1)} cups` : '—'}
          accent="#0ea5e9"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How this is calculated</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Base:</span>{' '}
              {Number.isFinite(kg) && kg > 0
                ? `${fmt(kg, 1)} kg × 35 ml = ${fmt(kg * 35, 0)} ml`
                : '—'}
            </li>
            <li>
              <span className="font-medium text-foreground">Activity:</span>{' '}
              {validMin
                ? `${Math.floor(min / 30)} × 350 ml = ${fmt(Math.floor(min / 30) * 350, 0)} ml`
                : '—'}
            </li>
            <li>
              <span className="font-medium text-foreground">Climate adj:</span>{' '}
              {climate === 'hot'
                ? '+500 ml (hot)'
                : climate === 'cold'
                  ? '−200 ml (cold)'
                  : '0 ml (temperate)'}
            </li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            This estimate includes water from all beverages and food. Individual
            needs vary — drink to thirst and monitor urine colour as a simple
            hydration check.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setWeight('70')
              setActivityMin('30')
              setClimate('temperate')
              setWeightUnit('kg')
            }}
          >
            Reset to defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}