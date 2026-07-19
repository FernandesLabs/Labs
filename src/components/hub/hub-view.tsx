// src/components/hub/hub-view.tsx
'use client'
import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search,
  X,
  ArrowRight,
  Layers,
  Star,
  Clock,
  Sparkles,
  Command as CommandIcon,
  ShieldCheck,
  Zap,
  Lock,
  TrendingUp,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type Tool,
  type ToolCategory,
} from '@/lib/tools/types'
import { useToolHistory } from '@/lib/tools/use-tool-history'
import { fuzzyMatch, fuzzySearchTools } from '@/lib/tools/fuzzy-search'
import { preloadTool, usePreloadOnHover } from '@/lib/tools/preload'
import { FavoriteButton } from './favorite-button'
import { AdUnit } from '@/components/ads/ad-unit'
import { CryptoDonate } from '@/components/ads/crypto-donate'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  developer: '{ }',
  text: 'Tt',
  finance: '%',
  seo: 'SEO',
  security: '🔒',
  network: '🌐',
  media: '◐',
  misc: '✦',
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
            <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">{w}</mark>
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
      <mark className="bg-primary/20 text-foreground rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
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
  initialCategory,
  initialQuery,
}: {
  tools: Tool[]
  toolsBySlug: Map<string, Tool>
  onSelect: (slug: string) => void
  searchRef: React.RefObject<HTMLInputElement>
  onOpenPalette: () => void
  initialCategory?: string
  initialQuery?: string
}) {
  const [query, setQuery] = React.useState(initialQuery ?? '')
  const [activeCat, setActiveCat] = React.useState<string>(initialCategory ?? 'all')
  const { recent, favorites, clearRecent } = useToolHistory()
  const isFiltering = query.trim() !== '' || activeCat !== 'all'

  // Track the last externally-supplied initialCategory so we only sync when it
  // actually changes from the outside — NOT every time the user clicks a chip.
  // Without this guard, clicking a category chip would set `activeCat`, which
  // re-runs the effect, which resets `activeCat` back to `initialCategory`,
  // making it impossible to change categories.
  const lastInitialCat = React.useRef<string | undefined>(initialCategory)
  React.useEffect(() => {
    // Only apply when the external prop itself changed (e.g. navigating via a
    // #cat=… hash link), never in response to a user click.
    if (initialCategory !== lastInitialCat.current) {
      lastInitialCat.current = initialCategory
      if (initialCategory && initialCategory !== activeCat) {
        setActiveCat(initialCategory)
      }
    }
  }, [initialCategory, activeCat])
  const lastInitialQuery = React.useRef<string | undefined>(initialQuery)
  React.useEffect(() => {
    if (initialQuery !== lastInitialQuery.current) {
      lastInitialQuery.current = initialQuery
      if (typeof initialQuery === 'string' && initialQuery !== query) {
        setQuery(initialQuery)
      }
    }
  }, [initialQuery, query])

  const filtered = React.useMemo(() => {
    if (query.trim() && activeCat === 'all') {
      return fuzzySearchTools(tools, query)
    }
    return tools.filter((t) => {
      if (activeCat !== 'all' && t.category !== activeCat) return false
      return matchTool(t, query)
    })
  }, [tools, query, activeCat])
  const grouped = React.useMemo(() => {
    const map = new Map<string, Tool[]>()
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
    <main id="main-content" className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="relative mb-8 flex flex-col items-center overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-muted/40 to-background px-6 py-10 text-center sm:py-12">
        <div className="fl-grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="relative z-10 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Free Online <span className="text-primary">Tools</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            A growing collection of {tools.length} fast, privacy-first tools for developers,
            designers, and marketers. No sign-up. No tracking. Works offline.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="mt-6 w-full max-w-xl"
          >
            {/* Search input — wrapped in a relative container so the icon and
                the ⌘K / clear button are centered against the input itself,
                not the whole block (which also contains the tip text below). */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools… (e.g. JSON, QR, password, BMI)"
                className="h-12 rounded-full border-border/80 bg-background/80 pl-11 pr-24 text-base shadow-sm backdrop-blur"
                aria-label="Search tools"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    searchRef.current?.focus()
                  }}
                  className="absolute right-14 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenPalette}
                  className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md border bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground transition hover:bg-muted/80"
                >
                  ⌘K
                </button>
              )}
            </div>
            {/* Search tip / keyboard shortcut hint */}
            <p className="mt-2 text-xs text-muted-foreground">
              Tip: press <kbd className="rounded border bg-muted px-1">/</kbd> to search,{' '}
              <kbd className="rounded border bg-muted px-1">⌘K</kbd> for the command palette
            </p>
          </motion.div>
          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <Lock className="size-3.5 text-emerald-500" />
              100% client-side
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="size-3.5 text-amber-500" />
              Instant results
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" />
              No data leaves your browser
            </span>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-primary" />
              {CATEGORY_ORDER.length} categories
            </span>
          </motion.div>
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
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
      {/* Tools */}
      <div className="space-y-8">
        {/* Quick-access rows (only when not filtering) */}
        {!isFiltering ? (
          <>
            {favTools.length > 0 ? (
              <QuickRow title="Favorites" icon={<Star className="h-4 w-4 text-yellow-500" />} tools={favTools} onSelect={onSelect} />
            ) : null}
            {recentTools.length > 0 ? (
              <QuickRow title="Recently Used" icon={<Clock className="h-4 w-4 text-blue-500" />} tools={recentTools} onSelect={onSelect} onClear={clearRecent} clearLabel="Clear history" />
            ) : null}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-semibold">Featured</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {featured.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} onSelect={onSelect} isFav={favorites.includes(tool.slug)} query="" />
                ))}
              </div>
            </div>
          </>
        ) : null}
        {isFiltering && filtered.length > 0 ? (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filtered.length}</span>{' '}
              tool{filtered.length === 1 ? '' : 's'} found
              {query.trim() ? (
                <>
                  {' '}for{' '}
                  <span className="font-medium text-foreground">“{query}”</span>
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
          <EmptyState
            query={query}
            onReset={() => {
              setQuery('')
              setActiveCat('all')
            }}
            onSelect={onSelect}
            tools={tools}
            toolsBySlug={toolsBySlug}
          />
        ) : (
          grouped.map(({ category, items }) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{CATEGORY_ICONS[category]}</span>
                <h2 className="text-lg font-semibold">{CATEGORY_META[category].label}</h2>
                <span className="hidden text-xs text-muted-foreground sm:inline">{CATEGORY_META[category].blurb}</span>
                <span className="ml-auto text-xs text-muted-foreground">{items.length} tool{items.length === 1 ? '' : 's'}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {items.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} onSelect={onSelect} isFav={favorites.includes(tool.slug)} query={query} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Donation + ad strip */}
      {!isFiltering ? (
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <AdUnit slot="horizontal" />
          </div>
          <div className="w-full sm:w-80">
            <CryptoDonate />
          </div>
        </div>
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
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-xs text-muted-foreground">{tools.length}</span>
        {onClear ? (
          <button type="button" onClick={onClear} className="ml-auto text-[11px] font-medium text-muted-foreground transition hover:text-foreground">
            {clearLabel}
          </button>
        ) : null}
      </div>
      <div className="fl-scroll flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {tools.map((tool) => (
          <button
            key={tool.slug}
            type="button"
            onClick={() => onSelect(tool.slug)}
            onMouseEnter={() => preloadTool(tool.slug)}
            className="fl-card-hover group flex w-44 shrink-0 flex-col gap-1.5 rounded-xl border border-border/80 bg-card p-3 text-left"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              {tool.name.slice(0, 2).toUpperCase()}
            </div>
            <h3 className="text-sm font-medium">{tool.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
          : 'border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {color ? <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} /> : null}
      {label}
      <span className={`text-[10px] ${active ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
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
  const preloadProps = usePreloadOnHover(tool.slug)
  const cat = CATEGORY_META[tool.category]
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative h-full"
    >
      <button
        type="button"
        {...preloadProps}
        onClick={() => onSelect(tool.slug)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(tool.slug)
          }
        }}
        className="fl-card-hover group relative flex h-full w-full cursor-pointer flex-col items-start gap-2 overflow-hidden rounded-xl border border-border/80 bg-card p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {/* Category color accent strip */}
        <span
          className="absolute inset-x-0 top-0 h-0.5 opacity-60 transition-opacity group-hover:opacity-100"
          style={{ backgroundColor: cat.color }}
          aria-hidden
        />
        <div className="flex w-full items-start justify-between gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold"
            style={{
              backgroundColor: `color-mix(in oklch, ${cat.color} 14%, transparent)`,
              color: cat.color,
            }}
          >
            {tool.name.slice(0, 2).toUpperCase()}
          </div>
          <span
            className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
            style={{
              borderColor: `color-mix(in oklch, ${cat.color} 35%, transparent)`,
              color: cat.color,
            }}
          >
            {CATEGORY_ICONS[tool.category]}
          </span>
        </div>
        <h3 className="text-sm font-medium leading-tight">
          {isFav ? <Star className="inline h-3 w-3 fill-current text-yellow-500 mr-1 -mt-0.5" /> : null}
          <Highlight text={tool.name} query={query} />
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          <Highlight text={tool.description} query={query} />
        </p>
        <span className="mt-auto flex items-center gap-1 pt-1 text-[10px] font-medium text-muted-foreground/70 transition group-hover:text-primary">
          {cat.label}
          <ArrowRight className="size-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
        </span>
      </button>
      {/* Favorite toggle — positioned over the card corner, stops propagation */}
      <div className="absolute right-1.5 top-1.5">
        <FavoriteButton slug={tool.slug} size="sm" />
      </div>
    </motion.div>
  )
}

function EmptyState({
  query,
  onReset,
  onSelect,
  tools,
  toolsBySlug,
}: {
  query: string
  onReset: () => void
  onSelect: (slug: string) => void
  tools: Tool[]
  toolsBySlug: Map<string, Tool>
}) {
  // Suggest popular tools (featured slugs that exist in the registry).
  const suggestions = React.useMemo(
    () =>
      FEATURED_SLUGS.map((s) => toolsBySlug.get(s))
        .filter((t): t is Tool => Boolean(t))
        .slice(0, 4),
    [toolsBySlug]
  )
  // Suggest a few categories to browse.
  const topCats = React.useMemo(
    () =>
      CATEGORY_ORDER.slice(0, 4).map((c) => ({
        category: c,
        meta: CATEGORY_META[c],
        count: tools.filter((t) => t.category === c).length,
      })),
    [tools]
  )
  return (
    <div className="fl-fade-in flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 p-8 text-center sm:p-12">
      <Layers className="h-10 w-10 text-muted-foreground/50" />
      <p className="mt-3 text-base font-medium text-foreground">
        No tools match{query.trim() ? (
          <>
            {' '}
            <span className="text-primary">&ldquo;{query}&rdquo;</span>
          </>
        ) : null}
      </p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Try a different keyword, browse a category below, or check out one of
        our most popular tools.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background px-3 py-1.5 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
      >
        Reset search
      </button>
      {/* Popular tools */}
      {suggestions.length > 0 ? (
        <div className="mt-8 w-full">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Popular tools
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {suggestions.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                onSelect={onSelect}
                isFav={false}
                query=""
              />
            ))}
          </div>
        </div>
      ) : null}
      {/* Category quick-links */}
      <div className="mt-8 w-full">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Browse by category
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {topCats.map(({ category, meta, count }) => (
            <Link
              key={category}
              href={`/category/${category}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: meta.color }}
                aria-hidden
              />
              {meta.label}
              <span className="text-[10px] text-muted-foreground/70">{count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
