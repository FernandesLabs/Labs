// src/components/hub/command-palette.tsx
'use client'
import * as React from 'react'
import { Command } from 'cmdk'
import { Search, ArrowRight, Star, BookOpen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { tools, toolsBySlug } from '@/lib/tools/registry'
import { CATEGORY_META, type Tool } from '@/lib/tools/types'
import { useToolHistory } from '@/lib/tools/use-tool-history'
import { blogCategoryColor } from '@/lib/blog/blog-utils'

/** Slim, serializable guide entry for the palette's "Guides" group. */
export interface PalettePost {
  slug: string
  title: string
  category: string
  minutes: number
}

export function CommandPalette({
  open,
  onOpenChange,
  onSelect,
  onSelectPost,
  posts = [],
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (slug: string) => void
  /** Called when a guide entry is chosen (defaults to /blog/<slug>). */
  onSelectPost?: (slug: string) => void
  /** Slim guide list — include on every page so ⌘K searches everything. */
  posts?: PalettePost[]
}) {
  const [query, setQuery] = React.useState('')
  const { recent, favorites } = useToolHistory()
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Controlled filtering (shouldFilter={false} on <Command>): cmdk's built-in
  // subsequence filter produced bad rankings with rich value strings (query
  // "qr generator" matched "quote generator…" as a subsequence). We score
  // matches ourselves: name prefix > name > keyword > description.
  const q = query.trim().toLowerCase()
  const scoreTool = React.useCallback(
    (tool: Tool): number => {
      if (!q) return 0
      const name = tool.name.toLowerCase()
      if (name.startsWith(q)) return 0
      if (name.includes(q)) return 1
      if (tool.keywords?.some((k) => k.toLowerCase().includes(q))) return 2
      if (tool.description.toLowerCase().includes(q)) return 3
      return Infinity
    },
    [q]
  )
  const filteredTools = React.useMemo(() => {
    const scored = tools
      .map((tool) => ({ tool, score: scoreTool(tool) }))
      .filter(({ score }) => score !== Infinity)
    scored.sort(
      (a, b) => a.score - b.score || a.tool.name.localeCompare(b.tool.name)
    )
    return scored.map(({ tool }) => tool)
  }, [scoreTool])
  const filteredPosts = React.useMemo(() => {
    if (!q) return posts
    return posts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    )
  }, [posts, q])

  // The palette owns ⌘K globally: every page that mounts it gets the shortcut.
  // (Per-page listeners were removed to avoid double-toggling.) Radix Dialog
  // already handles Esc-to-close.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  // Reset query when opening/closing
  React.useEffect(() => {
    if (open) {
      setQuery('')
      // Focus input when opening
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])
  const handleSelect = React.useCallback(
    (slug: string) => {
      onSelect(slug)
      onOpenChange(false)
    },
    [onSelect, onOpenChange]
  )
  const handleSelectPost = React.useCallback(
    (slug: string) => {
      if (onSelectPost) onSelectPost(slug)
      onOpenChange(false)
    },
    [onSelectPost, onOpenChange]
  )
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* aria-describedby={undefined} silences Radix's missing-Description warning */}
      <DialogContent aria-describedby={undefined} className="overflow-hidden p-0 shadow-lg sm:max-w-lg">
        {/* VisuallyHidden title fixes the Radix DialogTitle accessibility error */}
        <VisuallyHidden>
          <DialogTitle>Search tools and guides</DialogTitle>
        </VisuallyHidden>
        <Command
          shouldFilter={false}
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              placeholder={
                posts.length > 0
                  ? `Search ${tools.length} tools + ${posts.length} guides…`
                  : `Search ${tools.length} tools by name or keyword…`
              }
              className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-1">
            {filteredTools.length === 0 && filteredPosts.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No tools or guides found.
              </div>
            ) : null}
            {!query.trim() && recent.length > 0 && (
              <Command.Group heading="Recently Used" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                {recent.slice(0, 5).map((slug) => {
                  const tool = toolsBySlug.get(slug)
                  if (!tool) return null
                  return (
                    <Command.Item
                      key={tool.slug}
                      value={tool.slug}
                      onSelect={() => handleSelect(tool.slug)}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                        {tool.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="flex-1">{tool.name}</span>
                      <ArrowRight className="h-3 w-3 opacity-50" />
                    </Command.Item>
                  )
                })}
              </Command.Group>
            )}
            {/* Guides — keyword-rich titles make the palette a site-wide
                search: a user typing "mime" finds the guide without knowing
                the tool page exists. */}
            {filteredPosts.length > 0 ? (
              <Command.Group
                heading="Guides & tutorials"
                className="px-2 py-1.5 text-xs font-semibold text-muted-foreground"
              >
                {filteredPosts.map((post) => (
                  <Command.Item
                    key={post.slug}
                    value={`guide ${post.title} ${post.category}`}
                    onSelect={() => handleSelectPost(post.slug)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10">
                      <BookOpen className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{post.title}</span>
                    <span
                      className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                      style={{
                        color: blogCategoryColor(post.category),
                        backgroundColor: `${blogCategoryColor(post.category)}14`,
                      }}
                    >
                      {post.category}
                    </span>
                    <ArrowRight className="h-3 w-3 shrink-0 opacity-50" />
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null}
            {/*
              Tools. With a query: one flat "Tools" group in score order
              (prefix > name > keyword > description) so the best match is
              always the first thing the user sees. Without a query: the full
              directory grouped by category.
            */}
            {q ? (
              <Command.Group
                heading="Tools"
                className="px-2 py-1.5 text-xs font-semibold text-muted-foreground"
              >
                {filteredTools.map((tool) => (
                  <Command.Item
                    key={tool.slug}
                    value={tool.slug}
                    onSelect={() => handleSelect(tool.slug)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                      {tool.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="flex-1">{tool.name}</span>
                    {favorites.includes(tool.slug) ? (
                      <Star className="h-3 w-3 text-yellow-500" />
                    ) : null}
                    <ArrowRight className="h-3 w-3 opacity-50" />
                  </Command.Item>
                ))}
              </Command.Group>
            ) : (
              Object.entries(
                filteredTools.reduce<Record<string, Tool[]>>((groups, tool) => {
                  ;(groups[tool.category] ??= []).push(tool)
                  return groups
                }, {})
              )
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([category, categoryTools]) => (
                  <Command.Group
                    key={category}
                    heading={CATEGORY_META[category]?.label || category}
                    className="px-2 py-1.5 text-xs font-semibold text-muted-foreground"
                  >
                    {categoryTools.map((tool) => (
                      <Command.Item
                        key={tool.slug}
                        value={tool.slug}
                        onSelect={() => handleSelect(tool.slug)}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                          {tool.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="flex-1">{tool.name}</span>
                        {favorites.includes(tool.slug) ? (
                          <Star className="h-3 w-3 text-yellow-500" />
                        ) : null}
                        <ArrowRight className="h-3 w-3 opacity-50" />
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
