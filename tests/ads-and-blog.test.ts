/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { blogPosts, getBlogPost } from '@/lib/blog/posts'
import { isFreshPost } from '@/lib/blog/blog-utils'
import { toolMetaList, toolMetaBySlug } from '@/lib/tools/tool-meta'

describe('ads.txt', () => {
  test('declares the publisher id with DIRECT relationship (static file)', () => {
    const text = readFileSync(join(import.meta.dir, '..', 'public', 'ads.txt'), 'utf8')
    // The static public/ads.txt must always match the AdSense publisher ID.
    expect(text).toContain('google.com, pub-2766049026468980, DIRECT, f08c47fec0942fa0')
    const appAds = readFileSync(join(import.meta.dir, '..', 'public', 'app-ads.txt'), 'utf8')
    expect(appAds).toContain('google.com, pub-2766049026468980, DIRECT, f08c47fec0942fa0')
  })
})

describe('blog content integrity', () => {
  test('every post has a unique slug and non-empty body', () => {
    const slugs = new Set(blogPosts.map((p) => p.slug))
    expect(slugs.size).toBe(blogPosts.length)
    for (const p of blogPosts) {
      expect(p.body.length).toBeGreaterThan(200)
      expect(p.title.length).toBeGreaterThan(10)
      expect(p.description.length).toBeGreaterThan(20)
    }
  })

  test('relatedTools reference only real tool slugs', () => {
    const real = new Set(toolMetaList.map((t) => t.slug))
    for (const p of blogPosts) {
      for (const slug of p.relatedTools) {
        expect(real.has(slug)).toBe(true)
      }
    }
  })

  test('getBlogPost resolves by slug', () => {
    const first = blogPosts[0]
    expect(getBlogPost(first.slug)?.slug).toBe(first.slug)
    expect(getBlogPost('nope')).toBeUndefined()
    expect(toolMetaBySlug.get('ip-lookup')).toBeDefined()
  })
})

describe('round 11 content: open-graph + password-entropy guides', () => {
  const og = getBlogPost('open-graph-meta-tags-guide')
  const pw = getBlogPost('password-entropy-guide')

  test('both guides exist, are >4,000 chars (mid-ad split eligible) and fresh-dated', () => {
    expect(og).toBeDefined()
    expect(pw).toBeDefined()
    // Bodies must clear the mid-content ad threshold (>=4,000 chars) so the
    // pipeline treats them like every other long guide.
    expect(og!.body.length).toBeGreaterThan(4000)
    expect(pw!.body.length).toBeGreaterThan(4000)
    // Both dated 2026-09-19 (publish day): fresh at publish time, still
    // fresh a week's end later, NOT fresh after 7 days (strict window).
    expect(og!.date).toBe('2026-09-19')
    expect(pw!.date).toBe('2026-09-19')
    expect(isFreshPost(og!.date, new Date('2026-09-19T12:00:00Z').getTime())).toBe(true)
    expect(isFreshPost(pw!.date, new Date('2026-09-24T00:00:00Z').getTime())).toBe(true)
    expect(isFreshPost(pw!.date, new Date('2026-09-27T00:00:00Z').getTime())).toBe(false)
    expect(og!.category).toBe('SEO')
    expect(pw!.category).toBe('Security')
  })

  test('og:image numbers cited in the OG guide match the documented specs', () => {
    // These are the numbers fact-checked against Facebook/X/WhatsApp docs.
    expect(og!.body).toContain('1200 × 630')
    expect(og!.body).toContain('200 × 200') // Facebook minimum
    expect(og!.body).toContain('8 MB') // Facebook file limit
    expect(og!.body).toContain('4:1') // WhatsApp aspect cap
    expect(og!.body).toContain('summary_large_image') // X card type
    expect(og!.relatedTools).toContain('open-graph-preview')
    expect(og!.relatedTools).toContain('meta-tag-generator')
  })

  test('password-entropy math claims match the verified values', () => {
    // log2(26)≈4.70, log2(36)≈5.17, log2(62)≈5.95, log2(94)≈6.55 (verified)
    expect(pw!.body).toContain('L × log₂(R)')
    expect(pw!.body).toContain('4.70')
    expect(pw!.body).toContain('6.55')
    // Diceware: log2(7776)≈12.92 bits/word; 5 words ≈ 64.6 bits.
    expect(pw!.body).toContain('7,776-word list')
    expect(pw!.body).toContain('~65 bits')
    // NIST 800-63B claims.
    expect(pw!.body).toContain('Minimum 8 characters')
    expect(pw!.body).toContain('64')
    // UUID v4 = 122 random bits claim.
    expect(pw!.body).toContain('122 random bits')
    expect(pw!.relatedTools).toContain('password-generator')
    expect(pw!.relatedTools).toContain('password-strength-checker')
  })
})
