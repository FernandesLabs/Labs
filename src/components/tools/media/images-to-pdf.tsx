'use client'

import * as React from 'react'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'sonner'
import {
  ArrowDown,
  ArrowUp,
  Download,
  FilePlus2,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
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

interface ImageItem {
  id: string
  file: File
  url: string
  width: number
  height: number
  status: 'pending' | 'loaded' | 'error'
  kind: 'png' | 'jpg'
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
  return `img-${Date.now()}-${Math.floor(performance.now() * 1000)}`
}

function detectKind(file: File): 'png' | 'jpg' | null {
  if (file.type === 'image/png' || /\.png$/i.test(file.name)) return 'png'
  if (
    file.type === 'image/jpeg' ||
    file.type === 'image/jpg' ||
    /\.jpe?g$/i.test(file.name)
  ) {
    return 'jpg'
  }
  return null
}

export default function ImagesToPdf() {
  const [items, setItems] = React.useState<ImageItem[]>([])
  const [building, setBuilding] = React.useState(false)
  const [fitPage, setFitPage] = React.useState(true)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const addFiles = async (fileList: FileList | null): Promise<void> => {
    if (!fileList || fileList.length === 0) return
    const incoming: ImageItem[] = []
    for (const f of Array.from(fileList)) {
      const kind = detectKind(f)
      if (!kind) {
        toast.error(`"${f.name}" is not a PNG or JPEG — skipped`)
        continue
      }
      const url = URL.createObjectURL(f)
      incoming.push({
        id: uid(),
        file: f,
        url,
        width: 0,
        height: 0,
        status: 'pending',
        kind,
      })
    }
    if (incoming.length === 0) return
    setItems((prev) => [...prev, ...incoming])

    for (const item of incoming) {
      const img = new Image()
      img.onload = () => {
        if (img.naturalWidth < 1 || img.naturalHeight < 1) {
          setItems((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, status: 'error' as const } : p
            )
          )
          toast.error(`"${item.file.name}" could not be measured`)
          return
        }
        setItems((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? {
                  ...p,
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                  status: 'loaded' as const,
                }
              : p
          )
        )
      }
      img.onerror = () => {
        setItems((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, status: 'error' as const } : p
          )
        )
        toast.error(`"${item.file.name}" failed to load`)
      }
      img.src = item.url
    }
  }

  React.useEffect(() => {
    return () => {
      for (const item of items) URL.revokeObjectURL(item.url)
    }
    // Only run on unmount; items revoke individually in removeItem.
  }, [])

  const removeItem = (id: string): void => {
    setItems((prev) => {
      const target = prev.find((p) => p.id === id)
      if (target) URL.revokeObjectURL(target.url)
      return prev.filter((p) => p.id !== id)
    })
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

  const clearAll = (): void => {
    for (const item of items) URL.revokeObjectURL(item.url)
    setItems([])
  }

  const ready = items.filter((i) => i.status === 'loaded')

  const build = async (): Promise<void> => {
    if (ready.length === 0) {
      toast.error('Add at least one valid image')
      return
    }
    setBuilding(true)
    try {
      const pdf = await PDFDocument.create()
      const A4_W = 595.28
      const A4_H = 841.89
      for (const item of ready) {
        const bytes = await item.file.arrayBuffer()
        const img =
          item.kind === 'png'
            ? await pdf.embedPng(bytes)
            : await pdf.embedJpg(bytes)
        if (fitPage) {
          const page = pdf.addPage([img.width, img.height])
          page.drawImage(img, {
            x: 0,
            y: 0,
            width: img.width,
            height: img.height,
          })
        } else {
          const page = pdf.addPage([A4_W, A4_H])
          const margin = 36
          const maxW = A4_W - margin * 2
          const maxH = A4_H - margin * 2
          const scale = Math.min(maxW / img.width, maxH / img.height, 1)
          const drawW = img.width * scale
          const drawH = img.height * scale
          page.drawImage(img, {
            x: (A4_W - drawW) / 2,
            y: (A4_H - drawH) / 2,
            width: drawW,
            height: drawH,
          })
        }
      }
      const saved = await pdf.save()
      downloadBlob(
        new Blob([saved], { type: 'application/pdf' }),
        'images.pdf'
      )
      toast.success(`Built PDF with ${ready.length} page${ready.length === 1 ? '' : 's'}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Build failed: ${message}`)
    } finally {
      setBuilding(false)
    }
  }

  return (
    <div className="space-y-5">
      <Field label="Source images">
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
            accept="image/png,image/jpeg,.png,.jpg,.jpeg"
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
            Add images
          </Button>
          <p className="text-xs text-muted-foreground">
            PNG or JPEG. One image per page, page sized to the image.
          </p>
        </div>
      </Field>

      {items.length > 0 ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-3">
            <Switch
              id="itp-fit"
              checked={fitPage}
              onCheckedChange={setFitPage}
            />
            <Label htmlFor="itp-fit" className="text-sm">
              Page sized to image (off → A4 portrait)
            </Label>
          </div>
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
      ) : null}

      {!fitPage ? (
        <p className="rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
          A4-page mode places each image centred on an A4 page (595×842 pt).
          When <strong>on</strong>, each page is sized to match its image
          exactly — no whitespace, no scaling.
        </p>
      ) : null}

      {items.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Images in order</CardTitle>
            <CardDescription>
              Reorder with the arrows. Pages are added top-to-bottom.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="fl-scroll max-h-96 rounded-lg border border-border">
              <ol className="divide-y divide-border">
                {items.map((item, idx) => (
                  <li key={item.id} className="flex items-center gap-3 p-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-xs font-semibold tabular-nums text-muted-foreground">
                      {idx + 1}
                    </span>
                    <div className="size-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted/40">
                      {item.status !== 'error' ? (
                        <img
                          src={item.url}
                          alt={item.file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-[10px] text-destructive">
                          err
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {item.file.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatBytes(item.file.size)} ·{' '}
                        {item.kind.toUpperCase()} ·{' '}
                        {item.status === 'pending' && 'reading…'}
                        {item.status === 'loaded' &&
                          `${item.width}×${item.height}px`}
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
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Images" value={items.length} />
        <Stat
          label="Ready"
          value={ready.length}
          accent={ready.length > 0 ? 'oklch(0.62 0.17 150)' : undefined}
        />
        <Stat label="Output pages" value={ready.length} />
      </div>

      <Button
        type="button"
        onClick={() => void build()}
        disabled={building || ready.length === 0}
        className="bg-primary text-primary-foreground"
      >
        {building ? <Loader2 className="size-4 animate-spin" /> : <FilePlus2 className="size-4" />}
        {building ? 'Building…' : 'Build PDF'}
      </Button>

      <p className="text-xs text-muted-foreground">
        <Badge variant="outline" className="mr-2">client-side</Badge>
        <ImagePlus className="mr-1 inline size-3" />
        Each image is embedded with <code className="font-mono">embedPng</code> /
        <code className="font-mono">embedJpg</code>. Toggle the switch above to
        fit each image on an A4 page instead.
      </p>
    </div>
  )
}
