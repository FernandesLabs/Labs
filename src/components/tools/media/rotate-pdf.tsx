'use client'
import * as React from 'react'
import { PDFDocument, degrees } from 'pdf-lib'
import { toast } from 'sonner'
import { Download, Loader2, RotateCw, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'
type Angle = 90 | 180 | 270
type Target = 'all' | 'custom'
function formatBytes(b: number): string {
  if (!Number.isFinite(b) || b < 0) return '—'
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}
function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, '') || 'document'
}
/**
 * Parse a comma-separated list of pages and ranges (e.g. "1,3,5-7") into
 * 0-based page indices. Throws Error with a friendly message if any token
 * is malformed or out of range.
 */
function parsePageList(
  raw: string,
  pageCount: number
): number[] {
  const trimmed = raw.trim()
  if (!trimmed) throw new Error('No page numbers provided')
  const out: number[] = []
  const seen = new Set<number>()
  const tokens = trimmed.split(',').map((t) => t.trim()).filter(Boolean)
  for (const token of tokens) {
    const rangeMatch = /^(\d+)\s*-\s*(\d+)$/.exec(token)
    if (rangeMatch) {
      const a = parseInt(rangeMatch[1], 10)
      const b = parseInt(rangeMatch[2], 10)
      if (!Number.isFinite(a) || !Number.isFinite(b)) {
        throw new Error(`Invalid range: "${token}"`)
      }
      const lo = Math.min(a, b)
      const hi = Math.max(a, b)
      if (lo < 1 || hi > pageCount) {
        throw new Error(`Range ${lo}-${hi} is out of bounds (1-${pageCount})`)
      }
      for (let p = lo; p <= hi; p++) {
        const idx = p - 1
        if (!seen.has(idx)) {
          seen.add(idx)
          out.push(idx)
        }
      }
    } else if (/^\d+$/.test(token)) {
      const p = parseInt(token, 10)
      if (!Number.isFinite(p) || p < 1 || p > pageCount) {
        throw new Error(`Page ${p} is out of bounds (1-${pageCount})`)
      }
      const idx = p - 1
      if (!seen.has(idx)) {
        seen.add(idx)
        out.push(idx)
      }
    } else {
      throw new Error(`Unrecognised token: "${token}"`)
    }
  }
  if (out.length === 0) throw new Error('No valid pages parsed')
  return out
}
export default function RotatePdf() {
  const [file, setFile] = React.useState<File | null>(null)
  const [pageCount, setPageCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [angle, setAngle] = React.useState<Angle>(90)
  const [target, setTarget] = React.useState<Target>('all')
  const [pagesInput, setPagesInput] = React.useState('')
  const [rotating, setRotating] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const loadFile = async (f: File): Promise<void> => {
    setLoading(true)
    try {
      const bytes = await f.arrayBuffer()
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
      setFile(f)
      setPageCount(pdf.getPageCount())
      setPagesInput('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (/encrypt|password/i.test(message)) {
        toast.error('This PDF is password-protected and cannot be rotated.')
      } else {
        toast.error(`Could not read PDF: ${message}`)
      }
      setFile(null)
      setPageCount(0)
    } finally {
      setLoading(false)
    }
  }
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const f = e.target.files?.[0]
    if (f) void loadFile(f)
    e.target.value = ''
  }
  const rotate = async (): Promise<void> => {
    if (!file) {
      toast.error('Load a PDF first')
      return
    }
    let indices: number[] | null = null
    if (target === 'custom') {
      try {
        indices = parsePageList(pagesInput, pageCount)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid page list'
        toast.error(message)
        return
      }
    }
    setRotating(true)
    try {
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
      const pages = pdf.getPages()
      const targetSet = indices ? new Set(indices) : null
      let rotated = 0
      for (let i = 0; i < pages.length; i++) {
        if (targetSet && !targetSet.has(i)) continue
        const current = pages[i].getRotation().angle
        const next = (current + angle) % 360
        pages[i].setRotation(degrees(next))
        rotated++
      }
      const saved = await pdf.save()
      downloadBlob(
        new Blob([saved], { type: 'application/pdf' }),
        `${baseName(file.name)}-rotated-${angle}.pdf`
      )
      toast.success(`Rotated ${rotated} page${rotated === 1 ? '' : 's'} by ${angle}°`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Rotate failed: ${message}`)
    } finally {
      setRotating(false)
    }
  }
  return (
    <div className="space-y-5">
      <Field label="Source PDF">
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const f = e.dataTransfer.files?.[0]
            if (f) void loadFile(f)
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={onInputChange}
          />
          <Button
            type="button"
            className="bg-primary text-primary-foreground"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {loading ? 'Reading…' : 'Choose PDF'}
          </Button>
          <p className="text-xs text-muted-foreground">
            {file ? (
              <>
                <strong>{file.name}</strong> · {formatBytes(file.size)} · {pageCount} page{pageCount === 1 ? '' : 's'}
              </>
            ) : (
              'Drop a PDF here or click to choose.'
            )}
          </p>
        </div>
      </Field>
      {file ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Rotation angle" htmlFor="rp-angle">
            <Select
              value={String(angle)}
              onValueChange={(v) => setAngle(Number(v) as Angle)}
            >
              <SelectTrigger id="rp-angle" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90° clockwise</SelectItem>
                <SelectItem value="180">180°</SelectItem>
                <SelectItem value="270">270° clockwise (90° counter-clockwise)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Apply to" htmlFor="rp-target">
            <Select
              value={target}
              onValueChange={(v) => setTarget(v as Target)}
            >
              <SelectTrigger id="rp-target" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All pages</SelectItem>
                <SelectItem value="custom">Specific pages…</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      ) : null}
      {file && target === 'custom' ? (
        <Field
          label="Pages to rotate"
          htmlFor="rp-pages"
          hint={`e.g. 1,3,5-7 — range 1-${pageCount}`}
        >
          <Input
            id="rp-pages"
            type="text"
            inputMode="numeric"
            placeholder="1,3,5-7"
            value={pagesInput}
            onChange={(e) => setPagesInput(e.target.value)}
          />
        </Field>
      ) : null}
      {file ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Source pages" value={pageCount} />
          <Stat label="Angle" value={`${angle}°`} />
          <Stat
            label="Scope"
            value={target === 'all' ? 'All pages' : 'Custom'}
            accent={target === 'all' ? 'oklch(0.62 0.17 150)' : undefined}
          />
        </div>
      ) : null}
      {file && target === 'custom' && pagesInput.trim() ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Parsed preview</CardTitle>
            <CardDescription>
              The pages below will be rotated (invalid tokens are reported on apply).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              try {
                const idx = parsePageList(pagesInput, pageCount)
                return (
                  <div className="flex flex-wrap gap-1.5">
                    {idx.map((i) => (
                      <span
                        key={i}
                        className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-xs"
                      >
                        {i + 1}
                      </span>
                    ))}
                  </div>
                )
              } catch (err) {
                const msg = err instanceof Error ? err.message : 'Invalid'
                return (
                  <p className="text-sm text-destructive">{msg}</p>
                )
              }
            })()}
          </CardContent>
        </Card>
      ) : null}
      <Button
        type="button"
        onClick={() => void rotate()}
        disabled={!file || rotating}
        className="bg-primary text-primary-foreground"
      >
        {rotating ? <Loader2 className="size-4 animate-spin" /> : <RotateCw className="size-4" />}
        {rotating ? 'Rotating…' : 'Rotate & download'}
      </Button>
    </div>
  )
}