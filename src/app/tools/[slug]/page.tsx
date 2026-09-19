// src/app/tools/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { toolMetadata } from '@/lib/tools/tool-metadata'
import { siteConfig } from '@/lib/site-config'
import { blogPosts } from '@/lib/blog/posts'
import { guidesForTools, readingTimeMinutes, toPalettePosts } from '@/lib/blog/blog-utils'
import { generateToolTitle, generateToolDescription } from './tool-seo'
import { ToolPageClient } from './tool-page-client'
import type { ToolGuide } from '@/components/hub/tool-related-guides'

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Pre-generate all 132 tool slugs at build time so every tool page is
 * statically rendered (fast, SEO-friendly, indexable without JS).
 */
export async function generateStaticParams() {
  return toolMetadata.map((t) => ({ slug: t.slug }))
}

/**
 * Generate per-tool <title> and <meta description> using the keyword-rich
 * templates in `tool-seo.ts`.
 *
 * Each tool gets a unique title (tool name + category + brand) and a unique
 * description (base description + value-proposition tail), both optimised for
 * Google's display limits (50–60 char titles, 120–160 char descriptions).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = toolMetadata.find((t) => t.slug === slug)
  if (!tool) return {}

  const title = generateToolTitle(tool)
  const description = generateToolDescription(tool)
  const url = `https://${siteConfig.site.domain}/tools/${tool.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.site.name,
      type: 'website',
      images: [
        {
          url: `/api/og?slug=${encodeURIComponent(tool.slug)}`,
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?slug=${encodeURIComponent(tool.slug)}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

/**
 * Tool page — server component that looks up the tool by slug and delegates
 * client-side rendering (which needs the lazy-loaded Component) to
 * `ToolPageClient`.
 *
 * Also resolves the blog guides whose `relatedTools` include this tool (the
 * tool → guide side of the internal-linking loop) and passes a slim,
 * serializable slice down for the sidebar "Guides & tutorials" card. The
 * markdown bodies never enter the client bundle — only slug/title/category/
 * minutes do.
 */
export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = toolMetadata.find((t) => t.slug === slug)
  if (!tool) notFound()

  const relatedGuides: ToolGuide[] = guidesForTools([tool.slug], blogPosts, 3).map(
    (post) => ({
      slug: post.slug,
      title: post.title,
      category: post.category,
      minutes: readingTimeMinutes(post.body),
    })
  )

  return (
    <ToolPageClient
      slug={tool.slug}
      guides={relatedGuides}
      posts={toPalettePosts(blogPosts)}
    />
  )
}
