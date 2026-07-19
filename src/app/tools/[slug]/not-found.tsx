import Link from 'next/link'
import { ArrowLeft, Search, Home } from 'lucide-react'
import { toolMetaList } from '@/lib/tools/tool-meta'
import { CATEGORY_META, CATEGORY_ORDER, type ToolCategory } from '@/lib/tools/types'
import { siteConfig } from '@/lib/site-config'

/**
 * Not-found page for `/tools/[slug]` (and any other unmatched route).
 *
 * Instead of a generic 404, this page:
 *   - Explains the tool wasn't found
 *   - Suggests a few popular tools (internal linking — good for SEO + UX)
 *   - Links back to the hub and to each category
 */
export const metadata = {
  title: 'Tool not found — Fernandes Labs',
  description:
    'The tool you were looking for could not be found. Browse all 132 free online tools on Fernandes Labs.',
  robots: { index: false, follow: true },
}

// Curated "popular" tools shown on the 404 page (high-traffic slugs).
const POPULAR_SLUGS = [
  'json-formatter',
  'password-generator',
  'qr-generator',
  'uuid-generator',
  'base64-encoder-decoder',
  'word-counter',
  'color-converter',
  'hash-generator',
]

export default function NotFound() {
  const baseUrl = siteConfig.site.url
  const popular = POPULAR_SLUGS.map((s) => toolMetaList.find((t) => t.slug === s))
    .filter(Boolean)
    .slice(0, 8)

  // Organization + WebSite JSON-LD on the 404 too (consistent site identity).
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.site.name,
    url: baseUrl,
    description: siteConfig.site.description,
  }

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="fl-grid-bg absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
          <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-muted/60 text-muted-foreground">
            <Search className="size-7" />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            404
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Tool not found
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            We couldn&apos;t find the tool you were looking for. It may have been
            renamed or removed. Try one of these popular tools instead, or browse
            the full collection.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <Home className="size-4" />
              All tools
            </Link>
            <Link
              href="/#cat=developer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="size-4" />
              Browse categories
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Popular tools
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((tool) => {
            if (!tool) return null
            const cat = CATEGORY_META[tool.category as ToolCategory]
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group flex flex-col gap-1.5 rounded-xl border border-border/80 bg-card p-4 fl-card-hover"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-[10px] font-bold text-primary-foreground"
                    style={{ backgroundColor: cat.color }}
                  >
                    {tool.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {tool.name}
                </h3>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {tool.description}
                </p>
              </Link>
            )
          })}
        </div>

        <h2 className="mb-4 mt-10 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Browse by category
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat]
            const count = toolMetaList.filter((t) => t.category === cat).length
            return (
              <Link
                key={cat}
                href={`/category/${cat}`}
                className="group flex flex-col gap-1 rounded-xl border border-border/80 bg-card p-4 fl-card-hover"
              >
                <span
                  className="grid size-8 place-items-center rounded-lg text-xs font-bold text-primary-foreground"
                  style={{ backgroundColor: meta.color }}
                >
                  {meta.label.slice(0, 2)}
                </span>
                <h3 className="mt-1 text-sm font-semibold text-foreground">
                  {meta.label}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {count} tool{count === 1 ? '' : 's'}
                </p>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
