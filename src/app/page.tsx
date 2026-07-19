'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/hub/site-header'
import { SiteFooter } from '@/components/hub/site-footer'
import { HubView } from '@/components/hub/hub-view'
import { CommandPalette } from '@/components/hub/command-palette'
import { ShortcutsHelp } from '@/components/hub/shortcuts-help'
import { BackToTop } from '@/components/hub/back-to-top'
import { HomeJsonLd } from '@/components/hub/home-json-ld'
import { tools } from '@/lib/tools/registry'

/**
 * Home page (the hub).
 *
 * After the path-based-routing migration (SEO Priority 1), the hub lives at
 * `/` and individual tools live at `/tools/<slug>`. This component:
 *   - Renders the hub with search, category filter, favorites, etc.
 *   - Listens for legacy `#tool=<slug>` hash links (from old bookmarks /
 *     search-console indexes) and 301-redirects them to `/tools/<slug>`.
 *   - Listens for `#cat=<category>` (used by BreadcrumbList JSON-LD and the
 *     related-tools section) and activates that category filter on the hub.
 */
export default function Home() {
  const router = useRouter()
  const [paletteOpen, setPaletteOpen] = React.useState(false)
  const [helpOpen, setHelpOpen] = React.useState(false)
  const [initialCategory, setInitialCategory] = React.useState<
    'all' | 'developer' | 'text' | 'finance' | 'seo' | 'security' | 'network' | 'media' | 'misc'
  >('all')
  const searchRef = React.useRef<HTMLInputElement | null>(null)

  // On mount, check for legacy `#tool=<slug>` and redirect to `/tools/<slug>`.
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const h = window.location.hash.replace(/^#/, '')
    if (!h) return
    const params = new URLSearchParams(h)
    const toolSlug = params.get('tool')
    if (toolSlug) {
      // Legacy hash route → path route. Replace the URL so the back button
      // doesn't bounce back to the hash.
      router.replace(`/tools/${toolSlug}`)
      return
    }
    const cat = params.get('cat')
    if (cat) {
      setInitialCategory(cat as typeof initialCategory)
    }
  }, [router])

  const openTool = React.useCallback(
    (slug: string) => {
      router.push(`/tools/${slug}`)
    },
    [router]
  )

  // Global keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      const isTyping =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        target?.isContentEditable

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
        return
      }

      if (e.key === '?' && !isTyping) {
        e.preventDefault()
        setHelpOpen(true)
        return
      }

      if (e.key === 'Escape') {
        if (paletteOpen || helpOpen) return
        // On the hub, Esc clears focus (no back navigation needed)
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      }

      if (e.key === '/' && !isTyping) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [paletteOpen, helpOpen])

  return (
    <div className="flex min-h-screen flex-col">
      <HomeJsonLd />
      <SiteHeader
        onHome={() => router.push('/')}
        toolCount={tools.length}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      <HubView
        tools={tools}
        toolsBySlug={new Map(tools.map((t) => [t.slug, t]))}
        onSelect={openTool}
        searchRef={searchRef}
        onOpenPalette={() => setPaletteOpen(true)}
        initialCategory={initialCategory}
      />
      <SiteFooter />

      <CommandPalette
        tools={tools}
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onSelect={openTool}
      />
      <ShortcutsHelp open={helpOpen} onOpenChange={setHelpOpen} />
      <BackToTop />
    </div>
  )
}
