'use client'
import * as React from 'react'
import { List } from 'lucide-react'

/**
 * BlogToc — "On this page" table of contents with scroll-spy for blog posts.
 *
 * Unlike the tool page's `OnThisPage` (which watches a fixed list of tool
 * section ids), this component receives its items as a prop — the server
 * component extracts them from the markdown body at build time, so the
 * rendered h2 anchors and these links always match.
 */
interface TocItem {
  id: string
  label: string
}

export function BlogToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = React.useState<string>('')

  // Scroll-spy: highlight the heading nearest the top of the viewport.
  React.useEffect(() => {
    if (items.length === 0) return
    setActiveId(items[0].id)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
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
