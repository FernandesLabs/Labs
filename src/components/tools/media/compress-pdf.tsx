'use client'

import * as React from 'react'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'sonner'
import { AlertTriangle, Download, Loader2, Minimize2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'

function formatBytes(b: number): string {
  if (!Number.isFinite(b) || b < 0) return '—'
  if (b === 0) return '0 B'
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}

function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, '') || 'document'
}

export default function CompressPdf() {
  const [file, setFile] = React.useState<File | null>(null)
  const [pageCount, setPageCount] = React.useState(0)
  const [originalSize, setOriginalSize] = React.useState(0)
  const [compressedSize, setCompressedSize] = React.useState(0)
  const [compressedBytes, setCompressedBytes] = React.useState<Uint8Array | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [compressing, setComposing] = React.useState(false)
  const [stripMeta, setStripMeta] = React.useState(true)
  const [objectStreams, setObjectStreams] = React.useState(true)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const loadFile = async (f: File): Promise<void> => {
    setLoading(true)
    setCompressedBytes(null)
    setCompressedSize(0)
    try {
      const bytes = await f.arrayBuffer()
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
      setFile(f)
      setPageCount(pdf.getPageCount())
      setOriginalSize(f.size)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (/encrypt|password/i.test(message)) {
        toast.error('This PDF is password-protected and cannot be compressed.')
      } else {
        toast.error(`Could not read PDF: ${message}`)
      }
      setFile(null)
      setPageCount(0)
      setOriginalSize(0)
    } finally {
      setLoading(false)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const f = e.target.files?.[0]
    if (f) void loadFile(f)
    e.target.value = ''
  }

  const compress = async (): Promise<void> => {
    if (!file) {
      toast.error('Load a PDF first')
      return
    }
    setComposing(true)
    try {
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
      if (stripMeta) {
        try {
          pdf.setTitle('')
          pdf.setAuthor('')
          pdf.setSubject('')
          pdf.setKeywords([])
          pdf.setProducer('')
          pdf.setCreator('')
        } catch {
          // Metadata setters can throw on some PDFs; ignore.
        }
      }
      const saved = await pdf.save({ useObjectStreams: objectStreams })
      setCompressedBytes(saved)
      setCompressedSize(saved.length)
      const delta = originalSize - saved.length
      const pct = originalSize > 0 ? (delta / originalSize) * 100 : 0
      if (delta > 0) {
        toast.success(`Saved ${formatBytes(delta)} (${pct.toFixed(1)}%)`)
      } else if (delta === 0) {
        toast.info('No change in size')
      } else {
        toast.info(`Output is ${formatBytes(-delta)} larger — pdf-lib doesn't recompress images.`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Compress failed: ${message}`)
    } finally {
      setComposing(false)
    }
  }

  const download = (): void => {
    if (!compressedBytes || !file) {
      toast.error('Run compression first')
      return
    }
    downloadBlob(
      new Blob([compressedBytes], { type: 'application/pdf' }),
      `${baseName(file.name)}-compressed.pdf`
    )
  }

  const delta = originalSize - compressedSize
  const pct = originalSize > 0 ? (delta / originalSize) * 100 : 0
  const hasSavings = compressedBytes !== null && delta > 0

  return (
    <div className="space-y-5">
      <Alert>
        <AlertTriangle className="size-4" />
        <AlertTitle>Limited compression</AlertTitle>
        <AlertDescription>
          <code className="font-mono">pdf-lib</code> cannot recompress embedded
          images or downsample fonts. This tool strips metadata and re-saves
          with object streams — useful for PDFs that have lots of duplicated
          or unused objects, but image-heavy PDFs won&apos;t shrink much. For
          aggressive image-based compression, use a tool like Ghostscript.
        </AlertDescription>
      </Alert>

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
        <div className="space-y-3 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Switch
                id="cp-strip"
                checked={stripMeta}
                onCheckedChange={setStripMeta}
              />
              <Label htmlFor="cp-strip" className="text-sm">
                Strip metadata (title, author, producer…)
              </Label>
            </div>
            <Badge variant="outline">recommended</Badge>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Switch
                id="cp-obj"
                checked={objectStreams}
                onCheckedChange={setObjectStreams}
              />
              <Label htmlFor="cp-obj" className="text-sm">
                Pack objects into compressed object streams
              </Label>
            </div>
            <Badge variant="outline">recommended</Badge>
          </div>
        </div>
      ) : null}

      {file ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Original" value={formatBytes(originalSize)} />
          <Stat
            label="Compressed"
            value={compressedBytes ? formatBytes(compressedSize) : '—'}
            accent={hasSavings ? 'oklch(0.62 0.17 150)' : undefined}
          />
          <Stat
            label="Saved"
            value={compressedBytes ? formatBytes(Math.max(0, delta)) : '—'}
          />
          <Stat
            label="Savings"
            value={compressedBytes ? `${pct.toFixed(1)}%` : '—'}
            accent={hasSavings ? 'oklch(0.62 0.17 150)' : undefined}
          />
        </div>
      ) : null}

      {compressedBytes && delta <= 0 ? (
        <Alert>
          <AlertTriangle className="size-4" />
          <AlertTitle>No savings</AlertTitle>
          <AlertDescription>
            The re-saved file is {formatBytes(-delta)} larger than the
            original. This usually means the source PDF was already packed
            tightly and pdf-lib added small structural overhead. Use a
            dedicated compression tool if you need to shrink image-heavy PDFs.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => void compress()}
          disabled={!file || compressing}
          className="bg-primary text-primary-foreground"
        >
          {compressing ? <Loader2 className="size-4 animate-spin" /> : <Minimize2 className="size-4" />}
          {compressing ? 'Compressing…' : 'Compress'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={download}
          disabled={!compressedBytes}
        >
          <Download className="size-4" />
          Download compressed
        </Button>
      </div>
    </div>
  )
}
