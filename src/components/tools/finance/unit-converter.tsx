'use client'

import * as React from 'react'
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

function fmt(n: number, digits = 6): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  })
}

type Category = 'length' | 'weight' | 'temperature' | 'data' | 'speed' | 'time'

interface UnitDef {
  value: string
  label: string
  // For linear categories: factor to base unit (multiply input by factor → base).
  factor?: number
}

// Length — base: meter
const LENGTH: UnitDef[] = [
  { value: 'm', label: 'Meter (m)', factor: 1 },
  { value: 'km', label: 'Kilometer (km)', factor: 1000 },
  { value: 'cm', label: 'Centimeter (cm)', factor: 0.01 },
  { value: 'mm', label: 'Millimeter (mm)', factor: 0.001 },
  { value: 'mi', label: 'Mile (mi)', factor: 1609.344 },
  { value: 'ft', label: 'Foot (ft)', factor: 0.3048 },
  { value: 'in', label: 'Inch (in)', factor: 0.0254 },
  { value: 'yd', label: 'Yard (yd)', factor: 0.9144 },
]

// Weight — base: kilogram
const WEIGHT: UnitDef[] = [
  { value: 'kg', label: 'Kilogram (kg)', factor: 1 },
  { value: 'g', label: 'Gram (g)', factor: 0.001 },
  { value: 'mg', label: 'Milligram (mg)', factor: 1e-6 },
  { value: 't', label: 'Metric ton (t)', factor: 1000 },
  { value: 'lb', label: 'Pound (lb)', factor: 0.45359237 },
  { value: 'oz', label: 'Ounce (oz)', factor: 0.028349523125 },
]

// Data — base: byte (1024 progression)
const DATA: UnitDef[] = [
  { value: 'B', label: 'Byte (B)', factor: 1 },
  { value: 'KB', label: 'Kilobyte (KB)', factor: 1024 },
  { value: 'MB', label: 'Megabyte (MB)', factor: 1024 ** 2 },
  { value: 'GB', label: 'Gigabyte (GB)', factor: 1024 ** 3 },
  { value: 'TB', label: 'Terabyte (TB)', factor: 1024 ** 4 },
]

// Speed — base: meter per second
const SPEED: UnitDef[] = [
  { value: 'm/s', label: 'Meter / second (m/s)', factor: 1 },
  { value: 'km/h', label: 'Kilometer / hour (km/h)', factor: 1 / 3.6 },
  { value: 'mph', label: 'Mile / hour (mph)', factor: 0.44704 },
  { value: 'knot', label: 'Knot (kn)', factor: 0.514444 },
  { value: 'ft/s', label: 'Foot / second (ft/s)', factor: 0.3048 },
]

// Time — base: second
const TIME: UnitDef[] = [
  { value: 'ms', label: 'Millisecond (ms)', factor: 0.001 },
  { value: 's', label: 'Second (s)', factor: 1 },
  { value: 'min', label: 'Minute (min)', factor: 60 },
  { value: 'h', label: 'Hour (h)', factor: 3600 },
  { value: 'day', label: 'Day (d)', factor: 86400 },
  { value: 'week', label: 'Week (wk)', factor: 604800 },
  { value: 'month', label: 'Month (30 d)', factor: 2592000 },
  { value: 'year', label: 'Year (365 d)', factor: 31536000 },
]

// Temperature needs offset math (no factor). Handle separately.
const TEMPERATURE: UnitDef[] = [
  { value: 'C', label: 'Celsius (°C)' },
  { value: 'F', label: 'Fahrenheit (°F)' },
  { value: 'K', label: 'Kelvin (K)' },
]

function toCelsius(value: number, unit: string): number {
  if (unit === 'C') return value
  if (unit === 'F') return (value - 32) * (5 / 9)
  if (unit === 'K') return value - 273.15
  return NaN
}

function fromCelsius(celsius: number, unit: string): number {
  if (unit === 'C') return celsius
  if (unit === 'F') return celsius * (9 / 5) + 32
  if (unit === 'K') return celsius + 273.15
  return NaN
}

const CATEGORY_UNITS: Record<Category, UnitDef[]> = {
  length: LENGTH,
  weight: WEIGHT,
  temperature: TEMPERATURE,
  data: DATA,
  speed: SPEED,
  time: TIME,
}

const CATEGORY_LABELS: Record<Category, string> = {
  length: 'Length',
  weight: 'Weight',
  temperature: 'Temperature',
  data: 'Data',
  speed: 'Speed',
  time: 'Time',
}

/**
 * Unit Converter
 * Categories: Length, Weight, Temperature, Data, Speed, Time.
 * Live conversion on every input change. Temperature handled with offset math.
 */
export default function UnitConverter() {
  const [category, setCategory] = React.useState<Category>('length')
  const [fromUnit, setFromUnit] = React.useState<string>('m')
  const [toUnit, setToUnit] = React.useState<string>('ft')
  const [value, setValue] = React.useState('1')

  // When the category changes, reset units to the first two units available.
  const prevCategoryRef = React.useRef<Category>(category)
  React.useEffect(() => {
    if (prevCategoryRef.current !== category) {
      prevCategoryRef.current = category
      const units = CATEGORY_UNITS[category]
      if (units.length >= 2) {
        setFromUnit(units[0].value)
        setToUnit(units[1].value)
      }
    }
  }, [category])

  const v = parseNum(value)
  let result = NaN

  if (category === 'temperature') {
    if (Number.isFinite(v)) {
      const celsius = toCelsius(v, fromUnit)
      result = fromCelsius(celsius, toUnit)
    }
  } else {
    const fromDef = CATEGORY_UNITS[category].find((u) => u.value === fromUnit)
    const toDef = CATEGORY_UNITS[category].find((u) => u.value === toUnit)
    if (fromDef?.factor != null && toDef?.factor != null && Number.isFinite(v)) {
      const base = v * fromDef.factor
      result = base / toDef.factor
    }
  }

  const units = CATEGORY_UNITS[category]

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Category" htmlFor="uc-cat">
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger id="uc-cat" className="w-full" aria-label="Conversion category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Convert</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Value" htmlFor="uc-value">
            <Input
              id="uc-value"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Value to convert"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="From" htmlFor="uc-from">
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger id="uc-from" className="w-full" aria-label="From unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="To" htmlFor="uc-to">
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger id="uc-to" className="w-full" aria-label="To unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Result
          </div>
          <div className="font-mono text-3xl font-bold tabular-nums break-all">
            {Number.isFinite(result) ? fmt(result, 8) : '—'}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Value" value={Number.isFinite(v) ? fmt(v, 6) : '—'} />
            <Stat label="From" value={fromUnit} />
            <Stat
              label="Result"
              value={Number.isFinite(result) ? `${fmt(result, 8)} ${toUnit}` : '—'}
              accent="#16a34a"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {category === 'data'
              ? 'Data units use 1024-based progression (binary prefixes).'
              : category === 'temperature'
                ? 'Temperature conversions include offset math (C ↔ F ↔ K).'
                : 'Conversions use standard SI / imperial factors.'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
