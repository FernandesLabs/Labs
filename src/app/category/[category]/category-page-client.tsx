'use client'
import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight, ChevronRight, Home, Layers } from 'lucide-react'
import { SiteHeader } from '@/components/hub/site-header'
import { SiteFooter } from '@/components/hub/site-footer'
import { BackToTop } from '@/components/hub/back-to-top'
import { SkipToContent } from '@/components/hub/skip-to-content'
import { FavoriteButton } from '@/components/hub/favorite-button'
import { Input } from '@/components/ui/input'
import { fuzzyMatch } from '@/lib/tools/fuzzy-search'
import { usePreloadOnHover } from '@/lib/tools/preload'
import type { ToolMeta, ToolCategory } from '@/lib/tools/types'
import { CATEGORY_META } from '@/lib/tools/types'
/**
 * Client component for the category landing page.
 * Renders the category hero + a searchable grid of tools in that category
 * + cross-links to other categories.
 */
export function CategoryPageClient({
  category,
  tools,
  otherCategories,
}: {
  category: ToolCategory
  tools: ToolMeta[]
  otherCategories: { category: ToolCategory; meta: typeof CATEGORY_META[ToolCategory]; count: number }[]
}) {
  const router = useRouter()
  const cat = CATEGORY_META[category]
  const [query, setQuery] = React.useState('')
  const searchRef = React.useRef<HTMLInputElement | null>(null)
  const filtered = React.useMemo(() => {
    if (!query.trim()) return tools
    return tools.filter((t) => fuzzyMatch(t as never, query))
  }, [tools, query])
  // ⌘K → back to hub command palette; / → focus search
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        router.push('/')
        return
      }
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
  }, [router])
  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent />
      <SiteHeader
        onHome={() => router.push('/')}
        toolCount={132}
        onOpenPalette={() => router.push('/')}
      />
      <main id="main-content" className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border/60 bg-muted/20">
          <nav
            aria-label="Breadcrumb"
            className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-2.5 text-xs text-muted-foreground"
          >
            <Link href="/" className="inline-flex items-center gap-1 transition hover:text-foreground">
              <Home className="size-3.5" />
              <span>Tools</span>
            </Link>
            <ChevronRight className="size-3.5 text-muted-foreground/50" />
            <span className="font-medium text-foreground" aria-current="page">
              {cat.label}
            </span>
          </nav>
        </div>
        {/* Category hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              background: `radial-gradient(60% 80% at 0% 0%, ${cat.color} 0%, transparent 60%), radial-gradient(50% 70% at 100% 100%, ${cat.color} 0%, transparent 60%)`,
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-10 sm:py-14">
            <div className="flex items-start gap-4">
              <span
                className="grid size-14 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-primary-foreground shadow-lg"
                style={{ backgroundColor: cat.color }}
              >
                {cat.label.slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {cat.label} Tools
                </h1>
                <p className="mt-1.5 max-w-2xl text-sm text-foreground/80 sm:text-base">
                  {cat.blurb}
                </p>
                {/* Expanded SEO intro — 2–4 sentences with keywords + value props.
                    Renders below the short blurb for crawlers and users who want
                    more context about what this category covers. */}
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {cat.seoIntro}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted/70 px-2.5 py-1 font-medium text-foreground">
                    <Layers className="size-3 text-primary" />
                    {tools.length} tools
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2.5 py-1 font-medium text-muted-foreground">
                    100% client-side
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2.5 py-1 font-medium text-muted-foreground">
                    No sign-up
                  </span>
                </div>
              </div>
            </div>
            {/* Search within category */}
            <div className="relative mx-auto mt-6 max-w-xl">
              <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-foreground/40">
                <Search className="size-4" />
              </div>
              <Input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${cat.label.toLowerCase()} tools…`}
                className="h-11 rounded-full border-border/80 bg-background/80 pl-11 pr-10 text-base shadow-sm"
                aria-label={`Search ${cat.label} tools`}
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    searchRef.current?.focus()
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
          </div>
        </section>
        {/* Tools grid */}
        <section className="mx-auto max-w-6xl px-4 py-10">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
              <Search className="size-8 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium">No tools match your search</p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-3 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition hover:border-primary hover:text-primary"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  Showing{' '}
                  <span className="font-semibold text-foreground tabular-nums">
                    {filtered.length}
                  </span>{' '}
                  of {tools.length} {cat.label.toLowerCase()} tools
                  {query.trim() ? (
                    <>
                      {' '}for{' '}
                      <span className="font-mono text-foreground">&ldquo;{query}&rdquo;</span>
                    </>
                  ) : null}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((tool) => (
                  <CategoryToolCard key={tool.slug} tool={tool} catColor={cat.color} />
                ))}
              </div>
            </>
          )}
        </section>
        {/* Other categories */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Other categories
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {otherCategories.map(({ category: c, meta, count }) => (
              <Link
                key={c}
                href={`/category/${c}`}
                className="group flex flex-col gap-1 rounded-xl border border-border/80 bg-card p-3 fl-card-hover"
              >
                <span
                  className="grid size-7 place-items-center rounded-md text-[10px] font-bold text-primary-foreground"
                  style={{ backgroundColor: meta.color }}
                >
                  {meta.label.slice(0, 2)}
                </span>
                <h3 className="mt-1 text-xs font-semibold text-foreground">{meta.label}</h3>
                <p className="text-[10px] text-muted-foreground">{count}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  )
}
function CategoryToolCard({
  tool,
  catColor,
}: {
  tool: ToolMeta
  catColor: string
}) {
  const preload = usePreloadOnHover(tool.slug)
  return (
    <Link
      href={`/tools/${tool.slug}`}
      prefetch={false}
      onMouseEnter={preload.onMouseEnter}
      onFocus={preload.onFocus}
      className="group relative flex h-full cursor-pointer flex-col items-start gap-2 overflow-hidden rounded-xl border border-border/80 bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Category color accent strip */}
      <span
        className="absolute inset-x-0 top-0 h-0.5 opacity-50 transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: catColor }}
        aria-hidden
      />
      <div className="flex w-full items-start justify-between gap-2">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-lg text-xs font-bold transition-transform duration-200 group-hover:scale-105"
          style={{
            backgroundColor: `color-mix(in oklch, ${catColor} 16%, transparent)`,
            color: catColor,
          }}
        >
          {tool.name.slice(0, 2).toUpperCase()}
        </span>
        <div className="flex items-center gap-0.5">
          <FavoriteButton slug={tool.slug} size="sm" />
          <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 transition group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
      </div>
      <div className="mt-1">
        <h3 className="text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
          {tool.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
      </div>
      {tool.keywords && tool.keywords.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-1 pt-1">
          {tool.keywords.slice(0, 3).map((k) => (
            <span
              key={k}
              className="rounded-full bg-muted/60 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary/80"
            >
              {k}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  )
}