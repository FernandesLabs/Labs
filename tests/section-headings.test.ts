/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import {
  SECTION_HEADINGS,
  resolveSectionHeading,
  type ToolSectionKey,
} from '@/app/tools/[slug]/section-headings'
import {
  getRelatedTools,
  RELATED_TOOLS,
} from '@/app/tools/[slug]/tool-seo'
import { toolMetaBySlug, toolMetaList } from '@/lib/tools/tool-meta'

const KEYS: ToolSectionKey[] = [
  'about',
  'examples',
  'howTo',
  'useCases',
  'bestPractices',
  'tips',
  'faq',
]

const tool = (slug: string) => {
  const t = toolMetaBySlug.get(slug)
  if (!t) throw new Error(`unknown slug: ${slug}`)
  return t
}

describe('section headings (GSC-driven, export 2026-09-19)', () => {
  test('hand-tuned headings cover the top impression pages', () => {
    // The 10 pages that carried the most impressions in the GSC export.
    const priority = [
      'ip-lookup', // 4,429 impressions
      'redirect-checker', // 227 + ~350 via its query cluster
      'email-signature-generator', // 540
      'mime-detector', // 251 (pos 55 — closest big page to page 1)
      'canonical-url-checker', // 143
      'robots-txt-generator', // 125
      'file-signature-inspector', // 116 (pos 36.7)
      'ssl-checker', // 69
      'unicode-inspector', // 44 (pos 47.8)
      'capitalization-tool', // 35
      // Rising-zone round (export window ended 2026-09-16):
      'aria-validator', // 26 impressions at pos 24.3 — best position on site
      'font-accessibility-checker', // 87 impressions, pos 45.5, only page with real organic CTR (4.6%)
    ]
    const missing = priority.filter((slug) => !SECTION_HEADINGS[slug])
    expect(missing).toEqual([])
  })

  test('aria-validator howTo pins the ARIA validation phrase', () => {
    expect(SECTION_HEADINGS['aria-validator']!.howTo).toBe(
      'How to validate ARIA attributes in HTML'
    )
    expect(SECTION_HEADINGS['aria-validator']!.faq).toBe('ARIA validator FAQ')
  })

  test('font-accessibility-checker howTo carries the WCAG phrase', () => {
    expect(SECTION_HEADINGS['font-accessibility-checker']!.howTo).toBe(
      'How to check font accessibility against WCAG'
    )
  })

  test('ip-lookup headings carry the exact query phrases', () => {
    const h = SECTION_HEADINGS['ip-lookup']!
    expect(h.about).toContain('IP address lookup')
    expect(h.howTo).toBe('How to look up an IP address')
    expect(h.faq).toContain('IP address lookup')
  })

  test('redirect-checker howTo pins the 301-checker phrase', () => {
    // Queries: "check redirect 301", "test 301 redirect", "301 redirect check"
    expect(SECTION_HEADINGS['redirect-checker']!.howTo).toBe(
      'How to check 301 redirects'
    )
  })

  test('robots-txt-generator howTo pins the "make robots txt online" phrase', () => {
    expect(SECTION_HEADINGS['robots-txt-generator']!.howTo).toBe(
      'How to make a robots.txt file online'
    )
  })

  test('template fallbacks embed the tool name where useful', () => {
    const t = tool('sql-formatter')
    expect(resolveSectionHeading('about', t)).toBe('About the SQL Formatter')
    expect(resolveSectionHeading('howTo', t)).toBe(
      'How to use the SQL Formatter'
    )
    expect(resolveSectionHeading('examples', t)).toBe('SQL Formatter examples')
    // Every fallback is name-aware now, so no two pages share generic H2s.
    expect(resolveSectionHeading('useCases', t)).toBe('SQL Formatter use cases')
    expect(resolveSectionHeading('tips', t)).toBe('SQL Formatter tips')
  })

  test('SEO-category best-practices heading keeps its name-aware label', () => {
    const seoTool = toolMetaList.find((t) => t.category === 'seo')!
    expect(resolveSectionHeading('bestPractices', seoTool)).toBe(
      `${seoTool.name} best practices`
    )
    const other = toolMetaList.find((t) => t.category !== 'seo')!
    expect(resolveSectionHeading('bestPractices', other)).toBe(
      `${other.name} best practices`
    )
  })

  test('every heading resolves non-empty, short, and unique per tool', () => {
    for (const t of toolMetaList) {
      const resolved = KEYS.map((k) => resolveSectionHeading(k, t))
      for (const h of resolved) {
        expect(h.length).toBeGreaterThan(3)
        // H2s should stay scannable; nothing here needs 80+ chars.
        expect(h.length).toBeLessThanOrEqual(80)
      }
      expect(new Set(resolved).size).toBe(resolved.length)
    }
  })
})

describe('related-tool internal linking', () => {
  test('tools without a curated map fall back to same-category neighbours', () => {
    const notCurated = toolMetaList.filter((t) => !RELATED_TOOLS[t.slug])
    expect(notCurated.length).toBeGreaterThan(0)
    for (const t of notCurated) {
      const rel = getRelatedTools(t.slug, t.category)
      expect(rel.length, t.slug).toBeGreaterThan(0)
      expect(rel.length, t.slug).toBeLessThanOrEqual(6)
      expect(rel, t.slug).not.toContain(t.slug)
      for (const s of rel) {
        expect(toolMetaBySlug.get(s)?.category, `${t.slug} -> ${s}`).toBe(
          t.category
        )
      }
    }
  })

  test('curated entries still win over the fallback', () => {
    expect(getRelatedTools('ip-lookup', 'network')).toEqual([
      'dns-lookup',
      'ssl-checker',
      'http-header-checker',
      'user-agent-parser',
      'redirect-checker',
      'unix-timestamp-converter',
    ])
  })
})
