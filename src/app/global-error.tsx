'use client'
// src/app/global-error.tsx — the LAST-RESORT error boundary.
//
// This boundary replaces the entire root layout when the root layout itself
// throws (or an error escapes every nested boundary). Next.js requires it to
// render its own <html> and <body>.
//
// Resilience rules:
//   - ZERO imports from app code (no site-config, no components, no lib) —
//     anything imported here is a re-throw risk inside a broken tree.
//   - Inline styles only. When the root layout fails, compiled CSS/Tailwind
//     chunks may not be available, so class-based styling can silently no-op.
//   - Only navigation via plain <a> (next/link needs router context that the
//     broken tree no longer guarantees).
//
// Color values mirror the site's light theme tokens so the fallback still
// reads as "Fernandes Labs" even with no stylesheet loaded.

import * as React from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#fafafa',
          color: '#18181b',
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <main
          style={{
            width: '100%',
            maxWidth: 480,
            backgroundColor: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: 16,
            padding: '40px 32px',
            textAlign: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <div
            aria-hidden
            style={{
              width: 64,
              height: 64,
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '1px solid rgba(239,68,68,0.3)',
              backgroundColor: 'rgba(239,68,68,0.1)',
              fontSize: 28,
              color: '#dc2626',
            }}
          >
            !
          </div>

          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em' }}>
            Something went wrong
          </h1>
          <p
            style={{
              margin: '12px auto 0',
              maxWidth: 340,
              fontSize: 14,
              lineHeight: 1.6,
              color: '#71717a',
            }}
          >
            A critical error interrupted the site. Retrying usually fixes it.
          </p>

          <div
            style={{
              marginTop: 28,
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: 44,
                padding: '0 20px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: '#18181b',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                minHeight: 44,
                padding: '14px 20px',
                borderRadius: 8,
                border: '1px solid #e4e4e7',
                backgroundColor: '#ffffff',
                color: '#18181b',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Go to homepage
            </a>
          </div>

          {error?.digest ? (
            <p
              style={{
                margin: '24px 0 0',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 11,
                color: '#a1a1aa',
              }}
            >
              Error reference: <span style={{ userSelect: 'all' }}>{error.digest}</span>
            </p>
          ) : null}
        </main>
      </body>
    </html>
  )
}
