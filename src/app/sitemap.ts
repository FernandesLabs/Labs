import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
import toolSlugs from '@/lib/tools/tool-slugs.json'

/**
 * Auto-generated sitemap.xml at /sitemap.xml.
 * Lists the hub page + all 132 tool pages (as hash routes).
 * Submit this to Google Search Console after deployment.
 *
 * NOTE: reads tool slugs from a static JSON file (not the registry) because
 * the registry is a client module ('use client') and sitemap runs on the server.
 */
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

  const toolPages: MetadataRoute.Sitemap = (toolSlugs as string[]).map(
    (slug) => ({
      url: `${baseUrl}/#tool=${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })
  )

  return [...staticPages, ...toolPages]
}
