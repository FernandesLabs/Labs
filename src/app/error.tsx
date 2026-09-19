'use client'
// src/app/error.tsx — route-segment error boundary.
//
// Without this file, any uncaught client-side render error shows Next.js's
// default English-only "Application error" screen: no branding, no navigation,
// no recovery path. For a tools site where a reviewer or visitor may land on
// any of 132 tool pages, one render error becomes a branded dead end.
//
// Deliberately SELF-CONTAINED: no SiteHeader/SiteFooter/site-wide providers —
// if one of those threw, importing them here could throw again inside the
// boundary. Just icons, links, and the error state itself.

import * as React from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home, Wrench, ExternalLink } from 'lucide-react'

/** Same shortlist as the 404 page — proven, evergreen tools. */
const POPULAR_SLUGS = ['json-formatter', 'password-generator', 'qr-generator', 'uuid-generator']

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Dev-only detail helps debugging; production visitors get the digest code
  // they can quote in a bug report without exposing stack traces.
  const showDetail = process.env.NODE_ENV === 'development'

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-primary/5 px-4 py-16">
      {/* Soft radial glows — same treatment as /offline */}
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
            className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
            aria-hidden
          >
            <AlertTriangle className="size-7" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
            An unexpected error interrupted this page. Anything you had open in
            other tools is safe — everything on Fernandes Labs runs locally in
            your browser. Retrying usually fixes it.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
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

          {/* Error reference — reportable without leaking internals */}
          {error.digest ? (
            <p className="mt-6 font-mono text-[11px] text-muted-foreground/70">
              Error reference:{' '}
              <span className="select-all">{error.digest}</span>
            </p>
          ) : null}

          {showDetail && error.message ? (
            <details className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-3 text-left">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                Developer details
              </summary>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-muted-foreground">
                {error.message}
              </pre>
            </details>
          ) : null}

          {/* Quick resume — same chips as the offline page */}
          <div className="mt-6 border-t border-border/60 pt-5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Or jump to a popular tool
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_SLUGS.map((slug) => (
                <Link
                  key={slug}
                  href={`/tools/${slug}`}
                  className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Wrench className="size-3" aria-hidden />
                  {slug
                    .split('-')
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ')}
                </Link>
              ))}
              <Link
                href="/blog"
                className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ExternalLink className="size-3" aria-hidden />
                Blog &amp; guides
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground/70">
          Fernandes Labs — free tools that run entirely in your browser.
        </p>
      </main>
    </div>
  )
}
