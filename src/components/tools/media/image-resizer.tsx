'use client'

import * as React from 'react'
import { Download, Link2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'

type Format = 'image/png' | 'image/jpeg'

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}

export default function ImageResizer() {
  const [file, setFile] = React.useState<File | null>(null)
  const [imgUrl, setImgUrl] = React.useState<string | null>(null)
  const [origDims, setOrigDims] = React.useState<{ w: number; h: number } | null>(null)
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)
  const [lockRatio, setLockRatio] = React.useState(true)
  const [format, setFormat] = React.useState<Format>('image/png')
  const [outUrl, setOutUrl] = React.useState<string | null>(null)
  const [outSize, setOutSize] = React.useState(0)
  const [loadedImg, setLoadedImg] = React.useState<HTMLImageElement | null>(null)
  const ratioRef = React.useRef(1)
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  const onFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }
    setFile(f)
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
      setOrigDims({ w: img.naturalWidth, h: img.naturalHeight })
      setWidth(img.naturalWidth)
      setHeight(img.naturalHeight)
      ratioRef.current = img.naturalWidth / img.naturalHeight || 1
      setLoadedImg(img)
    }
    img.onerror = () => toast.error('Failed to load image')
    img.src = url
  }

  React.useEffect(() => {
    if (!loadedImg) return
    if (width < 1 || height < 1) return
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
    }
    ctx.drawImage(loadedImg, 0, 0, width, height)
    canvas.toBlob((blob) => {
      if (!blob) return
      setOutSize(blob.size)
      setOutUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return URL.createObjectURL(blob)
      })
    }, format)
  }, [loadedImg, width, height, format])

  React.useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl)
      if (outUrl) URL.revokeObjectURL(outUrl)
    }
  }, [imgUrl, outUrl])

  const onWidth = (v: number) => {
    if (lockRatio && ratioRef.current > 0) {
      setWidth(v)
      setHeight(Math.max(1, Math.round(v / ratioRef.current)))
    } else {
      setWidth(v)
    }
  }
  const onHeight = (v: number) => {
    if (lockRatio && ratioRef.current > 0) {
      setHeight(v)
      setWidth(Math.max(1, Math.round(v * ratioRef.current)))
    } else {
      setHeight(v)
    }
  }

  const handleDownload = () => {
    if (!outUrl) {
      toast.error('Nothing to download yet')
      return
    }
    const ext = format === 'image/png' ? 'png' : 'jpg'
    const base = file?.name.replace(/\.[^.]+$/, '') || 'image'
    fetch(outUrl)
      .then((r) => r.blob())
      .then((blob) => {
        downloadBlob(blob, `${base}-${width}x${height}.${ext}`)
        toast.success('Image downloaded')
      })
      .catch(() => toast.error('Download failed'))
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
            {file ? file.name : 'PNG, JPG, WebP, GIF — drop a file or click to choose.'}
          </p>
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Width (px)" htmlFor="ir-w">
          <Input
            id="ir-w"
            type="number"
            min={1}
            value={Number.isFinite(width) ? width : ''}
            onChange={(e) => onWidth(Math.max(1, parseInt(e.target.value, 10) || 0))}
          />
        </Field>
        <Field label="Height (px)" htmlFor="ir-h">
          <Input
            id="ir-h"
            type="number"
            min={1}
            value={Number.isFinite(height) ? height : ''}
            onChange={(e) => onHeight(Math.max(1, parseInt(e.target.value, 10) || 0))}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Switch
            id="ir-lock"
            checked={lockRatio}
            onCheckedChange={setLockRatio}
          />
          <Label htmlFor="ir-lock" className="flex items-center gap-1.5 text-sm">
            <Link2 className="size-4" />
            Maintain aspect ratio
          </Label>
        </div>
        <div className="w-44">
          <Field label="Format" htmlFor="ir-format">
            <Select
              value={format}
              onValueChange={(v) => setFormat(v as Format)}
            >
              <SelectTrigger id="ir-format" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image/png">PNG</SelectItem>
                <SelectItem value="image/jpeg">JPEG</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      {origDims ? (
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Original" value={`${origDims.w}×${origDims.h}`} />
          <Stat label="New size" value={`${width}×${height}`} />
          <Stat label="File size" value={outUrl ? formatBytes(outSize) : '—'} />
        </div>
      ) : null}

      {outUrl ? (
        <Card>
          <CardContent className="pt-6">
            <Label className="mb-2 block text-sm font-medium">Preview</Label>
            <img
              src={outUrl}
              alt="Resized preview"
              className="mx-auto max-h-72 rounded-md border border-border bg-muted/30"
            />
          </CardContent>
        </Card>
      ) : null}

      <Button
        type="button"
        onClick={handleDownload}
        disabled={!outUrl}
        className="bg-primary text-primary-foreground"
      >
        <Download className="size-4" />
        Download resized
      </Button>
    </div>
  )
}
