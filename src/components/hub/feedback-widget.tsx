'use client'

import * as React from 'react'
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react'

/**
 * A lightweight "Did this tool help?" feedback widget.
 * Stores feedback in localStorage (per-tool, one vote per tool).
 * No server — purely client-side sentiment tracking.
 */
export function FeedbackWidget({ slug }: { slug: string }) {
  const [vote, setVote] = React.useState<'up' | 'down' | null>(null)
  const storageKey = `fl-feedback-${slug}`

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored === 'up' || stored === 'down') setVote(stored)
    } catch {
      /* private mode */
    }
  }, [storageKey])

  const record = (v: 'up' | 'down') => {
    const next = vote === v ? null : v
    setVote(next)
    try {
      if (next) localStorage.setItem(storageKey, next)
      else localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-muted/20 p-4 text-center">
      <p className="text-xs font-medium text-muted-foreground">
        Did this tool help?
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => record('up')}
          aria-label="Yes, helpful"
          aria-pressed={vote === 'up'}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            vote === 'up'
              ? 'border-success bg-success/10 text-success'
              : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground'
          }`}
        >
          {vote === 'up' ? <Check className="size-3.5" /> : <ThumbsUp className="size-3.5" />}
          Yes
        </button>
        <button
          type="button"
          onClick={() => record('down')}
          aria-label="No, not helpful"
          aria-pressed={vote === 'down'}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            vote === 'down'
              ? 'border-destructive bg-destructive/10 text-destructive'
              : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground'
          }`}
        >
          {vote === 'down' ? <Check className="size-3.5" /> : <ThumbsDown className="size-3.5" />}
          No
        </button>
      </div>
      {vote ? (
        <p className="text-[11px] text-muted-foreground">
          Thanks for your feedback!
        </p>
      ) : null}
    </div>
  )
}
