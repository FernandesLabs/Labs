/// <reference types="bun-types" />
import { describe, expect, mock, test } from 'bun:test'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/network/route'
import { lookupIp } from '@/lib/network/ip-lookup'

function request(ip = '', headers: HeadersInit = {}): Request {
  return new Request(`https://www.fernandeslabs.com/api/network?op=ip&ip=${encodeURIComponent(ip)}`, { headers })
}

function dependencies() {
  // Inject isolated fakes; never replace global fetch or mock Node modules,
  // which could leak into unrelated tests in Bun's shared process.
  const fetchIp = mock(async (url: string, init: RequestInit) => {
    expect(init.cache).toBe('no-store')
    return Response.json({ ip: decodeURIComponent(new URL(url).pathname.split('/')[1]), country_name: 'Example' })
  })
  const resolveHostname = mock(async (hostname: string) => {
    expect(hostname).toBe('example.com')
    return { address: '203.0.113.4' }
  })
  return { fetch: fetchIp, resolveHostname }
}

describe('IP lookup target selection', () => {
  test('Use my IP looks up the first forwarded visitor address, never the server', async () => {
    const deps = dependencies()
    const res = await lookupIp(request('', { 'x-forwarded-for': '203.0.113.10, 10.0.0.1' }), deps)
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ ok: true, ip: '203.0.113.10' })
    expect(deps.fetch.mock.calls[0][0]).toBe('https://ipapi.co/203.0.113.10/json/')
    expect(deps.resolveHostname).not.toHaveBeenCalled()
  })

  test('X-Real-IP is used when a valid forwarded address is unavailable', async () => {
    for (const forwarded of ['', 'unknown']) {
      const deps = dependencies()
      const res = await lookupIp(request('', { 'x-forwarded-for': forwarded, 'x-real-ip': '2001:db8::2' }), deps)
      expect(await res.json()).toMatchObject({ ok: true, ip: '2001:db8::2' })
      expect(deps.resolveHostname).not.toHaveBeenCalled()
    }
  })

  test('missing or invalid caller headers return an error without upstream requests', async () => {
    const headerCases: HeadersInit[] = [{}, { 'x-forwarded-for': 'not-an-ip, 203.0.113.10' }, { 'x-real-ip': '999.1.1.1' }]
    for (const headers of headerCases) {
      const deps = dependencies()
      const res = await lookupIp(request('', headers), deps)
      expect(res.status).toBe(400)
      expect(await res.json()).toMatchObject({ ok: false, error: expect.stringContaining('Could not detect your public IP') })
      expect(deps.fetch).not.toHaveBeenCalled()
      expect(deps.resolveHostname).not.toHaveBeenCalled()
    }
    // Verify op=ip delegates to the same behavior in the real Next route.
    const routeRes = await GET(new NextRequest(request()))
    expect(routeRes.status).toBe(400)
    expect(await routeRes.json()).toMatchObject({ ok: false })
  })

  test('explicit IPv4 and IPv6 addresses override caller headers and bypass DNS', async () => {
    for (const address of ['8.8.8.8', '2606:4700:4700::1111', '::ffff:192.0.2.1']) {
      const deps = dependencies()
      const res = await lookupIp(request(` ${address} `, { 'x-forwarded-for': '203.0.113.10' }), deps)
      expect(await res.json()).toMatchObject({ ok: true, ip: address })
      expect(deps.fetch.mock.calls[0][0]).toBe(`https://ipapi.co/${encodeURIComponent(address)}/json/`)
      expect(deps.resolveHostname).not.toHaveBeenCalled()
    }
  })

  test('hostnames are resolved before the IP-only geolocation request', async () => {
    const deps = dependencies()
    const res = await lookupIp(request('example.com'), deps)
    expect(await res.json()).toMatchObject({ ok: true, ip: '203.0.113.4' })
    expect(deps.resolveHostname).toHaveBeenCalledWith('example.com')
    expect(deps.fetch.mock.calls[0][0]).toBe('https://ipapi.co/203.0.113.4/json/')
  })

  test('a hostname can resolve to IPv6', async () => {
    const deps = dependencies()
    const res = await lookupIp(request('example.com'), {
      ...deps,
      resolveHostname: async () => ({ address: '2001:db8::3' }),
    })
    expect(await res.json()).toMatchObject({ ok: true, ip: '2001:db8::3' })
    expect(deps.fetch.mock.calls[0][0]).toBe('https://ipapi.co/2001%3Adb8%3A%3A3/json/')
  })

  test('malformed addresses, URLs and paths fail before DNS or fetch', async () => {
    for (const input of ['999.1.1.1', '1.2.3', '2001:::1', 'https://example.com', 'example.com/path', 'example.com:443', 'example.com?x=1']) {
      const deps = dependencies()
      const res = await lookupIp(request(input), deps)
      expect(res.status, input).toBe(400)
      expect(await res.json()).toMatchObject({ ok: false })
      expect(deps.fetch).not.toHaveBeenCalled()
      expect(deps.resolveHostname).not.toHaveBeenCalled()
    }
  })

  test('DNS errors and invalid resolved addresses return a useful failure', async () => {
    const deps = dependencies()
    const failed = await lookupIp(request('example.com'), {
      ...deps,
      resolveHostname: async () => { throw new Error('ENOTFOUND') },
    })
    expect(failed.status).toBe(502)
    expect(await failed.json()).toMatchObject({ ok: false, error: expect.stringContaining('Could not resolve') })
    const invalid = await lookupIp(request('example.com'), {
      ...deps,
      resolveHostname: async () => ({ address: 'bad-address' }),
    })
    expect(invalid.status).toBe(502)
    expect(deps.fetch).not.toHaveBeenCalled()
  })
})

describe('IP lookup upstream failures', () => {
  test('HTTP failures and HTTP 200 error payloads never report success', async () => {
    for (const upstream of [new Response(null, { status: 429 }), Response.json({ error: true, reason: 'RateLimited' })]) {
      const res = await lookupIp(request('8.8.8.8'), { fetch: async () => upstream })
      expect(res.status).toBe(502)
      expect(await res.json()).toMatchObject({ ok: false, error: expect.any(String) })
    }
  })

  test('network failures are returned without exposing internal details', async () => {
    const res = await lookupIp(request('8.8.8.8'), {
      fetch: async () => { throw new Error('internal transport detail') },
    })
    expect(res.status).toBe(502)
    expect(await res.json()).toEqual({ ok: false, error: 'IP lookup is temporarily unavailable. Please try again.' })
  })
})
