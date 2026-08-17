/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { blogPosts, getBlogPost } from '@/lib/blog/posts'
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
