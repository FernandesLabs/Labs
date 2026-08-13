/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import sitemap from '@/app/sitemap'
import { toolMetaList } from '@/lib/tools/tool-meta'
import { blogPosts } from '@/lib/blog/posts'
import { CATEGORY_ORDER } from '@/lib/tools/types'

describe('sitemap.xml', () => {
  const urls = sitemap()
  const locs = urls.map((u) => u.url)

  test('contains every indexable page', () => {
    // 4 static (/, /blog, /privacy, /terms) + 6 blog + 8 categories + 132 tools
    expect(urls.length).toBe(4 + blogPosts.length + CATEGORY_ORDER.length + toolMetaList.length)
  })

  test('homepage is first and highest priority', () => {
    expect(urls[0].url).toBe('https://www.fernandeslabs.com/')
    expect(urls[0].priority).toBe(1.0)
  })

  test('every tool slug is present with a canonical www URL', () => {
    for (const tool of toolMetaList) {
      expect(locs).toContain(`https://www.fernandeslabs.com/tools/${tool.slug}`)
    }
  })

  test('every category and blog post is present', () => {
    for (const cat of CATEGORY_ORDER) {
      expect(locs).toContain(`https://www.fernandeslabs.com/category/${cat}`)
    }
    for (const post of blogPosts) {
      expect(locs).toContain(`https://www.fernandeslabs.com/blog/${post.slug}`)
    }
  })

  test('all URLs use the canonical https://www domain (no duplicates/non-www)', () => {
    for (const u of urls) {
      expect(u.url.startsWith('https://www.fernandeslabs.com')).toBe(true)
    }
    expect(new Set(locs).size).toBe(locs.length)
  })

  test('priority tools get a higher priority than the rest', () => {
    const ipLookup = urls.find((u) => u.url.endsWith('/tools/ip-lookup'))
    const someOther = urls.find((u) => u.url.endsWith('/tools/word-counter'))
    expect(ipLookup?.priority).toBe(0.9)
    expect(someOther?.priority).toBeLessThan(0.9)
  })
})
