import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'

/**
 * Build the Open Graph + Twitter metadata for a normal content page.
 *
 * Next.js merges metadata objects at the top level: a page that declares only
 * `alternates.canonical` still inherits the root layout's `openGraph.url`,
 * which points at the homepage. That made /about, /privacy and /terms claim to
 * be `/` when shared. Every page that sets a canonical should also set the
 * matching social URL — this helper makes the pair impossible to forget.
 */
export function socialMetadata(
  path: string,
  title: string,
  description: string
): Pick<Metadata, 'openGraph' | 'twitter'> {
  const url = `https://${siteConfig.site.domain}${path}`
  return {
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.site.name,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  }
}
