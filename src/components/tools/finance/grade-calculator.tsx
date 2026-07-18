'use client'

import * as React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Field, Stat } from '@/lib/tools/tool-ui'

type GradeType = 'percent' | 'letter'

const LETTER_GRADES: Record<string, number> = {
  A: 95,
  B: 85,
  C: 75,
  D: 65,
  F: 50,
}

interface Assignment {
  id: number
  name: string
  gradeType: GradeType
  letter: string
  percent: string
  weight: string
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

function pctToLetter(p: number): string {
  if (!Number.isFinite(p)) return '—'
  if (p >= 90) return 'A'
  if (p >= 80) return 'B'
  if (p >= 70) return 'C'
  if (p >= 60) return 'D'
  return 'F'
}

function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

/**
 * Grade Calculator
 * Dynamic assignment list — each row has an optional name, a grade (numeric
 * 0–100 or letter A/B/C/D/F), and a weight (%). Weighted final grade computed
 * live on every edit. Warns when weights don't sum to 100%.
 */
export default function GradeCalculator() {
  const [assignments, setAssignments] = React.useState<Assignment[]>([
    { id: 1, name: 'Homework', gradeType: 'percent', letter: 'A', percent: '92', weight: '20' },
    { id: 2, name: 'Midterm', gradeType: 'percent', letter: 'A', percent: '85', weight: '30' },
    { id: 3, name: 'Final', gradeType: 'percent', letter: 'A', percent: '88', weight: '50' },
  ])

  const add = () =>
    setAssignments((prev) => [
      ...prev,
      { id: nextId(), name: '', gradeType: 'percent', letter: 'A', percent: '90', weight: '10' },
    ])

  const remove = (id: number) =>
    setAssignments((prev) => prev.filter((a) => a.id !== id))

  const update = (id: number, patch: Partial<Assignment>) =>
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    )

  let totalWeight = 0
  let weightedSum = 0
  let validRows = 0
  for (const a of assignments) {
    const w = parseNum(a.weight)
    const grade =
      a.gradeType === 'letter' ? LETTER_GRADES[a.letter] : parseNum(a.percent)
    if (
      Number.isFinite(w) &&
      w > 0 &&
      Number.isFinite(grade) &&
      grade >= 0 &&
      grade <= 100
    ) {
      totalWeight += w
      weightedSum += grade * w
      validRows++
    }
  }

  const finalGrade = totalWeight > 0 ? weightedSum / totalWeight : NaN
  const letter = pctToLetter(finalGrade)
  const weightMismatch = totalWeight > 0 && Math.abs(totalWeight - 100) > 0.01

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-base">Assignments</CardTitle>
          <Button onClick={add} size="sm" className="bg-primary text-primary-foreground">
            <Plus className="size-4" />
            Add assignment
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <ScrollArea className="max-h-96">
            <div className="space-y-2 pr-3">
              {assignments.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No assignments yet. Click “Add assignment” to get started.
                </p>
              ) : null}
              {assignments.map((a, idx) => (
                <div
                  key={a.id}
                  className="grid items-end gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
                >
                  <Field label={`Assignment ${idx + 1}`} htmlFor={`a-${a.id}-name`}>
                    <Input
                      id={`a-${a.id}-name`}
                      value={a.name}
                      placeholder="Name (optional)"
                      onChange={(e) => update(a.id, { name: e.target.value })}
                      aria-label={`Assignment ${idx + 1} name`}
                    />
                  </Field>
                  <Field label="Grade type" htmlFor={`a-${a.id}-gt`}>
                    <Select
                      value={a.gradeType}
                      onValueChange={(v) => update(a.id, { gradeType: v as GradeType })}
                    >
                      <SelectTrigger
                        id={`a-${a.id}-gt`}
                        className="w-full"
                        aria-label={`Assignment ${idx + 1} grade type`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percent">Percent</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  {a.gradeType === 'percent' ? (
                    <Field label="Grade (%)" htmlFor={`a-${a.id}-pct`} hint="0–100">
                      <Input
                        id={`a-${a.id}-pct`}
                        inputMode="decimal"
                        value={a.percent}
                        onChange={(e) => update(a.id, { percent: e.target.value })}
                        aria-label={`Assignment ${idx + 1} grade percent`}
                      />
                    </Field>
                  ) : (
                    <Field label="Letter" htmlFor={`a-${a.id}-letter`}>
                      <Select
                        value={a.letter}
                        onValueChange={(v) => update(a.id, { letter: v })}
                      >
                        <SelectTrigger
                          id={`a-${a.id}-letter`}
                          className="w-full"
                          aria-label={`Assignment ${idx + 1} letter grade`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(LETTER_GRADES).map((l) => (
                            <SelectItem key={l} value={l}>
                              {l} ({LETTER_GRADES[l]}%)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                  <Field label="Weight (%)" htmlFor={`a-${a.id}-weight`}>
                    <Input
                      id={`a-${a.id}-weight`}
                      inputMode="decimal"
                      value={a.weight}
                      onChange={(e) => update(a.id, { weight: e.target.value })}
                      aria-label={`Assignment ${idx + 1} weight`}
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(a.id)}
                    aria-label={`Remove assignment ${idx + 1}`}
                    className="h-9 w-9"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          {weightMismatch ? (
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-amber-500/60 text-amber-600 dark:text-amber-400"
              >
                Weights sum to {fmt(totalWeight, 2)}% — not 100%
              </Badge>
              <span className="text-xs text-muted-foreground">
                Final grade is still computed as a weighted average of the rows you entered.
              </span>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Final grade
              </div>
              <div className="mt-1 font-mono text-4xl font-bold tabular-nums">
                {validRows > 0 ? fmt(finalGrade, 2) : '—'}
                {validRows > 0 ? (
                  <span className="ml-2 text-2xl text-muted-foreground">/ 100</span>
                ) : null}
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-lg">
              {validRows > 0 ? letter : '—'}
            </Badge>
          </div>

          <div
            className="grid gap-3 sm:grid-cols-3"
            role="status"
            aria-live="polite"
            aria-label="Grade summary"
          >
            <Stat
              label="Total weight"
              value={validRows > 0 ? `${fmt(totalWeight, 1)}%` : '—'}
              accent={weightMismatch ? '#f59e0b' : '#16a34a'}
            />
            <Stat
              label="Current grade"
              value={validRows > 0 ? `${fmt(finalGrade, 2)}%` : '—'}
            />
            <Stat label="Letter" value={validRows > 0 ? letter : '—'} />
          </div>

          <p className="text-xs text-muted-foreground">
            Weighted average updates live. Letter cutoffs: A ≥ 90, B ≥ 80, C ≥ 70,
            D ≥ 60, F &lt; 60. Letter inputs map to A=95, B=85, C=75, D=65, F=50.
            Rows with non-positive weight or out-of-range grade are ignored.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
