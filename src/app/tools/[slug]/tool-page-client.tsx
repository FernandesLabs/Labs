'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SiteHeader } from '@/components/hub/site-header'
import { SiteFooter } from '@/components/hub/site-footer'
import { ToolView } from '@/components/hub/tool-view'
import { CommandPalette } from '@/components/hub/command-palette'
import { ShortcutsHelp } from '@/components/hub/shortcuts-help'
import { BackToTop } from '@/components/hub/back-to-top'
import { tools, toolsBySlug } from '@/lib/tools/registry'
import { useToolHistory } from '@/lib/tools/use-tool-history'
import type { ToolMeta } from '@/lib/tools/types'

/**
 * Client-side wrapper for the per-tool page.
 *
 * The server component (`page.tsx`) handles metadata + JSON-LD, then mounts
 * this client component which lazy-loads the actual tool UI via `ToolView`.
 *
 * Navigation is path-based:
 *   - "Back to all tools" → `router.push('/')`
 *   - Selecting another tool → `router.push('/tools/<slug>')`
 *   - The command palette also navigates to `/tools/<slug>`
 */
export function ToolPageClient({
  slug,
  toolMeta,
  relatedMeta,
}: {
  slug: string
  toolMeta: ToolMeta
  relatedMeta: ToolMeta[]
}) {
  const router = useRouter()
  const [paletteOpen, setPaletteOpen] = React.useState(false)
  const [helpOpen, setHelpOpen] = React.useState(false)
  const { recordUse, recent } = useToolHistory()

  // The full Tool object (with the lazy-loaded Component) comes from the
  // client-side registry. We look it up by slug.
  const tool = toolsBySlug.get(slug)

  React.useEffect(() => {
    // Record this tool in the user's "recently used" history.
    if (tool) recordUse(slug)
    // Scroll to top on tool change.
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [slug, tool, recordUse])

  // Keyboard shortcuts (⌘K palette, ? help, Esc back)
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
        e.preventDefault()
        router.push('/')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [router, paletteOpen, helpOpen])

  const openTool = React.useCallback(
    (nextSlug: string) => {
      router.push(`/tools/${nextSlug}`)
    },
    [router]
  )

  const goHome = React.useCallback(() => {
    router.push('/')
  }, [router])

  if (!tool) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader
          onHome={goHome}
          toolCount={tools.length}
          onOpenPalette={() => setPaletteOpen(true)}
        />
        <main className="mx-auto max-w-2xl flex-1 px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Tool not found</h1>
          <p className="mt-2 text-muted-foreground">
            The tool &ldquo;{toolMeta.name}&rdquo; could not be loaded.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Back to all tools
          </Link>
        </main>
        <SiteFooter />
      </div>
    )
  }

  // Filter the related tools to only those that exist in the registry.
  const related = relatedMeta
    .map((m) => toolsBySlug.get(m.slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        onHome={goHome}
        toolCount={tools.length}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      <ToolView
        tool={tool}
        tools={tools}
        toolsBySlug={toolsBySlug}
        recent={recent}
        onBack={goHome}
        onSelect={openTool}
        relatedTools={related}
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
