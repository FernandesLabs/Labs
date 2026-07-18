'use client'

import * as React from 'react'
import { Loader2, Lock, Search, ShieldCheck, ShieldAlert } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Field, Stat } from '@/lib/tools/tool-ui'

interface SslCertSubject {
  CN?: string
  O?: string
  OU?: string
  C?: string
  ST?: string
  L?: string
}

interface SslCipher {
  name?: string
  version?: string
}

interface SslResponse {
  ok: boolean
  error?: string
  protocol?: string
  authorized?: boolean
  cipher?: SslCipher | null
  subject?: SslCertSubject | null
  issuer?: SslCertSubject | null
  validFrom?: string
  validTo?: string
  serialNumber?: string
  fingerprint?: string
  san?: string
  daysRemaining?: number
}

/** Parse the comma-separated `subjectaltname` string from a Node TLS cert. */
function parseSans(san?: string): string[] {
  if (!san) return []
  // Format: "DNS:example.com, DNS:*.example.com, IP Address:1.2.3.4"
  return san
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
}

/** Format an OpenSSL date string like "Oct 1 23:59:59 2024 GMT" nicely. */
function formatDate(raw?: string): string {
  if (!raw) return '—'
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

function daysRemainingAccent(days: number | undefined): string | undefined {
  if (days === undefined) return undefined
  if (days < 0) return 'oklch(0.6 0.22 25)'
  if (days < 7) return 'oklch(0.6 0.22 25)'
  if (days < 30) return 'oklch(0.7 0.18 75)'
  return 'oklch(0.6 0.17 150)'
}

async function fetchSsl(
  host: string,
  signal: AbortSignal
): Promise<SslResponse> {
  const url = `/api/network?op=ssl&host=${encodeURIComponent(host)}`
  const res = await fetch(url, { signal })
  return (await res.json()) as SslResponse
}

export default function SslChecker(): React.JSX.Element {
  const [host, setHost] = React.useState('example.com')
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<SslResponse | null>(null)
  const controllerRef = React.useRef<AbortController | null>(null)

  const check = React.useCallback(
    async (override?: string) => {
      const target = (override ?? host)
        .trim()
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '')
      if (!target) {
        toast.error('Enter a hostname')
        return
      }
      if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(target)) {
        toast.error('Enter a valid hostname (e.g. example.com)')
        return
      }
      if (controllerRef.current) controllerRef.current.abort()
      const controller = new AbortController()
      controllerRef.current = controller
      const timeout = setTimeout(() => controller.abort(), 15000)
      setLoading(true)
      try {
        const result = await fetchSsl(target, controller.signal)
        if (!result.ok) {
          toast.error(result.error || 'SSL check failed')
          setData(null)
          return
        }
        setData(result)
      } catch (e) {
        if ((e as Error).name === 'AbortError') {
          toast.error('Request timed out (15s)')
        } else {
          toast.error('Network error during SSL check')
        }
      } finally {
        clearTimeout(timeout)
        setLoading(false)
      }
    },
    [host]
  )

  React.useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort()
    }
  }, [])

  const sans = React.useMemo(() => parseSans(data?.san), [data])

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>SSL Certificate Checker</CardTitle>
          <CardDescription>
            Inspect the TLS/SSL certificate served on port 443 of any
            hostname. Shows protocol, cipher, subject/issuer, validity
            window, days remaining, serial, fingerprint, and SANs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Hostname" htmlFor="ssl-host" hint="e.g. example.com">
            <Input
              id="ssl-host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="example.com"
              onKeyDown={(e) => {
                if (e.key === 'Enter') void check()
              }}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
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
            Check certificate
          </Button>
        </CardContent>
      </Card>

      {data ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2 text-base">
              <Lock className="size-4" />
              <span className="font-mono">{host}</span>
              {data.authorized ? (
                <Badge className="border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="size-3" />
                  Valid
                </Badge>
              ) : (
                <Badge className="border-transparent bg-rose-500/15 text-rose-700 dark:text-rose-400">
                  <ShieldAlert className="size-3" />
                  Invalid
                </Badge>
              )}
            </CardTitle>
            {data.protocol ? (
              <CardDescription>
                Negotiated protocol:{' '}
                <span className="font-mono text-xs">{data.protocol}</span>
                {data.cipher?.name ? (
                  <>
                    {' '}
                    · cipher:{' '}
                    <span className="font-mono text-xs">
                      {data.cipher.name}
                    </span>
                  </>
                ) : null}
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat
                label="Days remaining"
                value={
                  data.daysRemaining !== undefined
                    ? data.daysRemaining < 0
                      ? `${Math.abs(data.daysRemaining)}d ago`
                      : `${data.daysRemaining}d`
                    : '—'
                }
                accent={daysRemainingAccent(data.daysRemaining)}
              />
              <Stat label="Protocol" value={data.protocol ?? '—'} />
              <Stat
                label="Authorized"
                value={data.authorized ? 'Yes' : 'No'}
                accent={
                  data.authorized ? 'oklch(0.6 0.17 150)' : 'oklch(0.6 0.22 25)'
                }
              />
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Subject
                </h3>
                <dl className="space-y-1 text-sm">
                  <DetailRow
                    label="Common Name"
                    value={data.subject?.CN}
                  />
                  <DetailRow
                    label="Organization"
                    value={data.subject?.O}
                  />
                  <DetailRow
                    label="Org. Unit"
                    value={data.subject?.OU}
                  />
                  <DetailRow
                    label="Country"
                    value={data.subject?.C}
                  />
                </dl>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Issuer
                </h3>
                <dl className="space-y-1 text-sm">
                  <DetailRow
                    label="Common Name"
                    value={data.issuer?.CN}
                  />
                  <DetailRow
                    label="Organization"
                    value={data.issuer?.O}
                  />
                  <DetailRow
                    label="Org. Unit"
                    value={data.issuer?.OU}
                  />
                  <DetailRow
                    label="Country"
                    value={data.issuer?.C}
                  />
                </dl>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Stat label="Valid from" value={formatDate(data.validFrom)} />
              <Stat label="Valid to" value={formatDate(data.validTo)} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Serial number
                </div>
                <div className="mt-1 break-all font-mono text-xs">
                  {data.serialNumber ?? '—'}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Fingerprint
                </div>
                <div className="mt-1 break-all font-mono text-xs">
                  {data.fingerprint ?? '—'}
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                Subject Alternative Names ({sans.length})
              </h3>
              {sans.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No SANs present on this certificate.
                </p>
              ) : (
                <ScrollArea className="max-h-48">
                  <div className="flex flex-wrap gap-1.5">
                    {sans.map((s, i) => (
                      <Badge
                        key={`${s}-${i}`}
                        variant="outline"
                        className="font-mono text-xs"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value?: string
}): React.JSX.Element {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="break-all text-right font-mono text-xs">
        {value ?? '—'}
      </dd>
    </div>
  )
}
