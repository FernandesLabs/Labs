// src/lib/blog/blog-utils.ts
// Shared, dependency-free helpers for the blog.
// IMPORTANT: no 'use client' and no server-only imports — this file is used
// by server components (blog/[slug]/page.tsx) AND client components
// (blog-index-client) at the same time.

import type { BlogPost } from './posts'

/**
 * Slugify a markdown heading into a DOM-safe anchor id.
 * "What size should body text be?" → "what-size-should-body-text-be"
 * Deterministic on both server (TOC extraction) and render (h2 id), so the
 * TOC links always match the actual heading ids.
 */
export function slugifyHeading(input: string): string {
  return input
    .toLowerCase()
    // strip common inline markdown markers so raw-text and rendered-text
    // slugs converge on the same id
    .replace(/[*_`]/g, '')
    // drop anything that isn't a letter, digit, space or dash
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Extract h2-level table-of-contents items from a markdown body.
 * Matches lines starting with "## " (ignoring fenced code blocks), returning
 * the anchor id (same algorithm as slugifyHeading) plus display label.
 */
export function extractToc(body: string): { id: string; label: string }[] {
  const items: { id: string; label: string }[] = []
  let inFence = false
  for (const line of body.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const m = /^##\s+(.+?)\s*$/.exec(line)
    if (m) {
      const label = m[1].replace(/[*_`]/g, '').trim()
      items.push({ id: slugifyHeading(label), label })
    }
  }
  return items
}

/** Reading time at ~200 wpm, rounded up, minimum 1 minute. */
export function readingTimeMinutes(body: string): number {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/**
 * Pick the most topically-related posts: shared related-tools weigh 2x,
 * same category weighs 1x, recency breaks ties. Excludes the current post.
 */
export function getRelatedPosts(
  current: BlogPost,
  all: BlogPost[],
  max = 3
): BlogPost[] {
  return all
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({
      post: p,
      score:
        p.relatedTools.filter((t) => current.relatedTools.includes(t)).length *
          2 +
        (p.category === current.category ? 1 : 0),
    }))
    .sort(
      (a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date)
    )
    .slice(0, max)
    .map((x) => x.post)
}

/** Category → accent color (hex). Used for badges/dots on blog cards. */
export const BLOG_CATEGORY_COLORS: Record<string, string> = {
  Network: '#10b981',
  SEO: '#f59e0b',
  Productivity: '#8b5cf6',
  Design: '#ec4899',
  Developer: '#06b6d4',
  Security: '#ef4444',
}

export function blogCategoryColor(category: string): string {
  return BLOG_CATEGORY_COLORS[category] ?? '#64748b'
}
