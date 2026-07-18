'use client'

import * as React from 'react'
import { CATEGORY_META, type Tool } from '@/lib/tools/types'

/**
 * Injects WebApplication JSON-LD structured data for a tool.
 * Helps search engines understand the tool is a free web app.
 */
export function ToolJsonLd({ tool }: { tool: Tool }) {
  const cat = CATEGORY_META[tool.category]
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://fernandeslabs.com'
  const url = `${origin}/#tool=${tool.slug}`

  const jsonLd = React.useMemo(
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

  return (
    <script
      type="application/ld+json"
      // JSON-LD is static structured data derived from trusted local config;
      // it is safe to inject via dangerouslySetInnerHTML.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
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
