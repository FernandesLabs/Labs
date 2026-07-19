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
interface GradeInfo {
  label: string
  point: number
}
const GRADES: GradeInfo[] = [
  { label: 'A+', point: 4.0 },
  { label: 'A', point: 4.0 },
  { label: 'A-', point: 3.7 },
  { label: 'B+', point: 3.3 },
  { label: 'B', point: 3.0 },
  { label: 'B-', point: 2.7 },
  { label: 'C+', point: 2.3 },
  { label: 'C', point: 2.0 },
  { label: 'C-', point: 1.7 },
  { label: 'D+', point: 1.3 },
  { label: 'D', point: 1.0 },
  { label: 'F', point: 0.0 },
]
interface Course {
  id: number
  name: string
  grade: string
  credits: string
}
function parseNum(value: string): number {
  if (value == null) return NaN
  const trimmed = value.trim()
  if (trimmed === '') return NaN
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : NaN
}
function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}
let _nextId = 3
function nextId(): number {
  _nextId += 1
  return _nextId
}
/**
 * GPA Calculator
 * Dynamic course list — each row has a course name (optional), grade, and
 * credits. Compute weighted GPA live on every change. No button press needed.
 */
export default function GpaCalculator() {
  const [courses, setCourses] = React.useState<Course[]>([
    { id: 1, name: 'Calculus I', grade: 'A', credits: '4' },
    { id: 2, name: 'English Composition', grade: 'B+', credits: '3' },
  ])
  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      { id: nextId(), name: '', grade: 'A', credits: '3' },
    ])
  }
  const removeCourse = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }
  const updateCourse = (id: number, patch: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    )
  }
  // Live GPA computation — runs on every render so results update instantly.
  let totalCredits = 0
  let totalPoints = 0
  let hasValid = false
  for (const c of courses) {
    const info = GRADES.find((g) => g.label === c.grade)
    const credits = parseNum(c.credits)
    if (info && Number.isFinite(credits) && credits > 0) {
      totalCredits += credits
      totalPoints += info.point * credits
      hasValid = true
    }
  }
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : NaN
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Courses</CardTitle>
          <Button onClick={addCourse} size="sm" className="bg-primary text-primary-foreground">
            <Plus className="size-4" />
            Add course
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <ScrollArea className="max-h-96">
            <div className="space-y-2 pr-3">
              {courses.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No courses yet. Click “Add course” to get started.
                </p>
              ) : null}
              {courses.map((c, idx) => (
                <div
                  key={c.id}
                  className="grid items-end gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-[1.5fr_1fr_1fr_auto]"
                >
                  <Field label={`Course ${idx + 1}`} htmlFor={`course-${c.id}-name`}>
                    <Input
                      id={`course-${c.id}-name`}
                      value={c.name}
                      placeholder="Course name (optional)"
                      onChange={(e) => updateCourse(c.id, { name: e.target.value })}
                      aria-label={`Course ${idx + 1} name`}
                    />
                  </Field>
                  <Field label="Grade" htmlFor={`course-${c.id}-grade`}>
                    <Select
                      value={c.grade}
                      onValueChange={(v) => updateCourse(c.id, { grade: v })}
                    >
                      <SelectTrigger id={`course-${c.id}-grade`} className="w-full" aria-label={`Course ${idx + 1} grade`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADES.map((g) => (
                          <SelectItem key={g.label} value={g.label}>
                            {g.label} ({g.point.toFixed(1)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Credits" htmlFor={`course-${c.id}-credits`}>
                    <Input
                      id={`course-${c.id}-credits`}
                      inputMode="decimal"
                      value={c.credits}
                      onChange={(e) => updateCourse(c.id, { credits: e.target.value })}
                      aria-label={`Course ${idx + 1} credits`}
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeCourse(c.id)}
                    aria-label={`Remove course ${idx + 1}`}
                    disabled={courses.length === 0}
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
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Your GPA
              </div>
              <div className="mt-1 font-mono text-4xl font-bold tabular-nums">
                {hasValid ? fmt(gpa, 2) : '—'}
              </div>
            </div>
            <Badge variant="outline" className="text-muted-foreground">
              {courses.length} course{courses.length === 1 ? '' : 's'}
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat
              label="GPA"
              value={hasValid ? fmt(gpa, 2) : '—'}
              accent="#16a34a"
            />
            <Stat
              label="Total credits"
              value={totalCredits > 0 ? fmt(totalCredits, 1) : '—'}
            />
            <Stat
              label="Grade scale"
              value="4.0"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            GPA updates live as you edit courses. Only rows with positive credit
            values are included in the weighted average.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}