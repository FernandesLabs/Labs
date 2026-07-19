'use client'
import * as React from 'react'
import { AlertTriangle, Info, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
interface CanonicalResult {
  canonical: string
  changes: string[]
  removedParams: string[]
  tag: string
}
const TRACKING_PREFIXES = ['utm_', 'gclid', 'fbclid', 'ref', 'mc_', 'igshid', '_hsenc', '_hsmi', 'vero_id', 'yclid', 'msclkid', 'dclid', 'twclid', 'li_fat_id', 'pk_']
function isTrackingParam(name: string): boolean {
  const lower = name.toLowerCase()
  return TRACKING_PREFIXES.some((p) => p.endsWith('_') ? lower.startsWith(p) : lower === p)
}
function normalizeUrl(input: string): CanonicalResult | null {
  let u: URL
  try {
    u = new URL(input.trim())
  } catch {
    return null
  }
  const changes: string[] = []
  const removedParams: string[] = []
  // Lowercase scheme + host
  if (u.protocol !== u.protocol.toLowerCase()) {
    changes.push(`Scheme lowercased: ${u.protocol} → ${u.protocol.toLowerCase()}`)
    u.protocol = u.protocol.toLowerCase()
  }
  if (u.hostname !== u.hostname.toLowerCase()) {
    changes.push(`Host lowercased: ${u.hostname} → ${u.hostname.toLowerCase()}`)
    u.hostname = u.hostname.toLowerCase()
  }
  // Remove default port
  const isDefaultPort =
    (u.protocol === 'http:' && u.port === '80') ||
    (u.protocol === 'https:' && u.port === '443')
  if (isDefaultPort) {
    changes.push(`Default port :${u.port} removed`)
    u.port = ''
  }
  // Remove tracking params + collect them
  const toDelete: string[] = []
  u.searchParams.forEach((_, key) => {
    if (isTrackingParam(key)) {
      toDelete.push(key)
      removedParams.push(key)
    }
  })
  toDelete.forEach((k) => u.searchParams.delete(k))
  if (removedParams.length > 0) {
    changes.push(`Removed ${removedParams.length} tracking param(s): ${removedParams.join(', ')}`)
  }
  // Sort query params alphabetically
  const sorted = Array.from(u.searchParams.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  )
  const beforeSort = u.searchParams.toString()
  u.search = ''
  sorted.forEach(([k, v]) => u.searchParams.append(k, v))
  if (beforeSort !== u.searchParams.toString()) {
    changes.push('Query parameters sorted alphabetically')
  }
  // Remove fragment
  if (u.hash) {
    changes.push(`Fragment "${u.hash}" removed`)
    u.hash = ''
  }
  // Remove trailing slash (but keep root '/')
  if (u.pathname.length > 1 && u.pathname.endsWith('/')) {
    const before = u.pathname
    u.pathname = u.pathname.replace(/\/+$/, '')
    changes.push(`Trailing slash removed: ${before} → ${u.pathname}`)
  }
  const canonical = u.toString()
  const tag = `<link rel="canonical" href="${canonical}" />`
  if (changes.length === 0) {
    changes.push('URL was already in canonical form.')
  }
  return { canonical, changes, removedParams, tag }
}
const SAMPLES = [
  'https://Example.com/blog/sustainable-coffee/?utm_source=newsletter&fbclid=abc123&utm_medium=email&ref=welcome#top',
  'http://www.example.com:80/products/?gclid=xyz&utm_campaign=launch&q=coffee&sort=price',
  'https://shop.example.com/item/123/',
]
export default function CanonicalUrlChecker(): React.JSX.Element {
  const [input, setInput] = React.useState(SAMPLES[0])
  const result = React.useMemo<CanonicalResult | null>(() => {
    if (!input.trim()) return null
    return normalizeUrl(input)
  }, [input])
  const handleCheck = (): void => {
    if (!input.trim()) {
      toast.error('Enter a URL to canonicalize')
      return
    }
    if (!result) {
      toast.error('Invalid URL — must include scheme (http/https) and host')
    } else {
      toast.success('URL canonicalized')
    }
  }
  const canonical = result?.canonical ?? ''
  const tag = result?.tag ?? ''
  const changes = result?.changes ?? []
  const removed = result?.removedParams ?? []
  const changed = canonical && canonical !== input.trim()
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Canonical URL Checker</CardTitle>
          <CardDescription>
            Normalize a URL into its canonical form. Browsers cannot fetch
            arbitrary cross-origin pages (CORS), so this tool performs
            client-side canonicalization: lowercases scheme + host, removes
            default ports and tracking parameters (utm_*, gclid, fbclid, ref,
            etc.), sorts query parameters, drops fragments, and strips
            trailing slashes. Also generates the{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              &lt;link rel=&quot;canonical&quot;&gt;
            </code>{' '}
            tag.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="URL to canonicalize" htmlFor="cu-input" hint="http or https">
            <Input
              id="cu-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://Example.com/blog/post/?utm_source=newsletter#top"
              type="url"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleCheck} className="bg-primary text-primary-foreground">
              Canonicalize
            </Button>
            {SAMPLES.map((s, i) => (
              <Button
                key={s}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInput(s)}
              >
                Sample {i + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      {input.trim() && !result ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-400"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>
            That doesn&apos;t look like a valid URL. Make sure it includes the
            scheme (e.g. <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">https://</code>) and a host.
          </span>
        </div>
      ) : null}
      {result ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Input length" value={input.length} />
            <Stat label="Canonical length" value={canonical.length} />
            <Stat
              label="Removed params"
              value={removed.length}
              accent={removed.length > 0 ? 'oklch(0.7 0.18 75)' : undefined}
            />
            <Stat
              label="Changed"
              value={changed ? 'Yes' : 'No'}
              accent={changed ? 'oklch(0.7 0.18 75)' : 'oklch(0.6 0.17 150)'}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Diff</CardTitle>
              <CardDescription>
                Step-by-step list of every normalization applied.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                <code className="rounded bg-muted px-2 py-1 font-mono text-xs break-all">
                  {input.trim()}
                </code>
                <ArrowRight className="size-4 text-muted-foreground" />
                <code className="rounded bg-emerald-500/10 px-2 py-1 font-mono text-xs break-all text-emerald-700 dark:text-emerald-400">
                  {canonical}
                </code>
              </div>
              <ul className="space-y-1.5 text-sm">
                {changes.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5 font-mono text-[10px]">
                      {i + 1}
                    </Badge>
                    <span className="text-muted-foreground">{c}</span>
                  </li>
                ))}
              </ul>
              {removed.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {removed.map((p, i) => (
                    <Badge key={`${p}-${i}`} variant="secondary" className="font-mono text-xs text-rose-600 dark:text-rose-400">
                      {p}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
          <ResultBox
            value={canonical}
            label="Canonical URL"
            rows={2}
            downloadName="canonical-url.txt"
          />
          <ResultBox
            value={tag}
            label="HTML tag"
            rows={2}
            downloadName="canonical-tag.html"
          />
        </>
      ) : (
        <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <span>Enter a URL above to see its canonical form and the changes applied.</span>
        </div>
      )}
    </div>
  )
}