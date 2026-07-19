'use client'
import * as React from 'react'
import { Monitor, Smartphone, Tablet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Stat } from '@/lib/tools/tool-ui'
interface ParseResult {
  browser: string
  browserVersion?: string
  os: string
  device: 'desktop' | 'mobile' | 'tablet'
  engine: string
}
function parseUA(ua: string): ParseResult {
  const u = ua || ''
  const empty: ParseResult = {
    browser: 'Unknown',
    os: 'Unknown',
    device: 'desktop',
    engine: 'Unknown',
  }
  if (!u.trim()) return empty
  // Engine
  let engine = 'Unknown'
  if (/Gecko\/\d/.test(u) && /Firefox/.test(u)) engine = 'Gecko'
  else if (/AppleWebKit/.test(u) && /CriOS|Chrome/.test(u)) engine = 'Blink'
  else if (/AppleWebKit/.test(u) && !/Chrome|CriOS/.test(u)) engine = 'WebKit'
  else if (/Trident/.test(u)) engine = 'Trident'
  else if (/Edge?\//.test(u) && /Edg/.test(u)) engine = 'Blink'
  // Browser + version
  let browser = 'Unknown'
  let browserVersion: string | undefined
  const browserRules: { name: string; re: RegExp }[] = [
    { name: 'Edge', re: /Edg(?:A|iOS)?\/([\d.]+)/ },
    { name: 'Opera', re: /OPR\/([\d.]+)/ },
    { name: 'Samsung Internet', re: /SamsungBrowser\/([\d.]+)/ },
    { name: 'Firefox', re: /Firefox\/([\d.]+)/ },
    { name: 'Chrome', re: /(?:Chrome|CriOS)\/([\d.]+)/ },
    { name: 'Safari', re: /Version\/([\d.]+).*Safari/ },
    { name: 'Internet Explorer', re: /(?:MSIE |Trident.*rv:)([\d.]+)/ },
  ]
  for (const rule of browserRules) {
    const m = rule.re.exec(u)
    if (m) {
      browser = rule.name
      browserVersion = m[1]
      break
    }
  }
  // OS
  let os = 'Unknown'
  let osMatch: RegExpExecArray | null = null
  if (/Windows NT 10/.test(u)) os = 'Windows 10/11'
  else if (/Windows NT 6\.3/.test(u)) os = 'Windows 8.1'
  else if (/Windows NT 6\.2/.test(u)) os = 'Windows 8'
  else if (/Windows NT 6\.1/.test(u)) os = 'Windows 7'
  else if (/Windows/.test(u)) os = 'Windows'
  else if ((osMatch = /iPhone OS ([\d_]+)/.exec(u)) || (osMatch = /iPhone;.*OS ([\d_]+)/.exec(u))) {
    os = `iOS ${osMatch[1].replace(/_/g, '.')}`
  } else if (/iPad/.test(u) || /CPU OS ([\d_]+)/.test(u)) {
    osMatch = /CPU OS ([\d_]+)/.exec(u)
    os = osMatch ? `iPadOS ${osMatch[1].replace(/_/g, '.')}` : 'iPadOS'
  } else if (/Mac OS X ([\d_]+)/.test(u)) {
    osMatch = /Mac OS X ([\d_]+)/.exec(u)
    os = osMatch ? `macOS ${osMatch[1].replace(/_/g, '.')}` : 'macOS'
  } else if (/Android ([\d.]+)/.test(u)) {
    osMatch = /Android ([\d.]+)/.exec(u)
    os = osMatch ? `Android ${osMatch[1]}` : 'Android'
  } else if (/CrOS/.test(u)) os = 'ChromeOS'
  else if (/Linux/.test(u)) os = 'Linux'
  else if (/FreeBSD/.test(u)) os = 'FreeBSD'
  // Device type
  let device: ParseResult['device'] = 'desktop'
  if (/iPad|Tablet|PlayBook|Silk/.test(u) || (/Android/.test(u) && !/Mobile/.test(u))) {
    device = 'tablet'
  } else if (/Mobi|iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry|Opera Mini/.test(u)) {
    device = 'mobile'
  }
  return { browser, browserVersion, os, device, engine }
}
const DEVICE_META: Record<
  ParseResult['device'],
  { label: string; icon: typeof Monitor }
> = {
  desktop: { label: 'Desktop', icon: Monitor },
  mobile: { label: 'Mobile', icon: Smartphone },
  tablet: { label: 'Tablet', icon: Tablet },
}
export default function UserAgentParser() {
  const [ua, setUa] = React.useState<string>('')
  React.useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setUa(navigator.userAgent)
    }
  }, [])
  const result = React.useMemo(() => parseUA(ua), [ua])
  const DeviceIcon = DEVICE_META[result.device].icon
  const useMyUA = () => {
    if (typeof navigator !== 'undefined') {
      setUa(navigator.userAgent)
    }
  }
  return (
    <div className="space-y-5">
      <Field label="User-Agent string" htmlFor="ua-input">
        <Textarea
          id="ua-input"
          value={ua}
          onChange={(e) => setUa(e.target.value)}
          rows={4}
          placeholder="Paste a user-agent string…"
          className="font-mono text-xs"
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={useMyUA}
          className="bg-primary text-primary-foreground"
        >
          Use my User-Agent
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setUa('')}
        >
          Clear
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat
          label="Browser"
          value={result.browserVersion ? `${result.browser} ${result.browserVersion}` : result.browser}
        />
        <Stat label="Operating System" value={result.os} />
        <Stat label="Engine" value={result.engine} />
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <DeviceIcon className="size-6" />
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Device type
              </div>
              <div className="font-mono text-lg font-semibold tabular-nums">
                {DEVICE_META[result.device].label}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {ua.trim() ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Raw User-Agent
            </div>
            <p className="mt-1 break-words font-mono text-xs text-foreground/80">
              {ua}
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}