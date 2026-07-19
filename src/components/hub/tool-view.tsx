// src/components/hub/tool-view.tsx
'use client'
import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ChevronRight,
  Home,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import type { Tool } from '@/lib/tools/types'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/tools/types'
import { AdblockBanner } from '@/components/ads/adblock-banner'
import { AdUnit } from '@/components/ads/ad-unit'
import { AffiliateLinks } from '@/components/ads/affiliate-links'
import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'
import { FavoriteButton } from './favorite-button'
import { ToolContent } from './tool-content'
import { ToolJsonLd } from './tool-json-ld'
import { BackToTop } from './back-to-top'
import { CommandPalette } from './command-palette'
import { MobileSidebar } from './mobile-sidebar'
import { OnThisPage } from './on-this-page'
import { ReadingProgress } from './reading-progress'
import { ShareButton } from './share-button'
import { SkipToContent } from './skip-to-content'
import { useToolHistory } from '@/lib/tools/use-tool-history'
import { preloadTool } from '@/lib/tools/preload'
import { toolMetaList } from '@/lib/tools/tool-meta'

/**
 * ToolView — the individual tool page shell.
 *
 * Responsibilities:
 *   - Sticky site header with home navigation
 *   - Breadcrumbs (Home › Category › Tool)
 *   - Tool header (name, description, favorite star, "recently used" badge)
 *   - The actual tool component (lazy-loaded via the registry)
 *   - Ad units (top + bottom) and contextual affiliate links
 *   - SEO content (intro / how-to / FAQ) — see ToolContent
 *   - JSON-LD structured data — see ToolJsonLd
 *   - "Related tools" rail (same category, excludes current)
 *   - Sticky footer
 *
 * The `recent` prop is accepted for API compatibility with the
 * `tool-page-client` wrapper but the live value is read from
 * `useToolHistory()` so the badge reflects the shared localStorage state.
 */
export function ToolView({
  tool,
  tools,
  toolsBySlug: _toolsBySlug,
  recent: _recent,
  onBack,
  onSelect,
}: {
  tool: Tool
  tools: Tool[]
  toolsBySlug: Map<string, Tool>
  recent: string[]
  onBack: () => void
  onSelect: (slug: string) => void
}) {
  const router = useRouter()
  const Component = tool.Component
  const cat = CATEGORY_META[tool.category]
  const { recent, recordUse } = useToolHistory()

  // Command palette state — Ctrl+K / ⌘K opens it inline so users can jump
  // to another tool without navigating back to the hub first.
  const [paletteOpen, setPaletteOpen] = React.useState(false)

  // Record this tool as recently-used on mount + scroll to top on tool change.
  React.useEffect(() => {
    recordUse(tool.slug)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [tool.slug, recordUse])

  // Global keyboard shortcuts:
  //   ⌘K / Ctrl+K → toggle the command palette
  //   Esc         → close the palette (if open)
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
      if (e.key === 'Escape' && paletteOpen) {
        setPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [paletteOpen])

  // Related tools — same category, excluding the current tool (max 6).
  const related = React.useMemo(() => {
    return tools
      .filter((t) => t.category === tool.category && t.slug !== tool.slug)
      .slice(0, 6)
  }, [tools, tool.category, tool.slug])

  // Other categories for the cross-linking rail.
  const otherCategories = React.useMemo(() => {
    return CATEGORY_ORDER.filter((c) => c !== tool.category).map((c) => ({
      category: c,
      meta: CATEGORY_META[c],
      count: toolMetaList.filter((t) => t.category === c).length,
    }))
  }, [tool.category])

  return (
    <div className="flex min-h-screen flex-col">
      <ReadingProgress />
      <SkipToContent />
      <AdblockBanner />
      <SiteHeader
        onHome={() => router.push('/')}
        toolCount={tools.length}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <ToolJsonLd tool={tool} />

      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition hover:text-foreground"
          >
            <Home className="size-3.5" />
            Home
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <Link
            href={`/category/${tool.category}`}
            className="inline-flex items-center gap-1.5 transition hover:text-foreground"
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: cat.color }}
              aria-hidden
            />
            {cat.label}
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <span className="font-medium text-foreground">{tool.name}</span>
        </nav>

        {/* Tool header */}
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                style={{
                  borderColor: `${cat.color}40`,
                  backgroundColor: `${cat.color}12`,
                  color: cat.color,
                }}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                  aria-hidden
                />
                {cat.label}
              </span>
              {recent[0] === tool.slug ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                  <Clock className="size-2.5" />
                  Recently used
                </span>
              ) : null}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {tool.name}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {tool.description}
            </p>
            {tool.keywords && tool.keywords.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tool.keywords.slice(0, 5).map((k) => (
                  <span
                    key={k}
                    className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {k}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border/70 bg-background px-3 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <ShareButton
              url={`/tools/${tool.slug}`}
              title={tool.name}
              description={tool.description}
            />
            <FavoriteButton slug={tool.slug} />
          </div>
        </header>

        {/* Top ad unit */}
        <div className="mb-6">
          <AdUnit slot="horizontal" />
        </div>

        {/* Tool + sidebar layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* Tool card */}
          <div className="min-w-0">
            <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
              <Component />
            </div>

            {/* Contextual affiliate links */}
            <div className="mt-6">
              <AffiliateLinks category={tool.category} />
            </div>

            {/* SEO content (intro / how-to / FAQ / use cases / tips) */}
            <ToolContent tool={tool} />

            {/* Bottom ad unit */}
            <div className="mt-8">
              <AdUnit slot="footer" />
            </div>
          </div>

          {/* Sidebar (collapsible on mobile, sticky on desktop) */}
          <aside>
            <MobileSidebar>
              {/* On this page — table of contents with scroll-spy */}
              <section className="rounded-xl border border-border/70 bg-card p-4">
                <OnThisPage />
              </section>

              {/* Related tools */}
              <section className="rounded-xl border border-border/70 bg-card p-4">
                <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold tracking-tight text-foreground">
                  <Sparkles className="size-4 text-primary" />
                  Related {cat.label} tools
                </h2>
                <ul className="space-y-1">
                  {related.map((t) => (
                    <li key={t.slug}>
                      <button
                        type="button"
                        onClick={() => onSelect(t.slug)}
                        onMouseEnter={() => preloadTool(t.slug)}
                        className="group flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-muted"
                      >
                        <span className="min-w-0 flex-1 truncate text-foreground/90 group-hover:text-foreground">
                          {t.name}
                        </span>
                        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50 transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </button>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/category/${tool.category}`}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border/70 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
                >
                  All {cat.label} tools
                  <ExternalLink className="size-3" />
                </Link>
              </section>

              {/* Vertical ad */}
              <div className="hidden lg:block">
                <AdUnit slot="vertical" />
              </div>

              {/* Other categories */}
              <section className="rounded-xl border border-border/70 bg-card p-4">
                <h2 className="mb-3 text-sm font-bold tracking-tight text-foreground">
                  Browse categories
                </h2>
                <ul className="space-y-1">
                  {otherCategories.map(({ category, meta, count }) => (
                    <li key={category}>
                      <Link
                        href={`/category/${category}`}
                        className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition hover:bg-muted"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: meta.color }}
                            aria-hidden
                          />
                          <span className="text-foreground/90">{meta.label}</span>
                        </span>
                        <span className="text-[11px] tabular-nums text-muted-foreground">
                          {count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </MobileSidebar>
          </aside>
        </div>
      </main>

      <SiteFooter />
      <BackToTop />
      {/* Command palette — ⌘K / Ctrl+K opens it inline on tool pages too */}
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onSelect={(slug) => {
          setPaletteOpen(false)
          onSelect(slug)
        }}
      />
    </div>
  )
}
