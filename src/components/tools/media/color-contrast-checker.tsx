'use client'

import * as React from 'react'
import { Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Stat } from '@/lib/tools/tool-ui'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return null
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  }
}

function channel(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function luminance({ r, g, b }: { r: number; g: number; b: number }): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrastRatio(fg: string, bg: string): number | null {
  const a = hexToRgb(fg)
  const b = hexToRgb(bg)
  if (!a || !b) return null
  const la = luminance(a)
  const lb = luminance(b)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

interface GradeResult {
  label: string
  pass: boolean
  threshold: number
}

function gradeFor(ratio: number, large: boolean): GradeResult {
  const threshold = large ? 3 : 4.5
  return {
    label: large ? 'AA Large' : 'AA Normal',
    pass: ratio >= threshold,
    threshold,
  }
}

function aaaGrade(ratio: number, large: boolean): GradeResult {
  const threshold = large ? 4.5 : 7
  return { label: large ? 'AAA Large' : 'AAA Normal', pass: ratio >= threshold, threshold }
}

export default function ColorContrastChecker() {
  const [fg, setFg] = React.useState('#0f172a')
  const [bg, setBg] = React.useState('#f8fafc')

  const ratio = contrastRatio(fg, bg)

  const grades = React.useMemo(() => {
    if (ratio == null) return []
    return [
      gradeFor(ratio, false),
      gradeFor(ratio, true),
      aaaGrade(ratio, false),
      aaaGrade(ratio, true),
    ]
  }, [ratio])

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Foreground" htmlFor="cc-fg">
          <div className="flex items-center gap-3">
            <input
              id="cc-fg"
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="size-10 cursor-pointer rounded-md border border-border bg-background p-1"
              aria-label="Foreground color picker"
            />
            <Input
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="font-mono uppercase"
              aria-label="Foreground hex"
            />
          </div>
        </Field>

        <Field label="Background" htmlFor="cc-bg">
          <div className="flex items-center gap-3">
            <input
              id="cc-bg"
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="size-10 cursor-pointer rounded-md border border-border bg-background p-1"
              aria-label="Background color picker"
            />
            <Input
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="font-mono uppercase"
              aria-label="Background hex"
            />
          </div>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat
          label="Contrast Ratio"
          value={ratio == null ? '—' : `${ratio.toFixed(2)} : 1`}
          accent={ratio != null && ratio >= 4.5 ? 'oklch(0.62 0.17 150)' : 'oklch(0.6 0.2 20)'}
        />
        <Stat
          label="WCAG Score"
          value={
            ratio == null
              ? '—'
              : ratio >= 7
                ? 'AAA'
                : ratio >= 4.5
                  ? 'AA'
                  : ratio >= 3
                    ? 'AA Large'
                    : 'Fail'
          }
        />
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">WCAG compliance</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {grades.map((g) => (
            <div
              key={g.label}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                g.pass
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-rose-500/40 bg-rose-500/10'
              }`}
            >
              {g.pass ? (
                <Check className="size-4 text-emerald-600" />
              ) : (
                <X className="size-4 text-rose-600" />
              )}
              <div className="min-w-0">
                <div className="text-sm font-semibold">{g.label}</div>
                <div className="text-[11px] text-muted-foreground">
                  needs {g.threshold.toFixed(1)} : 1
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Label className="mb-2 block text-sm font-medium">Live preview</Label>
          <div
            className="rounded-lg border border-border p-6"
            style={{ backgroundColor: bg }}
          >
            <p
              className="text-2xl font-bold leading-tight"
              style={{ color: fg }}
            >
              The quick brown fox jumps over the lazy dog.
            </p>
            <p
              className="mt-3 text-base"
              style={{ color: fg, opacity: 0.85 }}
            >
              Body copy uses a smaller font size and must meet the AA Normal 4.5:1 threshold for readability.
            </p>
            <p
              className="mt-3 text-sm font-semibold uppercase tracking-wider"
              style={{ color: fg }}
            >
              Large text — 18pt+ or 14pt+ bold
            </p>
          </div>
          {ratio == null ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Enter valid hex colors (#RRGGBB) for both fields.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">AA Normal ≥ 4.5:1</Badge>
        <Badge variant="secondary">AA Large ≥ 3:1</Badge>
        <Badge variant="secondary">AAA Normal ≥ 7:1</Badge>
        <Badge variant="secondary">AAA Large ≥ 4.5:1</Badge>
      </div>
    </div>
  )
}
