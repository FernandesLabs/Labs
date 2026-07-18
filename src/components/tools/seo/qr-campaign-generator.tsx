'use client'

import * as React from 'react'
import { toCanvas as qrToCanvas } from 'qrcode'
import { Download, QrCode, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'

type ECLevel = 'L' | 'M' | 'Q' | 'H'

interface QrState {
  destination: string
  source: string
  medium: string
  campaign: string
}

function isValidUrl(url: string): boolean {
  if (!url) return false
  try {
    const u = new URL(url.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function buildTaggedUrl(state: QrState): string {
  const base = state.destination.trim()
  if (!isValidUrl(base)) return ''
  try {
    const u = new URL(base)
    if (state.source.trim() && !u.searchParams.has('utm_source')) {
      u.searchParams.set('utm_source', state.source.trim())
    }
    if (state.medium.trim() && !u.searchParams.has('utm_medium')) {
      u.searchParams.set('utm_medium', state.medium.trim())
    }
    if (state.campaign.trim() && !u.searchParams.has('utm_campaign')) {
      u.searchParams.set('utm_campaign', state.campaign.trim())
    }
    return u.toString()
  } catch {
    return ''
  }
}

export default function QrCampaignGenerator(): React.JSX.Element {
  const [state, setState] = React.useState<QrState>({
    destination: 'https://fernandeslabs.com/launch',
    source: 'poster',
    medium: 'print',
    campaign: 'offline_q1',
  })
  const [size, setSize] = React.useState<number>(320)
  const [ecLevel, setEcLevel] = React.useState<ECLevel>('M')
  const [fg, setFg] = React.useState<string>('#0f172a')
  const [bg, setBg] = React.useState<string>('#ffffff')
  const [ready, setReady] = React.useState<boolean>(false)

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const { copy } = useCopy()

  const update = <K extends keyof QrState>(key: K, value: string): void => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const taggedUrl = React.useMemo(() => buildTaggedUrl(state), [state])
  const urlValid = isValidUrl(state.destination.trim())
  const requiredMissing =
    !state.source.trim() || !state.medium.trim() || !state.campaign.trim()

  const generate = React.useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!taggedUrl) {
      setReady(false)
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }
    try {
      await qrToCanvas(canvas, taggedUrl, {
        width: size,
        margin: 2,
        errorCorrectionLevel: ecLevel,
        color: { dark: fg, light: bg },
      })
      setReady(true)
    } catch {
      toast.error('Could not generate QR code — URL may be too long for this size.')
      setReady(false)
    }
  }, [taggedUrl, size, ecLevel, fg, bg])

  React.useEffect(() => {
    void generate()
  }, [generate])

  const handleDownload = (): void => {
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
      downloadBlob(blob, 'qr-campaign.png')
      toast.success('QR code downloaded')
    }, 'image/png')
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <QrCode className="size-4" />
            QR Campaign Generator
          </CardTitle>
          <CardDescription>
            Build a UTM-tagged destination URL and render a downloadable QR
            code for offline-to-online campaigns (posters, flyers, packaging).
            All generation runs in your browser via the{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
              qrcode
            </code>{' '}
            library.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Destination URL"
            htmlFor="qr-dest"
            hint={urlValid ? 'valid' : 'must be http(s)://…'}
          >
            <Input
              id="qr-dest"
              value={state.destination}
              onChange={(e) => update('destination', e.target.value)}
              placeholder="https://example.com/landing"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              type="url"
              className={!urlValid ? 'border-rose-500/60' : ''}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="utm_source *"
              htmlFor="qr-source"
              hint="referring channel"
            >
              <Input
                id="qr-source"
                value={state.source}
                onChange={(e) => update('source', e.target.value)}
                placeholder="poster"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
            <Field
              label="utm_medium *"
              htmlFor="qr-medium"
              hint="medium type"
            >
              <Input
                id="qr-medium"
                value={state.medium}
                onChange={(e) => update('medium', e.target.value)}
                placeholder="print"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
            <Field
              label="utm_campaign *"
              htmlFor="qr-campaign"
              hint="campaign name"
            >
              <Input
                id="qr-campaign"
                value={state.campaign}
                onChange={(e) => update('campaign', e.target.value)}
                placeholder="offline_q1"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">QR appearance</CardTitle>
            <CardDescription>
              Larger sizes scan more reliably. Higher error correction lets the
              code stay readable even if partially damaged or branded.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Size" htmlFor="qr-size" hint={`${size}px`}>
              <Slider
                id="qr-size"
                min={128}
                max={512}
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

            <div className="grid gap-4 sm:grid-cols-2">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">QR preview</CardTitle>
            <CardDescription>
              Renders live as you edit. Download as PNG for print or digital
              use.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-2">
            <div className="flex size-full min-h-[200px] items-center justify-center rounded-lg border border-border bg-muted/30 p-4">
              <canvas
                ref={canvasRef}
                className="max-h-[300px] max-w-full rounded-md bg-white"
                role="img"
                aria-label={ready ? 'Generated QR code' : 'QR code preview'}
              />
            </div>
            <Button
              type="button"
              onClick={handleDownload}
              disabled={!ready}
              className="bg-primary text-primary-foreground"
            >
              <Download className="size-4" />
              Download PNG
            </Button>
            {!ready ? (
              <Label className="text-xs text-muted-foreground">
                Enter a valid destination URL and required UTMs to generate a QR
                code.
              </Label>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Destination"
          value={urlValid ? 'valid' : 'invalid'}
          accent={urlValid ? 'oklch(0.6 0.17 150)' : 'oklch(0.6 0.22 25)'}
        />
        <Stat
          label="UTM required"
          value={requiredMissing ? 'missing' : 'complete'}
          accent={requiredMissing ? 'oklch(0.7 0.18 75)' : 'oklch(0.6 0.17 150)'}
        />
        <Stat label="QR size" value={`${size}px`} />
        <Stat label="URL length" value={taggedUrl.length} />
      </div>

      {!urlValid ? (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="size-4" />
          Enter a valid destination URL (must start with{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">http://</code>{' '}
          or{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">https://</code>
          ).
        </div>
      ) : requiredMissing ? (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="size-4" />
          utm_source, utm_medium, and utm_campaign are required for proper
          campaign attribution.
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          Tagged URL ready — QR code updates live.
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <Label htmlFor="qr-tagged" className="text-sm font-medium">
            Tagged URL (encoded in the QR)
          </Label>
          {taggedUrl ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => copy(taggedUrl, 'Tagged URL copied')}
            >
              Copy URL
            </Button>
          ) : null}
        </div>
        <Input
          id="qr-tagged"
          readOnly
          value={taggedUrl}
          className="font-mono text-xs"
          placeholder="Fill in the destination URL and UTMs to build the tagged URL."
        />
      </div>
    </div>
  )
}
