import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
import { toolSlugs } from '@/lib/tools/tool-meta'

/**
 * Auto-generated sitemap.xml at /sitemap.xml.
 * Lists the hub page + privacy + terms + all 132 tool pages (as PATH routes).
 * Submit this to Google Search Console after deployment.
 *
 * After the path-based-routing migration (SEO Priority 1), each tool has its
 * own URL: `/tools/<slug>` (instead of `/#tool=<slug>`). Google now indexes
 * each tool as a separate page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.site.url
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

  const toolPages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...toolPages]
}
