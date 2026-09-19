import Link from 'next/link'
import { History, Sparkles } from 'lucide-react'

/**
 * CurationSection — "Recently updated" log on the homepage.
 *
 * Purpose (twofold):
 *  1. SEO freshness — a visible, dated maintenance log is a strong signal
 *     that the site is actively curated (Google's helpful-content systems
 *     reward sites that are demonstrably maintained).
 *  2. AdSense trust — the "Low value content" review explicitly looks for
 *     "ongoing curation and structural maintenance". This section makes
 *     that maintenance impossible to miss.
 *
 * IMPORTANT: entries must stay truthful — describe work that actually
 * shipped, and add a new entry whenever you deploy meaningful changes.
 */
const UPDATES: { date: string; icon: 'guide' | 'fix' | 'seo' | 'ux'; text: string; href?: string; linkLabel?: string }[] = [
  {
    date: '2026-09-19',
    icon: 'seo',
    text: 'Search Console audit shipped: hand-tuned titles and descriptions for the Font Accessibility Checker and Diff Checker, corrected canonical tags on the legal pages, and refreshed the sitemap.',
    href: '/tools/font-accessibility-checker',
    linkLabel: 'Font Accessibility Checker',
  },
  {
    date: '2026-09-10',
    icon: 'guide',
    text: 'Three new in-depth guides published: font accessibility and WCAG legibility, MIME types explained, and how file signatures (magic bytes) identify any file.',
    href: '/blog',
    linkLabel: 'Read the guides',
  },
  {
    date: '2026-08-28',
    icon: 'ux',
    text: 'Ad experience overhaul: removed intrusive top-of-page ad units, simplified the cookie consent banner, and added a one-click consent withdrawal link in the footer.',
  },
  {
    date: '2026-08-15',
    icon: 'guide',
    text: 'Content marathon completed: every one of the 132 tool pages now carries unique, hand-written instructions, real examples, use cases, and an FAQ — visible even with JavaScript disabled.',
  },
  {
    date: '2026-08-02',
    icon: 'fix',
    text: 'Infrastructure fixes: redirect chains collapsed to a single hop (no more http → https → www loops) and stale sitemap dates corrected.',
  },
]

const ICONS: Record<string, React.ReactNode> = {
  guide: <Sparkles className="size-3.5" aria-hidden />,
  fix: <History className="size-3.5" aria-hidden />,
  seo: <Sparkles className="size-3.5" aria-hidden />,
  ux: <History className="size-3.5" aria-hidden />,
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  if (!y || !m || !d) return iso
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

export function CurationSection() {
  return (
    <section
      aria-label="Recent site updates"
      className="border-t border-border/60"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-primary" aria-hidden />
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
            <History className="size-5 text-primary" />
            Recently updated
          </h2>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          Fernandes Labs is actively maintained — here is what changed
          recently. Older entries are archived in the public{' '}
          <a
            href="https://github.com/FernandesLabs/Labs/commits/main"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            commit history
          </a>
          .
        </p>
        <ol className="relative space-y-4 border-l border-border/70 pl-5">
          {UPDATES.map((u) => (
            <li key={u.date} className="relative">
              <span
                className="absolute -left-[27px] top-1 grid size-4 place-items-center rounded-full border border-border bg-background text-primary"
                aria-hidden
              >
                {ICONS[u.icon]}
              </span>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {formatDate(u.date)}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-foreground">
                {u.text}
                {u.href && u.linkLabel ? (
                  <>
                    {' '}
                    <Link
                      href={u.href}
                      className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      {u.linkLabel}
                    </Link>
                  </>
                ) : null}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
