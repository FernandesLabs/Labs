'use client'
// src/components/hub/newsletter-cta.tsx
import * as React from 'react'
import { Mail, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react'

/**
 * NewsletterCta — reusable subscribe card (currently mounted on blog posts).
 *
 * POSTs `{ email }` to the existing /api/newsletter endpoint, which validates
 * and (when a provider is configured) forwards the subscription. The UI has
 * three states: idle → loading → success | error, with inline feedback and a
 * "subscribe another email" reset in the success state.
 *
 * Accessibility: the input is labelled, errors are announced via
 * aria-live="polite", and the whole card is a labelled region.
 */
export function NewsletterCta({
  title = 'Get new guides in your inbox',
  description = 'One short email when we publish a new guide or tool. No spam, unsubscribe anytime.',
  className = '',
}: {
  title?: string
  description?: string
  className?: string
}) {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = React.useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json()) as { ok: boolean; message?: string; error?: string }
      if (res.ok && data.ok) {
        setStatus('success')
        setMessage(data.message ?? "You're subscribed!")
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error — please check your connection and try again.')
    }
  }

  return (
    <section
      aria-label="Newsletter subscription"
      className={`relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-card to-card p-6 sm:p-7 ${className}`}
    >
      {/* Decorative corner glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-2xl"
        aria-hidden
      />
      <div className="relative">
        <div className="flex items-start gap-3.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
            <Mail className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-bold tracking-tight text-foreground">{title}</h2>
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </div>

        {status === 'success' ? (
          <div
            className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] p-3.5 text-sm"
            role="status"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <div>
              <p className="font-semibold text-foreground">{message}</p>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle')
                  setMessage('')
                }}
                className="mt-1 text-xs font-medium text-primary hover:underline"
              >
                Subscribe another email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row" noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'error') {
                  setStatus('idle')
                  setMessage('')
                }
              }}
              placeholder="you@example.com"
              className="h-11 flex-1 rounded-lg border border-border/80 bg-background px-3.5 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'loading' ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Send className="size-4" aria-hidden />
              )}
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}

        {/* Inline error / announcement area (kept in the DOM for aria-live) */}
        <div aria-live="polite" className="mt-2 min-h-5">
          {status === 'error' && message ? (
            <p className="flex items-start gap-1.5 text-xs font-medium text-destructive">
              <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              {message}
            </p>
          ) : null}
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/70">
          We store your email only to send occasional updates. See our privacy policy — no sharing, no spam.
        </p>
      </div>
    </section>
  )
}
