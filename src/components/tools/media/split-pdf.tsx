'use client'

import * as React from 'react'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'sonner'
import { Download, Loader2, Scissors, Upload } from 'lucide-react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'

type SplitMode = 'every' | 'range' | 'count'

interface SplitChunk {
  name: string
  label: string
  bytes: Uint8Array | null
  status: 'pending' | 'ready' | 'error'
}

function formatBytes(b: number): string {
  if (!Number.isFinite(b) || b < 0) return '—'
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}

function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, '') || 'document'
}

export default function SplitPdf() {
  const [file, setFile] = React.useState<File | null>(null)
  const [pageCount, setPageCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [mode, setMode] = React.useState<SplitMode>('every')
  const [rangeStart, setRangeStart] = React.useState(1)
  const [rangeEnd, setRangeEnd] = React.useState(1)
  const [chunkSize, setChunkSize] = React.useState(1)
  const [chunks, setChunks] = React.useState<SplitChunk[]>([])
  const [splitting, setSplitting] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const fileBytesRef = React.useRef<ArrayBuffer | null>(null)

  const loadFile = async (f: File): Promise<void> => {
    setLoading(true)
    setChunks([])
    try {
      const bytes = await f.arrayBuffer()
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
      fileBytesRef.current = bytes
      setFile(f)
      setPageCount(pdf.getPageCount())
      setRangeStart(1)
      setRangeEnd(pdf.getPageCount())
      setChunkSize(1)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (/encrypt|password/i.test(message)) {
        toast.error('This PDF is password-protected and cannot be split.')
      } else {
        toast.error(`Could not read PDF: ${message}`)
      }
      fileBytesRef.current = null
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

  const planChunks = (): { name: string; label: string; indices: number[] }[] => {
    if (!file) return []
    const base = baseName(file.name)
    if (mode === 'every') {
      const out: { name: string; label: string; indices: number[] }[] = []
      for (let i = 0; i < pageCount; i++) {
        out.push({
          name: `${base}-page-${i + 1}.pdf`,
          label: `Page ${i + 1}`,
          indices: [i],
        })
      }
      return out
    }
    if (mode === 'range') {
      const start = Math.max(1, Math.min(rangeStart, pageCount))
      const end = Math.max(start, Math.min(rangeEnd, pageCount))
      const indices: number[] = []
      for (let i = start - 1; i <= end - 1; i++) indices.push(i)
      return [
        {
          name: `${base}-pages-${start}-${end}.pdf`,
          label: `Pages ${start}–${end}`,
          indices,
        },
      ]
    }
    // count
    const size = Math.max(1, chunkSize)
    const out: { name: string; label: string; indices: number[] }[] = []
    for (let i = 0; i < pageCount; i += size) {
      const slice: number[] = []
      for (let j = i; j < Math.min(i + size, pageCount); j++) slice.push(j)
      const first = i + 1
      const last = i + slice.length
      out.push({
        name:
          slice.length === 1
            ? `${base}-page-${first}.pdf`
            : `${base}-pages-${first}-${last}.pdf`,
        label:
          slice.length === 1
            ? `Page ${first}`
            : `Pages ${first}–${last}`,
        indices: slice,
      })
    }
    return out
  }

  const plan = planChunks()

  const runSplit = async (): Promise<void> => {
    if (!file || !fileBytesRef.current) {
      toast.error('Load a PDF first')
      return
    }
    if (mode === 'range') {
      if (!Number.isFinite(rangeStart) || !Number.isFinite(rangeEnd)) {
        toast.error('Enter valid start and end page numbers')
        return
      }
      if (rangeStart < 1 || rangeEnd < rangeStart) {
        toast.error('Page range is invalid — end must be ≥ start, both ≥ 1')
        return
      }
      if (rangeStart > pageCount || rangeEnd > pageCount) {
        toast.error(`Page numbers must be ≤ ${pageCount}`)
        return
      }
    }
    if (mode === 'count' && (!Number.isFinite(chunkSize) || chunkSize < 1)) {
      toast.error('Pages-per-chunk must be at least 1')
      return
    }
    if (plan.length === 0) {
      toast.error('Nothing to split — check the source PDF')
      return
    }
    setSplitting(true)
    setChunks(plan.map((p) => ({ ...p, bytes: null, status: 'pending' as const })))
    try {
      for (let i = 0; i < plan.length; i++) {
        const item = plan[i]
        // Re-load source each chunk for safety; small overhead.
        const src = await PDFDocument.load(fileBytesRef.current, {
          ignoreEncryption: true,
        })
        const out = await PDFDocument.create()
        const pages = await out.copyPages(src, item.indices)
        for (const page of pages) out.addPage(page)
        const saved = await out.save()
        setChunks((prev) =>
          prev.map((c, idx) =>
            idx === i ? { ...c, bytes: saved, status: 'ready' as const } : c
          )
        )
      }
      toast.success(`Split into ${plan.length} file${plan.length === 1 ? '' : 's'}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Split failed: ${message}`)
      setChunks((prev) =>
        prev.map((c) => (c.status === 'pending' ? { ...c, status: 'error' as const } : c))
      )
    } finally {
      setSplitting(false)
    }
  }

  const downloadOne = (chunk: SplitChunk): void => {
    if (!chunk.bytes) {
      toast.error('Chunk not ready yet')
      return
    }
    downloadBlob(new Blob([chunk.bytes], { type: 'application/pdf' }), chunk.name)
  }

  const downloadAll = (): void => {
    const ready = chunks.filter((c) => c.bytes)
    if (ready.length === 0) {
      toast.error('Run the split first')
      return
    }
    for (const c of ready) {
      downloadBlob(new Blob([c.bytes as Uint8Array], { type: 'application/pdf' }), c.name)
    }
    toast.success(`Downloading ${ready.length} file${ready.length === 1 ? '' : 's'}`)
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
          <Field label="Split mode" htmlFor="sp-mode">
            <Select
              value={mode}
              onValueChange={(v) => setMode(v as SplitMode)}
            >
              <SelectTrigger id="sp-mode" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="every">Every page → N files</SelectItem>
                <SelectItem value="range">By page range</SelectItem>
                <SelectItem value="count">By page count (chunks)</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {mode === 'range' ? (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start page" htmlFor="sp-start">
                <Input
                  id="sp-start"
                  type="number"
                  min={1}
                  max={pageCount}
                  value={Number.isFinite(rangeStart) ? rangeStart : ''}
                  onChange={(e) => setRangeStart(parseInt(e.target.value, 10) || 0)}
                />
              </Field>
              <Field label="End page" htmlFor="sp-end">
                <Input
                  id="sp-end"
                  type="number"
                  min={1}
                  max={pageCount}
                  value={Number.isFinite(rangeEnd) ? rangeEnd : ''}
                  onChange={(e) => setRangeEnd(parseInt(e.target.value, 10) || 0)}
                />
              </Field>
            </div>
          ) : null}

          {mode === 'count' ? (
            <Field
              label="Pages per chunk"
              htmlFor="sp-count"
              hint={`source has ${pageCount} page${pageCount === 1 ? '' : 's'}`}
            >
              <Input
                id="sp-count"
                type="number"
                min={1}
                max={pageCount}
                value={Number.isFinite(chunkSize) ? chunkSize : ''}
                onChange={(e) => setChunkSize(parseInt(e.target.value, 10) || 0)}
              />
            </Field>
          ) : null}
        </div>
      ) : null}

      {file && plan.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Source pages" value={pageCount} />
          <Stat label="Output files" value={plan.length} accent="oklch(0.62 0.17 150)" />
          <Stat
            label="Mode"
            value={mode === 'every' ? 'Every page' : mode === 'range' ? 'Range' : 'Chunks'}
          />
        </div>
      ) : null}

      {file ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan preview</CardTitle>
            <CardDescription>
              {mode === 'every' && 'Each page becomes a single-page PDF.'}
              {mode === 'range' && 'A single PDF with the selected page range.'}
              {mode === 'count' && `Consecutive groups of ${chunkSize} page${chunkSize === 1 ? '' : 's'} each.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="fl-scroll max-h-72 rounded-lg border border-border">
              <ul className="divide-y divide-border">
                {plan.map((p, idx) => (
                  <li key={`${p.name}-${idx}`} className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{p.label}</div>
                      <div className="truncate font-mono text-xs text-muted-foreground">{p.name}</div>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {p.indices.length} page{p.indices.length === 1 ? '' : 's'}
                    </Badge>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : null}

      {chunks.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generated files</CardTitle>
            <CardDescription>
              Download individually, or grab them all at once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ScrollArea className="fl-scroll max-h-72 rounded-lg border border-border">
              <ul className="divide-y divide-border">
                {chunks.map((c, idx) => (
                  <li
                    key={`${c.name}-${idx}`}
                    className="flex items-center justify-between gap-3 p-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{c.label}</div>
                      <div className="truncate font-mono text-xs text-muted-foreground">
                        {c.name}
                        {c.bytes ? ` · ${formatBytes(c.bytes.length)}` : ''}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!c.bytes}
                      onClick={() => downloadOne(c)}
                    >
                      <Download className="size-3.5" />
                      Save
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={downloadAll}
                disabled={chunks.every((c) => !c.bytes)}
              >
                <Download className="size-3.5" />
                Download all
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Button
        type="button"
        onClick={() => void runSplit()}
        disabled={!file || splitting || plan.length === 0}
        className="bg-primary text-primary-foreground"
      >
        {splitting ? <Loader2 className="size-4 animate-spin" /> : <Scissors className="size-4" />}
        {splitting ? 'Splitting…' : `Split into ${plan.length || 0} file${plan.length === 1 ? '' : 's'}`}
      </Button>
    </div>
  )
}
