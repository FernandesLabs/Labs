'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronRight,
  Home,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Share2,
  Check,
  Link2,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdPlaceholder } from '@/lib/tools/tool-ui'
import { CATEGORY_META, type Tool } from '@/lib/tools/types'
import { FavoriteButton } from './favorite-button'
import { FeedbackWidget } from './feedback-widget'
import { ToolContent } from './tool-content'
import { AffiliateLinks } from '@/components/ads/affiliate-links'

/**
 * Per-tool view (client-side).
 *
 * After the path-based-routing migration, this component is mounted by the
 * server component at `app/tools/[slug]/page.tsx`. The server component
 * handles metadata + JSON-LD; this component handles the interactive UI.
 *
 * Navigation:
 *   - `onBack()` — go back to the hub (router.push('/'))
 *   - `onSelect(slug)` — navigate to another tool (router.push('/tools/<slug>'))
 *   - All "related tools" cards use Next.js `<Link>` (Priority 8 — internal linking)
 */
export function ToolView({
  tool,
  tools,
  toolsBySlug,
  recent,
  onBack,
  onSelect,
  relatedTools,
}: {
  tool: Tool
  tools: Tool[]
  toolsBySlug: Map<string, Tool>
  recent: string[]
  onBack: () => void
  onSelect: (slug: string) => void
  relatedTools?: Tool[]
}) {
  const Component = tool.Component
  const cat = CATEGORY_META[tool.category]

  // Related tools passed in from the server (same category, excluding current).
  // Falls back to a local computation if not provided (legacy callers).
  const recentSet = new Set(recent)
  const related = React.useMemo(() => {
    if (relatedTools && relatedTools.length > 0) return relatedTools.slice(0, 6)
    return tools
      .filter(
        (t) =>
          t.category === tool.category &&
          t.slug !== tool.slug &&
          !recentSet.has(t.slug)
      )
      .slice(0, 6)
  }, [tools, tool.category, tool.slug, recentSet, relatedTools])

  const [shareCopied, setShareCopied] = React.useState(false)
  const shareUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/tools/${tool.slug}`
  }, [tool.slug])

  const handleShare = React.useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${tool.name} — Fernandes Labs`,
          text: tool.description,
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 1500)
      }
    } catch {
      // user cancelled or clipboard failed — silent
    }
  }, [tool.name, tool.description, shareUrl])

  return (
    <main className="flex-1">
      {/* Breadcrumb — visible HTML mirrors the BreadcrumbList JSON-LD (Priority 4). */}
      <div className="border-b border-border/60 bg-muted/20">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex max-w-4xl items-center gap-1.5 px-4 py-2.5 text-xs text-muted-foreground"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition hover:text-foreground"
          >
            <Home className="size-3.5" />
            <span>Tools</span>
          </Link>
          <ChevronRight className="size-3.5 text-muted-foreground/50" />
          <Link
            href={`/#cat=${tool.category}`}
            className="capitalize transition hover:text-foreground"
          >
            {cat.label}
          </Link>
          <ChevronRight className="size-3.5 text-muted-foreground/50" />
          <span className="font-medium text-foreground" aria-current="page">
            {tool.name}
          </span>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative border-b border-border/60">
        <div
          className="absolute inset-x-0 top-0 h-px opacity-60"
          style={{
            background: `linear-gradient(to right, transparent, ${cat.color}, transparent)`,
          }}
        />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All tools
          </Button>
          <div className="flex items-start gap-3">
            <span
              className="grid size-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-primary-foreground shadow-sm"
              style={{ backgroundColor: cat.color }}
            >
              {tool.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {tool.name}
                </h1>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={`Share ${tool.name}`}
                    title="Share or copy link"
                    className="inline-grid size-8 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    {shareCopied ? (
                      <Check className="size-4 text-success" />
                    ) : (
                      <Share2 className="size-4" />
                    )}
                  </button>
                  <FavoriteButton slug={tool.slug} label={`Favorite ${tool.name}`} />
                </div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                {tool.description}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.label}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  <ShieldCheck className="size-2.5" />
                  Runs in your browser
                </span>
                {tool.keywords && tool.keywords.length > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    <Link2 className="size-2.5" />
                    {tool.keywords.slice(0, 3).join(' · ')}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool + ads */}
      <section className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-5">
          <AdPlaceholder slot="top" />
        </div>
        <div className="fl-fade-in rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-6">
          <Component />
        </div>
        <div className="mt-5">
          <AdPlaceholder slot="bottom" />
        </div>

        {/* Related tools — internal linking (Priority 8). Uses <Link> for SEO. */}
        {related.length > 0 ? (
          <div className="mt-10 fl-fade-in">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-md bg-muted/60">
                <Lightbulb className="size-3.5 text-amber-500" />
              </span>
              <h2 className="text-sm font-bold tracking-tight">
                More in {cat.label}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  prefetch={false}
                  className="group flex flex-col gap-1 rounded-xl border border-border/80 bg-card p-3 text-left fl-card-hover"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="grid size-7 shrink-0 place-items-center rounded-md text-[10px] font-bold text-primary-foreground"
                      style={{
                        backgroundColor: CATEGORY_META[t.category].color,
                      }}
                    >
                      {t.name.slice(0, 2).toUpperCase()}
                    </span>
                    <ArrowRight className="ml-auto size-3.5 text-muted-foreground/40 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <h3 className="truncate text-xs font-semibold">{t.name}</h3>
                  <p className="line-clamp-1 text-[11px] text-muted-foreground">
                    {t.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <AffiliateLinks category={tool.category} />

        <ToolContent tool={tool} />

        <FeedbackWidget slug={tool.slug} />
      </section>
    </main>
  )
}
