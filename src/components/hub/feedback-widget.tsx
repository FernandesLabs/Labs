'use client'
import * as React from 'react'
import { ThumbsUp, ThumbsDown, Check, Users } from 'lucide-react'
/**
 * "Did this help?" feedback widget for tool pages and blog guides.
 *
 * - One vote per page per browser (localStorage `fl-feedback-<slug>`).
 * - Votes are POSTed to /api/feedback, which stores ONLY { slug, helpful }
 *   (no identifiers — see /privacy). Aggregate counts are fetched on mount
 *   and rendered as social proof.
 * - Fully offline-safe: if the API is unreachable the widget falls back to
 *   local-only sentiment and simply hides the counts.
 */
export function FeedbackWidget({
  slug,
  label = 'tool',
}: {
  slug: string
  /** Copy variant: "tool" → "Did this tool help?", "guide" → "Was this guide helpful?" */
  label?: 'tool' | 'guide'
}) {
  const [vote, setVote] = React.useState<'up' | 'down' | null>(null)
  const [counts, setCounts] = React.useState<{ up: number; down: number } | null>(null)
  const storageKey = `fl-feedback-${slug}`

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored === 'up' || stored === 'down') setVote(stored)
    } catch {
      /* private mode */
    }
    // Aggregate counts — best-effort; hidden when offline / API down.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return
    let cancelled = false
    fetch(`/api/feedback?slug=${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { ok?: boolean; up?: number; down?: number } | null) => {
        if (!cancelled && data?.ok) setCounts({ up: data.up ?? 0, down: data.down ?? 0 })
      })
      .catch(() => {
        /* offline or API down — counts stay hidden */
      })
    return () => {
      cancelled = true
    }
  }, [slug, storageKey])

  const record = (v: 'up' | 'down') => {
    const next = vote === v ? null : v
    setVote(next)
    // Optimistic count update (only when counts are visible).
    if (counts && vote) {
      setCounts((c) =>
        c
          ? {
              up: c.up - (vote === 'up' ? 1 : 0) + (next === 'up' ? 1 : 0),
              down: c.down - (vote === 'down' ? 1 : 0) + (next === 'down' ? 1 : 0),
            }
          : c
      )
    } else if (counts && next) {
      setCounts((c) =>
        c ? { up: c.up + (next === 'up' ? 1 : 0), down: c.down + (next === 'down' ? 1 : 0) } : c
      )
    }
    try {
      if (next) localStorage.setItem(storageKey, next)
      else localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
    // Persist anonymously — fire-and-forget; local vote survives failures.
    if (next) {
      fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, helpful: next === 'up' }),
      }).catch(() => {
        /* offline — vote kept locally, retried naturally on the next visit */
      })
    }
  }

  const helpfulCount = counts?.up ?? 0

  return (
    <div
      className={
        vote
          ? 'relative overflow-hidden rounded-xl border border-success/30 bg-gradient-to-br from-success/[0.06] via-transparent to-transparent p-5 text-center shadow-[0_1px_0_0_rgba(0,0,0,0.02)] transition-colors duration-500'
          : 'relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-muted/40 via-transparent to-transparent p-5 text-center shadow-[0_1px_0_0_rgba(0,0,0,0.02)] transition-colors duration-500'
      }
    >
      <p className="text-sm font-semibold text-foreground">
        {label === 'guide' ? 'Was this guide helpful?' : 'Did this tool help?'}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Anonymous — one tap, no sign-up.
      </p>
      <div className="mt-3 flex items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={() => record('up')}
          aria-label="Yes, this was helpful"
          aria-pressed={vote === 'up'}
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 ${
            vote === 'up'
              ? 'border-success bg-success/10 text-success shadow-sm shadow-success/20'
              : 'border-border bg-background text-muted-foreground hover:-translate-y-0.5 hover:border-success/50 hover:text-success hover:shadow-sm'
          }`}
        >
          {vote === 'up' ? <Check className="size-4" /> : <ThumbsUp className="size-4" />}
          Yes
        </button>
        <button
          type="button"
          onClick={() => record('down')}
          aria-label="No, this was not helpful"
          aria-pressed={vote === 'down'}
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 ${
            vote === 'down'
              ? 'border-destructive bg-destructive/10 text-destructive shadow-sm shadow-destructive/20'
              : 'border-border bg-background text-muted-foreground hover:-translate-y-0.5 hover:border-destructive/50 hover:text-destructive hover:shadow-sm'
          }`}
        >
          {vote === 'down' ? <Check className="size-4" /> : <ThumbsDown className="size-4" />}
          No
        </button>
      </div>
      {/* Social proof + thanks — rendered client-side only (counts arrive async). */}
      {vote ? (
        <p
          className="mt-3 inline-flex origin-center items-center gap-1.5 text-xs font-medium text-success"
          style={{ animation: 'feedback-pop 0.35s ease-out' }}
        >
          <Check className="size-3.5" aria-hidden />
          Thanks for your feedback!
        </p>
      ) : null}
      {helpfulCount > 0 ? (
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
          <Users className="size-3.5 shrink-0" aria-hidden />
          <span>
            {helpfulCount.toLocaleString()}{' '}
            {helpfulCount === 1 ? 'person found' : 'people found'} this {label} helpful
          </span>
        </p>
      ) : null}
    </div>
  )
}
