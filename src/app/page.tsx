// src/app/page.tsx
import type { Metadata } from 'next'
import { HomePageClient } from '@/components/hub/home-page-client'
import { siteConfig } from '@/lib/site-config'
import { blogPosts } from '@/lib/blog/posts'
import { toPalettePosts } from '@/lib/blog/blog-utils'

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
    '132+ free online tools — JSON formatter, QR generator, password generator, ' +
    'IP lookup, redirect checker and more. Privacy-first. No sign-up.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Fernandes Labs — Free Online Tools',
    description:
      'Fast, privacy-first tools for developers, designers, and marketers. No sign-up.',
    url: '/',
    siteName: siteConfig.site.name,
    type: 'website',
    // This route overrides the layout's openGraph object, so it must repeat
    // the image. Without it the built homepage had no og:image / twitter:image
    // (shared links rendered as bare text cards).
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fernandes Labs — free online tools for developers and marketers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fernandes Labs — Free Online Tools',
    description:
      'Fast, privacy-first tools for developers, designers, and marketers.',
    images: ['/og-image.png'],
  },
}

export default function Home() {
  // Slim guide links for the SEO internal-linking block — slug/title/
  // description only, so the ~80KB of post markdown never reaches the
  // homepage's client bundle.
  const guides = blogPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
  }))
  return <HomePageClient posts={toPalettePosts(blogPosts)} guides={guides} />
}
