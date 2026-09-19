'use client'
// src/app/insights/insights-client.tsx — the feedback dashboard body.
//
// Fetches aggregate votes from /api/feedback/all and turns them into an
// actionable ranking: most-used pages, helpfulness percentage, and a
// "needs attention" view for pages that frustrate visitors. Data is
// aggregate-only (the same anonymous counts the public per-slug API returns).

import * as React from 'react'
import Link from 'next/link'
import {
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Inbox,
  AlertTriangle,
  Trophy,
  MessagesSquare,
  FileQuestion,
  Target,
  ExternalLink,
} from 'lucide-react'
import { toolMetaList } from '@/lib/tools/tool-meta'
import type { FeedbackAggregate, FeedbackTotals } from '@/lib/feedback/aggregate'

type SortKey = 'votes' | 'lowest' | 'recent'
type FetchState = 'loading' | 'ready' | 'error'

const REFRESH_MS = 30_000

export function InsightsClient({ guideSlugs = [] }: { guideSlugs?: string[] }) {
  const [state, setState] = React.useState<FetchState>('loading')
  const [pages, setPages] = React.useState<FeedbackAggregate[]>([])
  const [totals, setTotals] = React.useState<FeedbackTotals | null>(null)
  const [sort, setSort] = React.useState<SortKey>('votes')
  const [onlyProblems, setOnlyProblems] = React.useState(false)
  const [autoRefresh, setAutoRefresh] = React.useState(false)
  const [updatedAt, setUpdatedAt] = React.useState<string | null>(null)
  const guideSet = React.useMemo(() => new Set(guideSlugs), [guideSlugs])

  const load = React.useCallback(() => {
    let cancelled = false
    fetch('/api/feedback/all')
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (data: {
          ok?: boolean
          totals?: FeedbackTotals
          pages?: FeedbackAggregate[]
        } | null) => {
          if (cancelled) return
          if (data?.ok && data.pages) {
            setPages(data.pages)
            setTotals(data.totals ?? null)
            setState('ready')
            setUpdatedAt(new Date().toLocaleTimeString())
          } else {
            setState('error')
          }
        }
      )
      .catch(() => {
        if (!cancelled) setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  React.useEffect(() => {
    const cleanup = load()
    return cleanup
  }, [load])

  // Optional auto-refresh — handy to keep open on a second monitor while
  // traffic comes in. Interval only runs while the toggle is on.
  React.useEffect(() => {
    if (!autoRefresh) return
    const id = window.setInterval(load, REFRESH_MS)
    return () => window.clearInterval(id)
  }, [autoRefresh, load])

  const sorted = React.useMemo(() => {
    const list = onlyProblems
      ? pages.filter((p) => p.helpfulPct !== null && p.helpfulPct < 60)
      : pages
    const copy = [...list]
    if (sort === 'votes') {
      copy.sort((a, b) => b.total - a.total || b.up - a.up)
    } else if (sort === 'lowest') {
      copy.sort(
        (a, b) =>
          (a.helpfulPct ?? 101) - (b.helpfulPct ?? 101) || b.total - a.total
      )
    } else {
      copy.sort(
        (a, b) =>
          new Date(b.lastAt ?? 0).getTime() - new Date(a.lastAt ?? 0).getTime()
      )
    }
    return copy
  }, [pages, sort, onlyProblems])

  const worst = React.useMemo(
    () =>
      [...pages]
        .filter((p) => p.helpfulPct !== null && p.helpfulPct < 60)
        .sort((a, b) => (a.helpfulPct ?? 100) - (b.helpfulPct ?? 100))[0] ?? null,
    [pages]
  )
  const best = React.useMemo(
    () =>
      [...pages]
        .filter((p) => p.helpfulPct !== null)
        .sort(
          (a, b) =>
            (b.helpfulPct ?? 0) - (a.helpfulPct ?? 0) || b.total - a.total
        )[0] ?? null,
    [pages]
  )

  const hrefFor = (slug: string): { href: string | null; kind: 'tool' | 'guide' | 'other' } => {
    if (toolMetaList.some((t) => t.slug === slug)) return { href: `/tools/${slug}`, kind: 'tool' }
    if (guideSet.has(slug)) return { href: `/blog/${slug}`, kind: 'guide' }
    return { href: null, kind: 'other' }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Feedback insights
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Aggregate 👍/👎 votes from every tool page and guide. Use it to spot
            what visitors love — and which pages need a fix first.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border/70 bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RefreshCw className="size-4" aria-hidden />
            Refresh
          </button>
          <label className="inline-flex min-h-11 cursor-pointer select-none items-center gap-2 rounded-lg border border-border/70 bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted focus-within:ring-2 focus-within:ring-ring">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="size-4 accent-[hsl(var(--primary))]"
            />
            Auto (30s)
          </label>
        </div>
      </header>

      <p className="mt-2 text-xs text-muted-foreground/70" aria-live="polite">
        {state === 'ready' && updatedAt
          ? `Updated ${updatedAt}`
          : state === 'loading'
            ? 'Loading feedback…'
            : state === 'error'
              ? 'Could not load feedback data.'
              : ''}
      </p>

      {/* Summary cards */}
      {state === 'ready' && totals ? (
        <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Summary">
          <StatCard
            icon={MessagesSquare}
            label="Total votes"
            value={totals.votes.toLocaleString()}
            sub={`${totals.up.toLocaleString()} 👍 · ${totals.down.toLocaleString()} 👎`}
          />
          <StatCard
            icon={ThumbsUp}
            label="Site-wide helpful"
            value={totals.helpfulPct === null ? '—' : `${totals.helpfulPct}%`}
            sub={totals.helpfulPct === null ? 'not enough votes yet' : 'of all votes are 👍'}
          />
          <StatCard
            icon={FileQuestion}
            label="Pages with feedback"
            value={totals.pages.toLocaleString()}
            sub={`of ${toolMetaList.length} tools + guides`}
          />
          {worst ? (
            <StatCard
              icon={Target}
              label="Needs attention"
              value={`${worst.helpfulPct}%`}
              sub={worst.slug}
              href={hrefFor(worst.slug).href}
              tone="critical"
            />
          ) : (
            <StatCard
              icon={Trophy}
              label="Crowd favorite"
              value={best ? `${best.helpfulPct}%` : '—'}
              sub={best ? best.slug : 'no rated pages yet'}
              href={best ? hrefFor(best.slug).href : null}
              tone="positive"
            />
          )}
        </section>
      ) : null}

      {/* Controls */}
      {state === 'ready' && pages.length > 0 ? (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="insights-sort" className="text-xs font-medium text-muted-foreground">
              Sort by
            </label>
            <select
              id="insights-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-9 rounded-lg border border-border/70 bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="votes">Most votes</option>
              <option value="lowest">Lowest rated first</option>
              <option value="recent">Most recent activity</option>
            </select>
          </div>
          <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={onlyProblems}
              onChange={(e) => setOnlyProblems(e.target.checked)}
              className="size-4 accent-[hsl(var(--primary))]"
            />
            Only pages below 60% helpful
          </label>
        </div>
      ) : null}

      {/* Body states */}
      {state === 'loading' ? (
        <div className="mt-6 space-y-2" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted/50" />
          ))}
        </div>
      ) : state === 'error' ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-8 text-center">
          <AlertTriangle className="size-6 text-red-600 dark:text-red-400" aria-hidden />
          <p className="text-sm font-medium text-foreground">
            The feedback service could not be reached.
          </p>
          <button
            type="button"
            onClick={load}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RefreshCw className="size-4" aria-hidden />
            Try again
          </button>
        </div>
      ) : pages.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-10 text-center">
          <Inbox className="size-8 text-muted-foreground/60" aria-hidden />
          <p className="text-sm font-medium text-foreground">No feedback yet</p>
          <p className="max-w-sm text-xs text-muted-foreground">
            Votes appear here as soon as visitors use the “Did this help?”
            widget on a tool page or guide. Try voting on any tool to see it
            show up.
          </p>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border/70 bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Browse tools
            <ExternalLink className="size-3.5" aria-hidden />
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-border/70 bg-card">
          <div className="max-h-[32rem] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-semibold">#</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Page</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">👍</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">👎</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Helpful</th>
                  <th scope="col" className="hidden px-4 py-3 text-right font-semibold sm:table-cell">
                    Last vote
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, i) => {
                  const { href, kind } = hrefFor(p.slug)
                  const pct = p.helpfulPct
                  return (
                    <tr
                      key={p.slug}
                      className="border-t border-border/50 transition hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 text-xs tabular-nums text-muted-foreground/70">
                        {i + 1}
                      </td>
                      <td className="max-w-[16rem] px-4 py-3">
                        {href ? (
                          <Link
                            href={href}
                            className="font-medium text-foreground underline decoration-border underline-offset-2 transition hover:text-primary hover:decoration-primary"
                          >
                            {p.slug}
                          </Link>
                        ) : (
                          <span className="font-medium text-foreground">{p.slug}</span>
                        )}
                        <span className="ml-2 rounded-full border border-border/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                          {kind === 'tool' ? 'tool' : kind === 'guide' ? 'guide' : 'page'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                        {p.up}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-red-600 dark:text-red-400">
                        {p.down}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"
                            role="meter"
                            aria-valuenow={pct ?? undefined}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={
                              pct === null ? 'Not enough votes' : `${pct}% helpful`
                            }
                          >
                            <div
                              className={`h-full rounded-full ${
                                pct === null
                                  ? 'bg-muted-foreground/40'
                                  : pct >= 80
                                    ? 'bg-emerald-500'
                                    : pct >= 60
                                      ? 'bg-amber-500'
                                      : 'bg-red-500'
                              }`}
                              style={{ width: `${pct ?? 0}%` }}
                            />
                          </div>
                          <span
                            className={`text-xs font-semibold tabular-nums ${
                              pct === null
                                ? 'text-muted-foreground/60'
                                : pct >= 80
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : pct >= 60
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {pct === null ? 'low sample' : `${pct}%`}
                          </span>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-right text-xs text-muted-foreground sm:table-cell">
                        {p.lastAt ? relativeTime(p.lastAt) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground/70">
        Privacy: this dashboard shows only anonymous aggregate counts per page —
        the same numbers the public feedback API returns. No identifiers are
        collected anywhere on the site.
      </p>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  href,
  tone = 'neutral',
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub: string
  href?: string | null
  tone?: 'neutral' | 'positive' | 'critical'
}) {
  const toneRing =
    tone === 'positive'
      ? 'border-emerald-500/30 bg-emerald-500/5'
      : tone === 'critical'
        ? 'border-red-500/30 bg-red-500/5'
        : 'border-border/70 bg-card'
  const body = (
    <>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</p>
    </>
  )
  const cls = `block rounded-xl border p-4 transition ${toneRing} ${
    href ? 'hover:-translate-y-0.5 hover:shadow-md' : ''
  }`
  return href ? (
    <Link href={href} className={cls} aria-label={`${label}: ${value} — open ${sub}`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  )
}

/** Compact relative time for the "Last vote" column. */
function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  if (Number.isNaN(ms)) return '—'
  const minutes = Math.floor(ms / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}
