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
 * a branded placeholder when not. Used in place of the old AdPlaceholder.
 *
 * To activate: set `siteConfig.adsense.enabled = true` and fill in
 * `clientId` + `slots.horizontal` in src/lib/site-config.ts.
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

  // Inject the AdSense loader script once (head)
  React.useEffect(() => {
    if (!configured) return
    if (document.getElementById('adsbygoogle-js')) return
    const s = document.createElement('script')
    s.id = 'adsbygoogle-js'
    s.async = true
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsense.clientId}`
    s.crossOrigin = 'anonymous'
    document.head.appendChild(s)
  }, [configured])

  // Push the ad to AdSense after the <ins> renders
  React.useEffect(() => {
    if (!configured || !adSlot || pushed) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      setPushed(true)
    } catch {
      /* AdSense not loaded yet — will retry */
    }
  }, [configured, adSlot, pushed])

  if (!configured || !adSlot) {
    return (
      <div
        aria-hidden="true"
        className={`flex h-20 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/30 text-xs font-medium uppercase tracking-wider text-muted-foreground/60 ${className || ''}`}
      >
        Advertisement{slot ? ` · ${slot}` : ''}
      </div>
    )
  }

  const format = slot === 'vertical' ? 'vertical' : 'auto'

  return (
    <div className={`overflow-hidden rounded-lg ${className || ''}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: slot === 'horizontal' ? 90 : 200,
        }}
        data-ad-client={siteConfig.adsense.clientId!}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
