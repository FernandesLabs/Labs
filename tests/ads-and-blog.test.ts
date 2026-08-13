/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import { GET } from '@/app/ads.txt/route'
import { blogPosts, getBlogPost } from '@/lib/blog/posts'
import { toolMetaList, toolMetaBySlug } from '@/lib/tools/tool-meta'

describe('ads.txt', () => {
  test('declares the configured publisher id with DIRECT relationship', async () => {
    const res = GET()
    const text = await res.text()
    // .env sets NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-2766049026468980
    expect(text).toContain('google.com, pub-2766049026468980, DIRECT, f08c47fec0942fa0')
    expect(res.headers.get('content-type')).toBe('text/plain')
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
