// src/app/feed.xml/route.ts
import { blogPosts, type BlogPost } from '@/lib/blog/posts'
import { postsByDateDesc } from '@/lib/blog/blog-utils'
import { siteConfig } from '@/lib/site-config'

/**
 * RSS 2.0 feed for the Fernandes Labs blog — `/feed.xml`.
 *
 * Why it matters:
 *   - Discovery: aggregators, feed readers and some crawlers pick up
 *     `<link rel="alternate" type="application/rss+xml">` from <head>
 *     (wired in layout.tsx) — a cheap, always-fresh distribution channel.
 *   - Curation signal: a live feed demonstrates ongoing site maintenance to
 *     AdSense reviewers, and helps new guides get picked up quickly after
 *     publishing.
 *
 * Implementation notes:
 *   - Static-ish: rendered from the same `blogPosts` array as the site, with
 *     a long `s-maxage` — it only changes when a post is added, so revalidation
 *     is unnecessary. `dynamic = 'force-static'` keeps it free on Vercel.
 *   - `pubDate` uses `Date.toUTCString()` on a UTC-anchored ISO date, which is
 *     deterministic (RFC-822) regardless of server timezone.
 *   - All text is XML-escaped; descriptions are the post excerpt (full body
 *     stays on-site to protect pageviews).
 */

export const dynamic = 'force-static'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function rfc822(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString()
}

function renderItem(post: BlogPost, baseUrl: string): string {
  const link = `${baseUrl}/blog/${post.slug}`
  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${rfc822(post.date)}</pubDate>
      <category>${escapeXml(post.category)}</category>
    </item>`
}

export async function GET(): Promise<Response> {
  const baseUrl = `https://${siteConfig.site.domain}`
  const sorted = postsByDateDesc(blogPosts)
  const lastBuildDate =
    sorted.length > 0 ? rfc822(sorted[0].date) : rfc822('2026-09-19')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${siteConfig.site.name} Blog`)}</title>
    <link>${escapeXml(`${baseUrl}/blog`)}</link>
    <description>${escapeXml('Hand-written guides on developer, design, SEO, and network topics — every tool mentioned runs free in your browser.')}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <ttl>1440</ttl>
    <atom:link href="${escapeXml(`${baseUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />
${sorted.map((p) => renderItem(p, baseUrl)).join('\n')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
