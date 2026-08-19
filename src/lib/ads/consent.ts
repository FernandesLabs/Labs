// src/lib/ads/consent.ts
// Client-safe consent helpers for Google Consent Mode v2 (EU User Consent
// Policy) and the AdSense loader. These functions only run in the browser;
// the server-rendered consent "default" signal lives in the inline <head>
// script in layout.tsx (it must fire before any Google tag).
import { siteConfig } from '@/lib/site-config'

export type ConsentChoice = 'accepted' | 'rejected'

const STORAGE_KEY = 'fl-consent-v1'

/** Dispatched on `window` whenever the stored consent choice changes. */
export const CONSENT_EVENT = 'fl-consent-change'

export function getConsentChoice(): ConsentChoice | null {
  if (typeof window === 'undefined') return null
  const v = window.localStorage.getItem(STORAGE_KEY)
  return v === 'accepted' || v === 'rejected' ? v : null
}

export function isConsentGranted(): boolean {
  return getConsentChoice() === 'accepted'
}

export function setConsentChoice(choice: ConsentChoice): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, choice)
  window.dispatchEvent(new Event(CONSENT_EVENT))
}

/**
 * Push a consent signal into the dataLayer used by Google's consent mode.
 * `window.gtag` is defined by the inline head script in layout.tsx.
 */
export function pushConsentSignal(
  mode: 'default' | 'update',
  adState: 'granted' | 'denied'
): void {
  if (typeof window === 'undefined') return
  const win = window as Window & { gtag?: (...args: unknown[]) => void }
  if (typeof win.gtag !== 'function') return
  win.gtag('consent', mode, {
    ad_storage: adState,
    ad_user_data: adState,
    ad_personalization: adState,
    analytics_storage: adState,
    functionality_storage: 'granted',
    personalization_storage: adState,
    security_storage: 'granted',
  })
}

/**
 * Load the AdSense loader script — only ever called AFTER the user accepts
 * non-essential cookies (or a stored 'accepted' choice exists). Site
 * verification for AdSense is handled by the static public/ads.txt file, so
 * gating the script is policy-safe.
 */
export function loadAdsenseScript(): void {
  if (typeof document === 'undefined') return
  if (document.querySelector('script[data-adsense-loader]')) return
  const clientId = siteConfig.adsense.clientId
  if (!clientId) return
  const s = document.createElement('script')
  s.async = true
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
  s.setAttribute('data-adsense-loader', '1')
  s.crossOrigin = 'anonymous'
  document.head.appendChild(s)
}