'use client'
import * as React from 'react'
import Link from 'next/link'
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
 * Measure the real x-height of the selected font with a canvas.
 *
 * The previous implementation hard-coded 0.5 × font-size and displayed the
 * result as if it were measured. Canvas `actualBoundingBoxAscent` for the
 * glyph "x" gives the actual x-height for the loaded font, so the stat is
 * trustworthy when the browser can measure it (and falls back to the
 * documented estimate otherwise).
 */
function measureXHeight(
  fontFamily: string,
  fontSize: number,
  weight: number
): number | null {
  if (typeof document === 'undefined') return null
  try {
    const generic = new Set([
      'serif',
      'sans-serif',
      'monospace',
      'cursive',
      'fantasy',
      'system-ui',
      'ui-serif',
      'ui-sans-serif',
      'ui-monospace',
      'ui-rounded',
      'inherit',
      'initial',
      'unset',
    ])
    // Canvas `font` follows CSS font shorthand: multi-word family names need
    // quotes, while generic keywords must stay unquoted.
    const family =
      fontFamily
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) =>
          generic.has(part.toLowerCase()) ||
          /^(['"]).*\1$/.test(part)
            ? part
            : `"${part.replace(/"/g, '')}"`
        )
        .join(', ') || 'sans-serif'
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.font = `${weight} ${fontSize}px ${family}`
    const m = ctx.measureText('x')
    return m.actualBoundingBoxAscent || null
  } catch {
    return null
  }
}
/**
 * Compute a readability checklist score (0-100) for the given font settings.
 *
 * - Body text uses a practical starting point of ≥ 16px.
 * - Line height targets 1.5–1.6 for body.
 * - Line length should be 45–75 characters per rendered line.
 *
 * This is a five-check heuristic, not a WCAG conformance score. The UI
 * labels it accordingly.
 */
interface Metrics {
  fontSize: number
  lineHeight: number
  fontWeight: number
  xHeight: number
  xHeightRatio: number
  sampleChars: number
  sampleLines: number
  charsPerLine: number | null
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
  sample: string,
  measured?: { charsPerLine: number; xHeight: number } | null
): Metrics {
  const fontSize = parseNum(fontSizeStr, 16)
  const lineHeight = parseNum(lineHeightStr, 1.5)
  const xHeight = measured?.xHeight ?? estimateXHeight(fontSize)
  const xHeightRatio = fontSize > 0 ? xHeight / fontSize : 0
  const sampleChars = sample.replace(/\n/g, ' ').trim().length
  const sampleLines = sample.split('\n').length
  // Prefer the measured characters-per-line; fall back to the full sample
  // length only for the first paint before the DOM measurement runs.
  const charsPerLine = measured?.charsPerLine ?? null
  const effectiveCharsPerLine = charsPerLine ?? sampleChars
  const minBodySizeOk = fontSize >= 16
  const lineHeightOk = lineHeight >= 1.4
  const lineHeightInRange = lineHeight >= 1.5 && lineHeight <= 1.6
  const lineLengthOk =
    effectiveCharsPerLine >= 45 && effectiveCharsPerLine <= 75
  const weightOk = weight >= 400 && weight <= 700
  const checks: { label: string; pass: boolean; detail: string }[] = [
    {
      label: 'Body font size ≥ 16px',
      pass: minBodySizeOk,
      detail: minBodySizeOk
        ? `${fontSize}px meets this checklist's 16px starting point. WCAG does not set a minimum font size.`
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
      label: 'Line height in 1.5–1.6 target range',
      pass: lineHeightInRange,
      detail: lineHeightInRange
        ? `Line height ${lineHeight} meets this checklist's body-copy target; reader preferences vary.`
        : `Line height ${lineHeight} is outside this checklist's target. WCAG 1.4.12 tests user spacing overrides, not this default value.`,
    },
    {
      label: 'Line length 45–75 characters',
      pass: lineLengthOk,
      detail: lineLengthOk
        ? `About ${Math.round(effectiveCharsPerLine)} characters per rendered line — comfortable for reading.`
        : effectiveCharsPerLine < 45
          ? `About ${Math.round(effectiveCharsPerLine)} characters per line — too short for a comfortable line.`
          : `About ${Math.round(effectiveCharsPerLine)} characters per line — too long; readers lose their place.`,
    },
    {
      label: 'Font weight in 400–700 range',
      pass: weightOk,
      detail: weightOk
        ? `Weight ${weight} is within the checklist range. Available weights depend on the loaded font.`
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
    charsPerLine,
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
  const previewRef = React.useRef<HTMLDivElement | null>(null)
  const [measured, setMeasured] = React.useState<{
    charsPerLine: number
    xHeight: number
  } | null>(null)
  const metrics = React.useMemo(
    () =>
      computeMetrics(
        fontSize,
        lineHeight,
        fontWeight,
        sample,
        measured
      ),
    [fontSize, lineHeight, fontWeight, sample, measured]
  )

  /**
   * Measure text fragments only: selecting the entire preview also includes
   * paragraph boxes, which would double-count lines. Observe container size
   * and loaded fonts as well as the settings that affect layout.
   */
  React.useEffect(() => {
    const el = previewRef.current
    if (!el) return
    let frame = 0
    let disposed = false
    const measure = () => {
      const chars = sample.replace(/\n/g, ' ').trim().length
      const range = document.createRange()
      const lineTops = new Set<number>()
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) {
        range.selectNodeContents(walker.currentNode)
        for (const rect of Array.from(range.getClientRects())) {
          if (rect.width > 0 && rect.height > 0) {
            lineTops.add(Math.round(rect.top * 2) / 2)
          }
        }
      }
      const lines = Math.max(1, lineTops.size)
      const charsPerLine = Math.round(chars / lines)
      const xHeight =
        measureXHeight(fontFamily, metrics.fontSize, metrics.fontWeight) ??
        estimateXHeight(metrics.fontSize)
      setMeasured((previous) =>
        previous?.charsPerLine === charsPerLine && previous.xHeight === xHeight
          ? previous
          : { charsPerLine, xHeight }
      )
    }
    const scheduleMeasurement = () => {
      if (disposed) return
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(measure)
    }
    scheduleMeasurement()
    const observer = new ResizeObserver(scheduleMeasurement)
    observer.observe(el)
    document.fonts.ready.then(scheduleMeasurement)
    document.fonts.addEventListener('loadingdone', scheduleMeasurement)
    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      document.fonts.removeEventListener('loadingdone', scheduleMeasurement)
    }
  }, [sample, fontFamily, metrics.fontSize, metrics.fontWeight, metrics.lineHeight])
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
            Font Accessibility &amp; Readability Checker
          </CardTitle>
          <CardDescription>
            Run a font readability test using practical typography
            guidelines. Get live feedback on font size, line
            height, measured characters per line, and font weight — with a
            live preview at the settings you choose.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Font family"
            htmlFor="fac-family"
            hint="CSS font stack; uses fonts already available in your browser"
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
              label="Measured line length"
              htmlFor="fac-len"
              hint="45–75 chars target"
            >
              <Input
                id="fac-len"
                readOnly
                value={
                  metrics.charsPerLine !== null
                    ? `≈${metrics.charsPerLine} chars/line`
                    : `${metrics.sampleChars} chars total`
                }
                aria-label="Measured characters per line"
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
          label="Checklist score (5 checks)"
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
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="size-4" />
            Readability checklist
          </CardTitle>
          <CardDescription>
            These five heuristics help compare typography settings. A passing
            score does not verify WCAG conformance, zoom support, or user text
            spacing overrides on your website.
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
            ref={previewRef}
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
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Characters per line are measured from the rendered preview, so
            resizing the window changes the result. This test does not measure
            color contrast, font-file licensing, or reading difficulty such as
            a Flesch score. For contrast, use the{' '}
            <Link
              href="/tools/color-contrast-checker"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Color Contrast Checker
            </Link>
            .
          </p>
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
              <a href="https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html" className="font-semibold text-foreground underline underline-offset-2">1.4.4 Resize text</a>{' '}
              (Level AA): except for captions and images of text, text must
              support resizing to 200% without loss of content or functionality.
              WCAG does not specify a minimum font size; 16px is this
              checklist&apos;s practical starting point. Test resizing on the
              actual page.
            </p>
            <p>
              <a href="https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html" className="font-semibold text-foreground underline underline-offset-2">1.4.8 Visual Presentation</a>{' '}
              (Level AAA): users need a mechanism to adjust text presentation,
              including colors, spacing, alignment and a width of at most 80
              characters (40 for CJK). The 45–75 character checklist target is
              a separate typography guideline.
            </p>
            <p>
              <a href="https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html" className="font-semibold text-foreground underline underline-offset-2">1.4.12 Text Spacing</a>{' '}
              (Level AA): no loss of content when users override line
              height (1.5×), paragraph spacing (2×), letter spacing (0.12×),
              and word spacing (0.16× the font size) together. These values
              are not mandatory default styles. Test for clipped text,
              overlap and lost functionality on your actual page.
            </p>
          </div>
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <div>
              <div className="font-medium">Color contrast</div>
              <div className="text-xs">
                Normal-size text needs at least 4.5:1 contrast at Level AA;
                large text has a 3:1 threshold. Use the Color Contrast Checker
                to verify your foreground and background colors.
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
