// src/components/hub/tool-related-guides.tsx
'use client'
import Link from 'next/link'
import { BookOpen, ArrowRight, Clock3 } from 'lucide-react'
import { blogCategoryColor } from '@/lib/blog/blog-utils'

/**
 * Slim, serializable guide reference — computed on the server (page.tsx) via
 * `guidesForTools([tool.slug], blogPosts)` and passed down. Only the fields
 * needed for the sidebar card travel over the wire; the heavy markdown bodies
 * stay out of the client bundle.
 */
export interface ToolGuide {
  slug: string
  title: string
  category: string
  minutes: number
}

/**
 * ToolRelatedGuides — "Guides & tutorials" sidebar card on tool pages.
 *
 * Closes the tool → guide side of the topical-cluster loop: the blog already
 * links out to tools (guide → tool) and category pages list their guides
 * (category → guide), but tool pages — the site's biggest organic-entry
 * points — never linked INTO the editorial content. This card surfaces the
 * in-depth guides whose `relatedTools` include the current tool, keeping
 * readers in the cluster and passing internal PageRank to the guides.
 *
 * Renders nothing when the tool has no matching guides (e.g. most finance and
 * text tools today), so the sidebar stays noise-free.
 */
export function ToolRelatedGuides({ guides }: { guides: ToolGuide[] }) {
  if (guides.length === 0) return null
  return (
    <section className="rounded-xl border border-border/70 bg-card p-4">
      <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold tracking-tight text-foreground">
        <BookOpen className="size-4 text-primary" />
        Guides &amp; tutorials
      </h2>
      <ul className="space-y-1">
        {guides.map((g) => {
          const color = blogCategoryColor(g.category)
          return (
            <li key={g.slug}>
              <Link
                href={`/blog/${g.slug}`}
                className="group block rounded-lg border border-transparent p-2 transition hover:border-border/70 hover:bg-muted"
              >
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                  style={{ color, backgroundColor: `${color}14` }}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                  {g.category}
                </span>
                <span className="mt-1 block text-xs font-medium leading-snug text-foreground/90 transition group-hover:text-foreground">
                  {g.title}
                </span>
                <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock3 className="size-2.5" aria-hidden />
                  {g.minutes} min read
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      <Link
        href="/blog"
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border/70 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
      >
        All guides
        <ArrowRight className="size-3" aria-hidden />
      </Link>
    </section>
  )
}
