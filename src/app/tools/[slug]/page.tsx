// src/app/tools/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { toolMetadata } from '@/lib/tools/tool-metadata'
import { siteConfig } from '@/lib/site-config'
import { generateToolTitle, generateToolDescription } from './tool-seo'
import { ToolPageClient } from './tool-page-client'

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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
 */
export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = toolMetadata.find((t) => t.slug === slug)
  if (!tool) notFound()
  return <ToolPageClient slug={tool.slug} />
}
