'use client'

import * as React from 'react'
import {
  Loader2,
  Activity,
  Gauge,
  Repeat,
  RotateCcw,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { Field, Stat } from '@/lib/tools/tool-ui'

interface PingResponse {
  ok: boolean
  error?: string
  status: number
  statusText: string
  ttfbMs: number
  finalUrl: string
}

interface PingRun {
  index: number
  status: number | null
  ttfbMs: number | null
  finalUrl?: string
  error?: string
}

function ttfbAccent(ms: number | null | undefined): string | undefined {
  if (ms === null || ms === undefined) return undefined
  if (ms < 500) return 'oklch(0.6 0.17 150)'
  if (ms < 1500) return 'oklch(0.7 0.18 75)'
  return 'oklch(0.6 0.22 25)'
}

function ttfbBadgeClass(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) return ''
  if (ms < 500)
    return 'border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
  if (ms < 1500)
    return 'border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400'
  return 'border-transparent bg-rose-500/15 text-rose-700 dark:text-rose-400'
}

async function fetchPing(
  url: string,
  signal: AbortSignal
): Promise<PingResponse> {
  const api = `/api/network?op=ping&url=${encodeURIComponent(url)}`
  const res = await fetch(api, { signal })
  return (await res.json()) as PingResponse
}

export default function PingTool(): React.JSX.Element {
  const [url, setUrl] = React.useState('https://example.com')
  const [loading, setLoading] = React.useState(false)
  const [runs, setRuns] = React.useState<PingRun[]>([])
  const controllerRef = React.useRef<AbortController | null>(null)

  // Single ping with a 15s timeout via AbortController.
  const pingOnce = React.useCallback(
    async (target: string): Promise<PingRun> => {
      const controller = new AbortController()
      controllerRef.current = controller
      const timeout = setTimeout(() => controller.abort(), 15000)
      try {
        const r = await fetchPing(target, controller.signal)
        if (!r.ok) {
          return {
            index: 0,
            status: null,
            ttfbMs: null,
            error: r.error || 'Ping failed',
          }
        }
        return {
          index: 0,
          status: r.status,
          ttfbMs: r.ttfbMs,
          finalUrl: r.finalUrl,
        }
      } catch (e) {
        if ((e as Error).name === 'AbortError') {
          return {
            index: 0,
            status: null,
            ttfbMs: null,
            error: 'Timed out (15s)',
          }
        }
        return {
          index: 0,
          status: null,
          ttfbMs: null,
          error: 'Network error',
        }
      } finally {
        clearTimeout(timeout)
      }
    },
    []
  )

  const validate = (target: string): boolean => {
    if (!target) {
      toast.error('Enter a URL')
      return false
    }
    try {
      const parsed = new URL(target)
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        toast.error('URL must use http or https')
        return false
      }
      return true
    } catch {
      toast.error('That doesn’t look like a valid URL')
      return false
    }
  }

  const runSingle = React.useCallback(async () => {
    if (!validate(url)) return
    setLoading(true)
    try {
      const run = await pingOnce(url)
      setRuns((prev) => [
        { ...run, index: prev.length },
        ...prev,
      ])
      if (run.error) toast.error(run.error)
    } finally {
      setLoading(false)
    }
  }, [url, pingOnce])

  const runTriple = React.useCallback(async () => {
    if (!validate(url)) return
    setLoading(true)
    setRuns([])
    const collected: PingRun[] = []
    for (let i = 0; i < 3; i++) {
      const run = await pingOnce(url)
      collected.push({ ...run, index: i })
      // Surface each run as it completes.
      setRuns([...collected])
      if (run.error) {
        toast.error(`Ping ${i + 1} failed: ${run.error}`)
        break
      }
    }
    setLoading(false)
  }, [url, pingOnce])

  const clearRuns = () => {
    setRuns([])
  }

  React.useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort()
    }
  }, [])

  const successful = runs.filter((r) => r.ttfbMs !== null)
  const avgTtfb =
    successful.length > 0
      ? Math.round(
          successful.reduce((s, r) => s + (r.ttfbMs ?? 0), 0) /
            successful.length
        )
      : null
  const minTtfb =
    successful.length > 0
      ? Math.min(...successful.map((r) => r.ttfbMs ?? Infinity))
      : null
  const maxTtfb =
    successful.length > 0
      ? Math.max(...successful.map((r) => r.ttfbMs ?? -Infinity))
      : null

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>HTTP Latency (TTFB) Ping</CardTitle>
          <CardDescription>
            Measures the time to first byte (TTFB) for an HTTP request —
            not ICMP ping. Run a single check or three consecutive
            measurements to see the average TTFB.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="URL" htmlFor="ping-url" hint="http(s)://…">
            <Input
              id="ping-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) void runSingle()
              }}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              type="url"
              disabled={loading}
            />
          </Field>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={() => void runSingle()}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Activity className="size-4" />
              )}
              Ping once
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => void runTriple()}
              disabled={loading}
            >
              <Repeat className="size-4" />
              Run 3 pings
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearRuns}
              disabled={loading || runs.length === 0}
            >
              <RotateCcw className="size-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Avg TTFB"
          value={avgTtfb === null ? '—' : `${avgTtfb} ms`}
          accent={ttfbAccent(avgTtfb)}
        />
        <Stat
          label="Min TTFB"
          value={minTtfb === null ? '—' : `${minTtfb} ms`}
          accent={ttfbAccent(minTtfb)}
        />
        <Stat
          label="Max TTFB"
          value={maxTtfb === null ? '—' : `${maxTtfb} ms`}
          accent={ttfbAccent(maxTtfb)}
        />
        <Stat
          label="Successful"
          value={`${successful.length}/${runs.length}`}
        />
      </div>

      {runs.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="size-4" />
              Ping history
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-80">
              <ul className="space-y-2">
                {runs.map((r) => (
                  <li
                    key={r.index}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm"
                  >
                    <span className="text-xs font-medium text-muted-foreground">
                      #{r.index + 1}
                    </span>
                    {r.error ? (
                      <Badge className="border-transparent bg-rose-500/15 text-rose-700 dark:text-rose-400">
                        error
                      </Badge>
                    ) : r.status !== null ? (
                      <Badge variant="outline">{r.status}</Badge>
                    ) : null}
                    {r.ttfbMs !== null ? (
                      <Badge className={ttfbBadgeClass(r.ttfbMs)}>
                        {r.ttfbMs} ms
                      </Badge>
                    ) : null}
                    {r.error ? (
                      <span className="text-xs text-rose-600 dark:text-rose-400">
                        {r.error}
                      </span>
                    ) : null}
                    {r.finalUrl ? (
                      <span className="ml-auto break-all font-mono text-xs text-muted-foreground">
                        {r.finalUrl}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
