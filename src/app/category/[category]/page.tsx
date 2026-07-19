import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/lib/site-config'
import {
  getToolMeta,
  toolMetaList,
  toolsByCategory,
} from '@/lib/tools/tool-meta'
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type ToolCategory,
} from '@/lib/tools/types'
import { CategoryPageClient } from './category-page-client'
/**
 * Category landing page — `/category/<category>` (e.g. `/category/developer`).
 *
 * WHY: This gives each of the 8 categories its own indexable URL, which:
 *   - Adds 8 more SEO-relevant pages to the sitemap
 *   - Lets Google rank category-level queries ("developer tools", "seo tools")
 *   - Provides a clean internal-linking target from the home page, tool pages,
 *     and the 404 page
 *   - Improves site architecture / topical authority
 *
 * This is a Server Component that:
 *   1. Generates per-category `<Metadata>` (title, description, canonical)
 *   2. Emits BreadcrumbList + ItemList JSON-LD structured data
 *   3. Mounts the client-side `<CategoryPageClient>` for interactive search/filter
 */
interface PageProps {
  params: Promise<{ category: string }>
}
const VALID_CATEGORIES = new Set<string>(CATEGORY_ORDER)
export async function generateStaticParams() {
  return CATEGORY_ORDER.map((category) => ({ category }))
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: rawCat } = await params
  if (!VALID_CATEGORIES.has(rawCat)) {
    return {
      title: 'Category not found — Fernandes Labs',
      robots: { index: false, follow: false },
    }
  }
  const cat = rawCat as ToolCategory
  const meta = CATEGORY_META[cat]
  const baseUrl = siteConfig.site.url
  const canonical = `${baseUrl}/category/${cat}`
  const tools = toolsByCategory(cat)
  const title = `${meta.label} Tools — ${tools.length} Free Online Tools | Fernandes Labs`
  const description = `${meta.blurb} Browse ${tools.length} free ${meta.label.toLowerCase()} tools — all privacy-first, client-side, no sign-up. ${meta.label === 'Developer' ? 'JSON, encoders, hashes, regex, and code utilities.' : meta.label === 'Finance' ? 'Calculators for money, health, and school.' : ''}`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${meta.label} Tools — Fernandes Labs`,
      description,
      url: canonical,
      siteName: siteConfig.site.name,
      type: 'website',
      images: [
        {
          url: `/api/og?slug=${encodeURIComponent(tools[0]?.slug ?? '')}`,
          width: 1200,
          height: 630,
          alt: `${meta.label} Tools — Fernandes Labs`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta.label} Tools — Fernandes Labs`,
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
export default async function CategoryPage({ params }: PageProps) {
  const { category: rawCat } = await params
  if (!VALID_CATEGORIES.has(rawCat)) {
    notFound()
  }
  const cat = rawCat as ToolCategory
  const meta = CATEGORY_META[cat]
  const baseUrl = siteConfig.site.url
  const categoryUrl = `${baseUrl}/category/${cat}`
  const tools = toolsByCategory(cat)
  // Other categories for the sidebar / cross-linking.
  const otherCategories = CATEGORY_ORDER.filter((c) => c !== cat).map((c) => ({
    category: c,
    meta: CATEGORY_META[c],
    count: toolMetaList.filter((t) => t.category === c).length,
  }))
  // Structured data: BreadcrumbList + ItemList (the list of tools in this category).
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
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
            name: meta.label,
            item: categoryUrl,
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: `${meta.label} Tools`,
        description: meta.blurb,
        numberOfItems: tools.length,
        itemListElement: tools.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: t.name,
          url: `${baseUrl}/tools/${t.slug}`,
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
      <CategoryPageClient
        category={cat}
        tools={tools}
        otherCategories={otherCategories}
      />
    </>
  )
}