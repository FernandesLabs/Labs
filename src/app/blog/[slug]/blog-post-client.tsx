// src/app/blog/[slug]/blog-post-client.tsx
'use client'
import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Home, CalendarDays, Tag, User } from 'lucide-react'
import { SiteHeader } from '@/components/hub/site-header'
import { SiteFooter } from '@/components/hub/site-footer'
import { BackToTop } from '@/components/hub/back-to-top'
import { SkipToContent } from '@/components/hub/skip-to-content'
import { AdblockBanner } from '@/components/ads/adblock-banner'
import { toolMetaList } from '@/lib/tools/tool-meta'
import { siteConfig } from '@/lib/site-config'

export function BlogPostClient({
  postTitle,
  postExcerpt,
  postDate,
  postUpdated,
  postCategory,
  children,
}: {
  postTitle: string
  postExcerpt: string
  postDate: string
  /** ISO date of the last edit, or null if never revised. */
  postUpdated?: string
  postCategory: string
  children: React.ReactNode
}) {
  const router = useRouter()
  // Deterministic date formatting — no Date object, no timezone parsing, so
  // the server-rendered HTML and the client hydration always match.
  const formattedDate = formatIsoDate(postDate)
  const formattedUpdated = postUpdated ? formatIsoDate(postUpdated) : null
  // Author byline. This used to render no byline at all, while the Article
  // JSON-LD claimed an anonymous Organization — an authorship gap on exactly
  // the topics (SEO, network, finance) where Google looks hardest for one.
  const authorName = siteConfig.founder.name ?? siteConfig.site.name
  const authorIsPerson = Boolean(siteConfig.founder.name)
  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent />
      <AdblockBanner />
      <SiteHeader
        onHome={() => router.push('/')}
        toolCount={toolMetaList.length}
        onOpenPalette={() => router.push('/')}
      />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8"
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link href="/" className="inline-flex items-center gap-1 transition hover:text-foreground">
            <Home className="size-3.5" />
            Home
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/80" />
          <Link href="/blog" className="transition hover:text-foreground">
            Blog
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/80" />
          <span className="truncate font-medium text-foreground">{postTitle}</span>
        </nav>

        {/* Post header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-semibold text-primary">
              <Tag className="size-3" />
              {postCategory}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3" />
              <time dateTime={postDate}>{formattedDate}</time>
              {formattedUpdated ? (
                <>
                  <span aria-hidden>·</span>
                  <span>
                    Updated{' '}
                    <time dateTime={postUpdated}>{formattedUpdated}</time>
                  </span>
                </>
              ) : null}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {postTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {postExcerpt}
          </p>
          {/*
            Visible byline. Mirrors the `author` in the Article JSON-LD so the
            structured data and the on-page content agree — the same
            consistency rule that the FAQ schema violation broke.
          */}
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="size-3.5" />
            <span>
              By{' '}
              <span className="font-medium text-foreground">{authorName}</span>
              {authorIsPerson && siteConfig.founder.jobTitle ? (
                <span>, {siteConfig.founder.jobTitle}</span>
              ) : null}
            </span>
          </p>
        </header>

        {children}

      {/* Back to blog */}
        <div className="mt-12 border-t border-border/60 pt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            ← Back to all guides
          </Link>
        </div>
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  )
}

/** Deterministic ISO-date → "Month D, YYYY" formatter (see blog-index-client). */
function formatIsoDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) return iso
  return `${MONTHS[m - 1]} ${d}, ${y}`
}
