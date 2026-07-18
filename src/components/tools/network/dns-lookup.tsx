'use client'

import * as React from 'react'
import { Loader2, Search } from 'lucide-react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

type RecordType = 'A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CNAME' | 'SOA' | 'CAA'

const TYPES: RecordType[] = [
  'A',
  'AAAA',
  'MX',
  'TXT',
  'NS',
  'CNAME',
  'SOA',
  'CAA',
]

/** Map numeric DNS record type → human name. */
const TYPE_NAME: Record<number, string> = {
  1: 'A',
  2: 'NS',
  5: 'CNAME',
  6: 'SOA',
  15: 'MX',
  16: 'TXT',
  28: 'AAAA',
  257: 'CAA',
}

interface DnsAnswer {
  name: string
  type: number
  TTL: number
  data: string
}

interface DnsResponse {
  ok: boolean
  error?: string
  Status?: number
  Answer?: DnsAnswer[]
  Authority?: DnsAnswer[]
  Comment?: string
}

const SAMPLE_DOMAINS = ['example.com', 'google.com', 'cloudflare.com']

async function fetchDns(
  domain: string,
  type: RecordType,
  signal: AbortSignal
): Promise<DnsResponse> {
  const url = `/api/network?op=dns&domain=${encodeURIComponent(domain)}&type=${type}`
  const res = await fetch(url, { signal })
  return (await res.json()) as DnsResponse
}

export default function DnsLookup(): React.JSX.Element {
  const [domain, setDomain] = React.useState('example.com')
  const [type, setType] = React.useState<RecordType>('A')
  const [loading, setLoading] = React.useState(false)
  const [answers, setAnswers] = React.useState<DnsAnswer[]>([])
  const [status, setStatus] = React.useState<number | null>(null)
  const [hasResult, setHasResult] = React.useState(false)

  const controllerRef = React.useRef<AbortController | null>(null)

  const lookup = React.useCallback(
    async (override?: { domain?: string; type?: RecordType }) => {
      const d = (override?.domain ?? domain).trim()
      const t = override?.type ?? type
      if (!d) {
        toast.error('Enter a domain to look up')
        return
      }
      // Basic domain sanity check.
      if (!/^[a-zA-Z0-9.-]+$/.test(d) || !d.includes('.')) {
        toast.error('That doesn’t look like a valid domain')
        return
      }
      if (controllerRef.current) controllerRef.current.abort()
      const controller = new AbortController()
      controllerRef.current = controller
      const timeout = setTimeout(() => controller.abort(), 15000)
      setLoading(true)
      setHasResult(false)
      try {
        const data = await fetchDns(d, t, controller.signal)
        if (!data.ok) {
          toast.error(data.error || 'DNS lookup failed')
          setAnswers([])
          setStatus(null)
          setHasResult(true)
          return
        }
        setStatus(typeof data.Status === 'number' ? data.Status : null)
        const rows = data.Answer ?? []
        setAnswers(rows)
        setHasResult(true)
        if (rows.length === 0) {
          toast.info(`No ${t} records found for ${d}`)
        }
      } catch (e) {
        if ((e as Error).name === 'AbortError') {
          toast.error('Lookup timed out (15s)')
        } else {
          toast.error('Network error during lookup')
        }
      } finally {
        clearTimeout(timeout)
        setLoading(false)
      }
    },
    [domain, type]
  )

  React.useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort()
    }
  }, [])

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>DNS Lookup</CardTitle>
          <CardDescription>
            Resolve DNS records for any domain via Google&apos;s public
            DNS-over-HTTPS resolver. Supports A, AAAA, MX, TXT, NS, CNAME,
            SOA and CAA record types.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
            <Field label="Domain" htmlFor="dns-domain" hint="e.g. example.com">
              <Input
                id="dns-domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void lookup()
                }}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
            <Field label="Record type" htmlFor="dns-type">
              <Select
                value={type}
                onValueChange={(v) => setType(v as RecordType)}
              >
                <SelectTrigger id="dns-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={() => void lookup()}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
              Lookup
            </Button>
            <span className="text-xs text-muted-foreground">Try:</span>
            {SAMPLE_DOMAINS.map((d) => (
              <Button
                key={d}
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() => {
                  setDomain(d)
                  void lookup({ domain: d })
                }}
              >
                {d}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Records"
          value={answers.length}
          accent={answers.length > 0 ? 'oklch(0.6 0.17 150)' : undefined}
        />
        <Stat
          label="Record type"
          value={type}
        />
        <Stat
          label="DNS status"
          value={status === null ? '—' : status === 0 ? 'NOERROR' : status}
        />
        <Stat label="Resolver" value="Google DoH" />
      </div>

      {hasResult && answers.length === 0 ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          No {type} records returned for{' '}
          <span className="font-mono">{domain}</span>.
        </div>
      ) : null}

      {answers.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Results for{' '}
              <span className="font-mono text-primary">{domain}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">TTL</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {answers.map((a, i) => {
                    const typeName = TYPE_NAME[a.type] ?? `TYPE${a.type}`
                    return (
                      <TableRow key={`${a.name}-${i}`}>
                        <TableCell className="font-mono text-xs">
                          {a.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{typeName}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs tabular-nums">
                          {a.TTL}s
                        </TableCell>
                        <TableCell className="font-mono text-xs break-all">
                          {a.data}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
