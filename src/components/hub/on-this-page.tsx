'use client'
import * as React from 'react'
import { List } from 'lucide-react'

/**
 * OnThisPage — a sticky "table of contents" with scroll-spy.
 *
 * Watches the scroll position and highlights the section currently in view.
 * Only renders links for sections that actually exist in the DOM (e.g. the
 * "Examples" section is only present for tools with hand-written overrides).
 *
 * The section <section id="…"> anchors are emitted by ToolContent; the list
 * here must match those ids.
 */
interface TocItem {
  id: string
  label: string
}

const ALL_ITEMS: TocItem[] = [
  { id: 'about', label: 'About' },
  { id: 'examples', label: 'Examples' },
  { id: 'how-to', label: 'How to use' },
  { id: 'use-cases', label: 'Use cases' },
  { id: 'tips', label: 'Tips' },
  { id: 'faq', label: 'FAQ' },
]

export function OnThisPage() {
  const [activeId, setActiveId] = React.useState<string>('')
  const [items, setItems] = React.useState<TocItem[]>([])

  // Determine which sections are actually rendered on this page.
  React.useEffect(() => {
    const present = ALL_ITEMS.filter((it) => {
      const el = document.getElementById(it.id)
      return Boolean(el)
    })
    setItems(present)
    if (present.length > 0) setActiveId(present[0].id)
  }, [])

  // Scroll-spy: highlight the section nearest the top of the viewport.
  React.useEffect(() => {
    if (items.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry closest to the top that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        // Trigger when a section's top crosses ~30% from the viewport top,
        // accounting for the sticky header.
        rootMargin: '-80px 0px -65% 0px',
        threshold: [0, 0.5, 1],
      }
    )
    for (const it of items) {
      const el = document.getElementById(it.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  if (items.length < 2) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Update the URL hash without jumping, for shareable anchors.
      if (typeof history !== 'undefined') {
        history.replaceState(null, '', `#${id}`)
      }
    }
  }

  return (
    <nav aria-label="On this page" className="text-sm">
      <h2 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <List className="size-3.5" />
        On this page
      </h2>
      <ul className="space-y-0.5 border-l border-border/70">
        {items.map((it) => {
          const active = activeId === it.id
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={(e) => handleClick(e, it.id)}
                aria-current={active ? 'location' : undefined}
                className={`-ml-px block border-l-2 py-1 pl-3 transition ${
                  active
                    ? 'border-primary font-medium text-primary'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                {it.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
