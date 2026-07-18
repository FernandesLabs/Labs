'use client'

import * as React from 'react'
import { Copy, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Field } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'

interface Palette {
  hex: string
  count: number
  pct: number
}

const TOP_N = 6

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0'))
      .join('')
  ).toUpperCase()
}

function extractPalette(img: HTMLImageElement): Palette[] {
  const target = 100
  const ratio = img.width / img.height || 1
  const w = img.width >= img.height ? target : Math.max(1, Math.round(target * ratio))
  const h = img.height >= img.width ? target : Math.max(1, Math.round(target / ratio))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return []
  ctx.drawImage(img, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)
  const counts = new Map<number, { r: number; g: number; b: number; count: number }>()
  // Quantize to 6 bits per channel (4 levels: 0,64,128,192 — close enough for palette)
  const shift = 2 // divide by 64
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3]
    if (a < 125) continue
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const qr = r >> shift
    const qg = g >> shift
    const qb = b >> shift
    const key = (qr << 12) | (qg << 6) | qb
    const prev = counts.get(key)
    if (prev) {
      prev.r += r
      prev.g += g
      prev.b += b
      prev.count += 1
    } else {
      counts.set(key, { r, g, b, count: 1 })
    }
  }
  const total = Array.from(counts.values()).reduce((s, c) => s + c.count, 0) || 1
  const sorted = Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_N)
  return sorted.map((c) => {
    const r = Math.round(c.r / c.count)
    const g = Math.round(c.g / c.count)
    const b = Math.round(c.b / c.count)
    return {
      hex: rgbToHex(r, g, b),
      count: c.count,
      pct: (c.count / total) * 100,
    }
  })
}

export default function ColorPaletteExtractor() {
  const [palette, setPalette] = React.useState<Palette[]>([])
  const [imgUrl, setImgUrl] = React.useState<string | null>(null)
  const [fileName, setFileName] = React.useState<string | null>(null)
  const { copy } = useCopy()
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  const onFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }
    const url = URL.createObjectURL(file)
    setImgUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
    setFileName(file.name)
    const img = new Image()
    img.onload = () => {
      if (img.width < 1 || img.height < 1) {
        toast.error('Image too small to process')
        return
      }
      const p = extractPalette(img)
      if (p.length === 0) {
        toast.error('Could not extract colors')
        return
      }
      setPalette(p)
    }
    img.onerror = () => toast.error('Failed to load image')
    img.src = url
  }

  React.useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl)
    }
  }, [imgUrl])

  return (
    <div className="space-y-5">
      <Field label="Image">
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center"
          onDragOver={(e) => {
            e.preventDefault()
          }}
          onDrop={(e) => {
            e.preventDefault()
            const f = e.dataTransfer.files?.[0]
            if (f) onFile(f)
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onFile(f)
            }}
          />
          <Button
            type="button"
            className="bg-primary text-primary-foreground"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="size-4" />
            Choose image
          </Button>
          <p className="text-xs text-muted-foreground">
            {fileName ?? 'PNG, JPG, WebP, GIF — drop a file anywhere here.'}
          </p>
        </div>
      </Field>

      {imgUrl ? (
        <Card>
          <CardContent className="pt-6">
            <img
              src={imgUrl}
              alt={fileName ?? 'Source image'}
              className="mx-auto max-h-56 rounded-md border border-border"
            />
          </CardContent>
        </Card>
      ) : null}

      {palette.length > 0 ? (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Extracted palette</Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {palette.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => copy(c.hex, `Copied ${c.hex}`)}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Copy ${c.hex}`}
              >
                <div
                  className="h-16 w-full"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <div className="min-w-0">
                    <div className="font-mono text-sm font-semibold">{c.hex}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {c.pct.toFixed(1)}% · {c.count} px
                    </div>
                  </div>
                  <Copy className="size-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
