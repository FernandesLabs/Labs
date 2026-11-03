/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  generateToolDescription,
  generateToolTitle,
  getSeoOverride,
} from '@/app/tools/[slug]/tool-seo'
import { toolMetaBySlug, toolMetaList } from '@/lib/tools/tool-meta'
import { blogPosts } from '@/lib/blog/posts'
import sitemap from '@/app/sitemap'
import robots from '@/app/robots'
import { metadata as homeMetadata } from '@/app/page'
import { metadata as aboutMetadata } from '@/app/about/page'
import { metadata as blogIndexMetadata } from '@/app/blog/page'
import { metadata as contactMetadata } from '@/app/contact/page'
import { metadata as privacyMetadata } from '@/app/privacy/page'
import { metadata as termsMetadata } from '@/app/terms/page'

/**
 * Guards the GSC-driven metadata round (export 2026-10-23, 2026-07-22 →
 * 2026-10-21). The export showed 9,892 impressions at an average position of
 * 75.1 and a 0.33% CTR, so the fixes here are about matching query language
 * and staying inside the pixels Google actually renders.
 */

const tool = (slug: string) => {
  const t = toolMetaBySlug.get(slug)
  if (!t) throw new Error(`unknown slug: ${slug}`)
  return t
}

describe('tool metadata', () => {
  test('every title fits the SERP budget and stays unique', () => {
    const titles = toolMetaList.map((t) => generateToolTitle(t))
    expect(new Set(titles).size).toBe(toolMetaList.length)
    for (const title of titles) expect(title.length).toBeLessThanOrEqual(62)
  })

  test('every description fits the SERP budget and stays unique', () => {
    const descriptions = toolMetaList.map((t) => generateToolDescription(t))
    expect(new Set(descriptions).size).toBe(toolMetaList.length)
    for (const description of descriptions) {
      expect(description.length).toBeGreaterThan(40)
      expect(description.length).toBeLessThanOrEqual(160)
    }
  })

  test('priority pages target the exact GSC query language', () => {
    // IP lookup cluster: 4,264 impressions, position 80.8.
    expect(getSeoOverride(tool('ip-lookup'))?.title).toContain('IP Address Lookup')
    expect(getSeoOverride(tool('ip-lookup'))?.h1).toContain('IP Finder')
    // robots.txt cluster: 798 impressions, including robot.txt misspellings.
    expect(getSeoOverride(tool('robots-txt-generator'))?.title).toContain('Robot.txt')
    expect(getSeoOverride(tool('robots-txt-generator'))?.summary).toContain('robots.txt')
    // Font/accessibility cluster: the only real converter, but the 72-impression
    // "font readability test" query at position 2 had zero clicks.
    expect(getSeoOverride(tool('font-accessibility-checker'))?.title).toContain('Readability Test')
    // Email signature cluster includes Thunderbird/Gmail/Outlook queries.
    expect(getSeoOverride(tool('email-signature-generator'))?.title).toContain('Thunderbird')
    // 301 cluster: 724 impressions across check/test/status-code queries.
    expect(getSeoOverride(tool('redirect-checker'))?.title).toContain('301')
    // MIME vs file-signature differentiation.
    expect(getSeoOverride(tool('mime-detector'))?.summary).toContain('File Signature Inspector')
    expect(getSeoOverride(tool('file-signature-inspector'))?.summary).toContain('magic bytes')
  })

  test('H1 overrides only exist where the query phrase beats the tool name', () => {
    for (const t of toolMetaList) {
      const h1 = getSeoOverride(t)?.h1
      if (!h1) continue
      // A redundant override adds no value; keep the registry name instead.
      expect(h1, t.slug).not.toBe(t.name)
      // The override must still identify the tool family, not just a keyword.
      expect(h1.toLowerCase(), t.slug).toContain(
        t.name.toLowerCase().split(' ')[0]
      )
    }
  })
})

describe('blog metadata', () => {
  test('titles are unique and fit an untruncated SERP title', () => {
    expect(new Set(blogPosts.map((p) => p.title)).size).toBe(blogPosts.length)
    for (const post of blogPosts) {
      expect(post.title.length, post.slug).toBeLessThanOrEqual(70)
    }
  })

  test('descriptions are unique and inside the 160-character budget', () => {
    expect(new Set(blogPosts.map((p) => p.description)).size).toBe(
      blogPosts.length
    )
    for (const post of blogPosts) {
      expect(post.description.length, post.slug).toBeGreaterThan(80)
      expect(post.description.length, post.slug).toBeLessThanOrEqual(160)
    }
  })

  test('updated dates are real and never earlier than the publish date', () => {
    for (const post of blogPosts) {
      if (!post.updated) continue
      const published = Date.parse(post.date)
      const updated = Date.parse(post.updated)
      expect(Number.isNaN(updated), post.slug).toBe(false)
      expect(updated, post.slug).toBeGreaterThanOrEqual(published)
    }
  })

  test('sitemap lastModified follows post.updated, not just post.date', () => {
    const urls = sitemap()
    for (const post of blogPosts) {
      if (!post.updated) continue
      const entry = urls.find((u) =>
        u.url.endsWith(`/blog/${post.slug}`)
      )
      expect(entry, post.slug).toBeDefined()
      expect(new Date(entry!.lastModified as Date).toISOString()).toBe(
        new Date(post.updated).toISOString()
      )
    }
  })
})

describe('social metadata and crawling', () => {
  const pages = [
    ['/', homeMetadata],
    ['/about', aboutMetadata],
    ['/blog', blogIndexMetadata],
    ['/contact', contactMetadata],
    ['/privacy', privacyMetadata],
    ['/terms', termsMetadata],
  ] as const

  test('static pages fit the title and description budgets', () => {
    for (const [path, metadata] of pages) {
      expect(String(metadata.title).length, path).toBeLessThanOrEqual(70)
      expect(String(metadata.description).length, path).toBeLessThanOrEqual(
        160
      )
    }
  })

  test('every static page canonical resolves to its own path', () => {
    for (const [path, metadata] of pages) {
      const canonical = metadata.alternates?.canonical
      const canonicalUrl =
        typeof canonical === 'string'
          ? canonical
          : canonical instanceof URL
            ? canonical.toString()
            : canonical?.url
      if (path === '/') {
        expect(canonicalUrl, path).toBe('/')
      } else {
        expect(String(canonicalUrl).endsWith(path), path).toBe(true)
        expect(metadata.openGraph?.url, path).toBe(canonicalUrl)
      }
    }
  })

  test('blog index and contact og:url point at their own canonical page', () => {
    for (const [file, path] of [
      ['src/app/blog/page.tsx', '/blog'],
      ['src/app/contact/page.tsx', '/contact'],
    ] as const) {
      const src = readFileSync(join(process.cwd(), file), 'utf8')
      expect(src).toContain(
        `url: \`https://\${siteConfig.site.domain}${path}\``
      )
    }
  })

  test('robots.txt allows the OG image endpoint used by Article schema', () => {
    const rule = robots().rules[0]
    expect(rule.allow).toContain('/api/og')
    expect(rule.disallow).toContain('/api/')
  })
})
