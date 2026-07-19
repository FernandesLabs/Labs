'use client'
import * as React from 'react'
import Link from 'next/link'
import {
  Heart,
  ShieldCheck,
  Zap,
  Github,
  Mail,
  ArrowRight,
  Lock,
  Globe,
  Loader2,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/tools/types'
import { toolMetaList } from '@/lib/tools/tool-meta'
import { siteConfig } from '@/lib/site-config'

/**
 * SiteFooter — the global footer shared by the hub, tool pages, and category
 * pages.
 *
 * Sections:
 *  1. Brand + tagline + trust badges
 *  2. Tools by category (8 quick-links with counts)
 *  3. Resources (Privacy, Terms, GitHub, Contact)
 *  4. Principles / trust signals
 *  5. Newsletter signup (non-functional placeholder — wire to an API route
 *     when ready)
 *  6. Bottom bar: copyright + legal links + "all client-side" badge
 */
export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto border-t border-border/70 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand + tagline */}
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <svg viewBox="0 0 32 32" className="size-5" fill="none" aria-hidden="true">
                  <path
                    d="M10 22V10h5.5a3.5 3.5 0 0 1 0 7H12"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="20" cy="20" r="1.6" fill="currentColor" />
                </svg>
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold">Fernandes Labs</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Tool Network
                </span>
              </div>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
              {toolMetaList.length} free online tools for developers, designers,
              and marketers. Privacy-first, client-side, no tracking, no sign-up.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <Lock className="size-2.5" />
                Client-side
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                <Zap className="size-2.5" />
                Offline-ready
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                <Heart className="size-2.5" />
                Free
              </span>
            </div>
          </div>

          {/* Tools by category */}
          <nav aria-label="Tools by category">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORY_ORDER.map((cat) => {
                const meta = CATEGORY_META[cat]
                const count = toolMetaList.filter((t) => t.category === cat).length
                return (
                  <li key={cat}>
                    <Link
                      href={`/category/${cat}`}
                      className="group inline-flex items-center gap-2 text-muted-foreground transition hover:text-foreground"
                    >
                      <span
                        className="size-1.5 rounded-full transition-transform group-hover:scale-125"
                        style={{ backgroundColor: meta.color }}
                        aria-hidden
                      />
                      {meta.label}
                      <span className="text-[10px] text-muted-foreground/60">
                        {count}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Resources
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  All tools
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  Terms of service
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.site.contactEmail}`}
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition hover:text-foreground"
                >
                  <Mail className="size-3.5" />
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/FernandesLabs/Labs"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition hover:text-foreground"
                >
                  <Github className="size-3.5" />
                  GitHub
                </a>
              </li>
            </ul>
          </nav>

          {/* Newsletter */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Stay updated
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Get notified when new tools launch. No spam, unsubscribe anytime.
            </p>
            <NewsletterForm />
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Globe className="size-3" />
              {siteConfig.site.domain}
            </div>
          </div>
        </div>

        {/* Principles row */}
        <div className="mt-8 grid grid-cols-1 gap-3 rounded-xl border border-border/60 bg-background/50 p-4 sm:grid-cols-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Zap className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-foreground">Fast &amp; offline-ready</p>
              <p className="text-[10px] text-muted-foreground">Tools load instantly and work without a connection.</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-foreground">Client-side only</p>
              <p className="text-[10px] text-muted-foreground">Your data never leaves your browser.</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Heart className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-foreground">Free &amp; open</p>
              <p className="text-[10px] text-muted-foreground">{toolMetaList.length} tools, no sign-up, no tracking.</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <p>Built by Fernandes Labs</p>
            <span className="hidden text-border sm:inline">·</span>
            <Link href="/privacy" className="transition hover:text-foreground">Privacy</Link>
            <span className="text-border">·</span>
            <Link href="/terms" className="transition hover:text-foreground">Terms</Link>
          </div>
          <p className="tabular-nums">
            © {year} Fernandes Labs. All tools run in your browser.
          </p>
        </div>
      </div>
    </footer>
  )
}

function NewsletterForm() {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'done'>('idle')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.querySelector('input[type="email"]') as HTMLInputElement | null
    const email = input?.value?.trim()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string }
      if (res.ok && data.ok) {
        toast.success(data.message ?? "You're subscribed!")
        setStatus('done')
        form.reset()
        // Reset back to idle after 3s so the form can be reused.
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        toast.error(data.error ?? 'Subscription failed. Please try again.')
        setStatus('idle')
      }
    } catch {
      toast.error('Network error. Please check your connection.')
      setStatus('idle')
    }
  }

  return (
    <form className="mt-3 flex gap-2" onSubmit={onSubmit}>
      <input
        type="email"
        required
        aria-label="Email address"
        placeholder="you@example.com"
        disabled={status === 'loading' || status === 'done'}
        className="h-9 min-w-0 flex-1 rounded-md border border-border/70 bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:opacity-60"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        disabled={status === 'loading' || status === 'done'}
        className="inline-flex h-9 shrink-0 items-center gap-1 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:opacity-60"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span className="hidden sm:inline">Joining…</span>
          </>
        ) : status === 'done' ? (
          <>
            <Check className="size-3.5" />
            <span className="hidden sm:inline">Done</span>
          </>
        ) : (
          <>
            Join
            <ArrowRight className="size-3.5" />
          </>
        )}
      </button>
    </form>
  )
}
