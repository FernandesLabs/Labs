/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { HomeJsonLd } from '@/components/hub/home-json-ld'

type JsonNode = Record<string, unknown>

/** Render the component and parse the JSON-LD it emits. */
function extractJsonLdGraph(): JsonNode[] {
  const html = renderToStaticMarkup(<HomeJsonLd />)
  const match = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
  )
  if (!match) throw new Error('no JSON-LD script found')
  const parsed = JSON.parse(match[1]) as {
    '@context': string
    '@graph': JsonNode[]
  }
  expect(parsed['@context']).toBe('https://schema.org')
  return parsed['@graph']
}

describe('homepage JSON-LD schema', () => {
  const graph = extractJsonLdGraph()
  const byType = (t: string) => graph.filter((n) => n['@type'] === t)

  test('emits Organization, WebSite, ItemList (and Person when configured)', () => {
    expect(byType('Organization').length).toBe(1)
    expect(byType('WebSite').length).toBe(1)
    expect(byType('ItemList').length).toBe(1)
    expect(byType('Person').length).toBeLessThanOrEqual(1)
  })

  test('Organization uses the canonical www URL and links to the About page', () => {
    const org = byType('Organization')[0]
    expect(org.name).toBe('Fernandes Labs')
    expect(org.url).toBe('https://www.fernandeslabs.com')
    const mainEntity = org.mainEntityOfPage as { url?: string; '@id'?: string }
    expect(mainEntity.url).toBe('https://www.fernandeslabs.com/about')
    expect(mainEntity['@id']).toContain('/about')
    const sameAs = org.sameAs as string[]
    expect(sameAs.some((s) => s.endsWith('/about'))).toBe(true)
  })

  test('WebSite publisher references the Organization node', () => {
    const site = byType('WebSite')[0]
    const org = byType('Organization')[0]
    const publisher = site.publisher as { '@id': string }
    expect(publisher['@id']).toBe(org['@id'] as string)
    const action = site.potentialAction as { '@type': string }
    expect(action['@type']).toBe('SearchAction')
  })

  test('Person (when present) works for the Organization', () => {
    const people = byType('Person')
    if (people.length === 0) return
    const person = people[0]
    const org = byType('Organization')[0]
    const worksFor = person.worksFor as { '@id': string }
    expect(worksFor['@id']).toBe(org['@id'] as string)
  })
})
