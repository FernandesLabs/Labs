import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'
import { BlogIndexClient } from './blog-index-client'

export const metadata: Metadata = {
  title: 'Blog — Guides & Tutorials | Fernandes Labs',
  description:
    'In-depth guides, tutorials, and best practices for developers, designers, and marketers. Learn about JSON, QR codes, passwords, SEO, and the tools you use every day.',
  alternates: {
    canonical: `https://${siteConfig.site.domain}/blog`,
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Blog — Guides & Tutorials | Fernandes Labs',
    description:
      'In-depth guides, tutorials, and best practices for developers, designers, and marketers.',
    url: `https://${siteConfig.site.domain}/blog`,
    siteName: siteConfig.site.name,
    type: 'website',
  },
}

/**
 * Blog index page (`/blog`).
 *
 * Server component that exports metadata; delegates rendering to
 * `BlogIndexClient` (which needs `router.push` for the SiteHeader).
 *
 * See `/home/z/my-project/SEO-BLOG-PLAN.md` for the content plan and
 * `src/app/blog/blog-index-client.tsx` for the `POSTS` array (add new
 * post slugs there as they are written).
 */
export default function BlogPage() {
  return <BlogIndexClient />
}
