// src/app/offline/page.tsx
import type { Metadata } from 'next'
import { OfflinePageClient } from './offline-page-client'

/**
 * /offline — branded service-worker fallback.
 *
 * The service worker (public/sw.js) precaches this route at install time and
 * serves it as the last-resort response for navigation requests that fail both
 * the network and every cache. It must NOT be indexed — it's a utility view,
 * not content — so robots: noindex + excluded from the sitemap.
 */
export const metadata: Metadata = {
  title: "You're offline — Fernandes Labs",
  description:
    'The Fernandes Labs offline fallback. Pages you have already visited stay available — every tool runs locally in your browser.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function OfflinePage() {
  return <OfflinePageClient />
}
