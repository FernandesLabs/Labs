import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { toolMetaList } from '@/lib/tools/tool-meta'
import { CATEGORY_META, CATEGORY_ORDER, type ToolCategory } from '@/lib/tools/types'

/**
 * Root-level not-found page (for any unmatched URL not under /tools/).
 * Mirrors the /tools/[slug]/not-found design for consistency.
 */
export const metadata = {
  title: 'Page not found — Fernandes Labs',
  description:
    'The page you were looking for could not be found. Browse all 132 free online tools on Fernandes Labs.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  const popular = [
    'json-formatter',
    'password-generator',
    'qr-generator',
    'uuid-generator',
  ]
    .map((s) => toolMetaList.find((t) => t.slug === s))
    .filter(Boolean)
    .slice(0, 4)

  return (
    <main className="flex-1">
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
            Page not found
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            The page you were looking for doesn&apos;t exist. It may have moved
            or been removed.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <Home className="size-4" />
              Back to all tools
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
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-[10px] font-bold text-primary-foreground"
                  style={{ backgroundColor: cat.color }}
                >
                  {tool.name.slice(0, 2).toUpperCase()}
                </span>
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
