'use client'

import * as React from 'react'
import { siteConfig, isAdsenseConfigured } from '@/lib/site-config'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

/**
 * AdSense ad unit. Shows a real Google ad when configured, falls back to
 * a branded placeholder when not.
 *
 * The AdSense loader script is injected in src/app/layout.tsx (<head>),
 * NOT here — that way it's in the server-rendered HTML for Google's
 * crawler to verify.
 *
 * This component only renders the <ins> ad tag and pushes it to AdSense.
 *
 * Env vars (set in Vercel → Settings → Environment Variables):
 *   NEXT_PUBLIC_ADSENSE_ENABLED = true
 *   NEXT_PUBLIC_ADSENSE_CLIENT_ID = ca-pub-XXXXXXXXXXXXXXXX
 *   NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL = 1234567890
 *   NEXT_PUBLIC_ADSENSE_SLOT_VERTICAL = 0987654321
 *   NEXT_PUBLIC_ADSENSE_SLOT_FOOTER = 1111111111
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

  // Push the ad to AdSense after the <ins> renders
  React.useEffect(() => {
    if (!configured || !adSlot || pushed) return
    // Wait for the AdSense script (loaded in <head>) to be ready
    const tryPush = () => {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        setPushed(true)
      } catch {
        // AdSense script not loaded yet — retry in 500ms
        setTimeout(tryPush, 500)
      }
    }
    tryPush()
  }, [configured, adSlot, pushed])

  // Not configured or no slot ID → show branded placeholder
  if (!configured || !adSlot) {
    return (
      <div
        aria-hidden="true"
        className={`flex h-20 w-full items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/30 text-xs font-medium uppercase tracking-wider text-muted-foreground/60 ${className || ''}`}
      >
        Advertisement{slot ? ` · ${slot}` : ''}
      </div>
    )
  }

  const isVertical = slot === 'vertical'
  const format = isVertical ? 'vertical' : 'auto'

  return (
    <div className={`w-full overflow-hidden rounded-lg ${className || ''}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          minHeight: isVertical ? 600 : 100,
        }}
        data-ad-client={siteConfig.adsense.clientId!}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
