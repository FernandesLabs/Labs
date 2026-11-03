/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import {
  generateToolTitle,
  generateToolDescription,
  generateToolFaq,
  generateToolHowTo,
  generateToolIntro,
  getRelatedTools,
  getSeoOverride,
} from '@/app/tools/[slug]/tool-seo'
import { toolMetaBySlug, toolMetaList } from '@/lib/tools/tool-meta'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/tools/types'

const tool = (slug: string) => {
  const t = toolMetaBySlug.get(slug)
  if (!t) throw new Error(`unknown slug: ${slug}`)
  return t
}

describe('tool-seo generators', () => {
  test('priority tools get hand-tuned title + description overrides', () => {
    const ip = getSeoOverride(tool('ip-lookup'))
    expect(ip?.title).toContain('IP Address Lookup')
    expect(ip?.description).toContain('What is my IP')
  })

  test('generateToolTitle uses the override when present', () => {
    expect(generateToolTitle(tool('ip-lookup'))).toBe(
      'IP Address Lookup & IP Finder — Location, ISP & ASN'
    )
  })

  test('generateToolTitle falls back to the capability from the description', () => {
    // Was: "{name} — Free Online {Category} Tool | Fernandes Labs", which
    // spent the title's best keywords on generic filler and made 82 titles
    // near-identical. Now the tool's own description provides the descriptor.
    const title = generateToolTitle(tool('slug-generator'))
    expect(title).toContain('Slug Generator')
    expect(title).toContain('URL-safe slugs')
    expect(title.length).toBeLessThanOrEqual(62)
  })

  test('every generated title is unique and within the SERP budget', () => {
    const titles = toolMetaList.map((t) => generateToolTitle(t))
    expect(new Set(titles).size).toBe(toolMetaList.length)
    for (const t of titles) expect(t.length).toBeLessThanOrEqual(62)
  })

  test('every generated description is unique and free of browser-only overclaims on proxied tools', () => {
    const descs = toolMetaList.map((t) => generateToolDescription(t))
    expect(new Set(descs).size).toBe(toolMetaList.length)
    for (const t of toolMetaList) {
      if (t.category !== 'network') continue
      // The network tools DO send input to our server; claiming otherwise in
      // indexed copy is both inaccurate and an E-E-A-T liability.
      expect(generateToolDescription(t)).not.toMatch(
        /never leaves your (browser|device)|entirely in your browser|no uploads/
      )
    }
  })

  test('generateToolDescription is non-empty and within SERP length', () => {
    for (const slug of ['ip-lookup', 'word-counter', 'json-formatter', 'bmr-calculator']) {
      const desc = generateToolDescription(tool(slug))
      expect(desc.length).toBeGreaterThan(40)
      expect(desc.length).toBeLessThanOrEqual(165)
    }
  })

  test('every tool gets a unique title and description', () => {
    const slugs = ['ip-lookup', 'dns-lookup', 'word-counter', 'case-converter', 'qr-generator']
    const titles = new Set(slugs.map((s) => generateToolTitle(tool(s))))
    const descs = new Set(slugs.map((s) => generateToolDescription(tool(s))))
    expect(titles.size).toBe(slugs.length)
    expect(descs.size).toBe(slugs.length)
  })

  test('FAQ generation returns at least 3 Q&A pairs with content', () => {
    const faqs = generateToolFaq(tool('ssl-checker'))
    expect(faqs.length).toBeGreaterThanOrEqual(3)
    for (const faq of faqs) {
      expect(faq.q.length).toBeGreaterThan(5)
      expect(faq.a.length).toBeGreaterThan(20)
    }
  })

  test('how-to and intro generators produce non-empty content', () => {
    expect(generateToolHowTo(tool('ip-lookup')).length).toBeGreaterThanOrEqual(3)
    expect(generateToolIntro(tool('ip-lookup')).length).toBeGreaterThan(80)
  })

  test('getRelatedTools returns curated links for the traffic magnet', () => {
    const related = getRelatedTools('ip-lookup', 'network')
    expect(related).toContain('dns-lookup')
    expect(related.length).toBeGreaterThanOrEqual(4)
  })

test('getRelatedTools falls back to same-category neighbours for unmapped tools', () => {
    // Behaviour changed in the GSC-driven SEO round: the old code returned
    // [] (zero internal links) for the ~90 tools without a curated entry.
    // Same-category neighbours are the documented, intended fallback.
    const rel = getRelatedTools('slug-generator', 'text')
    expect(rel.length).toBeGreaterThan(0)
    expect(rel).not.toContain('slug-generator')
    for (const slug of rel) {
      expect(toolMetaBySlug.get(slug)?.category).toBe('text')
    }
    // A truly unknown slug/category still yields no links (no crash).
    expect(getRelatedTools('no-such-tool', 'no-such-category')).toEqual([])
  })

  test('getRelatedTools never links a tool to itself and honours the limit', () => {
    // The reported bug was tool pages with ZERO /tools/* hrefs; the other
    // failure mode is a link back to the page you are already on.
    for (const t of toolMetaList) {
      const related = getRelatedTools(t.slug, t.category, 8)
      expect(related).not.toContain(t.slug)
      expect(related.length).toBeLessThanOrEqual(8)
      // Deduped, and every slug real (a curated-map typo must degrade to a
      // missing link, not a broken anchor).
      expect(new Set(related).size).toBe(related.length)
      for (const slug of related) expect(toolMetaBySlug.has(slug)).toBe(true)
    }
  })

  test('category pages have substantive unique guide copy', () => {
    // Category pages were the thinnest indexable content on the site (~60
    // unique words). These guide sections are what makes them worth indexing.
    const guides = CATEGORY_ORDER.map((c) => CATEGORY_META[c].guide)
    expect(new Set(guides).size).toBe(CATEGORY_ORDER.length)
    for (const g of guides) {
      expect(g.length).toBeGreaterThan(400)
      expect(g.split(/\s+/).length).toBeGreaterThan(70)
    }
  })

  test('category guides do not overclaim client-side handling for network', () => {
    expect(CATEGORY_META.network.guide).toMatch(/proxied through our server/i)
    for (const c of CATEGORY_ORDER) {
      if (c === 'network') continue
      expect(CATEGORY_META[c].guide).not.toMatch(
        /never sent to our servers|never leaves your browser/i
      )
    }
  })

  test('every tool has at least one crawlable related link', () => {
    // The bug this prevents: tool pages shipping no /tools/* hrefs at all.
    const orphans = toolMetaList
      .filter((t) => getRelatedTools(t.slug, t.category).length === 0)
      .map((t) => t.slug)
    expect(orphans).toEqual([])
  })
})
