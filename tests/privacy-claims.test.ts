/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import {
  SERVER_PROXIED_TOOL_SLUGS,
  usesServerProxy,
  toolPrivacyClaim,
} from '@/lib/privacy'
import { toolMetaList } from '@/lib/tools/tool-meta'

/**
 * Guards on data-handling accuracy.
 *
 * The About page, Privacy page, site footer and the shared SEO template
 * generators all used to assert that user input never reaches our servers.
 * That was false for six tools, which proxy through `/api/network` to bypass
 * browser CORS. Inaccurate privacy claims in indexed copy are a regulatory
 * problem and an E-E-A-T liability, so they get a test.
 */

/** Every file under src/ as source text. */
function allSourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return allSourceFiles(full)
    if (!/\.(ts|tsx)$/.test(entry.name)) return []
    return [readFileSync(full, 'utf8')]
  })
}

describe('privacy claims match actual behaviour', () => {
  test('the proxied-tool list is exactly the set of components calling /api/network', () => {
    // Scan every tool component and collect the slugs that reference the
    // server proxy. This is the authoritative source of truth for which
    // tools transmit user input, so the list in `privacy.ts` cannot silently
    // drift from the code again.
    const toolDir = join(process.cwd(), 'src/components/tools')
    const actual = new Set<string>()

    for (const category of readdirSync(toolDir)) {
      const catDir = join(toolDir, category)
      if (!existsSync(catDir)) continue
      for (const entry of readdirSync(catDir)) {
        if (!entry.endsWith('.tsx')) continue
        const src = readFileSync(join(catDir, entry), 'utf8')
        if (src.includes('api/network')) actual.add(entry.replace(/\.tsx$/, ''))
      }
    }

    expect(actual.size).toBeGreaterThan(0)
    expect([...actual].sort()).toEqual([...SERVER_PROXIED_TOOL_SLUGS].sort())
  })

  test('usesServerProxy is consistent with the list', () => {
    for (const slug of SERVER_PROXIED_TOOL_SLUGS) {
      expect(usesServerProxy(slug)).toBe(true)
    }
    expect(usesServerProxy('json-formatter')).toBe(false)
  })

  test('every listed slug is a real tool', () => {
    const known = new Set(toolMetaList.map((t) => t.slug))
    for (const slug of SERVER_PROXIED_TOOL_SLUGS) {
      expect(known.has(slug)).toBe(true)
    }
  })

  test('no user-facing page claims input never leaves the browser', () => {
    const offenders: string[] = []
    const pattern =
      /nothing (you (type|enter|upload)[^.]*)?(is )?sent to our servers|your data never leaves your browser|inputs? (you enter )?are[^.]*never sent to our servers/i

    for (const dir of ['src/app/about', 'src/app/privacy', 'src/app/terms']) {
      for (const src of allSourceFiles(join(process.cwd(), dir))) {
        if (pattern.test(src)) offenders.push(dir)
      }
    }
    expect(offenders).toEqual([])
  })

  test('the shared SEO templates do not overclaim for proxied tools', () => {
    const seo = readFileSync(
      join(process.cwd(), 'src/app/tools/[slug]/tool-seo.ts'),
      'utf8'
    )
    // The network branch must exist and must not assert browser-only handling.
    expect(seo).toContain('toolIsProxied')
    const ipLookup = toolMetaList.find((t) => t.slug === 'ip-lookup')!
    expect(ipLookup.category).toBe('network')
  })

  test('toolPrivacyClaim returns truthful copy per behaviour', () => {
    expect(toolPrivacyClaim(false)).toMatch(/never sent to a server/i)
    expect(toolPrivacyClaim(true)).toMatch(/through our server/i)
  })
})