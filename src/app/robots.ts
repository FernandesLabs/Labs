import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
/**
 * Auto-generated robots.txt at /robots.txt.
 *
 * Allows all crawlers to access the site, but blocks:
 *   - `/api/` — API routes (not for indexing)
 *   - `/_next/static/` — Next.js static assets (JS/CSS/fonts). Google
 *     doesn't need to index these files individually; they're loaded as
 *     page resources. Blocking them saves crawl budget and prevents Google
 *     from reporting "Crawled - currently not indexed" on font/JS files.
 *
 * Points to the sitemap so Google can discover all 144 indexable pages.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = `https://${siteConfig.site.domain}`
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/static/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: siteConfig.site.domain,
  }
}