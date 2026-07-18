'use client'

import * as React from 'react'
import { toCanvas as qrToCanvas } from 'qrcode'
import { Download, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Field, downloadBlob } from '@/lib/tools/tool-ui'

type ECLevel = 'L' | 'M' | 'Q' | 'H'

export default function QrGenerator() {
  const [text, setText] = React.useState('https://fernandeslabs.com')
  const [size, setSize] = React.useState(320)
  const [ecLevel, setEcLevel] = React.useState<ECLevel>('M')
  const [fg, setFg] = React.useState('#0f172a')
  const [bg, setBg] = React.useState('#ffffff')
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const [ready, setReady] = React.useState(false)

  const generate = React.useCallback(async () => {
    if (!text.trim()) {
      setReady(false)
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      }
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      await qrToCanvas(canvas, text, {
        width: size,
        margin: 2,
        errorCorrectionLevel: ecLevel,
        color: { dark: fg, light: bg },
      })
      setReady(true)
    } catch {
      toast.error('Could not generate QR code')
      setReady(false)
    }
  }, [text, size, ecLevel, fg, bg])

  React.useEffect(() => {
    void generate()
  }, [generate])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas || !ready) {
      toast.error('Nothing to download yet')
      return
    }
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error('Could not export PNG')
        return
      }
      downloadBlob(blob, 'qr-code.png')
      toast.success('QR code downloaded')
    }, 'image/png')
  }

  return (
    <div className="space-y-5">
      <Field label="Text or URL" htmlFor="qr-text">
        <Textarea
          id="qr-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a URL or any text…"
          rows={3}
        />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Size"
          htmlFor="qr-size"
          hint={`${size}px`}
        >
          <Slider
            id="qr-size"
            min={128}
            max={1024}
            step={16}
            value={[size]}
            onValueChange={(v) => setSize(v[0] ?? size)}
          />
        </Field>

        <Field label="Error correction" htmlFor="qr-ec">
          <Select value={ecLevel} onValueChange={(v) => setEcLevel(v as ECLevel)}>
            <SelectTrigger id="qr-ec" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">L — Low (7%)</SelectItem>
              <SelectItem value="M">M — Medium (15%)</SelectItem>
              <SelectItem value="Q">Q — Quartile (25%)</SelectItem>
              <SelectItem value="H">H — High (30%)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Foreground" htmlFor="qr-fg">
          <div className="flex items-center gap-3">
            <input
              id="qr-fg"
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="size-10 cursor-pointer rounded-md border border-border bg-background p-1"
              aria-label="Foreground color"
            />
            <Input
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="font-mono"
              aria-label="Foreground hex value"
            />
          </div>
        </Field>

        <Field label="Background" htmlFor="qr-bg">
          <div className="flex items-center gap-3">
            <input
              id="qr-bg"
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
              aria-label="Background hex value"
            />
          </div>
        </Field>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <div className="flex size-full min-h-[200px] items-center justify-center rounded-lg border border-border bg-muted/30 p-4">
            <canvas
              ref={canvasRef}
              className="max-h-[360px] max-w-full rounded-md bg-white"
              role="img"
              aria-label={ready ? 'Generated QR code' : 'QR code preview'}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              onClick={handleDownload}
              disabled={!ready}
              className="bg-primary text-primary-foreground"
            >
              <Download className="size-4" />
              Download PNG
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Tip: lighter backgrounds scan best.')}
            >
              <QrCode className="size-4" />
              Scan Tip
            </Button>
          </div>
          {!ready ? (
            <Label className="text-xs text-muted-foreground">
              Enter text or a URL to generate a QR code.
            </Label>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
