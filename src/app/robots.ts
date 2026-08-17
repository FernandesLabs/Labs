import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
/**
 * Auto-generated robots.txt at /robots.txt.
 *
 * Allows all crawlers to access the site, but blocks:
 *   - `/api/` — API routes (not for indexing)
 *
 * IMPORTANT: we intentionally do NOT block `/_next/static/` (JS/CSS/fonts).
 * Google's documentation is explicit that crawlers must be able to fetch
 * CSS and JavaScript for mobile-first indexing and rendering — blocking
 * static assets is the single most common cause of "Crawled - currently not
 * indexed" for JavaScript-rendered sites. The old comment here claimed
 * blocking saved crawl budget, but it actually hurts rendering.
 *
 * Points to the sitemap so Google can discover all indexable pages.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = `https://${siteConfig.site.domain}`
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // `/api/` — API routes (not for indexing).
        // `/*XTransformPort*` — the dev preview gateway accepts a
        // ?XTransformPort=<port> query param to route to a local server.
        // Crawlers must never index those query-string variants (each one
        // is a duplicate of the canonical URL).
        disallow: ['/api/', '/*XTransformPort*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: siteConfig.site.domain,
  }
}