'use client'
import * as React from 'react'
import { CATEGORY_META, type Tool } from '@/lib/tools/types'
import { siteConfig } from '@/lib/site-config'
import { generateFaq } from './tool-content' // now exported
export function ToolJsonLd({ tool }: { tool: Tool }) {
  const cat = CATEGORY_META[tool.category]
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : `https://${siteConfig.site.domain}`
  const url = `${origin}/tools/${tool.slug}`
  const faqs = React.useMemo(() => generateFaq(tool), [tool])
  const webApplicationLd = React.useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.name,
      description: tool.description,
      url,
      applicationCategory: APPLICATION_CATEGORY[tool.category] ?? 'UtilitiesApplication',
      operatingSystem: 'Any (web browser)',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: tool.keywords,
      keywords: (tool.keywords ?? []).join(', '),
      isAccessibleForFree: true,
      browserRequirements: 'Requires JavaScript. Requires a modern web browser.',
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
    }),
    [tool, url, cat.label]
  )
  const faqPageLd = React.useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    }),
    [faqs]
  )
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageLd) }}
      />
    </>
  )
}
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