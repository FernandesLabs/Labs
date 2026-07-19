'use client'
import * as React from 'react'
import { ShieldCheck, FileCode2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ResultBox } from '@/lib/tools/tool-ui'
type DirectiveKey =
  | 'default-src'
  | 'script-src'
  | 'style-src'
  | 'img-src'
  | 'font-src'
  | 'connect-src'
  | 'media-src'
  | 'frame-src'
  | 'object-src'
const DIRECTIVES: { key: DirectiveKey; label: string; hint: string }[] = [
  { key: 'default-src', label: 'default-src', hint: 'Fallback for any directive not set below' },
  { key: 'script-src', label: 'script-src', hint: 'JavaScript sources' },
  { key: 'style-src', label: 'style-src', hint: 'Stylesheet sources' },
  { key: 'img-src', label: 'img-src', hint: 'Image sources' },
  { key: 'font-src', label: 'font-src', hint: 'Web font sources' },
  { key: 'connect-src', label: 'connect-src', hint: 'fetch, WebSocket, XHR destinations' },
  { key: 'media-src', label: 'media-src', hint: 'Audio and video sources' },
  { key: 'frame-src', label: 'frame-src', hint: 'iframe and frame sources' },
  { key: 'object-src', label: 'object-src', hint: 'Plugin objects (Flash, Java)' },
]
type Preset = 'none' | 'self' | 'https' | 'all' | 'custom'
const PRESET_VALUES: Record<Exclude<Preset, 'custom'>, string> = {
  none: "'none'",
  self: "'self'",
  https: 'https:',
  all: '*',
}
const PRESET_LABELS: Record<Preset, string> = {
  none: "None ('none')",
  self: "Same origin ('self')",
  https: 'HTTPS only (https:)',
  all: 'All (*)',
  custom: 'Custom only',
}
interface DirectiveState {
  enabled: boolean
  preset: Preset
  custom: string
}
const INITIAL_STATE: Record<DirectiveKey, DirectiveState> = {
  'default-src': { enabled: true, preset: 'self', custom: '' },
  'script-src': { enabled: true, preset: 'self', custom: '' },
  'style-src': { enabled: true, preset: 'self', custom: "'unsafe-inline'" },
  'img-src': { enabled: true, preset: 'self', custom: 'data: https:' },
  'font-src': { enabled: true, preset: 'self', custom: 'https:' },
  'connect-src': { enabled: true, preset: 'self', custom: '' },
  'media-src': { enabled: false, preset: 'self', custom: '' },
  'frame-src': { enabled: false, preset: 'self', custom: '' },
  'object-src': { enabled: true, preset: 'none', custom: '' },
}
function buildDirectiveValue(state: DirectiveState): string {
  if (!state.enabled) return ''
  if (state.preset === 'none') return "'none'"
  const parts: string[] = []
  if (state.preset !== 'custom') {
    parts.push(PRESET_VALUES[state.preset])
  }
  const custom = state.custom.trim()
  if (custom.length > 0) parts.push(custom)
  return parts.join(' ')
}
function buildCSP(
  states: Record<DirectiveKey, DirectiveState>,
  reportUri: string
): string {
  const parts: string[] = []
  for (const { key } of DIRECTIVES) {
    const value = buildDirectiveValue(states[key])
    if (value.length > 0) parts.push(`${key} ${value}`)
  }
  const uri = reportUri.trim()
  if (uri.length > 0) parts.push(`report-uri ${uri}`)
  return parts.join('; ')
}
export default function CspGenerator() {
  const [states, setStates] = React.useState(INITIAL_STATE)
  const [reportUri, setReportUri] = React.useState('')
  const csp = React.useMemo(
    () => buildCSP(states, reportUri),
    [states, reportUri]
  )
  const activeCount = DIRECTIVES.filter(
    (d) => buildDirectiveValue(states[d.key]).length > 0
  ).length
  const updateDirective = (key: DirectiveKey, patch: Partial<DirectiveState>) => {
    setStates((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            Content-Security-Policy Generator
          </CardTitle>
          <CardDescription>
            Build a CSP header directive-by-directive. Output is live and
            copy-ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ResultBox
            value={csp}
            label="CSP header value"
            mono
            rows={5}
            downloadName="csp.txt"
            empty="Enable at least one directive to build a policy."
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{activeCount} active directive{activeCount === 1 ? '' : 's'}</Badge>
            <span>·</span>
            <span>{csp.length} chars</span>
            <span>·</span>
            <span>Use as <span className="font-mono">Content-Security-Policy</span> HTTP response header.</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode2 className="size-4" />
            Directives
          </CardTitle>
          <CardDescription>
            Toggle each directive on, pick a preset, then add custom sources
            (space-separated).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {DIRECTIVES.map((d, idx) => {
              const s = states[d.key]
              return (
                <div key={d.key}>
                  {idx > 0 && <Separator className="mb-4" />}
                  <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-start">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor={`csp-enable-${d.key}`}
                            className="cursor-pointer font-mono text-sm"
                          >
                            {d.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">{d.hint}</p>
                        </div>
                        <Switch
                          id={`csp-enable-${d.key}`}
                          checked={s.enabled}
                          onCheckedChange={(c) =>
                            updateDirective(d.key, { enabled: c === true })
                          }
                          aria-label={`Enable ${d.label}`}
                        />
                      </div>
                      <div
                        className={`grid gap-3 sm:grid-cols-2 ${
                          s.enabled ? '' : 'opacity-50'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <Label
                            htmlFor={`csp-preset-${d.key}`}
                            className="text-xs text-muted-foreground"
                          >
                            Preset
                          </Label>
                          <Select
                            value={s.preset}
                            onValueChange={(v) =>
                              updateDirective(d.key, { preset: v as Preset })
                            }
                            disabled={!s.enabled}
                          >
                            <SelectTrigger
                              id={`csp-preset-${d.key}`}
                              className="w-full"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(Object.keys(PRESET_LABELS) as Preset[]).map((p) => (
                                <SelectItem key={p} value={p}>
                                  {PRESET_LABELS[p]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor={`csp-custom-${d.key}`}
                            className="text-xs text-muted-foreground"
                          >
                            Custom sources
                          </Label>
                          <Textarea
                            id={`csp-custom-${d.key}`}
                            value={s.custom}
                            onChange={(e) =>
                              updateDirective(d.key, { custom: e.target.value })
                            }
                            disabled={!s.enabled || s.preset === 'none'}
                            placeholder="https://cdn.example.com 'unsafe-inline'"
                            rows={2}
                            className="font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md border border-border bg-muted/30 p-2 font-mono text-xs break-all lg:min-w-[14rem]">
                      <span className="text-muted-foreground">{d.key}</span>{' '}
                      <span className="text-foreground">
                        {buildDirectiveValue(s) || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <Separator />
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="csp-report-uri">report-uri</Label>
              <Input
                id="csp-report-uri"
                value={reportUri}
                onChange={(e) => setReportUri(e.target.value)}
                placeholder="/csp-report  or  https://example.com/csp"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Endpoint that receives violation reports. Pair with a{' '}
                <span className="font-mono">Content-Security-Policy-Report-Only</span>{' '}
                header to test without enforcing.
              </p>
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-2 font-mono text-xs break-all lg:min-w-[14rem]">
              <span className="text-muted-foreground">report-uri</span>{' '}
              <span className="text-foreground">
                {reportUri.trim() || '—'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}