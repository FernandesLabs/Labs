import Link from 'next/link'
import { CATEGORY_ORDER, CATEGORY_META } from '@/lib/tools/types'

/** Not-found for /category/[invalid] */
export const metadata = {
  title: 'Category not found — Fernandes Labs',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="fl-grid-bg absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">404</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Category not found
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            That category doesn&apos;t exist. Pick one below.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat]
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
                <p className="text-xs text-muted-foreground">{meta.blurb}</p>
              </Link>
            )
          })}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            All tools
          </Link>
        </div>
      </section>
    </main>
  )
}
