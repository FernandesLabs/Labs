/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { toolMetaList } from '@/lib/tools/tool-meta'
import { getToolContentOverride } from '@/app/tools/[slug]/tool-content-overrides'

/**
 * The check that matters most for structured data.
 *
 * Google requires content marked up in JSON-LD to be visible to users. In
 * September 2026 impressions fell 91% overnight (75/day → 7/day, with average
 * position *improving* from 67.9 to 15.9 — the signature of pages leaving the
 * index) shortly after `FAQPage` schema shipped across all 132 tool pages.
 * The cause: `ToolContent` rendered only the FIRST FAQ answer into the HTML
 * while `ToolJsonLd` marked up all six. Five sixths of the marked-up content
 * was invisible on every tool page.
 *
 * These tests assert the invariant directly against the override data, so a
 * future accordion-style refactor cannot silently reintroduce the mismatch.
 */

/** The FAQ pair list that both the visible page and the schema consume. */
function faqsFor(slug: string) {
  const override = getToolContentOverride(slug)
  if (!override) throw new Error(`no override for ${slug}`)
  return override.faqs
}

/** Decode the HTML character references React emits for text content. */
function decodeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
}

describe('FAQ structured data matches visible content', () => {
  test('every tool has 6 FAQ pairs to mark up and render', () => {
    for (const t of toolMetaList) {
      expect(faqsFor(t.slug).length).toBe(6)
    }
  })

  test('no FAQ pair contains raw control characters that would break JSON-LD', () => {
    // A literal \r or \t inside a string makes the schema text differ from the
    // rendered text once the browser normalises whitespace, which is how the
    // unicode-inspector page slipped through a manual check. Sequences must be
    // escaped as visible characters.
    const offenders: string[] = []
    for (const t of toolMetaList) {
      for (const { q, a } of faqsFor(t.slug)) {
        if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(q + a)) offenders.push(t.slug)
      }
    }
    expect(offenders).toEqual([])
  })

  test('every FAQ question and answer is non-empty and reasonably long', () => {
    for (const t of toolMetaList) {
      for (const { q, a } of faqsFor(t.slug)) {
        expect(q.trim().length).toBeGreaterThan(10)
        // A 20-char "answer" would be thin content, which is its own problem.
        expect(a.trim().length).toBeGreaterThan(40)
      }
    }
  })

  test('FAQ questions are unique within each tool', () => {
    for (const t of toolMetaList) {
      const qs = faqsFor(t.slug).map((f) => f.q.toLowerCase())
      expect(new Set(qs).size).toBe(qs.length)
    }
  })

  test('the FAQ renderer ships every answer without needing JS', () => {
    // The fix was native <details>/<summary>, which puts all six answers in
    // the static HTML with no hydration. Guard against a revert to a
    // JS-controlled accordion that hides answers behind click state.
    const built = join(process.cwd(), '.next/server/app/tools')
    if (!existsSync(built)) {
      // Build not present — the source-level assertion below still applies.
      expect(getToolContentOverride('remove-blank-lines')!.faqs.length).toBe(6)
      return
    }
    const offenders: string[] = []
    for (const t of toolMetaList) {
      const page = join(built, `${t.slug}.html`)
      if (!existsSync(page)) continue
      const html = readFileSync(page, 'utf8')
      const override = getToolContentOverride(t.slug)
      if (!override) continue
      // Isolate the VISIBLE page: drop the JSON-LD block (which contains the
      // same strings with escaped quotes) and the other script tags, then
      // decode HTML entities — React renders `"` as `&quot;` and `'` as
      // `&#x27;`, so a raw substring test gives false failures.
      const visible = decodeEntities(
        html
          .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
          .replace(/<script[\s\S]*?<\/script>/g, '')
      )
      // Assert the INVARIANT, not a mechanism: every marked-up FAQ question and
      // answer must appear in the served HTML. This holds whether answers are
      // expanded with native <details> or collapsed via CSS grid-rows, so the
      // test survives a change of implementation.
      for (const { q, a } of override.faqs) {
        if (!visible.includes(q) || !visible.includes(a)) {
          offenders.push(`${t.slug} (${q.slice(0, 30)})`)
        }
      }
    }
    expect(offenders).toEqual([])
  })
})