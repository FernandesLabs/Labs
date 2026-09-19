// src/app/blog/[slug]/blog-post-client.tsx
'use client'
import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  Home,
  CalendarDays,
  Clock,
  ArrowLeft,
  ArrowRight,
  UserRound,
} from 'lucide-react'
import { SiteHeader } from '@/components/hub/site-header'
import { SiteFooter } from '@/components/hub/site-footer'
import { BackToTop } from '@/components/hub/back-to-top'
import dynamic from 'next/dynamic'
import type { PalettePost } from '@/components/hub/command-palette'
import { SkipToContent } from '@/components/hub/skip-to-content'
import { ReadingProgress } from '@/components/hub/reading-progress'
import { AdblockBanner } from '@/components/ads/adblock-banner'
import { NewsletterCta } from '@/components/hub/newsletter-cta'
import { ShareRow } from '@/components/hub/share-row'
import { FeedbackWidget } from '@/components/hub/feedback-widget'
import { toolMetaList } from '@/lib/tools/tool-meta'
import { blogCategoryColor, formatIsoDate } from '@/lib/blog/blog-utils'

export interface AdjacentPost {
  slug: string
  title: string
  category: string
}

// Lazy-load the palette (cmdk + Dialog, ~60KB) — only needed on ⌘K / click.
const CommandPalette = dynamic(
  () => import('@/components/hub/command-palette').then((m) => m.CommandPalette),
  { ssr: false }
)

export function BlogPostClient({
  postSlug,
  postTitle,
  postExcerpt,
  postDate,
  postCategory,
  readingMinutes,
  olderPost,
  newerPost,
  authorName,
  authorRole,
  posts = [],
  children,
}: {
  postSlug: string
  postTitle: string
  postExcerpt: string
  postDate: string
  postCategory: string
  readingMinutes: number
  /** Next-older post (chronologically previous) — may be null on the oldest post. */
  olderPost?: AdjacentPost | null
  /** Next-newer post (chronologically next) — may be null on the newest post. */
  newerPost?: AdjacentPost | null
  /** Display name for the byline (founder when configured, else the team). */
  authorName: string
  /** Role line under the author name, e.g. "Founder & Lead Developer". */
  authorRole: string
  /** Slim guide list for the ⌘K palette (server-computed, see page.tsx). */
  posts?: PalettePost[]
  children: React.ReactNode
}) {
  const router = useRouter()
  const [paletteOpen, setPaletteOpen] = React.useState(false)
  const formattedDate = formatIsoDate(postDate)
  return (
    <div className="flex min-h-screen flex-col">
      {/* Scroll progress — guides are 1,000+ word reads; tool pages already
          ship this, so the reading experience stays consistent site-wide.
          persistSlug saves the position so /blog can offer "Continue reading". */}
      <ReadingProgress persistSlug={postSlug} />
      <SkipToContent />
      <AdblockBanner />
      <SiteHeader
        onHome={() => router.push('/')}
        toolCount={toolMetaList.length}
        onOpenPalette={() => setPaletteOpen(true)}
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
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-semibold"
              style={{
                color: blogCategoryColor(postCategory),
                borderColor: `${blogCategoryColor(postCategory)}55`,
                backgroundColor: `${blogCategoryColor(postCategory)}14`,
              }}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: blogCategoryColor(postCategory) }}
                aria-hidden
              />
              {postCategory}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3" />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" />
              {readingMinutes} min read
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {postTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {postExcerpt}
          </p>

          {/* Author byline — E-E-A-T signal (experience/expertise attribution).
              Links to the About page so readers (and crawlers) can verify who
              is behind the content. */}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3">
            <span
              className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
              aria-hidden
            >
              <UserRound className="size-4.5" />
            </span>
            <div className="min-w-0 text-xs leading-snug">
              <p className="font-semibold text-foreground">
                By{' '}
                <Link href="/about" className="transition hover:text-primary hover:underline">
                  {authorName}
                </Link>
              </p>
              <p className="mt-0.5 text-muted-foreground">
                {authorRole} · Published {formattedDate}
              </p>
            </div>
          </div>
        </header>

        {/* Share row — privacy-safe intents + clipboard copy (no trackers) */}
        <ShareRow title={postTitle} className="mb-6" />

        {children}

        {/* Guide feedback — anonymous 👍/👎, aggregate social proof */}
        <div className="mt-10">
          <FeedbackWidget slug={postSlug} label="guide" />
        </div>

        {/* Prev / next post navigation — keeps readers inside the cluster */}
        {olderPost || newerPost ? (
          <nav aria-label="More guides" className="mt-10 grid gap-3 sm:grid-cols-2">
            {olderPost ? (
              <Link
                href={`/blog/${olderPost.slug}`}
                className="group flex flex-col rounded-xl border border-border/70 bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" aria-hidden />
                  Older guide
                </span>
                <span className="mt-1.5 text-sm font-semibold leading-snug text-foreground transition group-hover:text-primary">
                  {olderPost.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden className="hidden sm:block" />
            )}
            {newerPost ? (
              <Link
                href={`/blog/${newerPost.slug}`}
                className="group flex flex-col items-start rounded-xl border border-border/70 bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:items-end sm:text-right"
              >
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Newer guide
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
                <span className="mt-1.5 text-sm font-semibold leading-snug text-foreground transition group-hover:text-primary">
                  {newerPost.title}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}

        {/* Newsletter CTA — recaptures readers before they leave */}
        <NewsletterCta className="mt-8" />

        {/* Back to blog */}
        <div className="mt-8 border-t border-border/60 pt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            ← Back to all guides
          </Link>
        </div>
      </main>
      <SiteFooter />
      {/* ⌘K / Search button — real palette with tools + guides. */}
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onSelect={(slug) => router.push(`/tools/${slug}`)}
        onSelectPost={(slug) => router.push(`/blog/${slug}`)}
        posts={posts}
      />
      <BackToTop />
    </div>
  )
}
