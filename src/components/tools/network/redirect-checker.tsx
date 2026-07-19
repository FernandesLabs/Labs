'use client'
import * as React from 'react'
import {
  Loader2,
  Search,
  ArrowDown,
  AlertTriangle,
  Route,
  GitBranch,
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
interface ChainHop {
  url: string
  status: number
  location?: string
  ttfbMs: number
}
interface RedirectResponse {
  ok: boolean
  error?: string
  chain: ChainHop[]
  hops: number
}
function statusBadgeClass(status: number): string {
  if (status >= 200 && status < 300)
    return 'border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
  if (status >= 300 && status < 400)
    return 'border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-400'
  if (status >= 400 && status < 500)
    return 'border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400'
  if (status >= 500)
    return 'border-transparent bg-rose-500/15 text-rose-700 dark:text-rose-400'
  return 'border-transparent bg-muted text-muted-foreground'
}
function ttfbAccent(ms: number): string | undefined {
  if (ms < 500) return 'oklch(0.6 0.17 150)'
  if (ms < 1500) return 'oklch(0.7 0.18 75)'
  return 'oklch(0.6 0.22 25)'
}
/** Detect loops in the chain (same URL appearing twice). */
function findLoop(chain: ChainHop[]): { loop: boolean; visited: Set<string> } {
  const visited = new Set<string>()
  for (const hop of chain) {
    const key = hop.url
    if (visited.has(key)) {
      return { loop: true, visited }
    }
    visited.add(key)
  }
  return { loop: false, visited }
}
async function fetchRedirect(
  url: string,
  signal: AbortSignal
): Promise<RedirectResponse> {
  const api = `/api/network?op=redirect&url=${encodeURIComponent(url)}`
  const res = await fetch(api, { signal })
  return (await res.json()) as RedirectResponse
}
export default function RedirectChecker(): React.JSX.Element {
  const [url, setUrl] = React.useState('https://example.com')
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<RedirectResponse | null>(null)
  const controllerRef = React.useRef<AbortController | null>(null)
  const trace = React.useCallback(
    async (override?: string) => {
      const target = (override ?? url).trim()
      if (!target) {
        toast.error('Enter a URL')
        return
      }
      try {
        const parsed = new URL(target)
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          toast.error('URL must use http or https')
          return
        }
      } catch {
        toast.error('That doesn’t look like a valid URL')
        return
      }
      if (controllerRef.current) controllerRef.current.abort()
      const controller = new AbortController()
      controllerRef.current = controller
      const timeout = setTimeout(() => controller.abort(), 15000)
      setLoading(true)
      try {
        const result = await fetchRedirect(target, controller.signal)
        if (!result.ok) {
          toast.error(result.error || 'Redirect trace failed')
          setData(null)
          return
        }
        setData(result)
        const { loop } = findLoop(result.chain)
        if (loop) {
          toast.warning('Redirect loop detected')
        }
      } catch (e) {
        if ((e as Error).name === 'AbortError') {
          toast.error('Request timed out (15s)')
        } else {
          toast.error('Network error during trace')
        }
      } finally {
        clearTimeout(timeout)
        setLoading(false)
      }
    },
    [url]
  )
  React.useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort()
    }
  }, [])
  const loop = data ? findLoop(data.chain).loop : false
  const totalTtfb = data
    ? data.chain.reduce((sum, h) => sum + h.ttfbMs, 0)
    : 0
  const redirectCount = data
    ? data.chain.filter((h) => h.status >= 300 && h.status < 400).length
    : 0
  const finalHop = data?.chain[data.chain.length - 1]
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Redirect Checker</CardTitle>
          <CardDescription>
            Trace the full HTTP redirect chain for any URL — follow each
            3xx hop until the final destination. Detects redirect loops and
            shows status code + TTFB for every hop.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="URL" htmlFor="redir-url" hint="http(s)://…">
            <Input
              id="redir-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => {
                if (e.key === 'Enter') void trace()
              }}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              type="url"
            />
          </Field>
          <Button
            type="button"
            onClick={() => void trace()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            Trace
          </Button>
        </CardContent>
      </Card>
      {data ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              label="Total hops"
              value={data.hops}
              accent={data.hops > 5 ? 'oklch(0.7 0.18 75)' : undefined}
            />
            <Stat
              label="Redirects"
              value={redirectCount}
            />
            <Stat
              label="Total TTFB"
              value={`${totalTtfb} ms`}
              accent={ttfbAccent(totalTtfb)}
            />
            <Stat
              label="Final status"
              value={finalHop?.status ?? '—'}
              accent={
                finalHop && finalHop.status >= 200 && finalHop.status < 300
                  ? 'oklch(0.6 0.17 150)'
                  : undefined
              }
            />
          </div>
          {loop ? (
            <div className="flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-400">
              <AlertTriangle className="size-4" />
              <span className="font-medium">Redirect loop detected</span>
              <span className="text-rose-700/80 dark:text-rose-400/80">
                — a URL in the chain appears more than once.
              </span>
            </div>
          ) : null}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Route className="size-4" />
                Redirect chain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[28rem]">
                <ol className="space-y-1">
                  {data.chain.map((hop, i) => {
                    const isLast = i === data.chain.length - 1
                    const isRedirect =
                      hop.status >= 300 && hop.status < 400
                    return (
                      <li key={`${hop.url}-${i}`} className="space-y-1">
                        <div className="flex flex-wrap items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {i + 1}
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Badge className={statusBadgeClass(hop.status)}>
                                {hop.status}
                              </Badge>
                              {isRedirect ? (
                                <Badge variant="outline" className="gap-1">
                                  <GitBranch className="size-3" />
                                  redirect
                                </Badge>
                              ) : isLast ? (
                                <Badge
                                  variant="outline"
                                  className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                >
                                  final
                                </Badge>
                              ) : null}
                              <Badge variant="secondary" className="font-mono">
                                {hop.ttfbMs} ms
                              </Badge>
                            </div>
                            <div className="break-all font-mono text-xs">
                              {hop.url}
                            </div>
                            {hop.location ? (
                              <div className="break-all font-mono text-[11px] text-muted-foreground">
                                → {hop.location}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        {!isLast ? (
                          <div className="flex justify-center py-0.5">
                            <ArrowDown className="size-3.5 text-muted-foreground/60" />
                          </div>
                        ) : null}
                      </li>
                    )
                  })}
                </ol>
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}