// src/components/ads/ad-unit.tsx
'use client'
import * as React from 'react'
import { siteConfig, isAdsenseConfigured } from '@/lib/site-config'

// AdSense pushes ad creatives into the global `adsbygoogle` array.
declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

/**
 * Reserved heights per slot type.
 *
 * Google's AdSense documentation recommends reserving space for ad units
 * (min-height) so ads don't cause layout shift (CLS) — and so Auto ads fill
 * the space with larger, higher-paying creatives. Without a reserved height
 * the units render as small banners (or nothing at all), which is what
 * happened before: ad areas looked as small as a single tool card.
 *
 *  - horizontal → leaderboard height (~90px). A horizontal banner is a
 *    leaderboard, NOT a 300×250 rectangle — reserving 250px left a huge
 *    empty gap between the category chips and the tool grid.
 *  - vertical   → half-page size (600px). Only shown in the desktop sidebar.
 *  - footer     → leaderboard (90px mobile / 120px desktop).
 */
const SLOT_MIN_HEIGHT: Record<
  'horizontal' | 'vertical' | 'footer' | 'inArticle',
  string
> = {
  horizontal: 'min-h-[90px]',
  vertical: 'min-h-[600px]',
  footer: 'min-h-[90px] sm:min-h-[120px]',
  // In-article / in-content unit — a tall responsive slot (300×250 up to
  // 728×90 / fluid). Reserving 250px mobile / 280px desktop prevents CLS
  // when the creative is smaller or fails to fill.
  inArticle: 'min-h-[250px] md:min-h-[280px]',
}

/**
 * AdUnit — renders a Google AdSense ad slot, or a tasteful branded
 * placeholder when AdSense is not yet configured (e.g. in development or
 * before the AdSense account is approved).
 *
 * Slots:
 *  - "horizontal" — banner ad shown at the top/bottom of tool pages and the
 *    hub. Uses `data-ad-format="auto"` for responsive sizing.
 *  - "vertical" — sidebar ad (desktop only). Uses
 *    `data-ad-format="vertical"`.
 *  - "footer" — full-width ad above the site footer.
 *
 * IMPORTANT: when a `clientId` is configured but NO slot ID is set (the
 * common case before the publisher creates ad units in the AdSense
 * dashboard), the unit is rendered WITHOUT `data-ad-slot`. Google's
 * "Auto ads" then fills these units with automatically matched ads — this
 * guarantees the site monetizes from day one even with zero manual setup.
 *
 * Configuration: set the following env vars (see `.env.example`):
 *   NEXT_PUBLIC_ADSENSE_ENABLED=true
 *   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
 *   NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL=1234567890
 *   NEXT_PUBLIC_ADSENSE_SLOT_VERTICAL=1234567890
 *   NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=1234567890
 *
 * The AdSense loader script is injected in `src/app/layout.tsx` (in <head>)
 * when `enabled` + `clientId` are set, so crawler verification works.
 */
export function AdUnit({
  slot = 'horizontal',
  className,
}: {
  slot?: 'horizontal' | 'vertical' | 'footer' | 'inArticle'
  className?: string
}) {
  const configured = isAdsenseConfigured()
  const clientId = siteConfig.adsense.clientId
  const adSlot = siteConfig.adsense.slots[slot]
  const [mounted, setMounted] = React.useState(false)
  const [pushed, setPushed] = React.useState(false)
  const minHeight = SLOT_MIN_HEIGHT[slot]

  // The real <ins> is mounted ONLY on the client, AFTER hydration.
  //
  // WHY (critical): the <ins> must never appear in the server-rendered HTML.
  // Google's AdSense loader mutates every `ins.adsbygoogle` in the DOM as
  // soon as it runs — adding data-adsbygoogle-status / data-ad-status and
  // injecting the ad <iframe>. When the loader is cached (returning
  // visitors), it executes between HTML parse and React hydration, so the
  // client DOM never matches the server HTML and React throws
  // "Hydration failed because the server rendered HTML didn't match the
  // client" for every ad on the page.
  //
  // Rendering the <ins> after hydration (this effect) means React never
  // hydrates it — the mismatch is impossible. The reserved-space <div>
  // below keeps the exact same layout, so there is no layout shift.
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Push the ad into the AdSense queue once the <ins> is in the DOM.
  // Retries every 500ms if the AdSense script hasn't loaded yet.
  React.useEffect(() => {
    if (!configured || !clientId || !mounted || pushed || !adSlot) return
    const tryPush = () => {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        setPushed(true)
      } catch {
        // AdSense script not loaded yet — retry shortly.
        setTimeout(tryPush, 500)
      }
    }
    const timer = setTimeout(tryPush, 100)
    return () => clearTimeout(timer)
  }, [configured, clientId, adSlot, mounted, pushed])

  // AdSense not configured at all (no client ID) → show a professional
  // branded placeholder. This keeps the layout stable (no layout shift when
  // ads are enabled later) and signals where ads will appear.
  if (!configured || !clientId) {
    return (
      <div
        className={`flex w-full items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/30 px-4 text-center ${minHeight} ${className ?? ''}`}
        aria-label="Advertisement placeholder"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
          Advertisement
          {slot ? ` · ${slot}` : ''}
        </span>
      </div>
    )
  }

  // Server render + first client render: reserved space only — no <ins> in
  // the HTML, so hydration always succeeds.
  if (!mounted) {
    return (
      <div
        className={`block w-full ${minHeight} ${className ?? ''}`}
        aria-hidden="true"
      />
    )
  }

  // No slot ID is configured yet. A manual `<ins>` without `data-ad-slot`
  // is invalid and will never serve an ad — rendering it just produces a
  // dead element (and a silent AdSense error). Auto Ads
  // (enable_page_level_ads, injected in layout.tsx) fills the page with ads
  // independently of these units, so show a subtle, labelled placeholder
  // instead of a bare empty box.
  if (!adSlot) {
    return (
      <div
        className={`flex w-full items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20 px-4 text-center ${minHeight} ${className ?? ''}`}
        aria-label="Advertisement"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/50">
          Advertisement
        </span>
      </div>
    )
  }

  // Client-only: real AdSense ad unit with an explicit slot ID.
  const isVertical = slot === 'vertical'
  const format = isVertical ? 'vertical' : 'auto'
  return (
    <ins
      suppressHydrationWarning
      className={`adsbygoogle block w-full ${minHeight} ${className ?? ''}`}
      style={{ display: 'block' }}
      data-ad-client={clientId}
      data-ad-slot={adSlot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}
