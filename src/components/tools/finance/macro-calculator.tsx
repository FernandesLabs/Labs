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

interface DietPreset {
  value: string
  label: string
  protein: number // %
  carbs: number // %
  fat: number // %
}

const DIET_PRESETS: DietPreset[] = [
  { value: 'balanced', label: 'Balanced (30P / 40C / 30F)', protein: 30, carbs: 40, fat: 30 },
  { value: 'lowcarb', label: 'Low-carb (30P / 20C / 50F)', protein: 30, carbs: 20, fat: 50 },
  { value: 'keto', label: 'Keto (25P / 5C / 70F)', protein: 25, carbs: 5, fat: 70 },
  { value: 'highprotein', label: 'High-protein (40P / 40C / 20F)', protein: 40, carbs: 40, fat: 20 },
]

const PROTEIN_CAL_PER_G = 4
const CARB_CAL_PER_G = 4
const FAT_CAL_PER_G = 9

/**
 * Macro Calculator
 * Daily calories + diet type → protein/carbs/fat in grams.
 * Protein & carbs = 4 cal/g; fat = 9 cal/g. Live update.
 */
export default function MacroCalculator() {
  const [calories, setCalories] = React.useState('2000')
  const [dietValue, setDietValue] = React.useState<string>('balanced')

  const cal = parseNum(calories)
  const valid = Number.isFinite(cal) && cal > 0

  const diet = DIET_PRESETS.find((d) => d.value === dietValue) ?? DIET_PRESETS[0]

  const proteinG = valid ? (cal * diet.protein) / 100 / PROTEIN_CAL_PER_G : NaN
  const carbsG = valid ? (cal * diet.carbs) / 100 / CARB_CAL_PER_G : NaN
  const fatG = valid ? (cal * diet.fat) / 100 / FAT_CAL_PER_G : NaN

  // Verify the split adds up to the calorie target
  const derivedCalories = valid
    ? proteinG * PROTEIN_CAL_PER_G +
      carbsG * CARB_CAL_PER_G +
      fatG * FAT_CAL_PER_G
    : NaN

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your daily target</CardTitle>
          <CardDescription>
            Choose a diet style and we&apos;ll split your daily calories into
            protein, carbs, and fat.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Daily calories" htmlFor="macro-cal" hint="cal/day">
              <Input
                id="macro-cal"
                type="number"
                min={0}
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                aria-label="Daily calorie target"
              />
            </Field>
            <Field label="Diet type" htmlFor="macro-diet">
              <Select value={dietValue} onValueChange={setDietValue}>
                <SelectTrigger id="macro-diet">
                  <SelectValue placeholder="Select diet" />
                </SelectTrigger>
                <SelectContent>
                  {DIET_PRESETS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
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
          label="Protein"
          value={Number.isFinite(proteinG) ? `${fmt(proteinG, 0)} g` : '—'}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Calorie split</CardTitle>
          <CardDescription>
            Visual share of each macro by calorie contribution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex h-6 w-full overflow-hidden rounded-full border border-border">
            {valid ? (
              <>
                <MacroSegment
                  label="Protein"
                  pct={diet.protein}
                  color="bg-rose-500"
                />
                <MacroSegment label="Carbs" pct={diet.carbs} color="bg-amber-500" />
                <MacroSegment label="Fat" pct={diet.fat} color="bg-sky-500" />
              </>
            ) : (
              <div className="flex w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                Enter a daily calorie target to see the split
              </div>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <MacroLegend
              label="Protein"
              pct={diet.protein}
              grams={proteinG}
              color="bg-rose-500"
            />
            <MacroLegend
              label="Carbs"
              pct={diet.carbs}
              grams={carbsG}
              color="bg-amber-500"
            />
            <MacroLegend
              label="Fat"
              pct={diet.fat}
              grams={fatG}
              color="bg-sky-500"
            />
          </div>

          <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Check:</span>{' '}
            {valid
              ? `${fmt(derivedCalories, 0)} cal derived from ${fmt(proteinG * 4, 0)} (P) + ${fmt(carbsG * 4, 0)} (C) + ${fmt(fatG * 9, 0)} (F).`
              : '—'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setCalories('2000')
              setDietValue('balanced')
            }}
          >
            Reset to defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function MacroSegment({
  label,
  pct,
  color,
}: {
  label: string
  pct: number
  color: string
}) {
  const width = Math.min(100, Math.max(0, pct))
  return (
    <div
      className={`${color} flex items-center justify-center text-[10px] font-semibold text-white`}
      style={{ width: `${width}%` }}
      role="img"
      aria-label={`${label} ${pct}%`}
    >
      {width >= 8 ? `${pct}%` : ''}
    </div>
  )
}

function MacroLegend({
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
    <div className="flex items-center gap-2 rounded-md border border-border bg-card p-2">
      <span className={`size-3 rounded-sm ${color}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">
          {pct}% · {Number.isFinite(grams) ? `${grams.toFixed(0)} g` : '—'}
        </div>
      </div>
    </div>
  )
}
