'use client'

import * as React from 'react'
import { SiteHeader } from '@/components/hub/site-header'
import { SiteFooter } from '@/components/hub/site-footer'
import { HubView } from '@/components/hub/hub-view'
import { ToolView } from '@/components/hub/tool-view'
import { CommandPalette } from '@/components/hub/command-palette'
import { ShortcutsHelp } from '@/components/hub/shortcuts-help'
import { BackToTop } from '@/components/hub/back-to-top'
import { tools, toolsBySlug } from '@/lib/tools/registry'
import { useToolHistory } from '@/lib/tools/use-tool-history'

function parseHash(): string | null {
  if (typeof window === 'undefined') return null
  const h = window.location.hash.replace(/^#/, '')
  const params = new URLSearchParams(h)
  return params.get('tool')
}

function buildHash(slug: string): string {
  return `#tool=${slug}`
}

export default function Home() {
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null)
  const [paletteOpen, setPaletteOpen] = React.useState(false)
  const [helpOpen, setHelpOpen] = React.useState(false)
  const searchRef = React.useRef<HTMLInputElement | null>(null)
  const { recordUse, recent } = useToolHistory()

  // Sync state with URL hash
  React.useEffect(() => {
    const sync = () => {
      const slug = parseHash()
      const next = slug && toolsBySlug.has(slug) ? slug : null
      setActiveSlug(next)
      if (next) recordUse(next)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [recordUse])

  const openTool = React.useCallback((slug: string) => {
    window.location.hash = buildHash(slug)
  }, [])

  const goHome = React.useCallback(() => {
    if (window.location.hash) {
      history.pushState(
        null,
        '',
        window.location.pathname + window.location.search
      )
      setActiveSlug(null)
      window.scrollTo({ top: 0, behavior: 'auto' })
    } else {
      setActiveSlug(null)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])

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

      // Cmd/Ctrl+K — always open palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
        return
      }

      // ? — show help (when not typing)
      if (e.key === '?' && !isTyping) {
        e.preventDefault()
        setHelpOpen(true)
        return
      }

      // Esc — close palette/help, or go home from a tool
      if (e.key === 'Escape') {
        if (paletteOpen || helpOpen) return // dialog handles its own esc
        if (activeSlug) {
          e.preventDefault()
          goHome()
        }
        return
      }

      // / — focus search (when not typing and on hub)
      if (e.key === '/' && !isTyping && !activeSlug) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeSlug, paletteOpen, helpOpen, goHome])

  const activeTool = activeSlug ? toolsBySlug.get(activeSlug) ?? null : null

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        onHome={goHome}
        toolCount={tools.length}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      {activeTool ? (
        <ToolView
          tool={activeTool}
          tools={tools}
          toolsBySlug={toolsBySlug}
          recent={recent}
          onBack={goHome}
          onSelect={openTool}
        />
      ) : (
        <HubView
          tools={tools}
          toolsBySlug={toolsBySlug}
          onSelect={openTool}
          searchRef={searchRef}
          onOpenPalette={() => setPaletteOpen(true)}
        />
      )}
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
