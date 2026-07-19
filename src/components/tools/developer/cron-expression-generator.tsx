'use client'
import * as React from 'react'
import { Calendar, Clock, Copy, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
type CronField = 'minute' | 'hour' | 'dom' | 'month' | 'dow'
type FieldMode = 'every' | 'specific' | 'range' | 'step' | 'list'
interface FieldState {
  mode: FieldMode
  specific: string
  rangeFrom: string
  rangeTo: string
  step: string
  list: string
}
type CronState = Record<CronField, FieldState>
const FIELDS_META: Record<
  CronField,
  { label: string; short: string; min: number; max: number; hint: string; names?: string[] }
> = {
  minute: { label: 'Minute', short: 'm', min: 0, max: 59, hint: '0–59' },
  hour: { label: 'Hour', short: 'h', min: 0, max: 23, hint: '0–23' },
  dom: { label: 'Day of month', short: 'dom', min: 1, max: 31, hint: '1–31' },
  month: {
    label: 'Month',
    short: 'mon',
    min: 1,
    max: 12,
    hint: '1–12',
    names: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  dow: {
    label: 'Day of week',
    short: 'dow',
    min: 0,
    max: 6,
    hint: '0–6 (Sun–Sat)',
    names: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
}
const FIELD_ORDER: CronField[] = ['minute', 'hour', 'dom', 'month', 'dow']
const MODE_OPTIONS: { value: FieldMode; label: string }[] = [
  { value: 'every', label: 'Every (*)' },
  { value: 'specific', label: 'Specific' },
  { value: 'range', label: 'Range (a-b)' },
  { value: 'step', label: 'Step (*/n)' },
  { value: 'list', label: 'List (a,b,c)' },
]
function makeDefaultFieldState(field: CronField): FieldState {
  const { min, max } = FIELDS_META[field]
  return {
    mode: 'every',
    specific: String(min),
    rangeFrom: String(min),
    rangeTo: String(max),
    step: field === 'minute' ? '5' : field === 'hour' ? '2' : '2',
    list: `${min},${Math.min(min + 1, max)}`,
  }
}
function makeDefaultState(): CronState {
  const result = {} as CronState
  for (const f of FIELD_ORDER) result[f] = makeDefaultFieldState(f)
  return result
}
function makePreset(
  overrides: Partial<Record<CronField, Partial<FieldState>>>
): CronState {
  const result = makeDefaultState()
  for (const f of FIELD_ORDER) {
    if (overrides[f]) result[f] = { ...result[f], ...overrides[f] }
  }
  return result
}
function renderField(field: CronField, s: FieldState): string {
  const { min, max } = FIELDS_META[field]
  switch (s.mode) {
    case 'every':
      return '*'
    case 'specific': {
      const v = parseInt(s.specific, 10)
      if (!Number.isFinite(v) || v < min || v > max) return ''
      return String(v)
    }
    case 'range': {
      const from = parseInt(s.rangeFrom, 10)
      const to = parseInt(s.rangeTo, 10)
      if (
        !Number.isFinite(from) ||
        !Number.isFinite(to) ||
        from < min ||
        to > max ||
        from > to
      )
        return ''
      return `${from}-${to}`
    }
    case 'step': {
      const v = parseInt(s.step, 10)
      if (!Number.isFinite(v) || v < 1 || v > max) return ''
      return `*/${v}`
    }
    case 'list': {
      const parts = s.list
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
      if (parts.length === 0) return ''
      const valid = parts.every((p) => {
        const n = parseInt(p, 10)
        return Number.isFinite(n) && n >= min && n <= max
      })
      if (!valid) return ''
      return parts.join(',')
    }
    default:
      return ''
  }
}
function buildCron(state: CronState): { cron: string; valid: boolean } {
  const parts: string[] = []
  let valid = true
  for (const f of FIELD_ORDER) {
    const p = renderField(f, state[f])
    if (p === '') valid = false
    parts.push(p || '?')
  }
  return { cron: parts.join(' '), valid }
}
function parseField(expr: string, min: number, max: number): Set<number> | null {
  const result = new Set<number>()
  const parts = expr.split(',')
  for (const part of parts) {
    if (part === '*') {
      for (let i = min; i <= max; i++) result.add(i)
    } else if (part.includes('/')) {
      const [range, stepStr] = part.split('/')
      const step = parseInt(stepStr, 10)
      if (!Number.isFinite(step) || step < 1) return null
      let lo = min
      let hi = max
      if (range !== '*') {
        if (range.includes('-')) {
          const [a, b] = range.split('-').map((n) => parseInt(n, 10))
          if (!Number.isFinite(a) || !Number.isFinite(b)) return null
          lo = a
          hi = b
        } else {
          const v = parseInt(range, 10)
          if (!Number.isFinite(v)) return null
          lo = v
        }
      }
      if (lo < min || hi > max) return null
      for (let i = lo; i <= hi; i += step) result.add(i)
    } else if (part.includes('-')) {
      const [a, b] = part.split('-').map((n) => parseInt(n, 10))
      if (!Number.isFinite(a) || !Number.isFinite(b) || a > b) return null
      if (a < min || b > max) return null
      for (let i = a; i <= b; i++) result.add(i)
    } else {
      const v = parseInt(part, 10)
      if (!Number.isFinite(v) || v < min || v > max) return null
      result.add(v)
    }
  }
  return result.size > 0 ? result : null
}
function computeNextRuns(
  cron: string,
  count: number,
  from: Date
): Date[] | null {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return null
  const [minE, hourE, domE, monE, dowE] = parts
  const minutes = parseField(minE, 0, 59)
  const hours = parseField(hourE, 0, 23)
  const doms = parseField(domE, 1, 31)
  const months = parseField(monE, 1, 12)
  const dows = parseField(dowE, 0, 6)
  if (!minutes || !hours || !doms || !months || !dows) return null
  const domStar = domE === '*' || domE === '*/1'
  const dowStar = dowE === '*' || dowE === '*/1'
  const result: Date[] = []
  const start = new Date(from.getTime())
  start.setSeconds(0, 0)
  start.setMinutes(start.getMinutes() + 1)
  // 1-year cap to avoid runaway loops
  const limit = new Date(start.getTime() + 366 * 24 * 60 * 60 * 1000)
  let cur = new Date(start.getTime())
  let iterations = 0
  const MAX_ITER = 200000
  while (result.length < count && cur.getTime() < limit.getTime()) {
    if (++iterations > MAX_ITER) break
    const mon = cur.getMonth() + 1
    if (!months.has(mon)) {
      cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1, 0, 0, 0, 0)
      continue
    }
    const dom = cur.getDate()
    const dow = cur.getDay() // 0=Sunday in JS, matches cron
    const domMatch = doms.has(dom)
    const dowMatch = dows.has(dow)
    const dayMatch =
      domStar && dowStar
        ? true
        : domStar
        ? dowMatch
        : dowStar
        ? domMatch
        : domMatch || dowMatch
    if (!dayMatch) {
      cur = new Date(
        cur.getFullYear(),
        cur.getMonth(),
        cur.getDate() + 1,
        0,
        0,
        0,
        0
      )
      continue
    }
    const hour = cur.getHours()
    if (!hours.has(hour)) {
      cur = new Date(
        cur.getFullYear(),
        cur.getMonth(),
        cur.getDate(),
        cur.getHours() + 1,
        0,
        0,
        0
      )
      continue
    }
    const minute = cur.getMinutes()
    if (!minutes.has(minute)) {
      cur = new Date(
        cur.getFullYear(),
        cur.getMonth(),
        cur.getDate(),
        cur.getHours(),
        cur.getMinutes() + 1,
        0,
        0
      )
      continue
    }
    result.push(new Date(cur.getTime()))
    cur = new Date(
      cur.getFullYear(),
      cur.getMonth(),
      cur.getDate(),
      cur.getHours(),
      cur.getMinutes() + 1,
      0,
      0
    )
  }
  return result
}
interface Preset {
  label: string
  cron: string
  state: CronState
}
const PRESETS: Preset[] = [
  {
    label: 'Every minute',
    cron: '* * * * *',
    state: makePreset({}),
  },
  {
    label: 'Every 5 min',
    cron: '*/5 * * * *',
    state: makePreset({ minute: { mode: 'step', step: '5' } as FieldState }),
  },
  {
    label: 'Every 15 min',
    cron: '*/15 * * * *',
    state: makePreset({ minute: { mode: 'step', step: '15' } as FieldState }),
  },
  {
    label: 'Hourly',
    cron: '0 * * * *',
    state: makePreset({ minute: { mode: 'specific', specific: '0' } as FieldState }),
  },
  {
    label: 'Every 6 hours',
    cron: '0 */6 * * *',
    state: makePreset({
      minute: { mode: 'specific', specific: '0' } as FieldState,
      hour: { mode: 'step', step: '6' } as FieldState,
    }),
  },
  {
    label: 'Daily at midnight',
    cron: '0 0 * * *',
    state: makePreset({
      minute: { mode: 'specific', specific: '0' } as FieldState,
      hour: { mode: 'specific', specific: '0' } as FieldState,
    }),
  },
  {
    label: 'Weekdays 8:30am',
    cron: '30 8 * * 1-5',
    state: makePreset({
      minute: { mode: 'specific', specific: '30' } as FieldState,
      hour: { mode: 'specific', specific: '8' } as FieldState,
      dow: { mode: 'range', rangeFrom: '1', rangeTo: '5' } as FieldState,
    }),
  },
  {
    label: 'Every Monday 9am',
    cron: '0 9 * * 1',
    state: makePreset({
      minute: { mode: 'specific', specific: '0' } as FieldState,
      hour: { mode: 'specific', specific: '9' } as FieldState,
      dow: { mode: 'specific', specific: '1' } as FieldState,
    }),
  },
  {
    label: '1st of month',
    cron: '0 0 1 * *',
    state: makePreset({
      minute: { mode: 'specific', specific: '0' } as FieldState,
      hour: { mode: 'specific', specific: '0' } as FieldState,
      dom: { mode: 'specific', specific: '1' } as FieldState,
    }),
  },
  {
    label: 'Weekends noon',
    cron: '0 12 * * 0,6',
    state: makePreset({
      minute: { mode: 'specific', specific: '0' } as FieldState,
      hour: { mode: 'specific', specific: '12' } as FieldState,
      dow: { mode: 'list', list: '0,6' } as FieldState,
    }),
  },
]
function formatNextRun(d: Date): string {
  const dateStr = d.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  return dateStr
}
function describeField(field: CronField, s: FieldState): string {
  const meta = FIELDS_META[field]
  switch (s.mode) {
    case 'every':
      return `every ${meta.label.toLowerCase()}`
    case 'specific':
      return `${meta.label.toLowerCase()} ${s.specific}${
        meta.names ? ` (${meta.names[parseInt(s.specific, 10) - meta.min] ?? ''})` : ''
      }`
    case 'range':
      return `${meta.label.toLowerCase()} ${s.rangeFrom}–${s.rangeTo}`
    case 'step':
      return `every ${s.step} ${meta.label.toLowerCase()}s`
    case 'list':
      return `${meta.label.toLowerCase()} ${s.list}`
    default:
      return ''
  }
}
function FieldValueInput({
  field,
  state,
  onChange,
}: {
  field: CronField
  state: FieldState
  onChange: (next: FieldState) => void
}) {
  const { min, max, names } = FIELDS_META[field]
  if (state.mode === 'every') {
    return (
      <div className="flex h-9 items-center rounded-md border border-dashed border-border/70 bg-muted/20 px-3 text-xs text-muted-foreground">
        Matches every value ({min}–{max})
      </div>
    )
  }
  if (state.mode === 'specific') {
    const v = parseInt(state.specific, 10)
    const valid = Number.isFinite(v) && v >= min && v <= max
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={min}
          max={max}
          value={state.specific}
          onChange={(e) => onChange({ ...state, specific: e.target.value })}
          className="w-24"
          aria-invalid={!valid}
        />
        {names && valid ? (
          <span className="text-xs text-muted-foreground">
            {names[v - min]}
          </span>
        ) : null}
      </div>
    )
  }
  if (state.mode === 'range') {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={min}
          max={max}
          value={state.rangeFrom}
          onChange={(e) => onChange({ ...state, rangeFrom: e.target.value })}
          className="w-20"
          aria-label="Range from"
        />
        <span className="text-muted-foreground">to</span>
        <Input
          type="number"
          min={min}
          max={max}
          value={state.rangeTo}
          onChange={(e) => onChange({ ...state, rangeTo: e.target.value })}
          className="w-20"
          aria-label="Range to"
        />
      </div>
    )
  }
  if (state.mode === 'step') {
    return (
      <div className="flex items-center gap-2">
        <code className="rounded bg-muted px-2 py-1 text-xs">*/</code>
        <Input
          type="number"
          min={1}
          max={max}
          value={state.step}
          onChange={(e) => onChange({ ...state, step: e.target.value })}
          className="w-20"
          aria-label="Step value"
        />
        <span className="text-xs text-muted-foreground">
          (every {state.step || '?'} {FIELDS_META[field].label.toLowerCase()}
          {(parseInt(state.step, 10) || 0) > 1 ? 's' : ''})
        </span>
      </div>
    )
  }
  // list
  return (
    <Input
      value={state.list}
      onChange={(e) => onChange({ ...state, list: e.target.value })}
      placeholder={`${min},${min + 1},${Math.min(min + 2, max)}`}
      className="font-mono text-sm"
      aria-label="Comma-separated values"
    />
  )
}
export default function CronExpressionGenerator() {
  const [state, setState] = React.useState<CronState>(() => {
    // Default: daily at midnight
    return makePreset({
      minute: { mode: 'specific', specific: '0' } as FieldState,
      hour: { mode: 'specific', specific: '0' } as FieldState,
    })
  })
  const { cron, valid } = React.useMemo(() => buildCron(state), [state])
  const { copied, copy } = useCopy()
  const nextRuns = React.useMemo(() => {
    if (!valid) return null
    return computeNextRuns(cron, 5, new Date())
  }, [cron, valid])
  const applyPreset = (p: Preset) => {
    setState(p.state)
    toast.success(`Preset applied: ${p.label}`)
  }
  const updateField = (field: CronField, next: FieldState) => {
    setState((prev) => ({ ...prev, [field]: next }))
  }
  const descriptions = React.useMemo(
    () => FIELD_ORDER.map((f) => describeField(f, state[f])),
    [state]
  )
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="size-4" />
            Cron Expression Generator
          </CardTitle>
          <CardDescription>
            Build a 5-field cron schedule visually. Fields: minute, hour,
            day-of-month, month, day-of-week (0 = Sunday).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.label}
                type="button"
                size="sm"
                variant="outline"
                onClick={() => applyPreset(p)}
                className="h-7 text-xs"
              >
                <Sparkles className="size-3" />
                {p.label}
              </Button>
            ))}
          </div>
          <Separator />
          <div className="space-y-3">
            {FIELD_ORDER.map((f) => (
              <div
                key={f}
                className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_140px_1fr] sm:items-center"
              >
                <div>
                  <Label
                    htmlFor={`cron-${f}-mode`}
                    className="text-sm font-medium"
                  >
                    {FIELDS_META[f].label}
                  </Label>
                  <div className="text-[11px] text-muted-foreground">
                    {FIELDS_META[f].hint}
                  </div>
                </div>
                <Select
                  value={state[f].mode}
                  onValueChange={(v) =>
                    updateField(f, { ...state[f], mode: v as FieldMode })
                  }
                >
                  <SelectTrigger id={`cron-${f}-mode`} className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldValueInput
                  field={f}
                  state={state[f]}
                  onChange={(next) => updateField(f, next)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-3 pt-6">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Generated cron expression
            </span>
            {valid ? (
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                Valid
              </span>
            ) : (
              <span className="text-xs text-destructive">Invalid</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <code
              className={`flex-1 rounded-lg border bg-muted/40 px-4 py-3 font-mono text-lg font-semibold tracking-wider ${
                valid
                  ? 'border-border text-foreground'
                  : 'border-destructive/40 text-destructive'
              }`}
              aria-live="polite"
            >
              {cron}
            </code>
            <Button
              type="button"
              size="sm"
              onClick={() => copy(cron, 'Cron expression copied')}
              disabled={!valid}
              className="bg-primary text-primary-foreground"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {descriptions.join(' · ')}
          </p>
        </CardContent>
      </Card>
      {!valid ? (
        <ResultBox
          value=""
          label="Cron expression"
          downloadName="cron.txt"
          empty="Fix the invalid field(s) above to see output."
        />
      ) : (
        <ResultBox
          value={cron}
          label="Cron expression"
          downloadName="cron.txt"
          rows={2}
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="size-4" />
            Next 5 executions
          </CardTitle>
          <CardDescription>
            Computed from your current local time. Day-of-month and
            day-of-week follow standard cron semantics (OR when both are
            restricted).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {valid && nextRuns && nextRuns.length > 0 ? (
            <ScrollArea className="max-h-72">
              <ol className="space-y-2">
                {nextRuns.map((d, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-md border border-border bg-muted/20 px-3 py-2"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="font-mono text-sm">
                      {formatNextRun(d)}
                    </span>
                  </li>
                ))}
              </ol>
            </ScrollArea>
          ) : (
            <div className="rounded-md border border-dashed border-border/70 bg-muted/20 px-3 py-6 text-center text-sm text-muted-foreground">
              {valid
                ? 'No executions found within the next year. Try a less restrictive schedule.'
                : 'Enter a valid cron expression to see upcoming run times.'}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Fields" value="5" />
        <Stat label="Status" value={valid ? 'Valid' : 'Invalid'} accent={valid ? '#16a34a' : '#dc2626'} />
        <Stat label="Next runs shown" value={valid && nextRuns ? nextRuns.length : 0} />
      </div>
      <Field label="Quick reference" htmlFor="cron-ref">
        <div id="cron-ref" className="rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <code className="text-foreground">* * * * *</code> — field order: minute, hour, day-of-month, month, day-of-week
            </div>
            <div>
              <code className="text-foreground">*/n</code> — every n units · <code className="text-foreground">a-b</code> — range · <code className="text-foreground">a,b,c</code> — list
            </div>
          </div>
        </div>
      </Field>
    </div>
  )
}