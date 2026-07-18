'use client'

import * as React from 'react'
import { Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'

type Format = 'image/jpeg' | 'image/webp'

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}

export default function ImageCompressor() {
  const [file, setFile] = React.useState<File | null>(null)
  const [imgUrl, setImgUrl] = React.useState<string | null>(null)
  const [quality, setQuality] = React.useState(0.7)
  const [format, setFormat] = React.useState<Format>('image/jpeg')
  const [original, setOriginal] = React.useState(0)
  const [compressed, setCompressed] = React.useState<Blob | null>(null)
  const [compUrl, setCompUrl] = React.useState<string | null>(null)
  const [dims, setDims] = React.useState<{ w: number; h: number } | null>(null)
  const [loadedImg, setLoadedImg] = React.useState<HTMLImageElement | null>(null)
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  const onFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }
    setFile(f)
    setOriginal(f.size)
    setCompressed(null)
    setLoadedImg(null)
    const url = URL.createObjectURL(f)
    setImgUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
    const img = new Image()
    img.onload = () => {
      if (img.naturalWidth < 1 || img.naturalHeight < 1) {
        toast.error('Image too small to process')
        return
      }
      setDims({ w: img.naturalWidth, h: img.naturalHeight })
      setLoadedImg(img)
    }
    img.onerror = () => toast.error('Failed to load image')
    img.src = url
  }

  React.useEffect(() => {
    if (!loadedImg) return
    const canvas = document.createElement('canvas')
    canvas.width = loadedImg.naturalWidth
    canvas.height = loadedImg.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      toast.error('Could not get canvas context')
      return
    }
    if (format === 'image/jpeg' || format === 'image/webp') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    ctx.drawImage(loadedImg, 0, 0)
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error('Compression failed')
          return
        }
        setCompressed(blob)
        setCompUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return URL.createObjectURL(blob)
        })
      },
      format,
      quality
    )
  }, [loadedImg, format, quality])

  React.useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl)
      if (compUrl) URL.revokeObjectURL(compUrl)
    }
  }, [imgUrl, compUrl])

  const savings = compressed ? Math.max(0, 1 - compressed.size / original) : 0

  const handleDownload = () => {
    if (!compressed) {
      toast.error('Nothing to download yet')
      return
    }
    const ext = format === 'image/jpeg' ? 'jpg' : 'webp'
    const base = file?.name.replace(/\.[^.]+$/, '') || 'image'
    downloadBlob(compressed, `${base}-compressed.${ext}`)
    toast.success('Compressed image downloaded')
  }

  return (
    <div className="space-y-5">
      <Field label="Source image">
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center"
          onDragOver={(e) => e.preventDefault()}
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
            {file ? file.name : 'PNG, JPG, WebP — drop a file or click to choose.'}
          </p>
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Quality"
          htmlFor="ic-quality"
          hint={quality.toFixed(2)}
        >
          <Slider
            id="ic-quality"
            min={0.1}
            max={1}
            step={0.05}
            value={[quality]}
            onValueChange={(v) => setQuality(v[0] ?? quality)}
          />
        </Field>

        <Field label="Output format" htmlFor="ic-format">
          <Select
            value={format}
            onValueChange={(v) => setFormat(v as Format)}
          >
            <SelectTrigger id="ic-format" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image/jpeg">JPEG</SelectItem>
              <SelectItem value="image/webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      {imgUrl ? (
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Original" value={formatBytes(original)} />
          <Stat label="Compressed" value={compressed ? formatBytes(compressed.size) : '…'} />
        </div>
      ) : null}

      {compressed ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat
            label="Savings"
            value={`${(savings * 100).toFixed(1)}%`}
            accent="oklch(0.62 0.17 150)"
          />
          <Stat label="Dimensions" value={dims ? `${dims.w}×${dims.h}` : '—'} />
          <Stat label="Format" value={format === 'image/jpeg' ? 'JPEG' : 'WebP'} />
        </div>
      ) : null}

      {imgUrl && compUrl ? (
        <Card>
          <CardContent className="pt-6">
            <Label className="mb-2 block text-sm font-medium">Side-by-side preview</Label>
            <div className="grid grid-cols-2 gap-3">
              <figure className="overflow-hidden rounded-lg border border-border">
                <img
                  src={imgUrl}
                  alt="Original"
                  className="max-h-72 w-full object-contain bg-muted/30"
                />
                <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                  Original · {formatBytes(original)}
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-lg border border-border">
                <img
                  src={compUrl}
                  alt="Compressed"
                  className="max-h-72 w-full object-contain bg-muted/30"
                />
                <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                  Compressed · {compressed ? formatBytes(compressed.size) : '…'}
                </figcaption>
              </figure>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Button
        type="button"
        onClick={handleDownload}
        disabled={!compressed}
        className="bg-primary text-primary-foreground"
      >
        <Download className="size-4" />
        Download compressed
      </Button>
    </div>
  )
}
