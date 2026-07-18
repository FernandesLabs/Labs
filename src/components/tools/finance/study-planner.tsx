'use client'

import * as React from 'react'
import { Plus, Trash2, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Field, Stat } from '@/lib/tools/tool-ui'

interface Subject {
  id: number
  name: string
  hours: string
}

let _nextId = 3
function nextId(): number {
  _nextId += 1
  return _nextId
}

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
    minimumFractionDigits: 0,
  })
}

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

interface DayPlan {
  day: number
  date: Date
  hours: number
  subjects: { name: string; hours: number }[]
}

const MAX_SCHEDULE_DAYS = 365

/**
 * Study Planner
 * Exam date + dynamic subject list (name + estimated hours). Computes days
 * until exam, total hours needed, hours per day, and a day-by-day schedule
 * that distributes subjects across available days. Warns when the exam has
 * already passed.
 */
export default function StudyPlanner() {
  const [examDate, setExamDate] = React.useState('')
  const [subjects, setSubjects] = React.useState<Subject[]>([
    { id: 1, name: 'Mathematics', hours: '12' },
    { id: 2, name: 'History', hours: '8' },
  ])

  const add = () =>
    setSubjects((prev) => [...prev, { id: nextId(), name: '', hours: '4' }])
  const remove = (id: number) =>
    setSubjects((prev) => prev.filter((s) => s.id !== id))
  const update = (id: number, patch: Partial<Subject>) =>
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    )

  const today = React.useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return t
  }, [])

  const exam = examDate ? new Date(`${examDate}T00:00:00`) : null
  const examValid = exam !== null && !Number.isNaN(exam.getTime())
  const daysLeft = examValid ? daysBetween(today, exam as Date) : NaN
  const isPast = Number.isFinite(daysLeft) && daysLeft < 0
  const isToday = Number.isFinite(daysLeft) && daysLeft === 0

  const totalHours = subjects.reduce((sum, s) => {
    const h = parseNum(s.hours)
    return Number.isFinite(h) && h > 0 ? sum + h : sum
  }, 0)

  const effectiveDays =
    Number.isFinite(daysLeft) && daysLeft > 0 ? daysLeft : isToday ? 1 : 0

  const hoursPerDay =
    effectiveDays > 0 && totalHours > 0 ? totalHours / effectiveDays : NaN

  const schedule = React.useMemo<DayPlan[]>(() => {
    if (effectiveDays <= 0 || totalHours <= 0) return []
    const queue = subjects
      .map((s) => {
        const h = parseNum(s.hours)
        return {
          name: s.name.trim() || 'Untitled',
          remaining: Number.isFinite(h) && h > 0 ? h : 0,
        }
      })
      .filter((s) => s.remaining > 0)
    if (queue.length === 0) return []

    const rows: DayPlan[] = []
    let qIdx = 0
    let consumed = 0
    const days = Math.min(effectiveDays, MAX_SCHEDULE_DAYS)
    for (let d = 0; d < days; d++) {
      const remainingTotal = totalHours - consumed
      if (remainingTotal <= 0.001) break
      const budget = Math.min(hoursPerDay, remainingTotal)
      const date = new Date(today)
      date.setDate(date.getDate() + d)
      const daySubjects: { name: string; hours: number }[] = []
      let dayRemaining = budget
      let attempts = 0
      while (dayRemaining > 0.01 && queue.some((q) => q.remaining > 0.001)) {
        while (queue[qIdx].remaining <= 0.001 && attempts < queue.length) {
          qIdx = (qIdx + 1) % queue.length
          attempts += 1
        }
        if (queue[qIdx].remaining <= 0.001) break
        const take = Math.min(dayRemaining, queue[qIdx].remaining)
        daySubjects.push({ name: queue[qIdx].name, hours: take })
        queue[qIdx].remaining -= take
        consumed += take
        dayRemaining -= take
        if (queue[qIdx].remaining <= 0.001) {
          qIdx = (qIdx + 1) % queue.length
          attempts = 0
        }
      }
      if (daySubjects.length > 0) {
        rows.push({
          day: d + 1,
          date,
          hours: budget,
          subjects: daySubjects,
        })
      }
    }
    return rows
  }, [effectiveDays, totalHours, hoursPerDay, today, subjects])

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exam &amp; subjects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Exam date" htmlFor="sp-exam">
              <Input
                id="sp-exam"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                aria-label="Exam date"
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-sm font-medium text-foreground">Subjects</span>
            <Button size="sm" onClick={add} className="bg-primary text-primary-foreground">
              <Plus className="size-4" />
              Add subject
            </Button>
          </div>

          <ScrollArea className="max-h-72">
            <div className="space-y-2 pr-3">
              {subjects.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No subjects yet. Click “Add subject” to get started.
                </p>
              ) : null}
              {subjects.map((s, idx) => (
                <div
                  key={s.id}
                  className="grid items-end gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-[1.6fr_1fr_auto]"
                >
                  <Field label={`Subject ${idx + 1}`} htmlFor={`sp-${s.id}-name`}>
                    <Input
                      id={`sp-${s.id}-name`}
                      value={s.name}
                      placeholder="Subject name"
                      onChange={(e) => update(s.id, { name: e.target.value })}
                      aria-label={`Subject ${idx + 1} name`}
                    />
                  </Field>
                  <Field label="Estimated hours" htmlFor={`sp-${s.id}-hours`}>
                    <Input
                      id={`sp-${s.id}-hours`}
                      inputMode="decimal"
                      value={s.hours}
                      onChange={(e) => update(s.id, { hours: e.target.value })}
                      aria-label={`Subject ${idx + 1} estimated hours`}
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(s.id)}
                    aria-label={`Remove subject ${idx + 1}`}
                    className="h-9 w-9"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {isPast ? (
        <Alert variant="destructive">
          <TriangleAlert className="size-4" />
          <AlertTitle>This exam date has already passed</AlertTitle>
          <AlertDescription>
            Pick a future date to generate a study schedule. Stats below show
            “—” because no study time is available.
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div
            className="grid gap-3 sm:grid-cols-3"
            role="status"
            aria-live="polite"
            aria-label="Study planner summary"
          >
            <Stat
              label="Days until exam"
              value={
                Number.isFinite(daysLeft)
                  ? isToday
                    ? 'Today'
                    : `${daysLeft} day${daysLeft === 1 ? '' : 's'}`
                  : '—'
              }
              accent={isToday ? '#f59e0b' : '#16a34a'}
            />
            <Stat
              label="Total study hours"
              value={totalHours > 0 ? `${fmt(totalHours, 1)} h` : '—'}
            />
            <Stat
              label="Hours per day"
              value={
                Number.isFinite(hoursPerDay) && hoursPerDay > 0
                  ? `${fmt(hoursPerDay, 2)} h`
                  : '—'
              }
              accent="#7c3aed"
            />
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {schedule.length} day{schedule.length === 1 ? '' : 's'} scheduled
            </Badge>
            {effectiveDays > MAX_SCHEDULE_DAYS ? (
              <Badge variant="outline" className="border-amber-500/60 text-amber-600 dark:text-amber-400">
                Schedule capped at {MAX_SCHEDULE_DAYS} days
              </Badge>
            ) : null}
          </div>

          {schedule.length > 0 ? (
            <ScrollArea className="max-h-96">
              <div className="pr-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Subjects</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.map((row) => (
                      <TableRow key={row.day}>
                        <TableCell className="font-mono tabular-nums">
                          {row.day}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {fmtDate(row.date)}
                        </TableCell>
                        <TableCell className="font-mono tabular-nums">
                          {fmt(row.hours, 2)} h
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {row.subjects.map((subj, i) => (
                              <Badge
                                key={`${row.day}-${i}`}
                                variant="outline"
                                className="font-normal"
                              >
                                {subj.name} · {fmt(subj.hours, 2)}h
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              {isPast
                ? 'Pick a future exam date to generate a schedule.'
                : 'Add at least one subject with study hours to build a schedule.'}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Schedule distributes your subjects round-robin across the available
            days, filling each day with roughly{' '}
            <span className="font-mono">{Number.isFinite(hoursPerDay) ? fmt(hoursPerDay, 2) : '—'}</span>{' '}
            hours. Only subjects with positive hours are included.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
