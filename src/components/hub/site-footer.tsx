'use client'

import { Heart, ShieldCheck, Zap } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
                <svg viewBox="0 0 32 32" className="size-4" fill="none" aria-hidden="true">
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
              <span className="text-sm font-bold">Fernandes Labs</span>
            </div>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Free online tools for developers, designers, and marketers.
              Privacy-first, client-side, no tracking.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Network
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://github.com/FernandesLabs/Labs"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition hover:text-foreground"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://fernandeslabs.com"
                  className="transition hover:text-foreground"
                >
                  fernandeslabs.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Principles
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Zap className="size-3.5 text-primary" /> Fast &amp; offline-ready
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-primary" /> Client-side only
              </li>
              <li className="flex items-center gap-2">
                <Heart className="size-3.5 text-primary" /> Free &amp; open
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              License
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              FLSL v1.0. Free for personal use. No commercial use without a
              license.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-3">
            <p>Built by Fernandes Labs</p>
            <span className="text-border">·</span>
            <a href="/privacy" className="transition hover:text-foreground">Privacy</a>
            <span className="text-border">·</span>
            <a href="/terms" className="transition hover:text-foreground">Terms</a>
          </div>
          <p className="tabular-nums">
            © {new Date().getFullYear()} Fernandes Labs. All tools run in your browser.
          </p>
        </div>
      </div>
    </footer>
  )
}
