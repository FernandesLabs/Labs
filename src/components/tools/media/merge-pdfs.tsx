'use client'
import * as React from 'react'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'sonner'
import {
  ArrowDown,
  ArrowUp,
  Download,
  FilePlus2,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'
interface PdfItem {
  id: string
  file: File
  pageCount: number
  status: 'pending' | 'loaded' | 'error'
}
function formatBytes(b: number): string {
  if (!Number.isFinite(b) || b < 0) return '—'
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}
function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `pdf-${Date.now()}-${Math.floor(performance.now() * 1000)}`
}
export default function MergePdfs() {
  const [items, setItems] = React.useState<PdfItem[]>([])
  const [merging, setMerging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const addFiles = async (fileList: FileList | null): Promise<void> => {
    if (!fileList || fileList.length === 0) return
    const incoming: PdfItem[] = Array.from(fileList)
      .filter((f) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name))
      .map((f) => ({ id: uid(), file: f, pageCount: 0, status: 'pending' as const }))
    if (incoming.length === 0) {
      toast.error('Please choose PDF files')
      return
    }
    setItems((prev) => [...prev, ...incoming])
    // Load page counts asynchronously so the UI stays responsive.
    for (const item of incoming) {
      try {
        const bytes = await item.file.arrayBuffer()
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
        setItems((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? { ...p, pageCount: pdf.getPageCount(), status: 'loaded' as const }
              : p
          )
        )
      } catch {
        setItems((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, status: 'error' as const } : p
          )
        )
        toast.error(`Could not read "${item.file.name}" — is it a valid PDF?`)
      }
    }
  }
  const removeItem = (id: string): void => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }
  const move = (id: string, dir: -1 | 1): void => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = prev.slice()
      const [item] = copy.splice(idx, 1)
      copy.splice(next, 0, item)
      return copy
    })
  }
  const clearAll = (): void => setItems([])
  const readyItems = items.filter((p) => p.status === 'loaded')
  const totalPages = readyItems.reduce((sum, p) => sum + p.pageCount, 0)
  const merge = async (): Promise<void> => {
    if (readyItems.length === 0) {
      toast.error('Add at least one valid PDF to merge')
      return
    }
    setMerging(true)
    try {
      const out = await PDFDocument.create()
      for (const item of readyItems) {
        const bytes = await item.file.arrayBuffer()
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true })
        const pages = await out.copyPages(src, src.getPageIndices())
        for (const page of pages) out.addPage(page)
      }
      const saved = await out.save()
      downloadBlob(
        new Blob([saved], { type: 'application/pdf' }),
        'merged.pdf'
      )
      toast.success(`Merged ${readyItems.length} PDF${readyItems.length === 1 ? '' : 's'} (${totalPages} pages)`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Merge failed: ${message}`)
    } finally {
      setMerging(false)
    }
  }
  return (
    <div className="space-y-5">
      <Field label="Source PDFs">
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            void addFiles(e.dataTransfer.files)
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            multiple
            className="sr-only"
            onChange={(e) => {
              void addFiles(e.target.files)
              e.target.value = ''
            }}
          />
          <Button
            type="button"
            className="bg-primary text-primary-foreground"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-4" />
            Add PDF files
          </Button>
          <p className="text-xs text-muted-foreground">
            Drop PDFs here or click to add. Reorder with the arrows before merging.
          </p>
        </div>
      </Field>
      {items.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Files in order</CardTitle>
            <CardDescription>
              Pages are merged top-to-bottom. Reorder or remove entries below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="fl-scroll max-h-96 rounded-lg border border-border">
              <ol className="divide-y divide-border">
                {items.map((item, idx) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 p-3"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-xs font-semibold tabular-nums text-muted-foreground">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {item.file.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatBytes(item.file.size)}
                        {' · '}
                        {item.status === 'pending' && 'reading…'}
                        {item.status === 'loaded' && `${item.pageCount} page${item.pageCount === 1 ? '' : 's'}`}
                        {item.status === 'error' && (
                          <span className="text-destructive">unreadable</span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label={`Move ${item.file.name} up`}
                        disabled={idx === 0}
                        onClick={() => move(item.id, -1)}
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label={`Move ${item.file.name} down`}
                        disabled={idx === items.length - 1}
                        onClick={() => move(item.id, 1)}
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        aria-label={`Remove ${item.file.name}`}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
            </ScrollArea>
            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAll}
              >
                <Trash2 className="size-3.5" />
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Files" value={items.length} />
        <Stat
          label="Valid"
          value={readyItems.length}
          accent={readyItems.length > 0 ? 'oklch(0.62 0.17 150)' : undefined}
        />
        <Stat label="Total pages" value={totalPages} />
      </div>
      <Button
        type="button"
        onClick={() => void merge()}
        disabled={merging || readyItems.length === 0}
        className="bg-primary text-primary-foreground"
      >
        {merging ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FilePlus2 className="size-4" />
        )}
        {merging ? 'Merging…' : 'Merge PDFs'}
      </Button>
      <p className="text-xs text-muted-foreground">
        <Badge variant="outline" className="mr-2">client-side</Badge>
        Files are read with <code className="font-mono">pdf-lib</code> in your
        browser — nothing is uploaded.
      </p>
    </div>
  )
}