import { siteConfig } from '@/lib/site-config'
import { toolMetaList } from '@/lib/tools/tool-meta'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/tools/types'
/**
 * Home-page structured data (Server Component).
 *
 * Emits Organization + WebSite (with SearchAction) + ItemList (categories)
 * JSON-LD, plus a Person node when a founder name is configured. This helps
 * Google:
 *   - Show the site name + logo in search results (Organization)
 *   - Enable a sitelinks search box (WebSite.SearchAction)
 *   - Understand the site's category structure (ItemList)
 *   - Establish E-E-A-T entity signals (Person → Organization, About page)
 *
 * E-E-A-T wiring (Phase 2):
 *   - Organization.mainEntityOfPage → the /about page (the primary page
 *     describing the entity)
 *   - Organization.sameAs → GitHub profile + the /about page
 *   - Person.worksFor → Organization, Person.mainEntityOfPage → /about
 *   - WebSite.publisher → Organization
 */
export function HomeJsonLd() {
  const baseUrl = siteConfig.site.url
  const logoUrl = `${baseUrl}/fl-logo.svg`
  const aboutUrl = `${baseUrl}/about`
  const founder = siteConfig.founder
  const sameAs = [
    siteConfig.social.github,
    siteConfig.social.twitter,
    aboutUrl,
  ].filter(Boolean) as string[]

  const graph: Record<string, unknown>[] = [
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
      sameAs,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${aboutUrl}#webpage`,
        url: aboutUrl,
        name: `About ${siteConfig.site.name}`,
      },
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
  ]

  // Person node — only when a real founder identity is configured
  // (NEXT_PUBLIC_FOUNDER_NAME). Emitting an invented name would hurt E-E-A-T.
  if (founder.name) {
    graph.push({
      '@type': 'Person',
      '@id': `${baseUrl}/#founder`,
      name: founder.name,
      jobTitle: founder.jobTitle,
      url: founder.profileUrl ?? aboutUrl,
      worksFor: { '@id': `${baseUrl}/#organization` },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${aboutUrl}#webpage`,
        url: aboutUrl,
      },
      sameAs: [founder.profileUrl, siteConfig.social.github].filter(
        Boolean
      ) as string[],
    })
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}