'use client'

import * as React from 'react'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'sonner'
import { Download, FileDown, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'

function formatBytes(b: number): string {
  if (!Number.isFinite(b) || b < 0) return '—'
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}

function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, '') || 'document'
}

/** Parse "1,3,5-7" into 0-based indices. Preserves order & duplicates. */
function parsePageList(raw: string, pageCount: number): number[] {
  const trimmed = raw.trim()
  if (!trimmed) throw new Error('No page numbers provided')
  const out: number[] = []
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
      for (let p = lo; p <= hi; p++) out.push(p - 1)
    } else if (/^\d+$/.test(token)) {
      const p = parseInt(token, 10)
      if (!Number.isFinite(p) || p < 1 || p > pageCount) {
        throw new Error(`Page ${p} is out of bounds (1-${pageCount})`)
      }
      out.push(p - 1)
    } else {
      throw new Error(`Unrecognised token: "${token}"`)
    }
  }
  if (out.length === 0) throw new Error('No valid pages parsed')
  return out
}

export default function ExtractPdfPages() {
  const [file, setFile] = React.useState<File | null>(null)
  const [pageCount, setPageCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [pagesInput, setPagesInput] = React.useState('')
  const [extracting, setExtracting] = React.useState(false)
  const [extractedCount, setExtractedCount] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const parsedPreview: number[] | { error: string } = (() => {
    if (!file || !pagesInput.trim()) return []
    try {
      return parsePageList(pagesInput, pageCount)
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Invalid input' }
    }
  })()

  const loadFile = async (f: File): Promise<void> => {
    setLoading(true)
    setExtractedCount(0)
    try {
      const bytes = await f.arrayBuffer()
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
      setFile(f)
      setPageCount(pdf.getPageCount())
      setPagesInput('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (/encrypt|password/i.test(message)) {
        toast.error('This PDF is password-protected and cannot be read.')
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

  const extract = async (): Promise<void> => {
    if (!file) {
      toast.error('Load a PDF first')
      return
    }
    let indices: number[]
    try {
      indices = parsePageList(pagesInput, pageCount)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid page list'
      toast.error(message)
      return
    }
    setExtracting(true)
    try {
      const bytes = await file.arrayBuffer()
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true })
      const out = await PDFDocument.create()
      const pages = await out.copyPages(src, indices)
      for (const page of pages) out.addPage(page)
      const saved = await out.save()
      downloadBlob(
        new Blob([saved], { type: 'application/pdf' }),
        `${baseName(file.name)}-extracted.pdf`
      )
      setExtractedCount(indices.length)
      toast.success(`Extracted ${indices.length} page${indices.length === 1 ? '' : 's'}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Extract failed: ${message}`)
    } finally {
      setExtracting(false)
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
        <Field
          label="Pages to extract"
          htmlFor="ep-pages"
          hint={`range 1-${pageCount}`}
        >
          <Input
            id="ep-pages"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 1,3,5-7"
            value={pagesInput}
            onChange={(e) => setPagesInput(e.target.value)}
          />
        </Field>
      ) : null}

      {file ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Source pages" value={pageCount} />
          <Stat
            label="Will extract"
            value={Array.isArray(parsedPreview) ? parsedPreview.length : '—'}
            accent="oklch(0.62 0.17 150)"
          />
          <Stat
            label="Last result"
            value={extractedCount > 0 ? `${extractedCount} pages` : '—'}
          />
        </div>
      ) : null}

      {file && pagesInput.trim() ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
            <CardDescription>
              Pages will be added to the new PDF in the order shown below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Array.isArray(parsedPreview) ? (
              parsedPreview.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Enter page numbers like <code className="font-mono">1,3,5-7</code>.
                </p>
              ) : (
                <ScrollArea className="fl-scroll max-h-48">
                  <div className="flex flex-wrap gap-1.5">
                    {parsedPreview.map((i, idx) => (
                      <Badge
                        key={`${i}-${idx}`}
                        variant="outline"
                        className="font-mono text-xs"
                      >
                        p{i + 1}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              )
            ) : (
              <p className="text-sm text-destructive">{parsedPreview.error}</p>
            )}
          </CardContent>
        </Card>
      ) : null}

      <Button
        type="button"
        onClick={() => void extract()}
        disabled={!file || extracting || !pagesInput.trim()}
        className="bg-primary text-primary-foreground"
      >
        {extracting ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
        {extracting ? 'Extracting…' : 'Extract & download'}
      </Button>

      <p className="text-xs text-muted-foreground">
        <Download className="mr-1 inline size-3" />
        Output: <code className="font-mono">{file ? `${baseName(file.name)}-extracted.pdf` : 'document-extracted.pdf'}</code>
      </p>
    </div>
  )
}
