'use client'
import * as React from 'react'
import { CATEGORY_META, type Tool } from '@/lib/tools/types'
import { siteConfig } from '@/lib/site-config'
import { generateFaq } from './tool-content'
import { generateToolHowTo } from '@/app/tools/[slug]/tool-seo'
import { getToolContentOverride } from '@/app/tools/[slug]/tool-content-overrides'

/**
 * ToolJsonLd — structured data for individual tool pages.
 *
 * Emits a single JSON-LD `<script>` containing a `@graph` with:
 *
 *   1. SoftwareApplication — the tool itself (name, category, offers, etc.).
 *      Google may show a rich result with the app name, category, and "Free"
 *      price. Uses `SoftwareApplication` (not `WebApplication`) because
 *      Google's rich-result documentation explicitly lists
 *      `SoftwareApplication` as eligible for rich results.
 *
 *   2. BreadcrumbList — Home › Category › Tool. Helps Google show breadcrumbs
 *      in the SERP instead of the raw URL.
 *
 *   3. FAQPage — maps the visible FAQ accordion to `Question`/`Answer` pairs.
 *      Eligible for FAQ rich results (accordion-style display in SERP).
 *      Source: the same `generateFaq` used by the visible `ToolContent`, so
 *      the schema and visible text always match.
 *
 *   4. HowTo — maps the "How to use" steps to `HowToStep`s. Eligible for
 *      HowTo rich results (step-by-step display in SERP).
 *
 * All four are kept in sync with the visible page content (ToolContent) so
 * Google's quality guidelines (consistency between schema and visible text)
 * are satisfied.
 */
export function ToolJsonLd({ tool }: { tool: Tool }) {
  const cat = CATEGORY_META[tool.category]
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : `https://${siteConfig.site.domain}`
  const toolUrl = `${origin}/tools/${tool.slug}`
  const categoryUrl = `${origin}/category/${tool.category}`

  const faqs = React.useMemo(() => generateFaq(tool), [tool])
  const howToSteps = React.useMemo(() => {
    const override = getToolContentOverride(tool.slug)
    return override?.howTo ?? generateToolHowTo(tool)
  }, [tool])

  const graph = React.useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        // 1. SoftwareApplication — the tool
        {
          '@type': 'SoftwareApplication',
          '@id': `${toolUrl}#software`,
          name: tool.name,
          description: tool.description,
          url: toolUrl,
          applicationCategory:
            APPLICATION_CATEGORY[tool.category] ?? 'UtilitiesApplication',
          operatingSystem: 'Any (web browser)',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          featureList: tool.keywords,
          keywords: (tool.keywords ?? []).join(', '),
          isAccessibleForFree: true,
          browserRequirements:
            'Requires JavaScript. Requires a modern web browser.',
          author: {
            '@type': 'Organization',
            name: 'Fernandes Labs',
            url: 'https://fernandeslabs.com',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Fernandes Labs',
            url: 'https://fernandeslabs.com',
          },
          inLanguage: 'en',
          category: cat.label,
        },
        // 2. BreadcrumbList — Home › Category › Tool
        {
          '@type': 'BreadcrumbList',
          '@id': `${toolUrl}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: origin,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: `${cat.label} Tools`,
              item: categoryUrl,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: tool.name,
              item: toolUrl,
            },
          ],
        },
        // 3. FAQPage — maps the visible FAQ accordion
        {
          '@type': 'FAQPage',
          '@id': `${toolUrl}#faq`,
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        },
        // 4. HowTo — maps the "How to use" steps
        {
          '@type': 'HowTo',
          '@id': `${toolUrl}#howto`,
          name: `How to use the ${tool.name}`,
          description: tool.description,
          step: howToSteps.map((step, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            text: step,
            name: `Step ${i + 1}`,
          })),
        },
      ],
    }),
    [tool, toolUrl, origin, categoryUrl, cat.label, faqs, howToSteps]
  )

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}

/**
 * Maps a Fernandes Labs tool category to a schema.org `applicationCategory`.
 * These are the values Google's rich-result validator recognises.
 */
const APPLICATION_CATEGORY: Record<string, string> = {
  developer: 'DeveloperApplication',
  text: 'TextEditorApplication',
  finance: 'FinanceApplication',
  seo: 'BusinessApplication',
  security: 'UtilitiesApplication',
  network: 'UtilitiesApplication',
  media: 'MultimediaApplication',
  misc: 'UtilitiesApplication',
}
