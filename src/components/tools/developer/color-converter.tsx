'use client'
import * as React from 'react'
import { toast } from 'sonner'
import { Check, Copy } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Field } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
type RGB = { r: number; g: number; b: number }
type HSL = { h: number; s: number; l: number }
function hexToRgb(hex: string): RGB | null {
  let h = hex.trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(h)) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null
  const num = parseInt(h, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}
function rgbToHex({ r, g, b }: RGB): string {
  const to2 = (x: number) => x.toString(16).padStart(2, '0')
  return `#${to2(r)}${to2(g)}${to2(b)}`.toUpperCase()
}
function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0)
        break
      case gn:
        h = (bn - rn) / d + 2
        break
      case bn:
        h = (rn - gn) / d + 4
        break
    }
    h /= 6
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}
function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)))
}
function parseRgb(text: string): RGB | null {
  const m = text.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
  if (!m) return null
  const r = clampByte(Number(m[1]))
  const g = clampByte(Number(m[2]))
  const b = clampByte(Number(m[3]))
  return { r, g, b }
}
function CopyRow({ label, value }: { label: string; value: string }) {
  const { copied, copy } = useCopy()
  const has = value.length > 0
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="w-12 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <code className="truncate font-mono text-sm" title={value}>
          {has ? value : '—'}
        </code>
      </div>
      <button
        type="button"
        onClick={() => has && copy(value, `${label} value copied`)}
        disabled={!has}
        className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
        aria-label={`Copy ${label} value`}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
export default function ColorConverter() {
  const [hex, setHex] = React.useState<string>('#0EA5E9')
  const rgb = React.useMemo<RGB | null>(() => hexToRgb(hex), [hex])
  const hsl = React.useMemo<HSL | null>(() => (rgb ? rgbToHsl(rgb) : null), [rgb])
  const pickerValue = React.useMemo<string>(() => {
    if (rgb) return rgbToHex(rgb).toLowerCase()
    return '#000000'
  }, [rgb])
  const handleHexChange = (v: string) => {
    setHex(v)
  }
  const handleHexBlur = () => {
    if (hex.trim() && !hexToRgb(hex)) {
      toast.error('Invalid hex color', {
        description: 'Use #RGB or #RRGGBB format (e.g. #0ea5e9).',
      })
    }
  }
  const handleRgbInput = (v: string) => {
    const parsed = parseRgb(v)
    if (parsed) {
      setHex(rgbToHex(parsed))
    } else if (v.trim() === '') {
      setHex('')
    }
  }
  const hexOut = rgb ? rgbToHex(rgb) : ''
  const rgbOut = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ''
  const hslOut = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : ''
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <Field label="Color picker" htmlFor="color-picker">
          <input
            id="color-picker"
            type="color"
            value={pickerValue}
            onChange={(e) => setHex(e.target.value.toUpperCase())}
            className="h-10 w-20 cursor-pointer rounded-md border border-border bg-background p-1"
            aria-label="Pick a color"
          />
        </Field>
        <Field label="Hex" htmlFor="hex-input" className="flex-1">
          <Input
            id="hex-input"
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            onBlur={handleHexBlur}
            placeholder="#0EA5E9"
            className="font-mono"
          />
        </Field>
        <div
          className="h-10 w-full rounded-md border border-border shadow-inner sm:w-32"
          style={{ backgroundColor: hexOut || 'transparent' }}
          role="img"
          aria-label={`Live color preview ${hexOut || 'empty'}`}
        />
      </div>
      <Field label="Or enter RGB" htmlFor="rgb-input" hint="rgb(r, g, b)">
        <Input
          id="rgb-input"
          onChange={(e) => handleRgbInput(e.target.value)}
          placeholder="rgb(14, 165, 233)"
          className="font-mono"
        />
      </Field>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Conversions</Label>
        <CopyRow label="HEX" value={hexOut} />
        <CopyRow label="RGB" value={rgbOut} />
        <CopyRow label="HSL" value={hslOut} />
      </div>
      {rgb && hsl ? (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-border bg-card p-2">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">R</div>
            <div className="font-mono text-sm font-semibold tabular-nums">{rgb.r}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-2">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">G</div>
            <div className="font-mono text-sm font-semibold tabular-nums">{rgb.g}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-2">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">B</div>
            <div className="font-mono text-sm font-semibold tabular-nums">{rgb.b}</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}