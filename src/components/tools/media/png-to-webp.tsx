'use client'
import * as React from 'react'
import { Download, Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'
function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}
type Status = 'pending' | 'loading' | 'done' | 'error'
interface Result {
  webpBlob: Blob | null
  webpUrl: string | null
  dims: { w: number; h: number } | null
  status: Status
}
interface FileEntry {
  id: number
  file: File
}
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = src
  })
}
function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}
export default function PngToWebp() {
  const [entries, setEntries] = React.useState<FileEntry[]>([])
  const [results, setResults] = React.useState<Record<number, Result>>({})
  const [quality, setQuality] = React.useState(0.8)
  const fileRef = React.useRef<HTMLInputElement | null>(null)
  const nextId = React.useRef(1)
  const addFiles = React.useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const pngs = Array.from(fileList).filter(
      (f) => f.type === 'image/png' || /\.png$/i.test(f.name)
    )
    if (pngs.length === 0) {
      toast.error('Please select PNG files')
      return
    }
    setEntries((prev) => {
      const added: FileEntry[] = pngs.map((file) => ({
        id: nextId.current++,
        file,
      }))
      return [...prev, ...added]
    })
    toast.success(`Added ${pngs.length} PNG ${pngs.length === 1 ? 'file' : 'files'}`)
  }, [])
  const removeEntry = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    setResults((prev) => {
      const r = prev[id]
      if (r?.webpUrl) URL.revokeObjectURL(r.webpUrl)
      const next = { ...prev }
      delete next[id]
      return next
    })
  }
  // Re-convert every loaded file whenever the file set or quality changes.
  React.useEffect(() => {
    if (entries.length === 0) {
      setResults({})
      return
    }
    let cancelled = false
    // Initialize result slots.
    setResults((prev) => {
      const next: Record<number, Result> = {}
      for (const e of entries) {
        const existing = prev[e.id]
        if (existing) {
          next[e.id] = { ...existing, status: 'pending' }
        } else {
          next[e.id] = {
            webpBlob: null,
            webpUrl: null,
            dims: null,
            status: 'pending',
          }
        }
      }
      // Revoke any URLs for entries that no longer exist.
      for (const k of Object.keys(prev)) {
        const id = Number(k)
        if (!next[id] && prev[id]?.webpUrl) {
          URL.revokeObjectURL(prev[id]!.webpUrl as string)
        }
      }
      return next
    })
    const run = async () => {
      for (const entry of entries) {
        if (cancelled) return
        setResults((prev) =>
          prev[entry.id]
            ? { ...prev, [entry.id]: { ...prev[entry.id]!, status: 'loading' } }
            : prev
        )
        try {
          const url = URL.createObjectURL(entry.file)
          const img = await loadImage(url)
          URL.revokeObjectURL(url)
          if (cancelled) return
          if (img.naturalWidth < 1 || img.naturalHeight < 1) {
            throw new Error('Image too small')
          }
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('Canvas context unavailable')
          ctx.drawImage(img, 0, 0)
          const blob = await canvasToBlob(canvas, 'image/webp', quality)
          if (cancelled) return
          if (!blob) throw new Error('WebP encoding failed')
          setResults((prev) => {
            const prevUrl = prev[entry.id]?.webpUrl
            if (prevUrl) URL.revokeObjectURL(prevUrl)
            return {
              ...prev,
              [entry.id]: {
                webpBlob: blob,
                webpUrl: URL.createObjectURL(blob),
                dims: { w: img.naturalWidth, h: img.naturalHeight },
                status: 'done',
              },
            }
          })
        } catch {
          if (cancelled) return
          setResults((prev) =>
            prev[entry.id]
              ? {
                  ...prev,
                  [entry.id]: {
                    webpBlob: null,
                    webpUrl: null,
                    dims: null,
                    status: 'error',
                  },
                }
              : prev
          )
        }
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [entries, quality])
  // Revoke all object URLs on unmount.
  React.useEffect(() => {
    return () => {
      setResults((prev) => {
        for (const k of Object.keys(prev)) {
          const r = prev[Number(k)]
          if (r?.webpUrl) URL.revokeObjectURL(r.webpUrl)
        }
        return prev
      })
    }
  }, [])
  const doneEntries = entries.filter((e) => results[e.id]?.status === 'done')
  const totalOriginal = doneEntries.reduce(
    (sum, e) => sum + e.file.size,
    0
  )
  const totalWebp = doneEntries.reduce(
    (sum, e) => sum + (results[e.id]?.webpBlob?.size ?? 0),
    0
  )
  const totalSavings =
    totalOriginal > 0 ? Math.max(0, 1 - totalWebp / totalOriginal) : 0
  const downloadOne = (entry: FileEntry) => {
    const r = results[entry.id]
    if (!r?.webpBlob) {
      toast.error('WebP not ready yet')
      return
    }
    const base = entry.file.name.replace(/\.[^.]+$/, '')
    downloadBlob(r.webpBlob, `${base}.webp`)
  }
  const downloadAll = () => {
    if (doneEntries.length === 0) {
      toast.error('No converted files to download')
      return
    }
    for (const e of doneEntries) {
      const r = results[e.id]
      if (r?.webpBlob) {
        const base = e.file.name.replace(/\.[^.]+$/, '')
        downloadBlob(r.webpBlob, `${base}.webp`)
      }
    }
    toast.success(`Downloaded ${doneEntries.length} WebP ${doneEntries.length === 1 ? 'file' : 'files'}`)
  }
  return (
    <div className="space-y-5">
      <Field label="PNG files" htmlFor="ptw-file">
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            addFiles(e.dataTransfer.files)
          }}
        >
          <input
            ref={fileRef}
            id="ptw-file"
            type="file"
            multiple
            accept="image/png"
            className="sr-only"
            onChange={(e) => {
              addFiles(e.target.files)
              e.target.value = ''
            }}
          />
          <Button
            type="button"
            className="bg-primary text-primary-foreground"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="size-4" />
            Choose PNG files
          </Button>
          <p className="text-xs text-muted-foreground">
            {entries.length > 0
              ? `${entries.length} PNG ${entries.length === 1 ? 'file' : 'files'} loaded`
              : 'Drop PNG files here or click to choose. Multiple files supported.'}
          </p>
        </div>
      </Field>
      <Field
        label="Quality"
        htmlFor="ptw-quality"
        hint={quality.toFixed(2)}
      >
        <Slider
          id="ptw-quality"
          min={0.1}
          max={1}
          step={0.05}
          value={[quality]}
          onValueChange={(v) => setQuality(v[0] ?? quality)}
        />
      </Field>
      <Alert>
        <AlertDescription>
          WebP is lossy at quality &lt; 1.0; quality 1.0 is near-lossless.
          Files re-convert automatically when you change the quality.
        </AlertDescription>
      </Alert>
      {entries.length > 0 ? (
        <>
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            role="status"
            aria-live="polite"
          >
            <Stat label="Files" value={entries.length.toLocaleString()} />
            <Stat
              label="Original"
              value={totalOriginal > 0 ? formatBytes(totalOriginal) : '—'}
            />
            <Stat
              label="WebP"
              value={totalWebp > 0 ? formatBytes(totalWebp) : '—'}
            />
            <Stat
              label="Total savings"
              value={
                totalOriginal > 0
                  ? `${(totalSavings * 100).toFixed(1)}%`
                  : '—'
              }
              accent={
                totalOriginal > 0 && totalSavings > 0
                  ? 'oklch(0.62 0.17 150)'
                  : undefined
              }
            />
          </div>
          <div className="max-h-96 overflow-auto rounded-lg border border-border fl-scroll">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">File</TableHead>
                  <TableHead className="text-right">Original</TableHead>
                  <TableHead className="text-right">WebP</TableHead>
                  <TableHead className="text-right">Savings</TableHead>
                  <TableHead className="text-right">Download</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => {
                  const r = results[entry.id]
                  const webpSize = r?.webpBlob?.size ?? 0
                  const savings =
                    r?.webpBlob && entry.file.size > 0
                      ? Math.max(
                          0,
                          1 - webpSize / entry.file.size
                        )
                      : 0
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {r?.webpUrl ? (
                            <img
                              src={r.webpUrl}
                              alt=""
                              className="size-9 rounded border border-border object-cover"
                            />
                          ) : (
                            <div className="flex size-9 items-center justify-center rounded border border-border bg-muted/40">
                              {r?.status === 'loading' ? (
                                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                              ) : null}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">
                              {entry.file.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {r?.dims
                                ? `${r.dims.w}×${r.dims.h}`
                                : r?.status === 'error'
                                ? 'Conversion failed'
                                : 'Processing…'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {formatBytes(entry.file.size)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {r?.webpBlob ? formatBytes(webpSize) : '—'}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {r?.webpBlob
                          ? `${(savings * 100).toFixed(1)}%`
                          : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => downloadOne(entry)}
                          disabled={r?.status !== 'done'}
                        >
                          <Download className="size-3.5" />
                          <span className="sr-only sm:not-sr-only">
                            Download
                          </span>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          aria-label={`Remove ${entry.file.name}`}
                          onClick={() => removeEntry(entry.id)}
                        >
                          <X className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                for (const e of entries) removeEntry(e.id)
              }}
              className="text-muted-foreground"
            >
              <X className="size-4" />
              Clear all
            </Button>
            <Button
              type="button"
              onClick={downloadAll}
              disabled={doneEntries.length === 0}
              className="bg-primary text-primary-foreground"
            >
              <Download className="size-4" />
              Download all ({doneEntries.length})
            </Button>
          </div>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          No files loaded yet. Add one or more PNG files to begin conversion.
        </p>
      )}
    </div>
  )
}