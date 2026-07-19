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
 * AdUnit — renders a Google AdSense ad slot, or a tasteful branded
 * placeholder when AdSense is not yet configured (e.g. in development or
 * before the user has created ad units in their AdSense dashboard).
 *
 * Slots:
 *  - "horizontal" — banner ad shown at the top/bottom of tool pages and the
 *    hub. Uses `data-ad-format="auto"` for responsive sizing.
 *  - "vertical" — sidebar ad (desktop only). Uses
 *    `data-ad-format="vertical"`.
 *  - "footer" — full-width ad above the site footer.
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
  slot?: 'horizontal' | 'vertical' | 'footer'
  className?: string
}) {
  const configured = isAdsenseConfigured()
  const adSlot =
    siteConfig.adsense.slots[slot] || siteConfig.adsense.slots.horizontal
  const [pushed, setPushed] = React.useState(false)

  // Push the ad into the AdSense queue once the <ins> is in the DOM.
  // Retries every 500ms if the AdSense script hasn't loaded yet.
  React.useEffect(() => {
    if (!configured || !adSlot || pushed) return
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
  }, [configured, adSlot, pushed])

  // Not configured or no slot ID → show a professional branded placeholder.
  // This keeps the layout stable (no layout shift when ads are enabled later)
  // and signals to the user where ads will appear.
  if (!configured || !adSlot) {
    return (
      <div
        className={`flex w-full items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/30 px-4 py-6 text-center ${className ?? ''}`}
        aria-label="Advertisement placeholder"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60">
          Advertisement
          {slot ? ` · ${slot}` : ''}
        </span>
      </div>
    )
  }

  // Real AdSense ad unit.
  const isVertical = slot === 'vertical'
  const format = isVertical ? 'vertical' : 'auto'
  return (
    <ins
      className={`adsbygoogle ${className ?? ''}`}
      style={{ display: 'block' }}
      data-ad-client={siteConfig.adsense.clientId}
      data-ad-slot={adSlot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}