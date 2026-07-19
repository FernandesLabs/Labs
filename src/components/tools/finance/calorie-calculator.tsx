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
type Gender = 'male' | 'female'
interface GoalPreset {
  value: string
  label: string
  delta: number
  // Macro split percentages
  protein: number
  carbs: number
  fat: number
}
const GOAL_PRESETS: GoalPreset[] = [
  {
    value: 'lose1',
    label: 'Lose 1 lb/wk (-500)',
    delta: -500,
    protein: 40,
    carbs: 35,
    fat: 25,
  },
  {
    value: 'lose05',
    label: 'Lose 0.5 lb/wk (-250)',
    delta: -250,
    protein: 35,
    carbs: 40,
    fat: 25,
  },
  {
    value: 'maintain',
    label: 'Maintain',
    delta: 0,
    protein: 30,
    carbs: 40,
    fat: 30,
  },
  {
    value: 'gain05',
    label: 'Gain 0.5 lb/wk (+250)',
    delta: 250,
    protein: 30,
    carbs: 45,
    fat: 25,
  },
  {
    value: 'gain1',
    label: 'Gain 1 lb/wk (+500)',
    delta: 500,
    protein: 30,
    carbs: 50,
    fat: 20,
  },
]
const ACTIVITY_LEVELS = [
  { value: '1.2', label: 'Sedentary' },
  { value: '1.375', label: 'Light' },
  { value: '1.55', label: 'Moderate' },
  { value: '1.725', label: 'Active' },
  { value: '1.9', label: 'Very Active' },
] as const
/**
 * Calorie Calculator
 * BMR (Mifflin-St Jeor) × activity → daily calories. Includes macro
 * breakdown (protein/carbs/fat in grams) based on goal. Live update.
 */
export default function CalorieCalculator() {
  const [gender, setGender] = React.useState<Gender>('male')
  const [age, setAge] = React.useState('30')
  const [weight, setWeight] = React.useState('70')
  const [height, setHeight] = React.useState('175')
  const [activity, setActivity] = React.useState<string>('1.55')
  const [goalValue, setGoalValue] = React.useState<string>('maintain')
  const ageN = parseNum(age)
  const kg = parseNum(weight)
  const cm = parseNum(height)
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
  const multiplier = Number(activity)
  const tdee =
    Number.isFinite(bmr) && Number.isFinite(multiplier) && multiplier > 0
      ? bmr * multiplier
      : NaN
  const goal = GOAL_PRESETS.find((g) => g.value === goalValue) ?? GOAL_PRESETS[2]
  const target = Number.isFinite(tdee) ? tdee + goal.delta : NaN
  // Macro grams: protein/carbs = 4 cal/g, fat = 9 cal/g
  const proteinG =
    Number.isFinite(target) && target > 0 ? (target * goal.protein) / 100 / 4 : NaN
  const carbsG =
    Number.isFinite(target) && target > 0 ? (target * goal.carbs) / 100 / 4 : NaN
  const fatG =
    Number.isFinite(target) && target > 0 ? (target * goal.fat) / 100 / 9 : NaN
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Body metrics</CardTitle>
          <CardDescription>
            Daily calorie needs based on BMR × activity and a chosen goal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Gender" htmlFor="cal-gender">
            <Tabs
              value={gender}
              onValueChange={(v) => setGender(v as Gender)}
              id="cal-gender"
            >
              <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                <TabsTrigger value="male">Male</TabsTrigger>
                <TabsTrigger value="female">Female</TabsTrigger>
              </TabsList>
            </Tabs>
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Age" htmlFor="cal-age" hint="years">
              <Input
                id="cal-age"
                type="number"
                min={1}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                aria-label="Age in years"
              />
            </Field>
            <Field label="Weight" htmlFor="cal-weight" hint="kg">
              <Input
                id="cal-weight"
                type="number"
                min={0}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                aria-label="Weight in kilograms"
              />
            </Field>
            <Field label="Height" htmlFor="cal-height" hint="cm">
              <Input
                id="cal-height"
                type="number"
                min={0}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                aria-label="Height in centimeters"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Activity level" htmlFor="cal-activity">
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger id="cal-activity">
                  <SelectValue placeholder="Select activity" />
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
            <Field label="Goal" htmlFor="cal-goal">
              <Select value={goalValue} onValueChange={setGoalValue}>
                <SelectTrigger id="cal-goal">
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_PRESETS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
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
          label="BMR"
          value={Number.isFinite(bmr) ? `${fmt(bmr, 0)} cal` : '—'}
          accent="#0ea5e9"
        />
        <Stat
          label="TDEE"
          value={Number.isFinite(tdee) ? `${fmt(tdee, 0)} cal` : '—'}
          accent="#16a34a"
        />
        <Stat
          label="Target calories"
          value={Number.isFinite(target) ? `${fmt(target, 0)} cal` : '—'}
          accent="#d97706"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Macro breakdown</CardTitle>
          <CardDescription>
            Split for goal &quot;{goal.label}&quot; · P {goal.protein}% / C{' '}
            {goal.carbs}% / F {goal.fat}%
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat
              label="Protein"
              value={
                Number.isFinite(proteinG) ? `${fmt(proteinG, 0)} g` : '—'
              }
              accent="#dc2626"
            />
            <Stat
              label="Carbs"
              value={Number.isFinite(carbsG) ? `${fmt(carbsG, 0)} g` : '—'}
              accent="#d97706"
            />
            <Stat
              label="Fat"
              value={Number.isFinite(fatG) ? `${fmt(fatG, 0)} g` : '—'}
              accent="#0ea5e9"
            />
          </div>
          <div className="space-y-2">
            <MacroBar
              label="Protein"
              pct={goal.protein}
              grams={proteinG}
              color="bg-rose-500"
            />
            <MacroBar
              label="Carbs"
              pct={goal.carbs}
              grams={carbsG}
              color="bg-amber-500"
            />
            <MacroBar
              label="Fat"
              pct={goal.fat}
              grams={fatG}
              color="bg-sky-500"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Protein and carbs provide ~4 cal/g; fat provides ~9 cal/g. Macro
            ratios are general guidance — adjust to suit your training and
            dietary needs.
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
              setGender('male')
              setAge('30')
              setWeight('70')
              setHeight('175')
              setActivity('1.55')
              setGoalValue('maintain')
            }}
          >
            Reset to defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
function MacroBar({
  label,
  pct,
  grams,
  color,
}: {
  label: string
  pct: number
  grams: number
  color: string
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-medium">
          {label}{' '}
          <span className="text-muted-foreground">({pct}%)</span>
        </span>
        <span className="font-mono tabular-nums">
          {Number.isFinite(grams) ? `${grams.toFixed(0)} g` : '—'}
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`absolute inset-y-0 left-0 ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label={`${label} ${pct}%`}
        />
      </div>
    </div>
  )
}