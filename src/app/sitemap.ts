import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
// IMPORTANT: use the server-safe `toolMetadata` array, NOT the `tools` export
// from `@/lib/tools/registry`. The registry is a 'use client' module — its
// top-level `tools` array is not usable inside a server route handler and
// throws `tools.map is not a function`.
import { toolMetadata } from '@/lib/tools/tool-metadata'
import { blogPosts } from '@/lib/blog/posts'
import { CATEGORY_ORDER } from '@/lib/tools/types'

// Tools with hand-written, rich content overrides — these are the
// highest-quality pages and should be crawled first. Google prioritises
// pages with higher `priority` values.
const PRIORITY_TOOL_SLUGS = new Set([
  'json-formatter',
  'password-generator',
  'qr-generator',
  'ip-lookup',
  'email-signature-generator',
  'redirect-checker',
  'canonical-url-checker',
  'robots-txt-generator',
  'image-metadata-viewer',
  'citation-generator',
  'color-contrast-checker',
  'jwt-decoder',
  'jwt-generator',
  'regex-tester',
  'dns-lookup',
  'css-gradient-generator',
  'lorem-ipsum-generator',
  'file-signature-inspector',
  'capitalization-tool',
  'mime-detector',
  'user-agent-parser',
  'headline-analyzer',
  'color-palette-extractor',
  'bmr-calculator',
  'unicode-inspector',
  'http-header-checker',
  'campaign-url-builder',
  'image-resizer',
  'ai-cost-calculator',
  'ai-persona-generator',
])

// A stable "last modified" date. Using a fixed date (instead of
// `new Date()` on every request) means the sitemap output is deterministic —
// Google caches it more aggressively and doesn't waste crawl budget
// re-fetching "changed" sitemaps that haven't actually changed.
// Update this date when you deploy significant content changes.
const LAST_UPDATED = new Date('2026-08-13')

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `https://${siteConfig.site.domain}`

  // Static pages — homepage is highest priority.
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Blog posts — long-tail informational content targeting the biggest query
  // clusters from Search Console.
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  // Category pages — 8 indexable landing pages.
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_ORDER.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Tool pages — 132 pages. Priority tools (with rich content overrides) get
  // priority 0.9 so Google crawls them first. All others get 0.7.
  const toolPages: MetadataRoute.Sitemap = toolMetadata.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: PRIORITY_TOOL_SLUGS.has(tool.slug) ? 0.9 : 0.7,
  }))

  return [...staticPages, ...blogPages, ...categoryPages, ...toolPages]
}
