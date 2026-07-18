'use client'

import * as React from 'react'
import {
  Check,
  X,
  AlertTriangle,
  Type as TypeIcon,
  Eye,
  Accessibility,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import { Field, Stat } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type Weight = 400 | 500 | 600 | 700

const WEIGHT_OPTIONS: { value: Weight; label: string }[] = [
  { value: 400, label: '400 · Regular' },
  { value: 500, label: '500 · Medium' },
  { value: 600, label: '600 · Semibold' },
  { value: 700, label: '700 · Bold' },
]

function parseNum(value: string, fallback: number): number {
  const trimmed = value.trim()
  if (trimmed === '') return fallback
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : fallback
}

/**
 * Estimate the x-height of a font given its font-size in pixels.
 *
 * Real x-height varies by typeface (Georgia ~0.48, Helvetica ~0.52, Verdana
 * ~0.55, Times ~0.42). For the purposes of an accessibility checker we
 * cannot read the font's actual glyph metrics, so we use a reasonable
 * default of 0.5 (50% of font-size) and let the user know the estimate
 * is approximate. The x-height ratio = x-height / font-size, which for
 * most body text is 0.45–0.55.
 */
function estimateXHeight(fontSizePx: number): number {
  if (!Number.isFinite(fontSizePx) || fontSizePx <= 0) return 0
  return fontSizePx * 0.5
}

/**
 * Compute an accessibility score (0-100) for the given font settings.
 *
 * - Body text should be ≥ 16px (WCAG 1.4.4 — Resize text).
 * - Line height should be 1.5–1.6 for body.
 * - Line length should be 45–75 characters.
 */
interface Metrics {
  fontSize: number
  lineHeight: number
  fontWeight: number
  xHeight: number
  xHeightRatio: number
  sampleChars: number
  sampleLines: number
  minBodySizeOk: boolean
  lineHeightOk: boolean
  lineHeightInRange: boolean
  lineLengthOk: boolean
  weightOk: boolean
  score: number
  checks: { label: string; pass: boolean; detail: string }[]
}

function computeMetrics(
  fontSizeStr: string,
  lineHeightStr: string,
  weight: Weight,
  sample: string
): Metrics {
  const fontSize = parseNum(fontSizeStr, 16)
  const lineHeight = parseNum(lineHeightStr, 1.5)
  const xHeight = estimateXHeight(fontSize)
  const xHeightRatio = fontSize > 0 ? xHeight / fontSize : 0

  const sampleChars = sample.replace(/\n/g, ' ').trim().length
  const sampleLines = sample.split('\n').length

  const minBodySizeOk = fontSize >= 16
  const lineHeightOk = lineHeight >= 1.4
  const lineHeightInRange = lineHeight >= 1.5 && lineHeight <= 1.6
  const lineLengthOk =
    sampleChars >= 45 && sampleChars <= 75
  const weightOk = weight >= 400 && weight <= 700

  const checks: { label: string; pass: boolean; detail: string }[] = [
    {
      label: 'Body font size ≥ 16px',
      pass: minBodySizeOk,
      detail: minBodySizeOk
        ? `${fontSize}px is at or above the WCAG-recommended 16px body minimum.`
        : `${fontSize}px is below 16px — text may be hard to read on small screens.`,
    },
    {
      label: 'Line height ≥ 1.4',
      pass: lineHeightOk,
      detail: lineHeightOk
        ? `Line height ${lineHeight} provides enough vertical rhythm.`
        : `Line height ${lineHeight} is too tight — increase to at least 1.4.`,
    },
    {
      label: 'Line height in 1.5–1.6 (optimal)',
      pass: lineHeightInRange,
      detail: lineHeightInRange
        ? `Line height ${lineHeight} is in the optimal 1.5–1.6 range for body copy.`
        : `WCAG 1.4.12 recommends 1.5 for body text; ${lineHeight} is outside that range.`,
    },
    {
      label: 'Line length 45–75 characters',
      pass: lineLengthOk,
      detail: lineLengthOk
        ? `Sample is ${sampleChars} characters — comfortable for reading.`
        : sampleChars < 45
          ? `Sample is ${sampleChars} characters — too short for a comfortable line.`
          : `Sample is ${sampleChars} characters — too long; readers lose their place.`,
    },
    {
      label: 'Font weight supported',
      pass: weightOk,
      detail: weightOk
        ? `Weight ${weight} is a standard weight.`
        : `Weight ${weight} is unusual.`,
    },
  ]

  const score = Math.round(
    (checks.filter((c) => c.pass).length / checks.length) * 100
  )

  return {
    fontSize,
    lineHeight,
    fontWeight: weight,
    xHeight,
    xHeightRatio,
    sampleChars,
    sampleLines,
    minBodySizeOk,
    lineHeightOk,
    lineHeightInRange,
    lineLengthOk,
    weightOk,
    score,
    checks,
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_SAMPLE =
  'The quick brown fox jumps over the lazy dog. Typography is the ' +
  'art and technique of arranging type to make written language ' +
  'legible, readable, and appealing when displayed.'

export default function FontAccessibilityChecker() {
  const [fontFamily, setFontFamily] = React.useState(
    'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
  )
  const [fontSize, setFontSize] = React.useState('16')
  const [fontWeight, setFontWeight] = React.useState<Weight>(400)
  const [lineHeight, setLineHeight] = React.useState('1.5')
  const [sample, setSample] = React.useState(DEFAULT_SAMPLE)

  const metrics = React.useMemo(
    () => computeMetrics(fontSize, lineHeight, fontWeight, sample),
    [fontSize, lineHeight, fontWeight, sample]
  )

  const previewStyle: React.CSSProperties = {
    fontFamily: fontFamily.trim() || 'system-ui, sans-serif',
    fontSize: `${metrics.fontSize}px`,
    fontWeight: metrics.fontWeight,
    lineHeight: metrics.lineHeight,
  }

  const { copy } = useCopy()

  const copySettings = (): void => {
    const css = [
      `font-family: ${fontFamily.trim()};`,
      `font-size: ${metrics.fontSize}px;`,
      `font-weight: ${metrics.fontWeight};`,
      `line-height: ${metrics.lineHeight};`,
    ].join('\n')
    copy(css, 'CSS copied')
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="size-4" />
            Font Accessibility Checker
          </CardTitle>
          <CardDescription>
            Evaluate typographic settings against WCAG 1.4.x and readable
            typography best practices. Get live feedback on font size, line
            height, line length, and font weight, plus a live preview with
            the specified settings applied.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Font family"
            htmlFor="fac-family"
            hint="CSS font-family value"
          >
            <Input
              id="fac-family"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              placeholder="e.g. Inter, system-ui, sans-serif"
              aria-label="Font family"
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Font size (px)" htmlFor="fac-size">
              <Input
                id="fac-size"
                type="number"
                min={8}
                max={96}
                step={1}
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                aria-label="Font size in pixels"
              />
            </Field>
            <Field label="Font weight" htmlFor="fac-weight">
              <Select
                value={String(fontWeight)}
                onValueChange={(v) =>
                  setFontWeight(Number(v) as Weight)
                }
              >
                <SelectTrigger id="fac-weight" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEIGHT_OPTIONS.map((w) => (
                    <SelectItem key={w.value} value={String(w.value)}>
                      {w.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Line height" htmlFor="fac-lh">
              <Input
                id="fac-lh"
                type="number"
                min={1}
                max={3}
                step={0.05}
                value={lineHeight}
                onChange={(e) => setLineHeight(e.target.value)}
                aria-label="Line height (unitless)"
              />
            </Field>
            <Field
              label="Sample length"
              htmlFor="fac-len"
              hint="45–75 chars target"
            >
              <Input
                id="fac-len"
                readOnly
                value={`${metrics.sampleChars} chars / ${metrics.sampleLines} line(s)`}
                aria-label="Sample length"
              />
            </Field>
          </div>

          <Field label="Text sample" htmlFor="fac-sample">
            <Textarea
              id="fac-sample"
              rows={5}
              value={sample}
              onChange={(e) => setSample(e.target.value)}
              placeholder="Paste a representative paragraph of body copy…"
              aria-label="Text sample for preview"
            />
          </Field>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={copySettings}
              className="bg-primary text-primary-foreground"
            >
              Copy CSS
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setFontFamily(
                  'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
                )
                setFontSize('16')
                setFontWeight(400)
                setLineHeight('1.5')
                setSample(DEFAULT_SAMPLE)
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        role="status"
        aria-live="polite"
      >
        <Stat
          label="Accessibility score"
          value={`${metrics.score}/100`}
          accent={
            metrics.score >= 80
              ? '#16a34a'
              : metrics.score >= 50
                ? '#d97706'
                : '#dc2626'
          }
        />
        <Stat
          label="Font size"
          value={`${metrics.fontSize}px`}
          accent={metrics.minBodySizeOk ? '#16a34a' : '#dc2626'}
        />
        <Stat
          label="Line height"
          value={String(metrics.lineHeight)}
          accent={metrics.lineHeightInRange ? '#16a34a' : '#d97706'}
        />
        <Stat
          label="x-height ratio"
          value={metrics.xHeightRatio.toFixed(2)}
          hint="estimated"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="size-4" />
            WCAG compliance
          </CardTitle>
          <CardDescription>
            Each check below maps to a WCAG 1.4.x success criterion or
            typography best practice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {metrics.checks.map((c) => (
              <div
                key={c.label}
                className={`flex items-start gap-2 rounded-lg border p-3 ${
                  c.pass
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-rose-500/40 bg-rose-500/10'
                }`}
              >
                {c.pass ? (
                  <Check className="mt-0.5 size-4 text-emerald-600" />
                ) : (
                  <X className="mt-0.5 size-4 text-rose-600" />
                )}
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{c.label}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {c.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TypeIcon className="size-4" />
            Live preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="mb-2 block text-sm font-medium">
            Text rendered with your settings
          </Label>
          <div
            className="rounded-lg border border-border bg-background p-6"
            style={previewStyle}
          >
            {sample.trim() ? (
              sample.split('\n').map((line, i) => (
                <p key={i} className="mb-0">
                  {line || '\u00A0'}
                </p>
              ))
            ) : (
              <span className="text-muted-foreground">
                Type a sample to see the preview…
              </span>
            )}
          </div>

          <pre className="fl-scroll mt-3 overflow-auto rounded-lg border border-border bg-muted/30 p-3 font-mono text-xs">
            {`font-family: ${fontFamily.trim()};\nfont-size: ${metrics.fontSize}px;\nfont-weight: ${metrics.fontWeight};\nline-height: ${metrics.lineHeight};`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">WCAG guidance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">1.4.4 Resize text</strong>{' '}
              (Level AA): text can be resized up to 200% without assistive
              technology and remain readable. Use relative units (rem, em,
              %) — but body text should still start at 16px.
            </p>
            <p>
              <strong className="text-foreground">1.4.8 Visual
              Presentation</strong> (Level AAA): line spacing at least
              1.5× font size; paragraphs separated by at least 1.5× line
              height; text not justified; width no more than 80
              characters.
            </p>
            <p>
              <strong className="text-foreground">1.4.12 Text Spacing</strong>{' '}
              (Level AA): no loss of content when users override line
              height (1.5×), paragraph spacing (2×), letter spacing (0.12×),
              or word spacing (0.16×).
            </p>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <div>
              <div className="font-medium">Color contrast</div>
              <div className="text-xs">
                Font accessibility is only half the picture — text color
                must also meet the 4.5:1 (AA) or 7:1 (AAA) contrast ratio
                against its background. Use the Color Contrast Checker tool
                to verify your colors.
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-foreground">
              Recommendations
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • Use <strong className="text-foreground">16px</strong> as
                the body base size and scale up with rem.
              </li>
              <li>
                • Set <strong className="text-foreground">line-height:
                1.5</strong> for body copy; 1.1–1.2 for headings only.
              </li>
              <li>
                • Keep body line length in the{' '}
                <strong className="text-foreground">45–75 character</strong>{' '}
                range. Use <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">max-width: 65ch</code> in CSS.
              </li>
              <li>
                • Avoid weights below 400 for body text — thin weights are
                hard to read at small sizes.
              </li>
              <li>
                • Letter-spacing: <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">-0.011em</code>{' '}
                for headings, neutral for body.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">WCAG 1.4.4 / 1.4.8 / 1.4.12</Badge>
        <Badge variant="secondary">Live preview</Badge>
        <Badge variant="secondary">x-height ratio</Badge>
      </div>
    </div>
  )
}
