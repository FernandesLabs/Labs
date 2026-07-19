'use client'
import * as React from 'react'
import { Loader2, Search, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { Field, Stat } from '@/lib/tools/tool-ui'
interface HeadersResponse {
  ok: boolean
  error?: string
  status: number
  statusText: string
  headers: Record<string, string>
  redirected?: boolean
  finalUrl: string
}
/** HTTP security headers worth flagging in the UI. */
const SECURITY_HEADERS = new Set<string>([
  'content-security-policy',
  'strict-transport-security',
  'x-frame-options',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
  'cross-origin-embedder-policy',
  'cross-origin-resource-policy',
])
function statusAccent(status: number): string | undefined {
  if (status >= 200 && status < 300) return 'oklch(0.6 0.17 150)'
  if (status >= 300 && status < 400) return 'oklch(0.6 0.15 230)'
  if (status >= 400 && status < 500) return 'oklch(0.7 0.18 75)'
  if (status >= 500) return 'oklch(0.6 0.22 25)'
  return undefined
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
  return ''
}
async function fetchHeaders(
  url: string,
  signal: AbortSignal
): Promise<HeadersResponse> {
  const api = `/api/network?op=headers&url=${encodeURIComponent(url)}`
  const res = await fetch(api, { signal })
  return (await res.json()) as HeadersResponse
}
export default function HttpHeaderChecker(): React.JSX.Element {
  const [url, setUrl] = React.useState('https://example.com')
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<HeadersResponse | null>(null)
  const controllerRef = React.useRef<AbortController | null>(null)
  const check = React.useCallback(
    async (override?: string) => {
      const target = (override ?? url).trim()
      if (!target) {
        toast.error('Enter a URL')
        return
      }
      let parsed: URL
      try {
        parsed = new URL(target)
      } catch {
        toast.error('That doesn’t look like a valid URL')
        return
      }
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        toast.error('URL must use http or https')
        return
      }
      if (controllerRef.current) controllerRef.current.abort()
      const controller = new AbortController()
      controllerRef.current = controller
      const timeout = setTimeout(() => controller.abort(), 15000)
      setLoading(true)
      try {
        const result = await fetchHeaders(target, controller.signal)
        if (!result.ok) {
          toast.error(result.error || 'Header check failed')
          setData(null)
          return
        }
        setData(result)
      } catch (e) {
        if ((e as Error).name === 'AbortError') {
          toast.error('Request timed out (15s)')
        } else {
          toast.error('Network error during header check')
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
  const headerRows = React.useMemo(() => {
    if (!data) return []
    return Object.entries(data.headers)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, value]) => ({
        name,
        value,
        secure: SECURITY_HEADERS.has(name.toLowerCase()),
      }))
  }, [data])
  const secureCount = headerRows.filter((h) => h.secure).length
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>HTTP Header Checker</CardTitle>
          <CardDescription>
            Fetch the HTTP response headers for any URL. Status codes are
            colour-coded and key security headers (CSP, HSTS,
            X-Frame-Options, etc.) are highlighted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="URL" htmlFor="hdr-url" hint="http(s)://…">
            <Input
              id="hdr-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => {
                if (e.key === 'Enter') void check()
              }}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              type="url"
            />
          </Field>
          <Button
            type="button"
            onClick={() => void check()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            Check headers
          </Button>
        </CardContent>
      </Card>
      {data ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              label="Status"
              value={`${data.status} ${data.statusText}`.trim()}
              accent={statusAccent(data.status)}
            />
            <Stat label="Headers" value={headerRows.length} />
            <Stat
              label="Security"
              value={secureCount}
              accent={
                secureCount > 0 ? 'oklch(0.6 0.17 150)' : undefined
              }
            />
            <Stat
              label="Redirected"
              value={data.redirected ? 'Yes' : 'No'}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                <span>Response headers</span>
                <Badge className={statusBadgeClass(data.status)}>
                  {data.status}
                </Badge>
                {data.redirected ? (
                  <Badge variant="outline">redirected</Badge>
                ) : null}
              </CardTitle>
              {data.finalUrl && data.finalUrl !== url ? (
                <CardDescription className="font-mono text-xs break-all">
                  Final URL: {data.finalUrl}
                </CardDescription>
              ) : null}
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Header</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {headerRows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="text-muted-foreground"
                        >
                          No headers returned.
                        </TableCell>
                      </TableRow>
                    ) : (
                      headerRows.map((h) => (
                        <TableRow key={h.name}>
                          <TableCell className="font-mono text-xs">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span>{h.name}</span>
                              {h.secure ? (
                                <Badge
                                  variant="outline"
                                  className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                >
                                  <ShieldCheck className="size-3" />
                                  security
                                </Badge>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs break-all">
                            {h.value}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}