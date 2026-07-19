import { siteConfig } from '@/lib/site-config'
import { toolMetaList } from '@/lib/tools/tool-meta'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/tools/types'
/**
 * Home-page structured data (Server Component).
 *
 * Emits Organization + WebSite (with SearchAction) + ItemList (categories)
 * JSON-LD. This helps Google:
 *   - Show the site name + logo in search results (Organization)
 *   - Enable a sitelinks search box (WebSite.SearchAction)
 *   - Understand the site's category structure (ItemList)
 */
export function HomeJsonLd() {
  const baseUrl = siteConfig.site.url
  const logoUrl = `${baseUrl}/fl-logo.svg`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: siteConfig.site.name,
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
          width: 512,
          height: 512,
        },
        description: siteConfig.site.description,
        email: siteConfig.site.contactEmail,
        sameAs: [siteConfig.social.github].filter(Boolean),
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: siteConfig.site.name,
        description: siteConfig.site.description,
        publisher: { '@id': `${baseUrl}/#organization` },
        inLanguage: 'en',
        // Sitelinks search box — Google can show a search box directly in
        // search results that searches this site. We route to the hub with
        // ?q= which the hub's search box reads.
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'ItemList',
        name: 'Tool Categories',
        description: 'The 8 categories of free online tools on Fernandes Labs.',
        numberOfItems: CATEGORY_ORDER.length,
        itemListElement: CATEGORY_ORDER.map((cat, i) => {
          const meta = CATEGORY_META[cat]
          const count = toolMetaList.filter((t) => t.category === cat).length
          return {
            '@type': 'ListItem',
            position: i + 1,
            name: `${meta.label} Tools`,
            description: meta.blurb,
            url: `${baseUrl}/category/${cat}`,
            itemCount: count,
          }
        }),
      },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}