import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
// IMPORTANT: use the server-safe `toolMetadata` array, NOT the `tools` export
// from `@/lib/tools/registry`. The registry is a 'use client' module — its
// top-level `tools` array is not usable inside a server route handler and
// throws `tools.map is not a function`.
import { toolMetadata } from '@/lib/tools/tool-metadata'
import { CATEGORY_ORDER } from '@/lib/tools/types'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `https://${siteConfig.site.domain}`
  const now = new Date()
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_ORDER.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  const toolPages: MetadataRoute.Sitemap = toolMetadata.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  return [...staticPages, ...categoryPages, ...toolPages]
}
