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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

type Gender = 'male' | 'female'
type WeightUnit = 'kg' | 'lb'
type HeightUnit = 'cm' | 'in'

const LB_TO_KG = 0.45359237
const IN_TO_CM = 2.54

const ACTIVITY_LEVELS = [
  { label: 'Sedentary', multiplier: 1.2, desc: 'Little or no exercise' },
  { label: 'Light', multiplier: 1.375, desc: 'Light exercise 1-3 days/wk' },
  { label: 'Moderate', multiplier: 1.55, desc: 'Moderate exercise 3-5 days/wk' },
  { label: 'Active', multiplier: 1.725, desc: 'Hard exercise 6-7 days/wk' },
  { label: 'Very Active', multiplier: 1.9, desc: 'Very hard exercise / physical job' },
] as const

/**
 * BMR Calculator
 * Basal Metabolic Rate via the Mifflin-St Jeor equation.
 * Gender (Tabs), age, weight (kg/lb), height (cm/in).
 * Live update — no button press required.
 */
export default function BmrCalculator() {
  const [gender, setGender] = React.useState<Gender>('male')
  const [age, setAge] = React.useState('30')
  const [weightUnit, setWeightUnit] = React.useState<WeightUnit>('kg')
  const [weight, setWeight] = React.useState('70')
  const [heightUnit, setHeightUnit] = React.useState<HeightUnit>('cm')
  const [height, setHeight] = React.useState('175')

  const ageN = parseNum(age)
  const wRaw = parseNum(weight)
  const hRaw = parseNum(height)
  const kg = weightUnit === 'lb' ? wRaw * LB_TO_KG : wRaw
  const cm = heightUnit === 'in' ? hRaw * IN_TO_CM : hRaw

  const valid =
    Number.isFinite(ageN) &&
    ageN > 0 &&
    Number.isFinite(kg) &&
    kg > 0 &&
    Number.isFinite(cm) &&
    cm > 0

  let bmr = NaN
  if (valid) {
    const base = 10 * kg + 6.25 * cm - 5 * ageN
    bmr = gender === 'male' ? base + 5 : base - 161
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your details</CardTitle>
          <CardDescription>
            Uses the Mifflin-St Jeor equation — the most accurate BMR formula
            for most people.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Gender" htmlFor="bmr-gender-tabs">
            <Tabs
              value={gender}
              onValueChange={(v) => setGender(v as Gender)}
              id="bmr-gender-tabs"
            >
              <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                <TabsTrigger value="male">Male</TabsTrigger>
                <TabsTrigger value="female">Female</TabsTrigger>
              </TabsList>
            </Tabs>
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Age" htmlFor="bmr-age" hint="years">
              <Input
                id="bmr-age"
                inputMode="numeric"
                type="number"
                min={1}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                aria-label="Age in years"
              />
            </Field>

            <Field label="Weight" htmlFor="bmr-weight" hint={weightUnit}>
              <div className="flex gap-2">
                <Input
                  id="bmr-weight"
                  inputMode="decimal"
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

            <Field label="Height" htmlFor="bmr-height" hint={heightUnit}>
              <div className="flex gap-2">
                <Input
                  id="bmr-height"
                  inputMode="decimal"
                  type="number"
                  min={0}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  aria-label={`Height in ${heightUnit}`}
                  className="flex-1"
                />
                <div className="flex gap-1" role="group" aria-label="Height unit">
                  <Button
                    type="button"
                    size="sm"
                    variant={heightUnit === 'cm' ? 'default' : 'outline'}
                    onClick={() => setHeightUnit('cm')}
                    aria-pressed={heightUnit === 'cm'}
                    className="px-3"
                  >
                    cm
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={heightUnit === 'in' ? 'default' : 'outline'}
                    onClick={() => setHeightUnit('in')}
                    aria-pressed={heightUnit === 'in'}
                    className="px-3"
                  >
                    in
                  </Button>
                </div>
              </div>
            </Field>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label="BMR"
          value={Number.isFinite(bmr) ? `${fmt(bmr, 0)} cal` : '—'}
          accent="#16a34a"
        />
        <Stat
          label="Weight (kg)"
          value={Number.isFinite(kg) && kg > 0 ? `${fmt(kg, 1)} kg` : '—'}
        />
        <Stat
          label="Height (cm)"
          value={Number.isFinite(cm) && cm > 0 ? `${fmt(cm, 1)} cm` : '—'}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">TDEE by activity level</CardTitle>
          <CardDescription>
            Total Daily Energy Expenditure (TDEE) = BMR × activity multiplier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="fl-scroll max-h-96 overflow-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity level</TableHead>
                  <TableHead className="text-right">Multiplier</TableHead>
                  <TableHead className="text-right">TDEE (cal/day)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ACTIVITY_LEVELS.map((lvl) => (
                  <TableRow key={lvl.label}>
                    <TableCell>
                      <div className="font-medium">{lvl.label}</div>
                      <div className="text-xs text-muted-foreground">{lvl.desc}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      ×{lvl.multiplier.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {Number.isFinite(bmr) ? fmt(bmr * lvl.multiplier, 0) : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            BMR is the number of calories your body burns at complete rest. TDEE
            estimates your daily calorie needs based on activity level. These
            figures are estimates — consult a healthcare professional for
            personalised advice.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
