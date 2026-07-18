'use client'

import * as React from 'react'
import { RefreshCw, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Field, ResultBox, Stat, randomBytes } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
import { toast } from 'sonner'

/** Generate a single RFC 4122 v4 UUID using Web Crypto. */
function uuidV4(): string {
  const b = randomBytes(16)
  // Version 4 (0100)
  b[6] = (b[6] & 0x0f) | 0x40
  // Variant 10xx (RFC 4122)
  b[8] = (b[8] & 0x3f) | 0x80
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, '0'))
  return (
    hex.slice(0, 4).join('') +
    '-' +
    hex.slice(4, 6).join('') +
    '-' +
    hex.slice(6, 8).join('') +
    '-' +
    hex.slice(8, 10).join('') +
    '-' +
    hex.slice(10, 16).join('')
  )
}

function formatUuid(
  raw: string,
  opts: { uppercase: boolean; hyphens: boolean; braces: boolean }
): string {
  let s = opts.uppercase ? raw.toUpperCase() : raw
  if (!opts.hyphens) s = s.replace(/-/g, '')
  if (opts.braces) s = `{${s}}`
  return s
}

export default function UuidGenerator() {
  const [count, setCount] = React.useState(5)
  const [uppercase, setUppercase] = React.useState(false)
  const [hyphens, setHyphens] = React.useState(true)
  const [braces, setBraces] = React.useState(false)
  const [uuids, setUuids] = React.useState<string[]>([])
  const { copy } = useCopy()

  const generate = React.useCallback(() => {
    const safeCount = Math.max(1, Math.min(500, Math.floor(count) || 1))
    const list: string[] = []
    for (let i = 0; i < safeCount; i++) {
      list.push(
        formatUuid(uuidV4(), { uppercase, hyphens, braces })
      )
    }
    setUuids(list)
    toast.success(`Generated ${safeCount} UUID${safeCount === 1 ? '' : 's'}`)
  }, [count, uppercase, hyphens, braces])

  // Generate on first mount.
  React.useEffect(() => {
    generate()
  }, [])

  const output = uuids.join('\n')

  const onCountChange = (v: number) => {
    const clamped = Math.max(1, Math.min(500, Math.floor(v) || 1))
    setCount(clamped)
  }

  return (
    <div className="space-y-5">
      <Field label="How many UUIDs?" htmlFor="count" hint="1–500">
        <div className="flex items-center gap-4">
          <Input
            id="count"
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(e) => onCountChange(Number(e.target.value))}
            className="w-28"
          />
          <Slider
            value={[count]}
            min={1}
            max={500}
            step={1}
            onValueChange={(v) => setCount(v[0])}
            className="flex-1"
            aria-label="UUID count slider"
          />
        </div>
      </Field>

      <div className="flex flex-wrap items-center gap-5 rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <Switch id="up" checked={uppercase} onCheckedChange={setUppercase} />
          <Label htmlFor="up" className="text-sm">Uppercase</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="hy" checked={hyphens} onCheckedChange={setHyphens} />
          <Label htmlFor="hy" className="text-sm">Hyphens</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="br" checked={braces} onCheckedChange={setBraces} />
          <Label htmlFor="br" className="text-sm">Braces</Label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={generate}
          className="bg-primary text-primary-foreground"
        >
          <RefreshCw className="size-4" />
          Generate
        </Button>
        <Button
          variant="outline"
          onClick={() => copy(output, `Copied ${uuids.length} UUIDs`)}
          disabled={uuids.length === 0}
        >
          <Copy className="size-4" />
          Copy all
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Count" value={uuids.length} />
        <Stat label="Version" value="v4" accent="oklch(0.6 0.2 262.6)" />
        <Stat label="Randomness" value="Web Crypto" />
      </div>

      <ResultBox
        value={output}
        label="Generated UUIDs"
        rows={10}
        downloadName="uuids.txt"
        empty="No UUIDs yet — click Generate."
      />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Sample</Badge>
          <code className="font-mono text-xs text-muted-foreground">
            {uuids[0] ?? '—'}
          </code>
        </div>
      </div>
    </div>
  )
}
