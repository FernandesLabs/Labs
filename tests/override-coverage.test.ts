/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import { getToolContentOverride } from '@/app/tools/[slug]/tool-content-overrides'
import { toolMetaList } from '@/lib/tools/tool-meta'

describe('content override coverage (Phase 3)', () => {
  test('every tool in the registry has a hand-written override', () => {
    const missing = toolMetaList
      .map((t) => t.slug)
      .filter((slug) => !getToolContentOverride(slug))
    expect(missing).toEqual([])
  })

  test('every override has a 150+ word intro and exactly 6 FAQs', () => {
    for (const t of toolMetaList) {
      const o = getToolContentOverride(t.slug)
      if (!o) continue
      expect(o.intro.split(/\s+/).length).toBeGreaterThanOrEqual(150)
      expect(o.faqs.length).toBe(6)
      expect(o.examples.length).toBe(3)
      expect(o.howTo.length).toBe(5)
      expect(o.useCases.length).toBeGreaterThanOrEqual(5)
      expect(o.tips.length).toBe(4)
      expect((o.bestPractices ?? []).length).toBeGreaterThanOrEqual(5)
    }
  })

  test('no two tools share an intro (no templated filler)', () => {
    const intros = new Set(
      toolMetaList
        .map((t) => getToolContentOverride(t.slug)?.intro)
        .filter((i): i is string => Boolean(i))
    )
    expect(intros.size).toBe(toolMetaList.length)
  })

  test('every override matches the FAQPage JSON-LD shape {q, a}', () => {
    for (const t of toolMetaList) {
      const o = getToolContentOverride(t.slug)
      if (!o) continue
      for (const f of o.faqs) {
        expect(typeof f.q).toBe('string')
        expect(f.q.length).toBeGreaterThan(5)
        expect(typeof f.a).toBe('string')
        expect(f.a.length).toBeGreaterThan(40)
      }
    }
  })
})
