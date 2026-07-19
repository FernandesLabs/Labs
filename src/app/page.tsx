'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/hub/site-header'
import { SiteFooter } from '@/components/hub/site-footer'
import { HubView } from '@/components/hub/hub-view'
import { CommandPalette } from '@/components/hub/command-palette'
import { ShortcutsHelp } from '@/components/hub/shortcuts-help'
import { BackToTop } from '@/components/hub/back-to-top'
import { SkipToContent } from '@/components/hub/skip-to-content'
import { HomeJsonLd } from '@/components/hub/home-json-ld'
import { tools } from '@/lib/tools/registry'
import { toolMetaList } from '@/lib/tools/tool-meta'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/tools/types'
/**
 * Home page (the hub).
 *
 * After the path-based-routing migration (SEO Priority 1), the hub lives at
 * `/` and individual tools live at `/tools/<slug>`. This component:
 *   - Renders the hub with search, category filter, favorites, etc.
 *   - Reads the `?q=` URL query param (used by the WebSite.SearchAction
 *     JSON-LD on the home page) and pre-fills the search box. This makes
 *     the site eligible for Google's sitelinks search box rich result.
 *   - Listens for legacy `#tool=<slug>` hash links (from old bookmarks /
 *     search-console indexes) and 301-redirects them to `/tools/<slug>`.
 *   - Listens for `#cat=<category>` (legacy) and activates that category filter.
 */
export default function Home() {
  const router = useRouter()
  const [paletteOpen, setPaletteOpen] = React.useState(false)
  const [helpOpen, setHelpOpen] = React.useState(false)
  const [initialCategory, setInitialCategory] = React.useState<
    'all' | 'developer' | 'text' | 'finance' | 'seo' | 'security' | 'network' | 'media' | 'misc'
  >('all')
  const [initialQuery, setInitialQuery] = React.useState('')
  const searchRef = React.useRef<HTMLInputElement | null>(null)
  // On mount, read `?q=` (SearchAction) and legacy `#tool=` / `#cat=` hashes.
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    // 1. Read the ?q= query param (WebSite.SearchAction JSON-LD target).
    //    Pre-fills the search box so Google's sitelinks search box works.
    const url = new URL(window.location.href)
    const q = url.searchParams.get('q')
    if (q) {
      setInitialQuery(q)
      // Focus the search box after the query is applied.
      setTimeout(() => searchRef.current?.focus(), 100)
    }
    // 2. Handle legacy `#tool=<slug>` and `#cat=<category>` hash routes.
    const h = window.location.hash.replace(/^#/, '')
    if (!h) return
    const params = new URLSearchParams(h)
    const toolSlug = params.get('tool')
    if (toolSlug) {
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
      <SkipToContent />
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
        initialQuery={initialQuery}
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
      {/* SEO: server-rendered list of ALL 132 tools for crawlers that don't
          execute JS (Bing, social bots) and to speed up Googlebot discovery.
          The interactive hub above renders the grid client-side; this block
          guarantees every tool URL is present in the initial HTML payload. */}
      <noscript>
        <div
          style={{
            padding: '2rem 1rem',
            fontFamily: 'system-ui, sans-serif',
            color: '#333',
            background: '#fff',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Fernandes Labs — {toolMetaList.length} Free Online Tools
          </h2>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            Fast, privacy-first tools that run entirely in your browser. No
            sign-up. No tracking. Works offline.
          </p>
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat]
            const catTools = toolMetaList.filter((t) => t.category === cat)
            if (catTools.length === 0) return null
            return (
              <section key={cat} style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <a href={`/category/${cat}`}>{meta.label} Tools</a>{' '}
                  <span style={{ fontWeight: 400, color: '#666', fontSize: '0.875rem' }}>
                    ({catTools.length})
                  </span>
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.25rem' }}>
                  {catTools.map((t) => (
                    <li key={t.slug}>
                      <a
                        href={`/tools/${t.slug}`}
                        style={{ fontSize: '0.875rem', color: '#2563eb' }}
                      >
                        {t.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      </noscript>
    </div>
  )
}