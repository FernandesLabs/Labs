'use client'
import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/hub/site-header'
import { SiteFooter } from '@/components/hub/site-footer'
import { BackToTop } from '@/components/hub/back-to-top'
import { ReadingProgress } from '@/components/hub/reading-progress'
import { SkipToContent } from '@/components/hub/skip-to-content'
import { AdblockBanner } from '@/components/ads/adblock-banner'
import {
  Rss,
  CalendarDays,
  FileText,
  ArrowRight,
  Clock,
  Search,
  X,
  Sparkles,
  SearchX,
  BookOpen,
  ChevronDown,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import type { PalettePost } from '@/components/hub/command-palette'
import { toolMetaList } from '@/lib/tools/tool-meta'
import {
  blogCategoryColor,
  formatIsoDate,
} from '@/lib/blog/blog-utils'
import {
  readGuideProgress,
  removeGuideProgress,
  type GuideProgressEntry,
} from '@/lib/blog/reading-progress-store'

/** Server-computed, slim guide metadata — full markdown NEVER reaches the
 *  client bundle (the old module-scope blogPosts import shipped ~80KB of
 *  post bodies for search that only uses title/excerpt/keywords). */
export interface BlogCatalogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  minutes: number
  keywords: string
  searchText: string
  /** True when the post is < 7 days old (computed server-side at build —
   *  keeps Date.now() out of the client render path entirely). */
  fresh?: boolean
}

/**
 * BlogIndexClient — client-side wrapper for the blog index.
 *
 * The blog page itself (`page.tsx`) is a server component that exports the
 * `metadata` (title, description, canonical). This client component handles
 * the interactive parts:
 *   - "Continue reading" strip (per-guide scroll progress from localStorage)
 *   - instant client-side search (title + excerpt + keywords)
 *   - category filter chips with live counts
 *   - a featured "latest guide" hero card
 *   - `/` keyboard shortcut to focus search (same pattern as the hub and
 *     category pages)
 *
 * NOTE: `POSTS` is passed in from the server as `catalog` — do not import
 * `blogPosts` here; it would pull every guide's full markdown body (~80KB)
 * into the client bundle.
 */

// Lazy-load the palette (cmdk + Dialog, ~60KB) — only needed on ⌘K / click.
const CommandPalette = dynamic(
  () => import('@/components/hub/command-palette').then((m) => m.CommandPalette),
  { ssr: false }
)

/** Guides rendered per page (hero included in the budget). The index shows
 *  the newest PAGE_SIZE guides and reveals the rest behind a "Load more"
 *  button — keeps the initial grid scannable (and the DOM lean) as the
 *  library grows past a dozen posts. */
const PAGE_SIZE = 12

export function BlogIndexClient({
  catalog = [],
  posts = [],
}: {
  /** Server-computed slim guide metadata (search, cards, categories). */
  catalog?: BlogCatalogPost[]
  /** Slim guide list for the ⌘K palette (server-computed, see page.tsx). */
  posts?: PalettePost[]
}) {
  const router = useRouter()
  const [paletteOpen, setPaletteOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null)
  // Pagination — every filter change (search/category) resets to the first
  // page so results always start at the newest guide.
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE)
  const searchRef = React.useRef<HTMLInputElement | null>(null)
  // "Continue reading" history — read AFTER hydration (never during first
  // render: the server has no localStorage, so reading it in render would be
  // a hydration mismatch — same rule as use-tool-history).
  const [progress, setProgress] = React.useState<GuideProgressEntry[]>([])

  React.useEffect(() => {
    setProgress(readGuideProgress())
  }, [])

  // "/" focuses the search box — consistent with the hub + category pages.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      const isTyping =
        tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable
      if (e.key === '/' && !isTyping) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.filter((p) => {
      if (activeCategory && p.category !== activeCategory) return false
      if (!q) return true
      return p.searchText.includes(q)
    })
  }, [catalog, query, activeCategory])

  // Category chips with per-category counts (same data the server used to
  // compute at module scope — now derived from the slim catalog prop).
  const categories = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of catalog) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count, color: blogCategoryColor(name) }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [catalog])

  // "Continue reading" — at most 3 entries, mapped to catalog metadata
  // (entries for deleted/unknown slugs are dropped). Hidden while searching
  // or filtering so results stay a uniform, scannable grid (same rule as
  // the featured hero).
  const continueReading = React.useMemo(() => {
    if (query.trim() || activeCategory) return []
    return progress
      .map((e) => {
        const post = catalog.find((p) => p.slug === e.slug)
        return post ? { ...e, post } : null
      })
      .filter((e): e is GuideProgressEntry & { post: BlogCatalogPost } => Boolean(e))
      .slice(0, 3)
  }, [progress, catalog, query, activeCategory])

  const dismissReading = (slug: string) => {
    setProgress((prev) => prev.filter((e) => e.slug !== slug))
    removeGuideProgress(slug)
  }

  // When no filter is active the first card (newest post) is promoted to the
  // hero; the remaining cards render below. While searching/filtering the
  // hero is dropped so results stay a uniform, scannable grid.
  const featured = !query.trim() && !activeCategory ? catalog[0] : null
  const featuredColor = featured ? blogCategoryColor(featured.category) : null

  // Paged slice of `filtered` — PAGE_SIZE counts the hero card, so the page
  // budget is identical whether or not a hero is showing. `visibleRest` is
  // what the grid actually renders (the hero is pulled out of the slice).
  const visibleFiltered = filtered.slice(0, visibleCount)
  const visibleRest = featured ? visibleFiltered.slice(1) : visibleFiltered
  const hiddenCount = filtered.length - visibleFiltered.length
  // Honest result count: exactly what is on screen (paged).
  const visibleTotal = visibleFiltered.length

  // Search/category setters also reset pagination (single render, no effect).
  const applySearch = (value: string) => {
    setQuery(value)
    setVisibleCount(PAGE_SIZE)
  }
  const applyCategory = (category: string | null) => {
    setActiveCategory(category)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ReadingProgress />
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
            Home
          </Link>
          <span className="text-muted-foreground/80">/</span>
          <span className="font-medium text-foreground">Blog</span>
        </nav>

        <header className="mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Guides &amp; Tutorials
              </h1>
              <p className="mt-2 max-w-2xl text-base text-muted-foreground">
                In-depth guides, best practices, and tutorials for developers,
                designers, and marketers. Learn about the tools you use every day.
              </p>
            </div>
            {/* RSS subscribe — readers who follow the feed are repeat visitors
                (returning-traffic is an engagement signal Google notices). */}
            <a
              href="/feed.xml"
              type="application/rss+xml"
              className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-lg border border-border/70 bg-card px-3.5 text-xs font-semibold text-muted-foreground transition hover:border-orange-500/50 hover:text-foreground"
              aria-label="Subscribe to the RSS feed"
            >
              <Rss className="size-4 text-orange-500" aria-hidden />
              Subscribe
            </a>
          </div>
        </header>

        {/* Search + category filter bar */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="relative">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
              <Search className="size-4" aria-hidden />
            </div>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => applySearch(e.target.value)}
              placeholder="Search guides… try “redirect”, “mime”, “contrast”"
              aria-label="Search guides"
              className="h-11 w-full rounded-full border border-border/80 bg-card pl-10 pr-20 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  applySearch('')
                  searchRef.current?.focus()
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            ) : (
              <kbd
                className="pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border/70 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:block"
                aria-hidden
              >
                /
              </kbd>
            )}
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by category">
            <button
              type="button"
              onClick={() => applyCategory(null)}
              aria-pressed={activeCategory === null}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                activeCategory === null
                  ? 'border-primary/60 bg-primary/10 text-primary'
                  : 'border-border/70 bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground'
              }`}
            >
              All guides
              <span className="rounded-full bg-muted/70 px-1.5 text-[10px] tabular-nums">
                {catalog.length}
              </span>
            </button>
            {categories.map((c) => {
              const active = activeCategory === c.name
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => applyCategory(active ? null : c.name)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? 'text-foreground'
                      : 'border-border/70 bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground'
                  }`}
                  style={
                    active
                      ? {
                          borderColor: `${c.color}88`,
                          backgroundColor: `${c.color}16`,
                          color: c.color,
                        }
                      : undefined
                  }
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: c.color }}
                    aria-hidden
                  />
                  {c.name}
                  <span className="rounded-full bg-muted/70 px-1.5 text-[10px] tabular-nums">
                    {c.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Continue reading — persisted scroll position per guide (localStorage
            only, see /privacy). Hidden while searching/filtering; dismissible. */}
        {continueReading.length > 0 ? (
          <section
            aria-label="Continue reading"
            className="mb-8 rounded-2xl border border-border/70 bg-gradient-to-br from-primary/[0.04] to-transparent p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
                <BookOpen className="size-4 text-primary" aria-hidden />
                Continue reading
              </h2>
              <span className="text-[11px] text-muted-foreground/70">
                saved on this device
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {continueReading.map(({ slug, pct, post }) => {
                const color = blogCategoryColor(post.category)
                return (
                  <div
                    key={slug}
                    className="group relative rounded-xl border border-border/70 bg-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  >
                    <Link
                      href={`/blog/${slug}`}
                      className="block p-4 focus-visible:outline-none"
                      aria-label={`Resume ${post.title} — ${pct}% read`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: color }}
                            aria-hidden
                          />
                          <span style={{ color }}>{post.category}</span>
                        </span>
                        <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
                          {pct}% read
                        </span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition group-hover:text-primary">
                        {post.title}
                      </p>
                      {/* Resume position — the bar doubles as a skip hint */}
                      <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        Resume
                        <ArrowRight
                          className="size-3.5 transition group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => dismissReading(slug)}
                      aria-label={`Remove ${post.title} from continue reading`}
                      className="absolute right-1.5 top-1.5 rounded-full p-1.5 text-muted-foreground/60 opacity-0 transition hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        ) : null}

        {catalog.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 p-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/80" />
            <p className="mt-3 text-base font-medium text-foreground">
              Articles coming soon
            </p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              We&apos;re working on guides covering JSON, QR codes, passwords,
              SEO, and more. Check back shortly — or explore our{' '}
              <Link href="/" className="font-medium text-primary hover:underline">
                {toolMetaList.length} free tools
              </Link>{' '}
              in the meantime.
            </p>
          </div>
        ) : (
          <>
            {/* Result count — reflects what is actually on screen
                (paged), not just what matched the filter. */}
            <p className="mb-4 text-xs text-muted-foreground" aria-live="polite">
              Showing{' '}
              <span className="font-semibold text-foreground tabular-nums">
                {visibleTotal}
              </span>{' '}
              of {catalog.length} guides
              {query.trim() ? (
                <>
                  {' '}for{' '}
                  <span className="font-mono text-foreground">&ldquo;{query.trim()}&rdquo;</span>
                </>
              ) : null}
            </p>

            {filtered.length === 0 ? (
              /* Search empty state */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 p-12 text-center">
                <SearchX className="h-9 w-9 text-muted-foreground/70" aria-hidden />
                <p className="mt-3 text-sm font-semibold text-foreground">
                  No guides match your search
                </p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try a different keyword — or{' '}
                  <Link href="/" className="font-medium text-primary hover:underline">
                    browse the {toolMetaList.length} free tools
                  </Link>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => {
                    applySearch('')
                    applyCategory(null)
                  }}
                  className="mt-4 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
                >
                  Clear search &amp; filters
                </button>
              </div>
            ) : (
              <>
                {/* Featured hero — the newest guide, only on the unfiltered view */}
                {featured ? (
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group relative mb-6 block overflow-hidden rounded-2xl border border-border/70 bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 sm:p-8"
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.06]"
                      style={{
                        background: `radial-gradient(70% 90% at 100% 0%, ${featuredColor} 0%, transparent 65%)`,
                      }}
                      aria-hidden
                    />
                    <div className="relative">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                        style={{
                          color: featuredColor,
                          borderColor: `${featuredColor}55`,
                          backgroundColor: `${featuredColor}14`,
                        }}
                      >
                        <Sparkles className="size-3" aria-hidden />
                        Latest guide
                      </span>
                      <h2 className="mt-3 text-xl font-bold tracking-tight text-foreground transition group-hover:text-primary sm:text-2xl">
                        {featured.title}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {featured.excerpt}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-semibold"
                          style={{
                            color: featuredColor,
                            borderColor: `${featuredColor}55`,
                            backgroundColor: `${featuredColor}14`,
                          }}
                        >
                          <span
                            className="size-1.5 rounded-full"
                            style={{ backgroundColor: featuredColor }}
                            aria-hidden
                          />
                          {featured.category}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="size-3" aria-hidden />
                          {formatIsoDate(featured.date)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" aria-hidden />
                          {featured.minutes} min read
                        </span>
                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                          Read guide
                          <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : null}

                <div className="grid gap-6 sm:grid-cols-2">
                  {visibleRest.map((post) => {
                    const color = blogCategoryColor(post.category)
                    return (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                      >
                        {/* Category accent strip */}
                        <span
                          className="absolute inset-x-0 top-0 h-0.5 opacity-40 transition-opacity group-hover:opacity-100"
                          style={{ backgroundColor: color }}
                          aria-hidden
                        />
                        <span
                          className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                          style={{
                            color,
                            borderColor: `${color}55`,
                            backgroundColor: `${color}14`,
                          }}
                        >
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: color }}
                            aria-hidden
                          />
                          {post.category}
                        </span>
                        <h2 className="mt-2 text-lg font-bold text-foreground transition group-hover:text-primary">
                          {post.title}
                        </h2>
                        {post.fresh ? (
                          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden />
                            New
                          </span>
                        ) : null}
                        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {post.excerpt}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="size-3" aria-hidden />
                          {formatIsoDate(post.date)}
                          <span className="text-border">·</span>
                          <Clock className="size-3" aria-hidden />
                          {post.minutes} min read
                        </span>
                        <span className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                          Read more
                          <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                        </span>
                      </Link>
                    )
                  })}
                </div>

                {/* Load more — reveals the next page of the (filtered) list.
                    Search/category changes reset pagination to page one. */}
                {hiddenCount > 0 ? (
                  <div className="mt-8 flex flex-col items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                      className="group inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0 active:scale-95"
                      aria-label={`Load ${Math.min(PAGE_SIZE, hiddenCount)} more guides — ${hiddenCount} remaining`}
                    >
                      Load more guides
                      <span className="rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-bold tabular-nums text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                        +{Math.min(PAGE_SIZE, hiddenCount)}
                      </span>
                      <ChevronDown
                        className="size-4 text-muted-foreground transition group-hover:translate-y-0.5 group-hover:text-primary"
                        aria-hidden
                      />
                    </button>
                    <p className="text-[11px] text-muted-foreground/70">
                      newest first · {hiddenCount} more below
                    </p>
                  </div>
                ) : catalog.length > PAGE_SIZE && !query.trim() && !activeCategory ? (
                  /* End-of-list marker — only meaningful once the list has
                     actually been paginated at least once. */
                  <p
                    className="mt-8 flex items-center justify-center gap-3 text-xs text-muted-foreground/70"
                    aria-label={`All ${catalog.length} guides shown`}
                  >
                    <span className="h-px w-10 bg-border" aria-hidden />
                    That&apos;s all {catalog.length} guides
                    <span className="h-px w-10 bg-border" aria-hidden />
                  </p>
                ) : null}
              </>
            )}
          </>
        )}
      </main>
      <SiteFooter />
      {/* ⌘K / Search button — real palette with tools + guides (was a
          redirect to the hub, which made ⌘K useless on blog pages). */}
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
