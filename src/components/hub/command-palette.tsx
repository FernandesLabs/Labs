// src/components/hub/command-palette.tsx
'use client'
import * as React from 'react'
import { Command } from 'cmdk'
import { Search, ArrowRight, Star } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { tools, toolsBySlug } from '@/lib/tools/registry'
import { CATEGORY_META, type Tool } from '@/lib/tools/types'
import { useToolHistory } from '@/lib/tools/use-tool-history'
export function CommandPalette({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (slug: string) => void
}) {
  const [query, setQuery] = React.useState('')
  const { recent, favorites } = useToolHistory()
  const inputRef = React.useRef<HTMLInputElement>(null)
  // Filter tools based on query
  const filtered = React.useMemo(() => {
    if (!query.trim()) return tools
    const q = query.toLowerCase()
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords?.some((k) => k.toLowerCase().includes(q))
    )
  }, [query])
  // Group filtered tools
  const grouped = React.useMemo(() => {
    const groups: Record<string, Tool[]> = {}
    for (const tool of filtered) {
      const cat = tool.category
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(tool)
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-lg sm:max-w-lg">
        {/* VisuallyHidden title fixes the Radix DialogTitle accessibility error */}
        <VisuallyHidden>
          <DialogTitle>Search Tools</DialogTitle>
        </VisuallyHidden>
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              placeholder={`Search ${tools.length} tools by name or keyword…`}
              className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-1">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No tools found.
            </Command.Empty>
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
            {grouped.map(([category, categoryTools]) => (
              <Command.Group key={category} heading={CATEGORY_META[category]?.label || category} className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
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
                    {favorites.includes(tool.slug) ? <Star className="h-3 w-3 text-yellow-500" /> : null}
                    <ArrowRight className="h-3 w-3 opacity-50" />
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}