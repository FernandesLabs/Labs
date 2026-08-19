// src/components/ads/consent-manager.tsx
'use client'
import * as React from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'
import {
  CONSENT_EVENT,
  getConsentChoice,
  isConsentGranted,
  loadAdsenseScript,
  pushConsentSignal,
  setConsentChoice,
  type ConsentChoice,
} from '@/lib/ads/consent'

/**
 * ConsentManager — cookie-consent banner + Google Consent Mode v2.
 *
 * EU User Consent Policy compliance: non-essential tags (AdSense, Analytics)
 * must not run until the user opts in. The consent *default* (denied) is set
 * by the inline <head> script in layout.tsx so it fires before any Google
 * tag; this component handles the user-facing choice:
 *
 *   - Accept all → gtag('consent','update', granted) + loads the AdSense
 *     loader (adsbygoogle.js) so ad slots can fill.
 *   - Reject    → consent stays denied (non-personalized, no cookies) and
 *     the AdSense loader is never injected.
 *
 * The choice is persisted in localStorage and replayed on later visits. The
 * AdSense loader is only ever injected after an accepted choice — site
 * verification for AdSense is covered by the static public/ads.txt file.
 */
export function ConsentManager() {
  const [visible, setVisible] = React.useState(false)
  const [choice, setChoice] = React.useState<ConsentChoice | null>(
    getConsentChoice()
  )

  // Show the banner if no choice has been recorded yet.
  React.useEffect(() => {
    if (getConsentChoice() !== null) return
    const t = setTimeout(() => setVisible(true), 900)
    return () => clearTimeout(t)
  }, [])

  // When consent is granted, load the AdSense script exactly once.
  React.useEffect(() => {
    if (isConsentGranted()) loadAdsenseScript()
  }, [choice])

  const decide = (c: ConsentChoice) => {
    pushConsentSignal('update', c === 'accepted' ? 'granted' : 'denied')
    setConsentChoice(c)
    setChoice(c)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-2xl sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Cookie className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              We value your privacy
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              We use cookies to personalise content and ads, and to analyse
              our traffic. You can accept all, or reject non-essential
              cookies. See our{' '}
              <Link
                href="/privacy"
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Privacy Policy
              </Link>{' '}
              for details.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2 sm:flex-col lg:flex-row">
          <button
            type="button"
            onClick={() => decide('rejected')}
            className="flex-1 rounded-lg border border-border/70 px-4 py-2 text-xs font-medium text-foreground transition hover:bg-muted sm:flex-none"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 sm:flex-none"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}

export { CONSENT_EVENT }