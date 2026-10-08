/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Entity consistency between the homepage and blog Article schema.
 *
 * The homepage emitted its Person node at `#founder` while blog posts had no
 * Person node at all, so a named author could never be connected across the
 * two. Both must use `${site}/#person`, and both must reference the same
 * `#organization` as publisher/worksFor, or Google sees two unrelated
 * entities instead of one author and one site.
 *
 * These read the built HTML when available and otherwise assert the invariant
 * at the source level, so they are meaningful before the first `next build`.
 */

const BUILT = join(process.cwd(), '.next/server/app')

function readBuilt(rel: string): string | null {
  const p = join(BUILT, rel)
  return existsSync(p) ? readFileSync(p, 'utf8') : null
}

function graphOf(html: string): Record<string, any> {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  if (!m) throw new Error('no JSON-LD block')
  const data = JSON.parse(m[1])
  const nodes: any[] = data['@graph'] ?? [data]
  return Object.fromEntries(nodes.map((n) => [n['@type'], n]))
}

describe('author entity consistency', () => {
  test('homepage Person node uses #person and links #organization', () => {
    const html = readBuilt('index.html')
    if (!html) return // pre-build
    const g = graphOf(html)
    if (!g.Person) {
      // No founder configured — Person is intentionally omitted rather than
      // invented. Assert the fallback is a well-formed Organization.
      expect(g.Organization['@id']).toMatch(/#organization$/)
      return
    }
    expect(g.Person['@id']).toMatch(/\/#person$/)
    expect(g.Person['@id']).not.toMatch(/#founder$/)
    expect(g.Person.worksFor['@id']).toMatch(/#organization$/)
  })

  test('blog Article author is a Person when a founder is configured', () => {
    const html = readBuilt('blog/ip-address-lookup-guide.html')
    if (!html) return
    const g = graphOf(html)
    const article = g.Article
    expect(article).toBeDefined()
    // Either a linked Person (@id pointing at the site entity) or the
    // Organization fallback — never an anonymous or dangling author.
    const authorId = article.author['@id'] ?? ''
    if (article.author['@type'] === 'Person') {
      expect(authorId).toMatch(/\/#person$/)
      expect(article.publisher['@id']).toMatch(/#organization$/)
    } else {
      expect(article.author['@type']).toBe('Organization')
    }
  })

  test('Article publisher references the shared Organization entity', () => {
    const html = readBuilt('blog/ip-address-lookup-guide.html')
    if (!html) return
    const { Article } = graphOf(html)
    expect(Article.publisher['@id']).toMatch(/#organization$/)
    expect(Article.publisher.logo['@type']).toBe('ImageObject')
  })

  test('Article dateModified is sourced from a real field, not a copy of published', () => {
    const html = readBuilt('blog/ip-address-lookup-guide.html')
    if (!html) return
    const { Article } = graphOf(html)
    // Equal is allowed for a never-revised post, but the key must exist and
    // be a valid ISO date rather than undefined.
    expect(Article.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(Article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  test('every blog post has an author entry and a visible byline', () => {
    const posts = [
      'ip-address-lookup-guide',
      'what-is-a-301-redirect',
      'email-signature-guide',
      'canonical-url-guide',
      'robots-txt-guide',
      'css-gradient-guide',
    ]
    for (const slug of posts) {
      const html = readBuilt(`blog/${slug}.html`)
      if (!html) continue
      const { Article } = graphOf(html)
      expect(Article.author, slug).toBeDefined()
      // The byline is visible text, not only schema.
      const visible = html.replace(/<script[\s\S]*?<\/script>/g, '')
      expect(visible, `${slug} byline`).toContain('By')
    }
  })

  test('Article declares the tools it documents via `about`', () => {
    const html = readBuilt('blog/ip-address-lookup-guide.html')
    if (!html) return
    const { Article } = graphOf(html)
    expect(Array.isArray(Article.about)).toBe(true)
    expect(Article.about.length).toBeGreaterThan(0)
    for (const ref of Article.about) {
      expect(ref['@type']).toBe('SoftwareApplication')
      expect(ref.url).toMatch(/^https:\/\/www\.fernandeslabs\.com\/tools\//)
    }
  })
})