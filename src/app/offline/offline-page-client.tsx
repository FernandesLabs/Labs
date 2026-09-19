// src/app/offline/offline-page-client.tsx
'use client'
import * as React from 'react'
import Link from 'next/link'
import { WifiOff, RefreshCw, Home, ShieldCheck, Wrench, BookOpen } from 'lucide-react'
import { toolMetaList } from '@/lib/tools/tool-meta'
import type { ToolMeta } from '@/lib/tools/types'

/**
 * OfflinePageClient — the branded fallback shown by the service worker when a
 * navigation request fails (no network AND no cached copy of the page).
 *
 * Precached by sw.js, so it is always available. The "Try again" button is a
 * real reload (the only reliable way to re-attempt a failed navigation).
 */
export function OfflinePageClient() {
  const [online, setOnline] = React.useState(true)

  // Live connection indicator — flips the card copy the moment the network
  // returns, so the visitor immediately knows a reload will work.
  React.useEffect(() => {
    setOnline(navigator.onLine)
    const up = () => setOnline(true)
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  // Recently used tools (same localStorage key as use-tool-history) — gives
  // returning visitors a one-tap path back to the tools they rely on, which
  // are the pages most likely to already be in the runtime cache.
  //
  // HYDRATION NOTE: this MUST be read in an effect, not in a useMemo/render
  // path. Reading localStorage during the first client render produces markup
  // that differs from the server HTML (server has no storage), which React
  // reports as a hydration mismatch and discards the whole tree. Start empty
  // (matches SSR), then fill in after hydration — same pattern as
  // useToolHistory's mount effect above.
  const [recentlyUsed, setRecentlyUsed] = React.useState<ToolMeta[]>([])
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem('fl-recent-tools')
      const slugs: unknown = raw ? JSON.parse(raw) : []
      if (!Array.isArray(slugs)) return
      setRecentlyUsed(
        slugs
          .filter((s): s is string => typeof s === 'string')
          .map((s) => toolMetaList.find((t) => t.slug === s))
          .filter((t): t is ToolMeta => Boolean(t))
          .slice(0, 4)
      )
    } catch {
      /* private mode / corrupted storage — stay empty */
    }
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-primary/5 px-4 py-16">
      {/* Soft radial glows — matches the site's gradient accents */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-primary/5 blur-3xl"
        aria-hidden
      />

      <main className="relative w-full max-w-lg">
        <div className="rounded-2xl border border-border/70 bg-card p-8 text-center shadow-sm sm:p-10">
          <div
            className={`mx-auto mb-6 flex size-16 items-center justify-center rounded-full border transition-colors ${
              online
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
            aria-hidden
          >
            {online ? (
              <RefreshCw className="size-7" />
            ) : (
              <WifiOff className="size-7" />
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {online ? 'Connection restored' : "You're offline"}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
            {online
              ? 'Your network is back. Reload to continue where you left off.'
              : "This page hasn't been cached yet. Pages you've already visited still work — everything on Fernandes Labs runs right in your browser."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <RefreshCw className="size-4" aria-hidden />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border/70 bg-background px-5 text-sm font-medium text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Home className="size-4" aria-hidden />
              Go to homepage
            </Link>
          </div>

          {/* What works offline */}
          <ul className="mt-8 grid grid-cols-1 gap-2 text-left sm:grid-cols-3">
            {[
              { icon: Wrench, label: 'Cached tools run fully offline' },
              { icon: ShieldCheck, label: 'No data leaves your device' },
              { icon: BookOpen, label: 'Saved guides stay readable' },
            ].map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 p-3"
              >
                <Icon
                  className="mt-0.5 size-3.5 shrink-0 text-primary"
                  aria-hidden
                />
                <span className="text-[11px] leading-snug text-muted-foreground">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          {/* Recently used tools — quick resume, straight from localStorage */}
          {recentlyUsed.length > 0 ? (
            <div className="mt-6 border-t border-border/60 pt-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Jump back in
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {recentlyUsed.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
              <p className="mt-3 text-[10px] text-muted-foreground/70">
                Cached copies of these pages may be available offline.
              </p>
            </div>
          ) : null}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground/70">
          Fernandes Labs — {toolMetaList.length} free tools that run entirely in
          your browser.
        </p>
      </main>
    </div>
  )
}
