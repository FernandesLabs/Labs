'use client'
import * as React from 'react'
import { toast } from 'sonner'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
function toCm(value: string, unit: 'cm' | 'in'): number {
  const n = parseNum(value)
  if (!Number.isFinite(n)) return NaN
  return unit === 'in' ? n * 2.54 : n
}
interface FatCategory {
  label: string
  color: string
  bg: string
}
function categorize(bf: number, gender: 'male' | 'female'): FatCategory | null {
  if (!Number.isFinite(bf) || bf <= 0) return null
  // American Council on Exercise ranges
  if (gender === 'male') {
    if (bf < 6) return { label: 'Essential', color: '#0ea5e9', bg: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' }
    if (bf < 14) return { label: 'Athletic', color: '#16a34a', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' }
    if (bf < 18) return { label: 'Fitness', color: '#84cc16', bg: 'bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300' }
    if (bf < 25) return { label: 'Average', color: '#d97706', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' }
    return { label: 'Obese', color: '#dc2626', bg: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' }
  }
  if (bf < 14) return { label: 'Essential', color: '#0ea5e9', bg: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' }
  if (bf < 21) return { label: 'Athletic', color: '#16a34a', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' }
  if (bf < 25) return { label: 'Fitness', color: '#84cc16', bg: 'bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300' }
  if (bf < 32) return { label: 'Average', color: '#d97706', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' }
  return { label: 'Obese', color: '#dc2626', bg: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' }
}
/**
 * Body Fat Calculator — U.S. Navy method.
 * Gender toggle (Tabs). Inputs in cm or in (unit toggle).
 * Males:   495 / (1.0324 − 0.19077·log10(waist−neck) + 0.15456·log10(height)) − 450
 * Females: 495 / (1.29579 − 0.35004·log10(waist+hip−neck) + 0.22100·log10(height)) − 450
 * Edge case: waist <= neck (or waist+hip <= neck) → log10 of non-positive → NaN.
 * Shows a toast error and a graceful "—" without crashing.
 */
export default function BodyFatCalculator() {
  const [gender, setGender] = React.useState<'male' | 'female'>('male')
  const [unit, setUnit] = React.useState<'cm' | 'in'>('cm')
  const [height, setHeight] = React.useState('175')
  const [neck, setNeck] = React.useState('38')
  const [waist, setWaist] = React.useState('85')
  const [hip, setHip] = React.useState('95')
  const hCm = toCm(height, unit)
  const nCm = toCm(neck, unit)
  const wCm = toCm(waist, unit)
  const hipCm = toCm(hip, unit)
  let bf = NaN
  let errorReason: string | null = null
  if (
    Number.isFinite(hCm) &&
    Number.isFinite(nCm) &&
    Number.isFinite(wCm) &&
    hCm > 0 &&
    nCm > 0 &&
    wCm > 0
  ) {
    if (gender === 'male') {
      const diff = wCm - nCm
      if (diff <= 0) {
        errorReason = 'Waist must be greater than neck for the Navy formula.'
      } else {
        const denom =
          1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(hCm)
        if (denom === 0) {
          errorReason = 'Invalid measurements (division by zero).'
        } else {
          bf = 495 / denom - 450
        }
      }
    } else {
      if (!Number.isFinite(hipCm) || hipCm <= 0) {
        errorReason = 'Hip measurement is required for females.'
      } else {
        const sum = wCm + hipCm - nCm
        if (sum <= 0) {
          errorReason = 'Waist + hip must be greater than neck.'
        } else {
          const denom =
            1.29579 - 0.35004 * Math.log10(sum) + 0.221 * Math.log10(hCm)
          if (denom === 0) {
            errorReason = 'Invalid measurements (division by zero).'
          } else {
            bf = 495 / denom - 450
          }
        }
      }
    }
  }
  // Surface the error via toast when inputs are present but invalid.
  const warnedRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (errorReason && warnedRef.current !== errorReason) {
      warnedRef.current = errorReason
      toast.error(errorReason)
    } else if (!errorReason) {
      warnedRef.current = null
    }
  }, [errorReason])
  const cat = categorize(bf, gender)
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={gender} onValueChange={(v) => setGender(v as typeof gender)}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="male">Male</TabsTrigger>
            <TabsTrigger value="female">Female</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs value={unit} onValueChange={(v) => setUnit(v as typeof unit)}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="cm">cm</TabsTrigger>
            <TabsTrigger value="in">in</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Measurements ({unit})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Height" htmlFor="bf-height" hint={unit}>
              <Input
                id="bf-height"
                inputMode="decimal"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                aria-label="Height"
              />
            </Field>
            <Field label="Neck" htmlFor="bf-neck" hint={unit}>
              <Input
                id="bf-neck"
                inputMode="decimal"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                aria-label="Neck circumference"
              />
            </Field>
            <Field label="Waist" htmlFor="bf-waist" hint={unit}>
              <Input
                id="bf-waist"
                inputMode="decimal"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                aria-label="Waist circumference"
              />
            </Field>
            {gender === 'female' ? (
              <Field label="Hip" htmlFor="bf-hip" hint={unit}>
                <Input
                  id="bf-hip"
                  inputMode="decimal"
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                  aria-label="Hip circumference"
                />
              </Field>
            ) : null}
          </div>
          {errorReason ? (
            <p className="text-sm text-destructive">{errorReason}</p>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Body fat percentage
              </div>
              <div
                className="mt-1 font-mono text-4xl font-bold tabular-nums"
                style={{ color: cat ? cat.color : undefined }}
              >
                {Number.isFinite(bf) ? `${fmt(bf, 1)}%` : '—'}
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
              label="Body fat"
              value={Number.isFinite(bf) ? `${fmt(bf, 1)}%` : '—'}
              accent={cat?.color}
            />
            <Stat
              label="Method"
              value="U.S. Navy"
            />
            <Stat
              label="Gender"
              value={gender === 'male' ? 'Male' : 'Female'}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Categories based on American Council on Exercise guidelines. The
            Navy method is an estimate; for clinical body composition, consult a
            healthcare professional.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}