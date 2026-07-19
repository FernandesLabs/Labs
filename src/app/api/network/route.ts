import { NextRequest, NextResponse } from 'next/server'
/**
 * Network tools API proxy.
 *
 * Browser-side tools can't reach DNS/SSL/HTTP endpoints directly due to CORS,
 * so this server route fetches them and returns JSON. All processing happens
 * server-side; the browser tool only displays results.
 *
 * Endpoints (via ?op=...):
 *  - dns      ?domain=example.com&type=A|AAAA|MX|TXT|NS|CNAME|SOA|CAA
 *  - ip       ?ip=8.8.8.8            (omit ip to look up the caller's IP)
 *  - headers  ?url=https://example.com
 *  - ssl      ?host=example.com
 *  - ping     ?url=https://example.com   (measures TTFB via fetch)
 *  - redirect ?url=https://example.com   (follows redirect chain)
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const UA = 'FernandesLabs-ToolNetwork/1.0 (+https://fernandeslabs.com)'
function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}
function isValidDomain(d: string): boolean {
  return /^(?=.{1,253}$)([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(
    d
  )
}
function isValidHost(h: string): boolean {
  return isValidDomain(h) || /^\d{1,3}(\.\d{1,3}){3}$/.test(h)
}
function isValidHttpUrl(u: string): boolean {
  try {
    const url = new URL(u)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
/** DNS lookup via Google DoH JSON API. */
async function opDns(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain')?.trim() ?? ''
  const type = (req.nextUrl.searchParams.get('type')?.trim() || 'A').toUpperCase()
  if (!domain) return bad('Missing "domain" parameter')
  if (!isValidDomain(domain)) return bad('Invalid domain')
  const allowed = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'CAA']
  if (!allowed.includes(type)) return bad(`Type must be one of: ${allowed.join(', ')}`)
  const dohUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`
  const res = await fetch(dohUrl, {
    headers: { accept: 'application/dns-json', 'user-agent': UA },
    cache: 'no-store',
  })
  if (!res.ok) return bad(`DNS resolver returned ${res.status}`, 502)
  const data = await res.json()
  return NextResponse.json({ ok: true, ...data })
}
/** IP geolocation via ipapi.co (server-side, no CORS issue). */
async function opIp(req: NextRequest) {
  const ip = req.nextUrl.searchParams.get('ip')?.trim() ?? ''
  const target = ip || ''
  if (target && !isValidHost(target)) return bad('Invalid IP address')
  const url = target
    ? `https://ipapi.co/${encodeURIComponent(target)}/json/`
    : `https://ipapi.co/json/`
  const res = await fetch(url, {
    headers: { 'user-agent': UA },
    cache: 'no-store',
  })
  if (!res.ok) return bad(`IP lookup returned ${res.status}`, 502)
  const data = await res.json()
  return NextResponse.json({ ok: true, ...data })
}
/** HTTP response headers for a URL. */
async function opHeaders(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')?.trim() ?? ''
  if (!url) return bad('Missing "url" parameter')
  if (!isValidHttpUrl(url)) return bad('Invalid URL (must be http/https)')
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'manual',
    headers: { 'user-agent': UA },
    cache: 'no-store',
  })
  const headers: Record<string, string> = {}
  res.headers.forEach((v, k) => {
    headers[k] = v
  })
  return NextResponse.json({
    ok: true,
    status: res.status,
    statusText: res.statusText,
    headers,
    redirected: res.redirected,
    finalUrl: res.url || url,
  })
}
/** SSL/TLS certificate info via the tls module. */
async function opSsl(req: NextRequest) {
  const host = req.nextUrl.searchParams.get('host')?.trim() ?? ''
  if (!host) return bad('Missing "host" parameter')
  if (!isValidDomain(host)) return bad('Invalid host (must be a domain)')
  const tls = await import('tls')
  return new Promise<Response>((resolve) => {
    const socket = tls.connect(
      { host, port: 443, servername: host, rejectUnauthorized: false },
      () => {
        const cert = socket.getPeerCertificate()
        const protocol = socket.getProtocol()
        const authorized = socket.authorized
        socket.end()
        if (!cert || Object.keys(cert).length === 0) {
          resolve(
            NextResponse.json(
              { ok: false, error: 'No certificate returned' },
              { status: 502 }
            )
          )
          return
        }
        resolve(
          NextResponse.json({
            ok: true,
            protocol,
            authorized,
            cipher: socket.getCipher(),
            subject: cert.subject,
            issuer: cert.issuer,
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
            serialNumber: cert.serialNumber,
            fingerprint: cert.fingerprint,
            san: cert.subjectaltname,
            daysRemaining: Math.floor(
              (new Date(cert.valid_to).getTime() - Date.now()) / 86400000
            ),
          })
        )
      }
    )
    socket.setTimeout(8000, () => {
      socket.destroy()
      resolve(bad('Connection timed out', 504))
    })
    socket.on('error', (err) => {
      resolve(bad(`TLS error: ${err.message}`, 502))
    })
  })
}
/** "Ping" via fetch — measures TTFB (time to first byte). */
async function opPing(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')?.trim() ?? ''
  if (!url) return bad('Missing "url" parameter')
  if (!isValidHttpUrl(url)) return bad('Invalid URL')
  const start = Date.now()
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'user-agent': UA },
      cache: 'no-store',
    })
    const ttfb = Date.now() - start
    return NextResponse.json({
      ok: true,
      status: res.status,
      statusText: res.statusText,
      ttfbMs: ttfb,
      finalUrl: res.url,
    })
  } catch (e) {
    return bad(`Fetch failed: ${e instanceof Error ? e.message : 'unknown'}`, 502)
  }
}
/** Follow a redirect chain and report each hop. */
async function opRedirect(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')?.trim() ?? ''
  if (!url) return bad('Missing "url" parameter')
  if (!isValidHttpUrl(url)) return bad('Invalid URL')
  const chain: { url: string; status: number; location?: string; ttfbMs: number }[] =
    []
  let current = url
  const maxHops = 20
  for (let i = 0; i < maxHops; i++) {
    const start = Date.now()
    let res: Response
    try {
      res = await fetch(current, {
        method: 'GET',
        redirect: 'manual',
        headers: { 'user-agent': UA },
        cache: 'no-store',
      })
    } catch (e) {
      return bad(
        `Fetch failed at hop ${i + 1}: ${
          e instanceof Error ? e.message : 'unknown'
        }`,
        502
      )
    }
    const ttfb = Date.now() - start
    const location = res.headers.get('location') ?? undefined
    chain.push({ url: current, status: res.status, location, ttfbMs: ttfb })
    if (res.status >= 300 && res.status < 400 && location) {
      try {
        current = new URL(location, current).toString()
      } catch {
        break
      }
    } else {
      break
    }
  }
  return NextResponse.json({ ok: true, chain, hops: chain.length })
}
export async function GET(req: NextRequest) {
  const op = req.nextUrl.searchParams.get('op')?.trim() ?? ''
  try {
    switch (op) {
      case 'dns':
        return await opDns(req)
      case 'ip':
        return await opIp(req)
      case 'headers':
        return await opHeaders(req)
      case 'ssl':
        return await opSsl(req)
      case 'ping':
        return await opPing(req)
      case 'redirect':
        return await opRedirect(req)
      default:
        return bad(
          'Unknown op. Use one of: dns, ip, headers, ssl, ping, redirect'
        )
    }
  } catch (e) {
    return bad(
      `Server error: ${e instanceof Error ? e.message : 'unknown'}`,
      500
    )
  }
}