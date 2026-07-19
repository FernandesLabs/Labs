'use client'
import * as React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Field, ResultBox } from '@/lib/tools/tool-ui'
type GradientType = 'linear' | 'radial'
interface Stop {
  id: string
  color: string
  position: number
}
function newStopId(): string {
  // Use crypto.randomUUID if available, fallback otherwise (no Math.random)
  const c: Crypto | undefined =
    typeof crypto !== 'undefined' ? crypto : undefined
  if (c && typeof c.randomUUID === 'function') {
    return c.randomUUID()
  }
  const arr = new Uint8Array(8)
  c?.getRandomValues(arr)
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('')
}
function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}
function buildCss(
  type: GradientType,
  angle: number,
  stops: Stop[]
): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position)
  const stopsStr = sorted
    .map((s) => `${s.color} ${clamp(s.position, 0, 100).toFixed(0)}%`)
    .join(', ')
  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${stopsStr})`
  }
  return `radial-gradient(circle at center, ${stopsStr})`
}
export default function CssGradientGenerator() {
  const [type, setType] = React.useState<GradientType>('linear')
  const [angle, setAngle] = React.useState(135)
  const [stops, setStops] = React.useState<Stop[]>([
    { id: newStopId(), color: '#7c3aed', position: 0 },
    { id: newStopId(), color: '#ec4899', position: 100 },
  ])
  const css = React.useMemo(
    () => buildCss(type, angle, stops),
    [type, angle, stops]
  )
  const addStop = () => {
    const lastPos = stops[stops.length - 1]?.position ?? 50
    const newPos = clamp(lastPos - 25, 0, 100)
    setStops((prev) => [
      ...prev,
      { id: newStopId(), color: '#10b981', position: newPos },
    ])
  }
  const removeStop = (id: string) => {
    setStops((prev) => {
      if (prev.length <= 2) return prev
      return prev.filter((s) => s.id !== id)
    })
  }
  const updateStop = (id: string, patch: Partial<Stop>) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    )
  }
  return (
    <div className="space-y-5">
      <Tabs
        value={type}
        onValueChange={(v) => setType(v as GradientType)}
      >
        <TabsList>
          <TabsTrigger value="linear">Linear</TabsTrigger>
          <TabsTrigger value="radial">Radial</TabsTrigger>
        </TabsList>
        <TabsContent value="linear" className="pt-4">
          <Field label="Angle" htmlFor="cg-angle" hint={`${angle}°`}>
            <Slider
              id="cg-angle"
              min={0}
              max={360}
              step={5}
              value={[angle]}
              onValueChange={(v) => setAngle(v[0] ?? angle)}
            />
          </Field>
        </TabsContent>
        <TabsContent value="radial" className="pt-4">
          <p className="text-sm text-muted-foreground">
            Radial gradients radiate from the center of the element.
          </p>
        </TabsContent>
      </Tabs>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Color stops</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addStop}
          >
            <Plus className="size-4" />
            Add stop
          </Button>
        </div>
        <div className="space-y-3">
          {stops.map((stop, idx) => (
            <div
              key={stop.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  #{idx + 1}
                </span>
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) =>
                    updateStop(stop.id, { color: e.target.value })
                  }
                  className="size-9 cursor-pointer rounded-md border border-border bg-background p-1"
                  aria-label={`Stop ${idx + 1} color`}
                />
              </div>
              <Input
                value={stop.color}
                onChange={(e) =>
                  updateStop(stop.id, { color: e.target.value })
                }
                className="w-32 font-mono"
                aria-label={`Stop ${idx + 1} hex`}
              />
              <div className="flex min-w-[180px] flex-1 items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(e) =>
                    updateStop(stop.id, {
                      position: clamp(
                        parseInt(e.target.value, 10) || 0,
                        0,
                        100
                      ),
                    })
                  }
                  className="w-20"
                  aria-label={`Stop ${idx + 1} position`}
                />
                <span className="text-xs text-muted-foreground">%</span>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[stop.position]}
                  onValueChange={(v) =>
                    updateStop(stop.id, { position: v[0] ?? stop.position })
                  }
                  className="flex-1"
                  aria-label={`Stop ${idx + 1} position slider`}
                />
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeStop(stop.id)}
                disabled={stops.length <= 2}
                aria-label="Remove stop"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label className="mb-2 block text-sm font-medium">Preview</Label>
        <div
          className="h-48 w-full rounded-lg border border-border"
          style={{ background: css }}
          role="img"
          aria-label="Gradient preview"
        />
      </div>
      <ResultBox
        label="CSS"
        value={`background: ${css};`}
        rows={3}
        downloadName="gradient.css"
      />
    </div>
  )
}