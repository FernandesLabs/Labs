// src/app/page.tsx
import type { Metadata } from 'next'
import { HomePageClient } from '@/components/hub/home-page-client'
import { siteConfig } from '@/lib/site-config'

/**
 * Home page (the hub) — server component.
 *
 * WHY a server component: it must export route-level `metadata`. The root
 * layout no longer declares a canonical (that was poisoning child routes —
 * /privacy and /terms inherited the homepage URL as their canonical), so
 * every page owns its canonical explicitly. The interactive hub body lives
 * in `@/components/hub/home-page-client` (client component).
 *
 * The title/description target the "free online tools" query cluster that
 * Search Console shows for the homepage, leading with the commercial
 * intent instead of the brand name (brand queries already rank #1).
 */
export const metadata: Metadata = {
  title: 'Free Online Tools for Developers & Marketers — Fernandes Labs',
  description:
    '132+ free online tools that run entirely in your browser — ' +
    'JSON formatter, QR code generator, password generator, IP lookup, redirect checker, calculators and more. No sign-up, no tracking, works offline.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Fernandes Labs — Free Online Tools',
    description:
      'Fast, privacy-first tools for developers, designers, and marketers. No sign-up. No tracking.',
    url: '/',
    siteName: siteConfig.site.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fernandes Labs — Free Online Tools',
    description:
      'Fast, privacy-first tools for developers, designers, and marketers.',
  },
}

export default function Home() {
  return <HomePageClient />
}
