// src/app/tools/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { toolMetadata } from '@/lib/tools/tool-metadata'
import { siteConfig } from '@/lib/site-config'
import {
  generateToolTitle,
  generateToolDescription,
  getRelatedTools,
} from './tool-seo'
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
  const url = `${siteConfig.site.url}/tools/${tool.slug}`

  return {
    title,
    description,
    // Emit the tool's OWN keywords. Previously this key was omitted, so
    // Next.js metadata inheritance made every one of the 132 tool pages emit
    // the homepage's keyword list ("JSON formatter", "QR generator", …).
    // Modern Google largely ignores <meta keywords>, but emitting the
    // homepage's list on a tool page is still plainly wrong.
    keywords: [...tool.keywords, tool.name],
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
 */
export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = toolMetadata.find((t) => t.slug === slug)
  if (!tool) notFound()
  return (
    <>
      {/*
        Crawlable link graph for every tool page.

        The interactive tool is client-rendered and the sidebar's related
        tools used to be <button> elements, so a crawler arriving at one tool
        page could not reach any other. The "Related tools" block in
        ToolContent already renders crawlable <Link>s for the curated map
        plus same-category fallbacks, and this adds a compact, reliably
        present set of anchors plus a <noscript> fallback for agents that do
        not execute JavaScript.
      */}
      <nav
        aria-label="Related tools"
        className="mx-auto mb-6 max-w-6xl px-4 text-xs text-muted-foreground sm:px-6 lg:px-8"
      >
        <span className="font-medium text-foreground">Related tools: </span>
        {getRelatedTools(tool.slug, tool.category, 12).map((s, i, arr) => {
          const target = toolMetadata.find((t) => t.slug === s)
          if (!target) return null
          return (
            <span key={s}>
              <Link href={`/tools/${s}`} className="underline underline-offset-2 hover:text-foreground">
                {target.name}
              </Link>
              {i < arr.length - 1 ? ' · ' : ''}
            </span>
          )
        })}
      </nav>
      {/*
        No-JS fallback. Google renders JS, but not every crawler does, and the
        tool itself cannot function without it — so state the requirement
        plainly rather than serving an empty page.
      */}
      <noscript>
        <div className="mx-auto max-w-6xl px-4 pb-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>
            The {tool.name} tool needs JavaScript to run. All processing happens
            in your browser.{' '}
            {tool.category === 'network'
              ? 'This lookup is proxied through our server and is not logged.'
              : 'Your input is never sent to a server.'}
          </p>
        </div>
      </noscript>
      <ToolPageClient slug={tool.slug} />
    </>
  )
}
