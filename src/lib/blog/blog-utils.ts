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

/**
 * Deterministic ISO-date ("2026-08-03") → "August 3, 2026" formatter.
 * No Date object, no timezone parsing — server HTML and client hydration
 * always produce identical output (prevents hydration mismatches for users
 * west of UTC, where Date parsing would shift the date a day back).
 * Single source of truth — previously duplicated in two client components.
 */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

export function formatIsoDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) return iso
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

/**
 * Sort posts newest-first (ISO dates sort lexicographically).
 * Used by the blog index, prev/next navigation, and category guides.
 */
export function postsByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * True when the post is younger than 7 days. Used for the "New" badge on the
 * blog index and post header. Computed SERVER-side (page.tsx / build time) so
 * `Date.now()` never enters a client render path — the badge simply refreshes
 * on the next deploy, which is exactly when content freshness changes anyway.
 */
export const FRESH_WINDOW_MS = 7 * 86_400_000

export function isFreshPost(date: string, now: number = Date.now()): boolean {
  const ts = new Date(date).getTime()
  if (Number.isNaN(ts)) return false
  return now - ts < FRESH_WINDOW_MS && now - ts >= 0
}

/**
 * Chronological neighbors of a post (newest-first list): the previous item is
 * the next-older post, the next item is the next-newer post. Powers the
 * prev/next footer navigation on blog posts — a standard engagement pattern
 * that keeps readers inside the topical cluster.
 */
export function getAdjacentPosts(
  current: BlogPost,
  all: BlogPost[]
): { newer: BlogPost | null; older: BlogPost | null } {
  const sorted = postsByDateDesc(all)
  const idx = sorted.findIndex((p) => p.slug === current.slug)
  if (idx === -1) return { newer: null, older: null }
  return {
    newer: idx > 0 ? sorted[idx - 1] : null,
    older: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  }
}

/**
 * Distinct blog categories with post counts, newest-post-first order.
 * Powers the filter chips on the blog index.
 */
export function getBlogCategories(
  posts: BlogPost[]
): { name: string; count: number; color: string }[] {
  const counts = new Map<string, number>()
  for (const p of posts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count, color: blogCategoryColor(name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

/**
 * Blog guides topically related to a set of tool slugs (e.g. every tool in a
 * category): a guide matches when ANY of its relatedTools is in the set.
 * Powers the "Guides & tutorials" section on the category landing pages —
 * this is the blog ↔ tools cross-link that ties the topical clusters together.
 */
export function guidesForTools(
  toolSlugs: string[],
  posts: BlogPost[],
  max = 3
): BlogPost[] {
  const set = new Set(toolSlugs)
  return postsByDateDesc(posts)
    .filter((p) => p.relatedTools.some((t) => set.has(t)))
    .slice(0, max)
}

/**
 * Split a markdown post body at the `## ` heading closest to the middle, so a
 * mid-content ad unit can be injected between the two halves.
 *
 * Fence-aware: lines inside ``` code blocks are never treated as headings
 * (posts embed fenced examples that could otherwise false-match).
 *
 * Guard rails — returns null (no split, no mid ad) when:
 *   - the body is shorter than MIN_SPLIT_CHARS (short posts would end up with
 *     a cramped ad and hurt the reading experience / AdSense viewability), or
 *   - the best heading sits outside the 25–75% window (a split at the very
 *     start/end is effectively a top/bottom ad — already covered elsewhere).
 *
 * The heading line itself starts the SECOND half, so the section keeps its
 * heading. Anchor ids and the TOC are unaffected: both halves render through
 * the same slugifyHeading pipeline.
 */
const MIN_SPLIT_CHARS = 4000

export function splitBodyAtMiddleHeading(
  body: string
): [string, string] | null {
  if (body.length < MIN_SPLIT_CHARS) return null

  let inFence = false
  const headingOffsets: number[] = []
  let lineStart = 0

  for (let i = 0; i <= body.length; i++) {
    const ch = i < body.length ? body[i] : '\n'
    if (ch === '\n') {
      const line = body.slice(lineStart, i)
      const trimmed = line.trimStart()
      if (trimmed.startsWith('```')) {
        inFence = !inFence
      } else if (!inFence && trimmed.startsWith('## ')) {
        headingOffsets.push(lineStart)
      }
      lineStart = i + 1
    }
  }

  if (headingOffsets.length === 0) return null

  const middle = body.length / 2
  let best = -1
  let bestDist = Infinity
  for (const offset of headingOffsets) {
    const dist = Math.abs(offset - middle)
    if (dist < bestDist) {
      bestDist = dist
      best = offset
    }
  }

  // Keep the ad out of the intro and the conclusion.
  if (best < body.length * 0.25 || best > body.length * 0.75) return null

  return [body.slice(0, best), body.slice(best)]
}

/**
 * Slim guide entries for the ⌘K command palette ("Guides & tutorials" group):
 * title/category/minutes only — markdown bodies never reach the client bundle.
 * Shape is structurally identical to `PalettePost` in command-palette.tsx.
 */
export function toPalettePosts(posts: BlogPost[]): {
  slug: string
  title: string
  category: string
  minutes: number
}[] {
  return postsByDateDesc(posts).map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    minutes: readingTimeMinutes(p.body),
  }))
}
