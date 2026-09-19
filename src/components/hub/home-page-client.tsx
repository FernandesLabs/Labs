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
      {/* Editorial intro — substantial unique content so Google (and AdSense
          reviewers) can determine what the site is about, plus keyword-rich
          internal links to every category. */}
      <section
        aria-label="About Fernandes Labs"
        className="border-b border-border/60 bg-muted/20"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Free online tools for developers, designers &amp; marketers
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Fernandes Labs is a collection of 132 free online tools that run
            entirely in your browser — no sign-up, no uploads, no tracking.
            Format and validate JSON, generate secure passwords, look up IP
            addresses and DNS records, test 301 redirects, compress images,
            and calculate everything from loan payments to BMR. Pick a
            category to start:
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORY_ORDER.map((cat) => (
              <li key={cat}>
                <a
                  href={`/category/${cat}`}
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  Free {CATEGORY_META[cat].label.toLowerCase()} tools
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Every tool processes data client-side with modern Web APIs, so
            sensitive inputs like API keys, passwords, and private documents
            never leave your device. Each page includes hand-written guides,
            real examples, and practical tips from our team.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            The site is free, supported by clearly labeled ads and affiliate
            links — never by selling data.{' '}
            <a
              href="/about"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Learn more about who we are
            </a>{' '}
            or read our{' '}
            <a
              href="/blog"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              latest guides
            </a>
            .
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
