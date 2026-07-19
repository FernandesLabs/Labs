'use client'

import * as React from 'react'
import {
  Search,
  X,
  ArrowRight,
  Layers,
  Star,
  Clock,
  Sparkles,
  Command as CommandIcon,
  Wand2,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type Tool,
  type ToolCategory,
} from '@/lib/tools/types'
import { useToolHistory } from '@/lib/tools/use-tool-history'
import { fuzzyMatch, fuzzySearchTools } from '@/lib/tools/fuzzy-search'
import { usePreloadOnHover } from '@/lib/tools/preload'
import { FavoriteButton } from './favorite-button'
import { AdUnit } from '@/components/ads/ad-unit'
import { CryptoDonate } from '@/components/ads/crypto-donate'

const CATEGORY_ICONS: Record<ToolCategory, React.ReactNode> = {
  developer: <span className="font-mono text-sm font-bold">{'{ }'}</span>,
  text: <span className="text-sm font-bold">Tt</span>,
  finance: <span className="text-sm font-bold">%</span>,
  seo: <span className="text-sm font-bold">SEO</span>,
  security: <span className="text-sm font-bold">🔒</span>,
  network: <span className="text-sm font-bold">🌐</span>,
  media: <span className="text-sm font-bold">◐</span>,
  misc: <span className="text-sm font-bold">✦</span>,
}

// Curated "featured" tools shown at the top of the hub (high-use, showcase variety)
const FEATURED_SLUGS = [
  'json-formatter',
  'password-generator',
  'qr-generator',
  'uuid-generator',
  'color-converter',
  'markdown-preview',
  'hash-generator',
  'invoice-generator',
]

// "Popular" tools — a second curated row highlighting different categories
// so visitors immediately see the breadth of the collection.
const POPULAR_SLUGS = [
  'base64-encoder-decoder',
  'jwt-decoder',
  'regex-tester',
  'word-counter',
  'bmi-calculator',
  'password-strength-checker',
  'color-palette-extractor',
  'unix-timestamp-converter',
  'slug-generator',
  'unit-converter',
  'meta-tag-generator',
  'dns-lookup',
]

function matchTool(tool: Tool, q: string): boolean {
  if (!q) return true
  return fuzzyMatch(tool, q)
}

/** Highlight matched query terms in text via <mark> spans. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>
  const qLower = q.toLowerCase()
  const lower = text.toLowerCase()
  const idx = lower.indexOf(qLower)
  if (idx === -1) {
    // Try word-prefix matches
    const words = text.split(/(\s+)/)
    return (
      <>
        {words.map((w, i) =>
          w.toLowerCase().startsWith(qLower) ? (
            <mark
              key={i}
              className="rounded bg-primary/20 px-0.5 text-foreground"
            >
              {w}
            </mark>
          ) : (
            <span key={i}>{w}</span>
          )
        )}
      </>
    )
  }
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-primary/20 px-0.5 text-foreground">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}

export function HubView({
  tools,
  toolsBySlug,
  onSelect,
  searchRef,
  onOpenPalette,
  initialCategory = 'all',
}: {
  tools: Tool[]
  toolsBySlug: Map<string, Tool>
  onSelect: (slug: string) => void
  searchRef: React.RefObject<HTMLInputElement | null>
  onOpenPalette: () => void
  initialCategory?: ToolCategory | 'all'
}) {
  const [query, setQuery] = React.useState('')
  const [activeCat, setActiveCat] = React.useState<ToolCategory | 'all'>(
    initialCategory
  )

  // If the parent passes a new initialCategory (e.g. from a `#cat=` hash),
  // apply it. This lets BreadcrumbList JSON-LD links land on the right filter.
  React.useEffect(() => {
    if (initialCategory !== 'all') setActiveCat(initialCategory)
  }, [initialCategory])
  const { recent, favorites, clearRecent } = useToolHistory()

  const isFiltering = query.trim() !== '' || activeCat !== 'all'

  const filtered = React.useMemo(() => {
    // When searching with a query, fuzzy-rank across all tools (ignoring
    // category) so the best matches surface first. When only filtering by
    // category, keep category grouping intact.
    if (query.trim() && activeCat === 'all') {
      return fuzzySearchTools(tools, query)
    }
    return tools.filter((t) => {
      if (activeCat !== 'all' && t.category !== activeCat) return false
      return matchTool(t, query)
    })
  }, [tools, query, activeCat])

  const grouped = React.useMemo(() => {
    const map = new Map<ToolCategory, Tool[]>()
    for (const t of filtered) {
      if (!map.has(t.category)) map.set(t.category, [])
      map.get(t.category)!.push(t)
    }
    return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => ({
      category: c,
      items: map.get(c)!,
    }))
  }, [filtered])

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { all: tools.length }
    for (const cat of CATEGORY_ORDER) c[cat] = 0
    for (const t of tools) c[t.category] = (c[t.category] ?? 0) + 1
    return c
  }, [tools])

  const featured = React.useMemo(
    () =>
      FEATURED_SLUGS.map((s) => toolsBySlug.get(s)).filter(
        (t): t is Tool => Boolean(t)
      ),
    [toolsBySlug]
  )
  const popular = React.useMemo(
    () =>
      POPULAR_SLUGS.map((s) => toolsBySlug.get(s)).filter(
        (t): t is Tool => Boolean(t)
      ),
    [toolsBySlug]
  )
  const favTools = React.useMemo(
    () =>
      favorites
        .map((s) => toolsBySlug.get(s))
        .filter((t): t is Tool => Boolean(t)),
    [favorites, toolsBySlug]
  )
  const recentTools = React.useMemo(
    () =>
      recent
        .map((s) => toolsBySlug.get(s))
        .filter((t): t is Tool => Boolean(t)),
    [recent, toolsBySlug]
  )

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="fl-grid-bg absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div
          className="absolute -top-24 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              {tools.length} tools · 100% client-side · No sign-up
            </div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Free Online&nbsp;
              <span className="bg-gradient-to-r from-primary via-[oklch(0.65_0.2_280)] to-[oklch(0.7_0.16_200)] bg-clip-text text-transparent">
                Tools
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-foreground/75 sm:text-lg">
              A growing collection of <strong className="font-semibold text-foreground">{tools.length} fast, privacy-first tools</strong> for developers,
              designers, and marketers. No sign-up. No tracking. Works offline.
            </p>

            <div className="relative mx-auto mt-7 max-w-xl">
              <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-foreground/40">
                <Search className="size-4" />
              </div>
              <Input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools… (e.g. JSON, QR, password, BMI)"
                className="h-12 rounded-full border-border/80 bg-background/80 pl-11 pr-24 text-base shadow-sm backdrop-blur"
                aria-label="Search tools"
              />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      searchRef.current?.focus()
                    }}
                    className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenPalette}
                    className="hidden items-center gap-1 rounded-full border border-border/70 bg-muted/50 px-2 py-1 text-[10px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground sm:inline-flex"
                    aria-label="Open command palette"
                  >
                    <CommandIcon className="size-3" />
                    <kbd className="font-mono">⌘K</kbd>
                  </button>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <kbd className="rounded border border-border bg-muted/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground/80">/</kbd>
                to search
              </span>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-1.5">
                <kbd className="rounded border border-border bg-muted/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground/80">⌘K</kbd>
                command palette
              </span>
              <span className="text-border">·</span>
              <Link href="/category/developer" className="inline-flex items-center gap-1 transition hover:text-foreground">
                Browse categories
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="sticky top-14 z-30 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2.5 fl-scroll">
          <CategoryChip
            active={activeCat === 'all'}
            onClick={() => setActiveCat('all')}
            label="All"
            count={counts.all}
          />
          {CATEGORY_ORDER.map((cat) => (
            <CategoryChip
              key={cat}
              active={activeCat === cat}
              onClick={() => setActiveCat(cat)}
              label={CATEGORY_META[cat].label}
              count={counts[cat] ?? 0}
              color={CATEGORY_META[cat].color}
            />
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        {/* Quick-access rows (only when not filtering) */}
        {!isFiltering ? (
          <div className="space-y-10">
            {favTools.length > 0 ? (
              <QuickRow
                title="Favorites"
                icon={<Star className="size-4 fill-amber-400 text-amber-400" />}
                tools={favTools}
                onSelect={onSelect}
              />
            ) : null}
            {recentTools.length > 0 ? (
              <QuickRow
                title="Recently used"
                icon={<Clock className="size-4 text-muted-foreground" />}
                tools={recentTools}
                onSelect={onSelect}
                onClear={clearRecent}
                clearLabel="Clear history"
              />
            ) : null}
            <QuickRow
              title="Featured"
              icon={<Sparkles className="size-4 text-primary" />}
              tools={featured}
              onSelect={onSelect}
            />
            <QuickRow
              title="Popular"
              icon={<TrendingUp className="size-4 text-rose-500" />}
              tools={popular}
              onSelect={onSelect}
            />
          </div>
        ) : null}

        {isFiltering && filtered.length > 0 ? (
          <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground tabular-nums">
                {filtered.length}
              </span>{' '}
              tool{filtered.length === 1 ? '' : 's'} found
              {query.trim() ? (
                <>
                  {' '}for{' '}
                  <span className="font-mono text-foreground">
                    &ldquo;{query}&rdquo;
                  </span>
                </>
              ) : null}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setActiveCat('all')
              }}
              className="text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
            >
              Clear filter
            </button>
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
            <Search className="size-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium">No tools match your search</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different keyword or clear the filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setQuery('')
                setActiveCat('all')
              }}
            >
              Reset
            </Button>
          </div>
        ) : (
          <div className={`space-y-10 ${!isFiltering ? 'pt-10' : ''}`}>
            {grouped.map(({ category, items }) => (
              <div key={category} className="fl-fade-in">
                <div className="mb-4 flex items-end justify-between gap-3">
                  <Link
                    href={`/category/${category}`}
                    className="group flex items-center gap-3"
                  >
                    <span
                      className="grid size-9 place-items-center rounded-lg text-primary-foreground transition group-hover:scale-105"
                      style={{ backgroundColor: CATEGORY_META[category].color }}
                    >
                      {CATEGORY_ICONS[category]}
                    </span>
                    <div>
                      <h2 className="text-lg font-bold tracking-tight transition group-hover:text-primary">
                        {CATEGORY_META[category].label}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {CATEGORY_META[category].blurb}
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3">
                    <span className="hidden items-center gap-1 text-xs font-medium text-muted-foreground sm:flex">
                      <Layers className="size-3.5" />
                      {items.length} tool{items.length === 1 ? '' : 's'}
                    </span>
                    <Link
                      href={`/category/${category}`}
                      className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
                    >
                      View all
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((tool) => (
                    <ToolCard
                      key={tool.slug}
                      tool={tool}
                      onSelect={onSelect}
                      isFav={favorites.includes(tool.slug)}
                      query={query}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Donation + ad strip */}
      {!isFiltering ? (
        <section className="mx-auto max-w-6xl px-4 pb-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <CryptoDonate />
            <AdUnit slot="footer" />
          </div>
        </section>
      ) : null}

      {/* Browse by category — SEO internal-linking grid */}
      {!isFiltering ? (
        <section className="mx-auto max-w-6xl px-4 pb-14">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Browse by category
              </h2>
              <p className="text-xs text-muted-foreground">
                {tools.length} tools across 8 categories — pick one to dive in.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORY_ORDER.map((cat) => {
              const meta = CATEGORY_META[cat]
              const count = counts[cat] ?? 0
              return (
                <Link
                  key={cat}
                  href={`/category/${cat}`}
                  className="group relative flex flex-col gap-2 overflow-hidden rounded-xl border border-border/80 bg-card p-4 fl-card-hover"
                >
                  <div
                    className="absolute -right-6 -top-6 size-20 rounded-full opacity-10 transition group-hover:opacity-20"
                    style={{ backgroundColor: meta.color }}
                    aria-hidden="true"
                  />
                  <span
                    className="grid size-9 place-items-center rounded-lg text-xs font-bold text-primary-foreground"
                    style={{ backgroundColor: meta.color }}
                  >
                    {meta.label.slice(0, 2)}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {meta.label}
                    </h3>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                      {meta.blurb}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-[11px]">
                    <span className="font-medium text-muted-foreground tabular-nums">
                      {count} tool{count === 1 ? '' : 's'}
                    </span>
                    <ArrowRight className="size-3 text-muted-foreground/40 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      ) : null}
    </main>
  )
}

function QuickRow({
  title,
  icon,
  tools,
  onSelect,
  onClear,
  clearLabel,
}: {
  title: string
  icon: React.ReactNode
  tools: Tool[]
  onSelect: (slug: string) => void
  onClear?: () => void
  clearLabel?: string
}) {
  if (tools.length === 0) return null
  return (
    <div className="fl-fade-in">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-muted/60">
            {icon}
          </span>
          <h2 className="text-sm font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <span className="rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground tabular-nums">
            {tools.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-md px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {clearLabel}
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1 fl-scroll">
        {tools.map((tool) => (
          <button
            key={`${title}-${tool.slug}`}
            type="button"
            onClick={() => onSelect(tool.slug)}
            className="group flex w-44 shrink-0 flex-col gap-1.5 rounded-xl border border-border/80 bg-card p-3 text-left fl-card-hover"
          >
            <div className="flex items-center gap-2">
              <span
                className="grid size-7 shrink-0 place-items-center rounded-md text-[10px] font-bold text-primary-foreground"
                style={{ backgroundColor: CATEGORY_META[tool.category].color }}
              >
                {tool.name.slice(0, 2).toUpperCase()}
              </span>
              <ArrowRight className="ml-auto size-3.5 text-muted-foreground/40 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <h3 className="truncate text-xs font-semibold text-foreground">
              {tool.name}
            </h3>
            <p className="line-clamp-1 text-[11px] text-muted-foreground">
              {tool.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

function CategoryChip({
  active,
  onClick,
  label,
  count,
  color,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
  color?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
          : 'border-border/70 bg-background text-muted-foreground hover:border-border hover:text-foreground'
      }`}
    >
      {color ? (
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      ) : null}
      {label}
      <span
        className={`rounded-full px-1.5 text-[10px] tabular-nums ${
          active ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function ToolCard({
  tool,
  onSelect,
  isFav,
  query,
}: {
  tool: Tool
  onSelect: (slug: string) => void
  isFav: boolean
  query: string
}) {
  const preload = usePreloadOnHover(tool.slug)
  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={preload.onMouseEnter}
      onFocus={preload.onFocus}
      onClick={() => onSelect(tool.slug)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(tool.slug)
        }
      }}
      className="fl-card-hover group relative flex h-full cursor-pointer flex-col items-start gap-2 rounded-xl border border-border/80 bg-card p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex w-full items-start justify-between gap-2">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-lg text-xs font-bold text-primary-foreground"
          style={{ backgroundColor: CATEGORY_META[tool.category].color }}
        >
          {tool.name.slice(0, 2).toUpperCase()}
        </span>
        <div className="flex items-center gap-0.5">
          <FavoriteButton slug={tool.slug} size="sm" />
          <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 transition group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
      </div>
      <div className="mt-1">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold leading-tight text-foreground">
          <Highlight text={tool.name} query={query} />
          {isFav ? (
            <Star className="size-3 fill-amber-400 text-amber-400" />
          ) : null}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          <Highlight text={tool.description} query={query} />
        </p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
        <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          <Wand2 className="size-2.5" />
          {CATEGORY_META[tool.category].label}
        </span>
        {tool.keywords?.slice(0, 2).map((k) => (
          <span
            key={k}
            className="rounded-full border border-border/40 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground/80"
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  )
}
