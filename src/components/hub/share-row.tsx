'use client'
// src/components/hub/share-row.tsx
import * as React from 'react'
import { Link2, Check, Twitter, Linkedin } from 'lucide-react'

/**
 * ShareRow — lightweight share buttons for blog posts.
 *
 * - "Copy link" uses the async clipboard API and flips to a check icon for
 *   2s as feedback (no toast dependency).
 * - X and LinkedIn use share-intent URLs that open in a small popup window;
 *   they receive no data from us beyond the URL/title the reader chose to
 *   share (privacy-safe, no tracking scripts).
 *
 * Rendered on the client only — `window.location` is read lazily inside the
 * handlers, so SSR output stays deterministic (no hydration mismatch).
 */
export function ShareRow({
  title,
  className = '',
}: {
  title: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be denied (permissions/insecure context) — silently
      // ignore; the native share intents below still work.
    }
  }

  function openIntent(url: string) {
    window.open(
      url,
      'share',
      'noopener,noreferrer,width=600,height=520,menubar=no,toolbar=no'
    )
  }

  const btn =
    'inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background'

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      role="group"
      aria-label="Share this guide"
    >
      <span className="text-xs font-medium text-muted-foreground/80">Share:</span>
      <button type="button" onClick={copyLink} className={btn} aria-label="Copy link to this guide">
        {copied ? (
          <>
            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="size-3.5" aria-hidden />
            Copy link
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() =>
          openIntent(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.href : ''
            )}`
          )
        }
        className={btn}
        aria-label="Share on X (Twitter)"
      >
        <Twitter className="size-3.5" aria-hidden />
        X
      </button>
      <button
        type="button"
        onClick={() =>
          openIntent(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.href : ''
            )}`
          )
        }
        className={btn}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="size-3.5" aria-hidden />
        LinkedIn
      </button>
    </div>
  )
}
