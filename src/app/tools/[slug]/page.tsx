import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/lib/site-config'
import { getToolMeta, toolMetaBySlug, toolsByCategory } from '@/lib/tools/tool-meta'
import { CATEGORY_META, type ToolCategory } from '@/lib/tools/types'
import { ToolPageClient } from './tool-page-client'
import { generateToolFaq, generateToolHowTo, generateToolIntro } from './tool-seo'

/**
 * Per-tool page (Priority 1: path-based routing).
 *
 * Each tool now has its own URL: `/tools/<slug>` instead of `/#tool=<slug>`.
 * This is critical for SEO — Google indexes each tool as a separate page with
 * its own title, meta description, canonical URL, and structured data.
 *
 * This file is a Server Component. It:
 *   1. Generates per-tool `<Metadata>` (title, description, canonical, OG, Twitter)
 *   2. Renders the structured data (WebApplication + BreadcrumbList + FAQPage + HowTo JSON-LD)
 *   3. Mounts the client-side `<ToolPageClient>` which lazy-loads the actual tool UI
 */

interface PageProps {
  params: Promise<{ slug: string }>
}

// Note: `generateStaticParams` is intentionally omitted. In this 4GB sandbox,
// pre-rendering all 132 tool pages at once OOM-kills the dev server. In
// production (Vercel), Next.js will pre-render pages on-demand or at build
// time with ample memory.

/** Per-tool metadata: unique title, description, canonical, OG, Twitter (Priorities 2 & 3). */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolMeta(slug)
  if (!tool) {
    return {
      title: 'Tool not found — Fernandes Labs',
      robots: { index: false, follow: false },
    }
  }

  const cat = CATEGORY_META[tool.category as ToolCategory]
  const baseUrl = siteConfig.site.url
  const canonical = `${baseUrl}/tools/${slug}`
  const title = `${tool.name} — Free Online Tool | Fernandes Labs`
  const description = tool.description
  const keywords = [
    tool.name.toLowerCase(),
    ...(tool.keywords ?? []),
    'free online tool',
    'no sign up',
    cat.label.toLowerCase(),
    'fernandes labs',
  ]

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${tool.name} — Fernandes Labs`,
      description,
      url: canonical,
      siteName: siteConfig.site.name,
      type: 'website',
      images: [
        {
          url: `/api/og?slug=${encodeURIComponent(slug)}`,
          width: 1200,
          height: 630,
          alt: `${tool.name} — Fernandes Labs`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} — Fernandes Labs`,
      description,
      images: [`/api/og?slug=${encodeURIComponent(slug)}`],
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

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params
  const tool = getToolMeta(slug)
  if (!tool) {
    notFound()
  }

  const cat = CATEGORY_META[tool!.category as ToolCategory]
  const baseUrl = siteConfig.site.url
  const toolUrl = `${baseUrl}/tools/${slug}`

  // Related tools (same category, excluding current) for the sidebar/internal links.
  const related = toolsByCategory(tool!.category)
    .filter((t) => t.slug !== slug)
    .slice(0, 6)

  // Generate SEO content for JSON-LD (Priority 5 & 6).
  const intro = generateToolIntro(tool!)
  const howToSteps = generateToolHowTo(tool!)
  const faqs = generateToolFaq(tool!)

  // Structured data: WebApplication + BreadcrumbList + FAQPage + HowTo (Priorities 4, 5, 6).
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool!.name,
        description: tool!.description,
        url: toolUrl,
        applicationCategory:
          APPLICATION_CATEGORY[tool!.category] ?? 'UtilitiesApplication',
        operatingSystem: 'Any (web browser)',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: tool!.keywords,
        keywords: (tool!.keywords ?? []).join(', '),
        isAccessibleForFree: true,
        browserRequirements:
          'Requires JavaScript. Requires a modern web browser.',
        author: {
          '@type': 'Organization',
          name: siteConfig.site.name,
          url: baseUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.site.name,
          url: baseUrl,
        },
        inLanguage: 'en',
        category: cat.label,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: cat.label,
            item: `${baseUrl}/#cat=${tool!.category}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tool!.name,
            item: toolUrl,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
      {
        '@type': 'HowTo',
        name: `How to use the ${tool!.name}`,
        description: tool!.description,
        step: howToSteps.map((text, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: `Step ${i + 1}`,
          text,
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ToolPageClient
        slug={slug}
        toolMeta={tool!}
        relatedMeta={related}
      />
      {/* Hidden SEO intro text — also rendered visibly by ToolContent, but
          duplicated here for crawlers that don't execute JS. */}
      <noscript>
        <h1>{tool!.name}</h1>
        <p>{intro}</p>
        <p>
          Visit <a href={toolUrl}>{toolUrl}</a> to use this free online tool.
        </p>
      </noscript>
    </>
  )
}

const APPLICATION_CATEGORY: Record<string, string> = {
  developer: 'DeveloperApplication',
  text: 'TextEditorApplication',
  finance: 'FinanceApplication',
  seo: 'SEOApplication',
  security: 'SecurityApplication',
  misc: 'UtilitiesApplication',
}
