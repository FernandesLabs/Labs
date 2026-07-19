'use client'
import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Home, FileText } from 'lucide-react'
import { SiteHeader } from '@/components/hub/site-header'
import { SiteFooter } from '@/components/hub/site-footer'
import { BackToTop } from '@/components/hub/back-to-top'
import { ReadingProgress } from '@/components/hub/reading-progress'
import { SkipToContent } from '@/components/hub/skip-to-content'
import { toolMetaList } from '@/lib/tools/tool-meta'

/**
 * LegalPage — shared layout shell for long-form legal / info pages
 * (Privacy Policy, Terms of Service, etc.).
 *
 * Provides: skip-to-content link, reading progress bar, sticky site header,
 * breadcrumbs, a prose article container, sticky footer, and back-to-top.
 *
 * The `sections` prop (optional) drives a sticky "On this page" table of
 * contents in the sidebar — pass the ids/labels of <section id="…"> blocks
 * inside the children.
 */
export function LegalPage({
  title,
  subtitle,
  children,
  sections = [],
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  sections?: { id: string; label: string }[]
}) {
  const router = useRouter()
  const hasToc = sections.length >= 2

  return (
    <div className="flex min-h-screen flex-col">
      <ReadingProgress />
      <SkipToContent />
      <SiteHeader
        onHome={() => router.push('/')}
        toolCount={toolMetaList.length}
        onOpenPalette={() => router.push('/')}
      />
      <main id="main-content" className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border/60 bg-muted/20">
          <nav
            aria-label="Breadcrumb"
            className="mx-auto flex max-w-5xl items-center gap-1.5 px-4 py-2.5 text-xs text-muted-foreground"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 transition hover:text-foreground"
            >
              <Home className="size-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="size-3.5 text-muted-foreground/50" />
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <FileText className="size-3.5" />
              {title}
            </span>
          </nav>
        </div>

        <div
          className={`mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 ${
            hasToc ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10' : ''
          }`}
        >
          <article className={hasToc ? 'min-w-0' : 'mx-auto max-w-3xl'}>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
            <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {children}
            </div>
            <p className="mt-12 border-t border-border/60 pt-4 text-xs text-muted-foreground">
              © {new Date().getFullYear()} Fernandes Labs. All rights reserved.
            </p>
          </article>

          {hasToc ? (
            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <LegalToc sections={sections} />
              </div>
            </aside>
          ) : null}
        </div>
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  )
}

/** Table of contents for legal pages (mirrors OnThisPage but server-friendly). */
function LegalToc({
  sections,
}: {
  sections: { id: string; label: string }[]
}) {
  const [activeId, setActiveId] = React.useState<string>(sections[0]?.id ?? '')

  React.useEffect(() => {
    if (sections.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: [0, 0.5, 1] }
    )
    for (const s of sections) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [sections])

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (typeof history !== 'undefined') {
        history.replaceState(null, '', `#${id}`)
      }
    }
  }

  return (
    <nav aria-label="On this page" className="text-sm">
      <h2 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        On this page
      </h2>
      <ul className="space-y-0.5 border-l border-border/70">
        {sections.map((s) => {
          const active = activeId === s.id
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => handleClick(e, s.id)}
                aria-current={active ? 'location' : undefined}
                className={`-ml-px block border-l-2 py-1 pl-3 transition ${
                  active
                    ? 'border-primary font-medium text-primary'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                {s.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
