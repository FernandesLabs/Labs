'use client'
import * as React from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Field, ResultBox, downloadBlob } from '@/lib/tools/tool-ui'
const W = 1200
const H = 630
interface Gradient {
  name: string
  stops: [string, string]
}
const GRADIENTS: Gradient[] = [
  { name: 'Sunset', stops: ['#ff7e5f', '#feb47b'] },
  { name: 'Ocean', stops: ['#2e3192', '#1bffff'] },
  { name: 'Forest', stops: ['#134e5e', '#71b280'] },
  { name: 'Berry', stops: ['#8e2de2', '#e74292'] },
  { name: 'Charcoal', stops: ['#232526', '#414345'] },
  { name: 'Amber', stops: ['#f12711', '#f5af19'] },
]
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}
function fitTitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
  startSize: number,
  minSize: number
): { lines: string[]; size: number } {
  let size = startSize
  while (size >= minSize) {
    ctx.font = `800 ${size}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
    const lines = wrapText(ctx, text, maxWidth)
    const lineH = size * 1.15
    if (lines.length * lineH <= maxHeight) {
      return { lines, size }
    }
    size -= 4
  }
  ctx.font = `800 ${minSize}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
  return { lines: wrapText(ctx, text, maxWidth), size: minSize }
}
export default function SocialImageGenerator() {
  const [title, setTitle] = React.useState('Build better tools with Fernandes Labs')
  const [subtitle, setSubtitle] = React.useState('A modern developer toolkit, crafted with care.')
  const [gradient, setGradient] = React.useState<string>(GRADIENTS[0].name)
  const [solidColor, setSolidColor] = React.useState('#0f172a')
  const [useGradient, setUseGradient] = React.useState(true)
  const [textColor, setTextColor] = React.useState('#ffffff')
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const render = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Background
    if (useGradient) {
      const g = GRADIENTS.find((x) => x.name === gradient) ?? GRADIENTS[0]
      const grad = ctx.createLinearGradient(0, 0, W, H)
      grad.addColorStop(0, g.stops[0])
      grad.addColorStop(1, g.stops[1])
      ctx.fillStyle = grad
    } else {
      ctx.fillStyle = solidColor
    }
    ctx.fillRect(0, 0, W, H)
    // Subtle overlay vignette
    const overlay = ctx.createLinearGradient(0, 0, 0, H)
    overlay.addColorStop(0, 'rgba(0,0,0,0.05)')
    overlay.addColorStop(1, 'rgba(0,0,0,0.25)')
    ctx.fillStyle = overlay
    ctx.fillRect(0, 0, W, H)
    const padding = 80
    const maxWidth = W - padding * 2
    // Title (wrap + shrink)
    const titleText = title.trim() || 'Untitled'
    const { lines: titleLines, size: titleSize } = fitTitle(
      ctx,
      titleText,
      maxWidth,
      H * 0.5,
      84,
      36
    )
    // Subtitle
    const subText = subtitle.trim()
    ctx.font = `400 28px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
    const subLines = subText ? wrapText(ctx, subText, maxWidth) : []
    const subLineH = 28 * 1.4
    const titleLineH = titleSize * 1.15
    const gap = subText ? 28 : 0
    const totalH = titleLines.length * titleLineH + gap + subLines.length * subLineH
    let y = (H - totalH) / 2 + titleSize * 0.5
    ctx.fillStyle = textColor
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.font = `800 ${titleSize}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
    for (const line of titleLines) {
      ctx.fillText(line, padding, y)
      y += titleLineH
    }
    if (subText) {
      y += gap - titleLineH + subLineH * 0.5
      ctx.font = `400 28px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
      ctx.globalAlpha = 0.85
      for (const line of subLines) {
        ctx.fillText(line, padding, y)
        y += subLineH
      }
      ctx.globalAlpha = 1
    }
    // Small brand mark in bottom-right
    ctx.font = `600 20px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
    ctx.textAlign = 'right'
    ctx.globalAlpha = 0.7
    ctx.fillText('Fernandes Labs', W - padding, H - 48)
    ctx.globalAlpha = 1
  }, [title, subtitle, gradient, solidColor, useGradient, textColor])
  React.useEffect(() => {
    render()
  }, [render])
  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error('Could not export PNG')
        return
      }
      downloadBlob(blob, 'social-image.png')
      toast.success('Social image downloaded')
    }, 'image/png')
  }
  const css = `background: ${
    useGradient
      ? (() => {
          const g = GRADIENTS.find((x) => x.name === gradient) ?? GRADIENTS[0]
          return `linear-gradient(135deg, ${g.stops[0]}, ${g.stops[1]})`
        })()
      : solidColor
  };\ncolor: ${textColor};`
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" htmlFor="si-title">
          <Textarea
            id="si-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={3}
            placeholder="Your headline"
          />
        </Field>
        <Field label="Subtitle" htmlFor="si-sub">
          <Textarea
            id="si-sub"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={3}
            placeholder="Optional supporting text"
          />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Background" htmlFor="si-bg">
          <Select
            value={useGradient ? gradient : '__solid'}
            onValueChange={(v) => {
              if (v === '__solid') {
                setUseGradient(false)
              } else {
                setUseGradient(true)
                setGradient(v)
              }
            }}
          >
            <SelectTrigger id="si-bg" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GRADIENTS.map((g) => (
                <SelectItem key={g.name} value={g.name}>
                  {g.name}
                </SelectItem>
              ))}
              <SelectItem value="__solid">Solid color</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Text color" htmlFor="si-fg">
          <div className="flex items-center gap-3">
            <input
              id="si-fg"
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="size-10 cursor-pointer rounded-md border border-border bg-background p-1"
              aria-label="Text color"
            />
            <Input
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="font-mono"
            />
          </div>
        </Field>
      </div>
      {!useGradient ? (
        <Field label="Solid background color" htmlFor="si-solid">
          <div className="flex items-center gap-3">
            <input
              id="si-solid"
              type="color"
              value={solidColor}
              onChange={(e) => setSolidColor(e.target.value)}
              className="size-10 cursor-pointer rounded-md border border-border bg-background p-1"
              aria-label="Solid color"
            />
            <Input
              value={solidColor}
              onChange={(e) => setSolidColor(e.target.value)}
              className="font-mono"
            />
          </div>
        </Field>
      ) : null}
      <Card>
        <CardContent className="pt-6">
          <Label className="mb-2 block text-sm font-medium">
            Live preview · 1200 × 630
          </Label>
          <div className="fl-scroll max-h-[420px] overflow-auto rounded-lg border border-border bg-muted/30 p-3">
            <canvas
              ref={canvasRef}
              className="block w-full rounded-md"
              role="img"
              aria-label="Generated social image preview"
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={handleDownload}
          className="bg-primary text-primary-foreground"
        >
          <Download className="size-4" />
          Download PNG
        </Button>
        <Label className="text-xs text-muted-foreground">
          Long titles wrap automatically and shrink to fit.
        </Label>
      </div>
      <ResultBox
        label="CSS snippet"
        value={css}
        rows={3}
        downloadName="social-bg.css"
        empty="—"
      />
    </div>
  )
}