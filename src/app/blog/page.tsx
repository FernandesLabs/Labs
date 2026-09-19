import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'
import { BlogIndexClient, type BlogCatalogPost } from './blog-index-client'
import { blogPosts } from '@/lib/blog/posts'
import { toPalettePosts, postsByDateDesc, readingTimeMinutes } from '@/lib/blog/blog-utils'

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
 * See `/home/z/my-project/SEO-BLOG-PLAN.md` for the content plan. New posts
 * are added to `src/lib/blog/posts.ts`; the catalog below picks them up
 * automatically (no per-page edits needed).
 */
export default function BlogPage() {
  // Server-computed slim guide catalog: everything the index needs for its
  // cards + client-side search (title/excerpt/keywords — NOT the markdown
  // bodies). Importing `blogPosts` directly in the client component used to
  // ship ~80KB of post bodies for nothing.
  const catalog: BlogCatalogPost[] = postsByDateDesc(blogPosts).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.description,
    category: p.category,
    date: p.date,
    minutes: readingTimeMinutes(p.body),
    keywords: p.keywords.join(' ').toLowerCase(),
    searchText: `${p.title} ${p.description} ${p.keywords.join(' ')}`.toLowerCase(),
  }))
  // Slim guide list for the ⌘K palette's "Guides & tutorials" group — the
  // palette is a site-wide search: tools + guides from every page.
  return <BlogIndexClient catalog={catalog} posts={toPalettePosts(blogPosts)} />
}
