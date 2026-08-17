// src/components/ads/content-ad-slot.tsx
'use client'
import * as React from 'react'
import { AdUnit } from './ad-unit'

/**
 * ContentAdSlot — high-viewability in-content ad unit for SEO content blocks.
 *
 * Placed inside the readable article flow (between the tool intro and the
 * FAQ section) where dwell time and viewability are highest — this is the
 * classic "in-article" placement that drives the best RPM on tool pages.
 *
 * Layout-shift safety (CLS):
 *   - The container always reserves space via AdUnit's `inArticle` slot
 *     (min-h 250px mobile / 280px desktop), so the ad can never push the
 *     surrounding content around when it renders.
 *   - The real <ins> is mounted only after hydration (see AdUnit), so the
 *     server HTML and first client render are identical.
 *
 * Uses the same AdSense client ID as every other unit
 * (NEXT_PUBLIC_ADSENSE_CLIENT_ID) and its own slot
 * (NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE). If the in-article slot is not
 * configured yet, AdUnit falls back to a labelled placeholder — the page
 * still looks intentional and the reserved space keeps CLS at zero.
 */
export function ContentAdSlot() {
  return (
    <div className="my-10" aria-label="Advertisement">
      <AdUnit slot="inArticle" />
    </div>
  )
}
