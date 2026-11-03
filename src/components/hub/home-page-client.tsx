'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { SiteHeader } from '@/components/hub/site-header'
import { SiteFooter } from '@/components/hub/site-footer'
import { HubView } from '@/components/hub/hub-view'
import { SeoLinksSection, type SeoGuideLink } from '@/components/hub/seo-links-section'
import { CurationSection } from '@/components/hub/curation-section'
import { BackToTop } from '@/components/hub/back-to-top'
import { SkipToContent } from '@/components/hub/skip-to-content'
import { HomeJsonLd } from '@/components/hub/home-json-ld'
import { AdblockBanner } from '@/components/ads/adblock-banner'
import { tools } from '@/lib/tools/registry'
import { toolMetaList } from '@/lib/tools/tool-meta'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/tools/types'
import type { PalettePost } from '@/components/hub/command-palette'

// Lazy-load dialog-heavy components that only open on user interaction.
// This saves ~60KB of JS (cmdk + Dialog x2) on the initial page load,
// significantly improving LCP and TBT.
const CommandPalette = dynamic(
  () => import('@/components/hub/command-palette').then((m) => m.CommandPalette),
  { ssr: false }
)
const ShortcutsHelp = dynamic(
  () => import('@/components/hub/shortcuts-help').then((m) => m.ShortcutsHelp),
  { ssr: false }
)
/**
 * HomePageClient — interactive hub (the `/` route body).
 *
 * Split out of `src/app/page.tsx` so the page can export server-side
 * `metadata` (its own canonical URL + an optimized title/description).
 * This component handles everything interactive:
 *   - Renders the hub with search, category filter, favorites, etc.
 *   - Reads the `?q=` URL query param (used by the WebSite.SearchAction
 *     JSON-LD on the home page) and pre-fills the search box.
 *   - Listens for legacy `#tool=<slug>` hash links and 301-redirects them
 *     to `/tools/<slug>`.
 *   - Listens for `#cat=<category>` (legacy) and activates that filter.
 */
export function HomePageClient({
  posts = [],
  guides = [],
}: {
  /** Slim guide list for the ⌘K palette's "Guides" group (server-computed). */
  posts?: PalettePost[]
  /** Slim guide links for the SEO internal-linking block (server-computed —
   *  keeps post markdown out of the homepage client bundle). */
  guides?: SeoGuideLink[]
}) {
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
        // ⌘K is handled globally inside CommandPalette — ignore here to
        // avoid double-toggling.
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
      <AdblockBanner />
      <HomeJsonLd />
      <SiteHeader
        onHome={() => router.push('/')}
        toolCount={tools.length}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      {/*
        NOTE: the ~150-word editorial intro that used to sit here was removed.

        It pushed the tool grid — the actual reason to visit — below the fold
        and read as filler to anyone who had not used a tool yet. The
        differentiators it made in prose now live in the hero badge row (see
        hub-view.tsx), and the internal links it carried were moved to
        SeoLinksSection, which renders crawlable anchors to all 8 category
        hubs. Unique homepage copy for crawlers is still present: the
        <noscript> block below, plus every category blurb, tool blurb and post
        excerpt in SeoLinksSection.
      */}
      <HubView
        tools={tools}
        toolsBySlug={new Map(tools.map((t) => [t.slug, t]))}
        searchRef={searchRef}
        onOpenPalette={() => setPaletteOpen(true)}
        initialCategory={initialCategory}
        initialQuery={initialQuery}
      />
      {/* Curation log — dated entries proving ongoing maintenance (freshness
          for Google, trust for AdSense reviewers). */}
      <CurationSection />
      {/* SEO: internal-linking section with crawlable anchors to the top
          tools, all blog posts, and the About page (link equity + E-E-A-T). */}
      <SeoLinksSection guides={guides} />
      <SiteFooter />
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onSelect={openTool}
        posts={posts}
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
            Fast, privacy-first tools that mostly run in your browser. No
            sign-up. Most work offline.
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
