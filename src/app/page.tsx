'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { SiteHeader } from '@/components/hub/site-header'
import { SiteFooter } from '@/components/hub/site-footer'
import { HubView } from '@/components/hub/hub-view'
import { SeoLinksSection } from '@/components/hub/seo-links-section'
import { BackToTop } from '@/components/hub/back-to-top'
import { SkipToContent } from '@/components/hub/skip-to-content'
import { HomeJsonLd } from '@/components/hub/home-json-ld'
import { AdblockBanner } from '@/components/ads/adblock-banner'
import { tools } from '@/lib/tools/registry'
import { toolMetaList } from '@/lib/tools/tool-meta'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/tools/types'

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
      <AdblockBanner />
      <HomeJsonLd />
      <SiteHeader
        onHome={() => router.push('/')}
        toolCount={tools.length}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      {/* Editorial intro — substantial unique content so Google (and AdSense
          reviewers) can determine what the site is about. */}
      <section
        aria-label="About Fernandes Labs"
        className="border-b border-border/60 bg-muted/20"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Free online tools for developers, designers &amp; marketers
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Fernandes Labs is a growing collection of 132 fast, privacy-first
            tools that run entirely in your browser. Format and validate JSON,
            generate secure passwords, look up IP addresses and DNS records,
            audit redirects and canonical tags, compress images, and calculate
            everything from mortgage payments to BMR — all without creating an
            account, uploading a single file, or being tracked.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every tool is built around the same promise: your data stays on
            your device. Processing happens client-side using modern Web APIs,
            so sensitive inputs like API keys, passwords, and private documents
            never leave your computer. The tools work offline once loaded and
            are installable as a Progressive Web App for on-the-go use.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Each tool ships with hand-written documentation, real examples,
            and practical tips written by our team of developers and SEO
            specialists. The site is free and supported by clearly labeled
            advertising and affiliate links — never by selling your data.
            <a
              href="/about"
              className="ml-1 font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Learn more about who we are.
            </a>
          </p>
        </div>
      </section>
      <HubView
        tools={tools}
        toolsBySlug={new Map(tools.map((t) => [t.slug, t]))}
        onSelect={openTool}
        searchRef={searchRef}
        onOpenPalette={() => setPaletteOpen(true)}
        initialCategory={initialCategory}
        initialQuery={initialQuery}
      />
      {/* SEO: internal-linking section with crawlable anchors to the top
          tools, all blog posts, and the About page (link equity + E-E-A-T). */}
      <SeoLinksSection />
      <SiteFooter />
      <CommandPalette
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