// src/app/insights/page.tsx
import type { Metadata } from 'next'
import { InsightsClient } from './insights-client'
import { blogPosts } from '@/lib/blog/posts'

/**
 * Owner-facing feedback insights — the "quality radar" for the site.
 *
 * The feedback widget on every tool page and guide has been collecting
 * anonymous 👍/👎 votes since it shipped; this page is where those votes
 * become actionable: which tools people love, which ones frustrate them,
 * and where to invest improvements first (the exact signal AdSense's
 * "low value content" review cares about).
 *
 * noindex + nofollow: this is an internal dashboard, not content for search.
 * It is also excluded from the sitemap by construction (the sitemap only
 * lists tools, guides, categories and the curated static pages).
 *
 * Privacy: only AGGREGATE counts are shown — the same anonymous numbers the
 * public per-slug feedback API already returns. No identifiers exist to show.
 */
export const metadata: Metadata = {
  title: 'Feedback insights — Fernandes Labs',
  description: 'Aggregate helpfulness votes across all tools and guides.',
  robots: { index: false, follow: false },
}

// Render per-request so a refresh actually shows fresh votes. The dashboard
// is low-traffic (owner-only), so dynamic rendering is fine here.
export const dynamic = 'force-dynamic'

export default function InsightsPage() {
  // Slim slug list only — full post bodies must never reach the client bundle.
  return <InsightsClient guideSlugs={blogPosts.map((p) => p.slug)} />
}
