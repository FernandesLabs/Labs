import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
/**
 * Auto-generated robots.txt at /robots.txt.
 * Allows all crawlers, points to the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = `https://${siteConfig.site.domain}`
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: siteConfig.site.domain,
  }
}