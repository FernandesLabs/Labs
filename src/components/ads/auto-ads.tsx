// src/components/ads/auto-ads.tsx
'use client'
import * as React from 'react'
import { siteConfig, isAdsenseConfigured } from '@/lib/site-config'
import {
  CONSENT_EVENT,
  isConsentGranted,
} from '@/lib/ads/consent'

// Module-level flag ensures the page-level Auto Ads config is pushed exactly
// once per page load, regardless of how many times <AutoAds> is mounted or
// how many times effects re-run (React StrictMode double-invokes effects in
// development). Google throws `adsbygoogle.push() error: Only one
// 'enable_page_level_ads' allowed per page` if the config is pushed twice.
let pushed = false

/**
 * AutoAds — pushes the AdSense page-level Auto Ads config once.
 *
 * Auto Ads lets Google place ads automatically across the site (in-feed,
 * in-page, anchor, and vignette formats) without any manual `<ins>` slots.
 * This is what turns an "Authorized" AdSense account into actually serving
 * ads when no `NEXT_PUBLIC_ADSENSE_SLOT_*` slot IDs are configured.
 *
 * It is a separate client component (rather than an inline <script> in the
 * root layout <head>) because an inline script in <head> is executed twice
 * during React streaming/hydration, which triggers the "Only one
 * 'enable_page_level_ads' allowed per page" console error.
 *
 * The `adsbygoogle.js` loader itself stays in <head> (layout.tsx) for
 * crawler verification; this component only issues the page-level config.
 */
export function AutoAds() {
  React.useEffect(() => {
    const pushConfig = () => {
      if (pushed) return
      if (!isAdsenseConfigured()) return
      const hasManualSlots = Boolean(
        siteConfig.adsense.slots.horizontal ||
          siteConfig.adsense.slots.vertical ||
          siteConfig.adsense.slots.footer ||
          siteConfig.adsense.slots.inArticle
      )
      // Auto Ads would fight manual placements — skip when slots are configured.
      if (hasManualSlots) return
      pushed = true
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: siteConfig.adsense.clientId,
          enable_page_level_ads: true,
          overlays: { bottom: true },
        })
      } catch {
        // AdSense script not ready — it will pick the config up on next load.
      }
    }

    // Respect the user's consent choice (EU User Consent Policy): Auto Ads
    // only runs after an accepted choice. If consent isn't granted yet,
    // wait for the ConsentManager to record it.
    if (!isConsentGranted()) {
      const handler = () => pushConfig()
      window.addEventListener(CONSENT_EVENT, handler, { once: true })
      return () => window.removeEventListener(CONSENT_EVENT, handler)
    }
    pushConfig()
  }, [])

  return null
}
