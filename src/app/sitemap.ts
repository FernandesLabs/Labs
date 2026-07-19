import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
import { toolSlugs } from '@/lib/tools/tool-meta'
import { CATEGORY_ORDER } from '@/lib/tools/types'

/**
 * Auto-generated sitemap.xml at /sitemap.xml.
 *
 * Lists:
 *   - the hub (`/`)
 *   - 8 category landing pages (`/category/<cat>`)
 *   - 132 tool pages (`/tools/<slug>`)
 *   - privacy + terms
 *
 * Total: 143 URLs. Submit to Google Search Console after deployment.
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

  // Category landing pages — high priority for category-level SEO queries.
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_ORDER.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const toolPages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...categoryPages, ...toolPages]
}
