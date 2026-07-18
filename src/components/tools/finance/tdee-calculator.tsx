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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const ACTIVITY_LEVELS = [
  { value: '1.2', label: 'Sedentary (little or no exercise)' },
  { value: '1.375', label: 'Light (1-3 days/wk)' },
  { value: '1.55', label: 'Moderate (3-5 days/wk)' },
  { value: '1.725', label: 'Active (6-7 days/wk)' },
  { value: '1.9', label: 'Very Active (physical job)' },
] as const

const GOAL_TARGETS = [
  { label: 'Lose 1 lb/week', delta: -500 },
  { label: 'Lose 0.5 lb/week', delta: -250 },
  { label: 'Maintain', delta: 0 },
  { label: 'Gain 0.5 lb/week', delta: 250 },
  { label: 'Gain 1 lb/week', delta: 500 },
] as const

const LB_TO_KG = 0.45359237
const IN_TO_CM = 2.54

/**
 * TDEE Calculator
 * Total Daily Energy Expenditure = BMR × activity multiplier.
 * BMR may be entered directly or computed from gender/age/weight/height
 * via the Mifflin-St Jeor equation. Live update.
 */
export default function TdeeCalculator() {
  const [mode, setMode] = React.useState<'compute' | 'direct'>('compute')

  // Compute-mode inputs
  const [gender, setGender] = React.useState<Gender>('male')
  const [age, setAge] = React.useState('30')
  const [weight, setWeight] = React.useState('70')
  const [height, setHeight] = React.useState('175')

  // Direct mode
  const [bmrInput, setBmrInput] = React.useState('1600')

  const [activity, setActivity] = React.useState<string>('1.55')

  // Compute BMR
  const ageN = parseNum(age)
  const kg = parseNum(weight)
  const cm = parseNum(height)

  let computedBmr = NaN
  if (
    Number.isFinite(ageN) &&
    ageN > 0 &&
    Number.isFinite(kg) &&
    kg > 0 &&
    Number.isFinite(cm) &&
    cm > 0
  ) {
    const base = 10 * kg + 6.25 * cm - 5 * ageN
    computedBmr = gender === 'male' ? base + 5 : base - 161
  }

  const directBmr = parseNum(bmrInput)
  const bmr =
    mode === 'direct'
      ? Number.isFinite(directBmr) && directBmr > 0
        ? directBmr
        : NaN
      : computedBmr

  const multiplier = Number(activity)
  const tdee =
    Number.isFinite(bmr) && Number.isFinite(multiplier) && multiplier > 0
      ? bmr * multiplier
      : NaN

  return (
    <div className="space-y-5">
      <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="compute">Compute BMR</TabsTrigger>
          <TabsTrigger value="direct">Enter BMR directly</TabsTrigger>
        </TabsList>

        <TabsContent value="compute">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Body metrics</CardTitle>
              <CardDescription>
                BMR is calculated with the Mifflin-St Jeor equation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Gender" htmlFor="tdee-gender">
                <Tabs
                  value={gender}
                  onValueChange={(v) => setGender(v as Gender)}
                  id="tdee-gender"
                >
                  <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                    <TabsTrigger value="male">Male</TabsTrigger>
                    <TabsTrigger value="female">Female</TabsTrigger>
                  </TabsList>
                </Tabs>
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Age" htmlFor="tdee-age" hint="years">
                  <Input
                    id="tdee-age"
                    type="number"
                    min={1}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    aria-label="Age in years"
                  />
                </Field>
                <Field label="Weight" htmlFor="tdee-weight" hint="kg">
                  <Input
                    id="tdee-weight"
                    type="number"
                    min={0}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    aria-label="Weight in kilograms"
                  />
                </Field>
                <Field label="Height" htmlFor="tdee-height" hint="cm">
                  <Input
                    id="tdee-height"
                    type="number"
                    min={0}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    aria-label="Height in centimeters"
                  />
                </Field>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="direct">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enter your BMR</CardTitle>
              <CardDescription>
                If you already know your BMR from a prior calculation or lab
                test, enter it directly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Field label="BMR" htmlFor="tdee-bmr-direct" hint="calories/day">
                <Input
                  id="tdee-bmr-direct"
                  type="number"
                  min={0}
                  value={bmrInput}
                  onChange={(e) => setBmrInput(e.target.value)}
                  aria-label="Basal Metabolic Rate in calories per day"
                />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity level</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Activity" htmlFor="tdee-activity">
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger id="tdee-activity">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_LEVELS.map((lvl) => (
                  <SelectItem key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Stat
          label="BMR"
          value={Number.isFinite(bmr) ? `${fmt(bmr, 0)} cal/day` : '—'}
          accent="#0ea5e9"
        />
        <Stat
          label="TDEE"
          value={Number.isFinite(tdee) ? `${fmt(tdee, 0)} cal/day` : '—'}
          accent="#16a34a"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Calorie targets by goal</CardTitle>
          <CardDescription>
            Adjustments from TDEE based on a 3,500 cal/lb rule of thumb.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="fl-scroll max-h-96 overflow-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Goal</TableHead>
                  <TableHead className="text-right">Δ cal/day</TableHead>
                  <TableHead className="text-right">Target</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {GOAL_TARGETS.map((g) => {
                  const target = Number.isFinite(tdee) ? tdee + g.delta : NaN
                  return (
                    <TableRow key={g.label}>
                      <TableCell className="font-medium">{g.label}</TableCell>
                      <TableCell
                        className={`text-right font-mono tabular-nums ${
                          g.delta < 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : g.delta > 0
                              ? 'text-amber-600 dark:text-amber-400'
                              : ''
                        }`}
                      >
                        {g.delta > 0 ? `+${g.delta}` : g.delta}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {Number.isFinite(target) ? `${fmt(target, 0)} cal` : '—'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            One pound of body fat ≈ 3,500 calories. A daily deficit of 500 cal
            should yield roughly 1 lb of weight loss per week.
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
              setAge('30')
              setWeight('70')
              setHeight('175')
              setBmrInput('1600')
              setActivity('1.55')
              setGender('male')
            }}
          >
            Reset to defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
