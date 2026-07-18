'use client'

import * as React from 'react'
import { Download, FileCode2, AlertTriangle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
import { Separator } from '@/components/ui/separator'
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'

type BgMode = 'checker' | 'white' | 'dark'
type Zoom = '50' | '100' | '200'

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="Sample">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="24" fill="url(#g)" />
  <circle cx="100" cy="100" r="48" fill="white" opacity="0.9" />
  <path d="M80 100 L100 80 L120 100 L100 120 Z" fill="#0f172a" />
</svg>`

interface SvgStats {
  width: number | null
  height: number | null
  hasViewBox: boolean
  elementCount: number
  fileSize: number
}

function parseDimensions(svgText: string): { width: number | null; height: number | null; hasViewBox: boolean } {
  let width: number | null = null
  let height: number | null = null
  let hasViewBox = false
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgText, 'image/svg+xml')
    const parseError = doc.querySelector('parsererror')
    if (parseError) return { width: null, height: null, hasViewBox: false }
    const svg = doc.documentElement
    if (!svg || svg.nodeName.toLowerCase() !== 'svg') {
      return { width: null, height: null, hasViewBox: false }
    }
    const viewBoxAttr = svg.getAttribute('viewBox')
    if (viewBoxAttr) {
      hasViewBox = true
      const parts = viewBoxAttr.split(/[\s,]+/).map(Number)
      if (parts.length === 4 && parts.every((n) => !Number.isNaN(n))) {
        width = parts[2]
        height = parts[3]
      }
    }
    const wAttr = svg.getAttribute('width')
    const hAttr = svg.getAttribute('height')
    if (wAttr) {
      const w = parseFloat(wAttr)
      if (!Number.isNaN(w)) width = w
    }
    if (hAttr) {
      const h = parseFloat(hAttr)
      if (!Number.isNaN(h)) height = h
    }
  } catch {
    return { width: null, height: null, hasViewBox: false }
  }
  return { width, height, hasViewBox }
}

function countElements(svgText: string): number {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgText, 'image/svg+xml')
    if (doc.querySelector('parsererror')) return 0
    return doc.documentElement.querySelectorAll('*').length
  } catch {
    return 0
  }
}

function validateSvg(svgText: string): { ok: boolean; error?: string } {
  if (!svgText.trim()) return { ok: false, error: 'Empty input' }
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgText, 'image/svg+xml')
    const parseError = doc.querySelector('parsererror')
    if (parseError) {
      return { ok: false, error: 'Malformed XML — check for unclosed tags or invalid syntax.' }
    }
    const svg = doc.documentElement
    if (!svg || svg.nodeName.toLowerCase() !== 'svg') {
      return { ok: false, error: 'Root element must be <svg>.' }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to parse SVG' }
  }
}

function checkerboardStyle(): React.CSSProperties {
  return {
    backgroundImage:
      'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    backgroundColor: '#f8fafc',
  }
}

export default function SvgViewer(): React.JSX.Element {
  const [svgText, setSvgText] = React.useState<string>(SAMPLE_SVG)
  const [bg, setBg] = React.useState<BgMode>('checker')
  const [zoom, setZoom] = React.useState<Zoom>('100')

  const validation = React.useMemo(() => validateSvg(svgText), [svgText])
  const stats = React.useMemo<SvgStats>(() => {
    const { width, height, hasViewBox } = parseDimensions(svgText)
    const elementCount = countElements(svgText)
    const fileSize = new Blob([svgText]).size
    return { width, height, hasViewBox, elementCount, fileSize }
  }, [svgText])

  const previewBg =
    bg === 'white'
      ? { backgroundColor: '#ffffff' }
      : bg === 'dark'
        ? { backgroundColor: '#0f172a' }
        : checkerboardStyle()

  const zoomScale = parseInt(zoom, 10) / 100

  const download = (): void => {
    if (!validation.ok) return
    downloadBlob(new Blob([svgText], { type: 'image/svg+xml' }), 'image.svg')
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>SVG Viewer</CardTitle>
          <CardDescription>
            Paste SVG markup to render it live. Stats (dimensions, element
            count, file size) and validation update as you type. Use the
            sample button to load a demo SVG.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="SVG markup"
            htmlFor="sv-input"
            hint={`${stats.fileSize.toLocaleString()} bytes`}
          >
            <Textarea
              id="sv-input"
              value={svgText}
              onChange={(e) => setSvgText(e.target.value)}
              placeholder="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot;>...</svg>"
              className="min-h-32 font-mono text-xs"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSvgText(SAMPLE_SVG)}
            >
              <Sparkles className="size-3.5" />
              Load sample
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={download}
              disabled={!validation.ok}
            >
              <Download className="size-3.5" />
              Download SVG
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Background" htmlFor="sv-bg">
          <Select value={bg} onValueChange={(v) => setBg(v as BgMode)}>
            <SelectTrigger id="sv-bg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checker">Checkerboard</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Zoom" htmlFor="sv-zoom">
          <Select value={zoom} onValueChange={(v) => setZoom(v as Zoom)}>
            <SelectTrigger id="sv-zoom">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
              <SelectItem value="200">200%</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Dimensions"
          value={stats.width && stats.height ? `${stats.width}×${stats.height}` : '—'}
        />
        <Stat
          label="viewBox"
          value={stats.hasViewBox ? 'Yes' : 'No'}
          accent={stats.hasViewBox ? 'oklch(0.6 0.17 150)' : 'oklch(0.6 0.2 25)'}
        />
        <Stat label="Elements" value={stats.elementCount} />
        <Stat label="File size" value={`${stats.fileSize} B`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
          <CardDescription>
            Renders the SVG inline (your own input, sandboxed to this page).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {validation.ok ? (
            <div
              className="fl-scroll flex max-h-[28rem] min-h-48 items-center justify-center overflow-auto rounded-lg border border-border p-6"
              style={previewBg}
            >
              <div
                style={{ transform: `scale(${zoomScale})`, transformOrigin: 'center' }}
                // User-entered SVG rendered client-side only — same-origin sandbox.
                dangerouslySetInnerHTML={{ __html: svgText }}
              />
            </div>
          ) : (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-400"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>
                <div className="font-medium">Cannot render SVG</div>
                <div className="text-xs">{validation.error}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <FileCode2 className="size-3.5" />
        <span>
          Rendering uses <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">dangerouslySetInnerHTML</code> with your own input only — no external resources are loaded.
        </span>
      </div>
    </div>
  )
}
