'use client'

import * as React from 'react'
import { Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Field, downloadBlob } from '@/lib/tools/tool-ui'

const SIZES = [16, 32, 48, 64, 180]

function drawImageFavicon(
  size: number,
  img: HTMLImageElement
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  if (img.naturalWidth < 1 || img.naturalHeight < 1) return canvas
  const ratio = Math.max(size / img.naturalWidth, size / img.naturalHeight)
  const w = img.naturalWidth * ratio
  const h = img.naturalHeight * ratio
  const x = (size - w) / 2
  const y = (size - h) / 2
  ctx.drawImage(img, x, y, w, h)
  return canvas
}

function drawTextFavicon(
  size: number,
  text: string,
  bg: string,
  fg: string,
  fontSizePct: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = fg
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const sizeFactor = (fontSizePct / 100) * 0.6
  ctx.font = `bold ${Math.round(size * sizeFactor)}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
  ctx.fillText(text, size / 2, size / 2 + size * 0.02)
  return canvas
}

export default function FaviconGenerator() {
  const [mode, setMode] = React.useState<'image' | 'text'>('text')
  const [text, setText] = React.useState('FL')
  const [bg, setBg] = React.useState('#0f172a')
  const [fg, setFg] = React.useState('#f8fafc')
  const [fontSize, setFontSize] = React.useState(80)
  const [img, setImg] = React.useState<HTMLImageElement | null>(null)
  const [imgUrl, setImgUrl] = React.useState<string | null>(null)
  const [imgName, setImgName] = React.useState<string | null>(null)
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  const cleaned = text.trim().slice(0, 2)

  const loadFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }
    const url = URL.createObjectURL(f)
    const image = new Image()
    image.onload = () => {
      setImg(image)
      setImgUrl(url)
      setImgName(f.name)
    }
    image.onerror = () => {
      toast.error('Failed to load image')
      URL.revokeObjectURL(url)
    }
    image.src = url
  }

  React.useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl)
    }
  }, [imgUrl])

  const previews = React.useMemo<{ size: number; url: string; canvas: HTMLCanvasElement }[]>(() => {
    return SIZES.map((size) => {
      let canvas: HTMLCanvasElement
      if (mode === 'image' && img) {
        canvas = drawImageFavicon(size, img)
      } else if (mode === 'text' && cleaned.length > 0) {
        canvas = drawTextFavicon(size, cleaned, bg, fg, fontSize)
      } else {
        canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = '#e5e7eb'
          ctx.fillRect(0, 0, size, size)
        }
      }
      return { size, url: canvas.toDataURL('image/png'), canvas }
    })
  }, [mode, img, cleaned, bg, fg, fontSize])

  const handleDownload = (size: number) => {
    const entry = previews.find((p) => p.size === size)
    if (!entry) return
    entry.canvas.toBlob((blob) => {
      if (!blob) {
        toast.error('Could not export PNG')
        return
      }
      downloadBlob(blob, `favicon-${size}x${size}.png`)
      toast.success(`Downloaded ${size}×${size}`)
    }, 'image/png')
  }

  const handleDownloadAll = () => {
    previews.forEach((p, i) => {
      window.setTimeout(() => handleDownload(p.size), i * 200)
    })
  }

  const disabled = mode === 'text' ? cleaned.length === 0 : !img

  return (
    <div className="space-y-5">
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'image' | 'text')}>
        <TabsList>
          <TabsTrigger value="text">From Text</TabsTrigger>
          <TabsTrigger value="image">From Image</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-5 pt-4">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Text" htmlFor="fav-text" hint="1–2 characters">
              <Input
                id="fav-text"
                value={text}
                maxLength={2}
                onChange={(e) => setText(e.target.value)}
                placeholder="FL"
              />
            </Field>
            <Field label="Font size" htmlFor="fav-fs" hint={`${fontSize}%`}>
              <Input
                id="fav-fs"
                type="number"
                min={20}
                max={200}
                value={fontSize}
                onChange={(e) =>
                  setFontSize(
                    Math.max(20, Math.min(200, parseInt(e.target.value, 10) || 80))
                  )
                }
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Background" htmlFor="fav-bg">
              <div className="flex items-center gap-3">
                <input
                  id="fav-bg"
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="size-10 cursor-pointer rounded-md border border-border bg-background p-1"
                  aria-label="Background color"
                />
                <Input
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="font-mono"
                />
              </div>
            </Field>
            <Field label="Text color" htmlFor="fav-fg">
              <div className="flex items-center gap-3">
                <input
                  id="fav-fg"
                  type="color"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="size-10 cursor-pointer rounded-md border border-border bg-background p-1"
                  aria-label="Text color"
                />
                <Input
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="font-mono"
                />
              </div>
            </Field>
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-5 pt-4">
          <Field label="Source image">
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const f = e.dataTransfer.files?.[0]
                if (f) loadFile(f)
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) loadFile(f)
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
                {imgName ?? 'Square images work best. PNG, JPG, WebP, SVG.'}
              </p>
            </div>
          </Field>
          {imgUrl ? (
            <Card>
              <CardContent className="pt-6">
                <img
                  src={imgUrl}
                  alt="Source"
                  className="mx-auto max-h-40 rounded-md border border-border"
                />
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>

      <Separator />
      <Label className="text-sm font-medium">Generated favicons</Label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {previews.map(({ size, url }) => (
          <div
            key={size}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-md bg-[conic-gradient(at_50%_50%,_#e5e7eb_25%,_#f8fafc_0_50%,_#e5e7eb_0_75%,_#f8fafc_0)] bg-[length:16px_16px]">
              <img
                src={url}
                alt={`${size}×${size} favicon preview`}
                width={Math.min(96, Math.max(32, size))}
                height={Math.min(96, Math.max(32, size))}
                style={{ imageRendering: 'pixelated' }}
                className="rounded-sm"
              />
            </div>
            <div className="text-xs font-medium">{size}×{size}</div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleDownload(size)}
              disabled={disabled}
            >
              <Download className="size-3.5" />
              PNG
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleDownloadAll}
        disabled={disabled}
      >
        <Download className="size-4" />
        Download all sizes
      </Button>
    </div>
  )
}
