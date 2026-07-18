'use client'

import * as React from 'react'
import { Loader2, Globe, MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { Field, Stat } from '@/lib/tools/tool-ui'

interface IpResponse {
  ok: boolean
  error?: string
  ip?: string
  city?: string
  region?: string
  country_name?: string
  country_code?: string
  postal?: string
  timezone?: string
  latitude?: number
  longitude?: number
  org?: string
  asn?: string
  error_msg?: string
  reason?: string
}

/** Convert an ISO 3166-1 alpha-2 country code to a flag emoji. */
function countryFlag(code?: string): string {
  if (!code || code.length !== 2) return ''
  const upper = code.toUpperCase()
  if (!/^[A-Z]{2}$/.test(upper)) return ''
  // Regional indicator symbols start at U+1F1E6 for 'A'.
  const cp = (ch: string): number => 0x1f1e6 + (ch.charCodeAt(0) - 65)
  return String.fromCodePoint(cp(upper[0]!), cp(upper[1]!))
}

async function fetchIp(
  ip: string,
  signal: AbortSignal
): Promise<IpResponse> {
  const url = ip
    ? `/api/network?op=ip&ip=${encodeURIComponent(ip)}`
    : `/api/network?op=ip`
  const res = await fetch(url, { signal })
  return (await res.json()) as IpResponse
}

export default function IpLookup(): React.JSX.Element {
  const [ip, setIp] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<IpResponse | null>(null)
  const controllerRef = React.useRef<AbortController | null>(null)

  const lookup = React.useCallback(
    async (overrideIp?: string) => {
      const target = (overrideIp ?? ip).trim()
      if (target) {
        // Basic IP-or-host sanity check.
        const isIpv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(target)
        const isDomain = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(
          target
        )
        if (!isIpv4 && !isDomain) {
          toast.error('Enter a valid IPv4 address or hostname')
          return
        }
      }
      if (controllerRef.current) controllerRef.current.abort()
      const controller = new AbortController()
      controllerRef.current = controller
      const timeout = setTimeout(() => controller.abort(), 15000)
      setLoading(true)
      try {
        const result = await fetchIp(target, controller.signal)
        if (!result.ok) {
          toast.error(result.error || 'IP lookup failed')
          setData(null)
          return
        }
        // ipapi.co returns 200 with an `error` field on failure.
        if (result.error || result.reason) {
          toast.error(result.error_msg || result.reason || 'IP lookup failed')
          setData(null)
          return
        }
        setData(result)
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
    [ip]
  )

  React.useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort()
    }
  }, [])

  const flag = countryFlag(data?.country_code)
  const lat = data?.latitude
  const lon = data?.longitude
  const mapHref =
    lat !== undefined && lon !== undefined
      ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=10/${lat}/${lon}`
      : null

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>IP Lookup</CardTitle>
          <CardDescription>
            Geolocate any IPv4 address or hostname, or look up your own
            public IP. Returns city, region, country, coordinates, ISP, and
            timezone via ipapi.co.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="IP address or hostname"
            htmlFor="ip-input"
            hint="leave empty for your own IP"
          >
            <div className="flex gap-2">
              <Input
                id="ip-input"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="8.8.8.8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void lookup()
                }}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIp('')
                  void lookup('')
                }}
                disabled={loading}
              >
                Use my IP
              </Button>
            </div>
          </Field>

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
            Look up
          </Button>
        </CardContent>
      </Card>

      {data ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="size-4" />
              <span className="font-mono">{data.ip ?? '—'}</span>
              {flag ? (
                <span aria-hidden="true" className="text-xl leading-none">
                  {flag}
                </span>
              ) : null}
              {data.country_code ? (
                <span className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
                  {data.country_code}
                </span>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label="IP" value={data.ip ?? '—'} />
              <Stat label="City" value={data.city ?? '—'} />
              <Stat label="Region" value={data.region ?? '—'} />
              <Stat
                label="Country"
                value={
                  data.country_name
                    ? `${flag ? `${flag} ` : ''}${data.country_name}`
                    : '—'
                }
              />
              <Stat label="Postal" value={data.postal ?? '—'} />
              <Stat label="Timezone" value={data.timezone ?? '—'} />
              <Stat
                label="Latitude"
                value={
                  data.latitude !== undefined
                    ? data.latitude.toFixed(4)
                    : '—'
                }
              />
              <Stat
                label="Longitude"
                value={
                  data.longitude !== undefined
                    ? data.longitude.toFixed(4)
                    : '—'
                }
              />
              <Stat label="ISP / Org" value={data.org ?? '—'} />
            </div>

            {mapHref ? (
              <div>
                <Button asChild type="button" variant="outline" size="sm">
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="size-4" />
                    View on OpenStreetMap
                  </a>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
