import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

interface IpLookupDependencies {
  fetch: (url: string, init: RequestInit) => Promise<Response>
  resolveHostname: (hostname: string) => Promise<{ address: string }>
}

function error(message: string, status = 400): Response {
  return Response.json({ ok: false, error: message }, { status })
}

function isHostname(value: string): boolean {
  return /^(?=.{1,253}$)([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(value)
}

/** The deployment proxy supplies the visitor address in these headers. */
function callerIp(headers: Headers): string | undefined {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const real = headers.get('x-real-ip')?.trim()
  return [forwarded, real].find((value): value is string => Boolean(value && isIP(value)))
}

/** Resolve a visitor, literal IPv4/IPv6 address or hostname before geolocation. */
export async function lookupIp(
  req: Request,
  dependencies: Partial<IpLookupDependencies> = {}
): Promise<Response> {
  const fetchIp = dependencies.fetch ?? fetch
  const resolveHostname = dependencies.resolveHostname ?? lookup
  const input = new URL(req.url).searchParams.get('ip')?.trim() ?? ''
  let target: string

  if (!input) {
    const visitor = callerIp(req.headers)
    // Calling /json/ without an address would locate this server's outbound
    // connection. Never substitute that address for the visitor's public IP.
    if (!visitor) {
      return error('Could not detect your public IP. Enter an IPv4 or IPv6 address to look it up.')
    }
    target = visitor
  } else if (isIP(input)) {
    target = input
  } else if (isHostname(input)) {
    try {
      target = (await resolveHostname(input)).address
    } catch {
      return error('Could not resolve that hostname to an IP address.', 502)
    }
    if (!isIP(target)) return error('The hostname did not resolve to a valid IP address.', 502)
  } else {
    return error('Enter a valid IPv4 address, IPv6 address or hostname.')
  }

  try {
    const res = await fetchIp(`https://ipapi.co/${encodeURIComponent(target)}/json/`, {
      headers: { 'user-agent': 'FernandesLabs-ToolNetwork/1.0 (+https://fernandeslabs.com)' },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return error(`IP lookup returned ${res.status}`, 502)
    const data = await res.json()
    // ipapi also reports lookup errors in HTTP 200 responses.
    if (data.error) {
      return error(data.reason || data.message || 'IP lookup failed.', 502)
    }
    return Response.json({ ...data, ok: true })
  } catch {
    return error('IP lookup is temporarily unavailable. Please try again.', 502)
  }
}
