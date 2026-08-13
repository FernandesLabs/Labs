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
import { toolMetaBySlug } from '@/lib/tools/tool-meta'

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
      'IP Address Lookup — Find IP Location, ISP & More'
    )
  })

  test('generateToolTitle falls back to a branded template and stays short', () => {
    const title = generateToolTitle(tool('slug-generator'))
    expect(title).toContain('Slug Generator')
    expect(title).toContain('Fernandes Labs')
    expect(title.length).toBeLessThanOrEqual(70)
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

  test('getRelatedTools returns empty for an unmapped tool', () => {
    expect(getRelatedTools('no-such-tool', 'network')).toEqual([])
  })
})
