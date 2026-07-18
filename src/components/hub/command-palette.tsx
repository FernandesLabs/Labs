'use client'

import * as React from 'react'
import { CornerDownLeft, Star, Clock, ArrowRight } from 'lucide-react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import {
  CATEGORY_META,
  type Tool,
  type ToolCategory,
} from '@/lib/tools/types'
import { useToolHistory } from '@/lib/tools/use-tool-history'

export function CommandPalette({
  tools,
  open,
  onOpenChange,
  onSelect,
}: {
  tools: Tool[]
  open: boolean
  onOpenChange: (v: boolean) => void
  onSelect: (slug: string) => void
}) {
  const { recent, favorites } = useToolHistory()
  const toolsBySlug = React.useMemo(
    () => new Map(tools.map((t) => [t.slug, t])),
    [tools]
  )

  const favTools = React.useMemo(
    () =>
      favorites
        .map((s) => toolsBySlug.get(s))
        .filter((t): t is Tool => Boolean(t)),
    [favorites, toolsBySlug]
  )
  const recentTools = React.useMemo(
    () =>
      recent
        .map((s) => toolsBySlug.get(s))
        .filter((t): t is Tool => Boolean(t)),
    [recent, toolsBySlug]
  )

  const grouped = React.useMemo(() => {
    const map = new Map<ToolCategory, Tool[]>()
    for (const t of tools) {
      if (!map.has(t.category)) map.set(t.category, [])
      map.get(t.category)!.push(t)
    }
    return map
  }, [tools])

  const handleSelect = React.useCallback(
    (slug: string) => {
      onSelect(slug)
      onOpenChange(false)
    },
    [onSelect, onOpenChange]
  )

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command Palette"
      description="Search tools by name, category, or keyword."
      className="max-w-2xl"
    >
      <CommandInput placeholder="Search 62 tools by name or keyword…" />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty>No tools found.</CommandEmpty>

        {favTools.length > 0 || recentTools.length > 0 ? (
          <>
            {favTools.length > 0 ? (
              <CommandGroup heading="Favorites">
                {favTools.map((t) => (
                  <PaletteItem
                    key={`fav-${t.slug}`}
                    tool={t}
                    onSelect={handleSelect}
                    icon={<Star className="size-4 fill-amber-400 text-amber-400" />}
                  />
                ))}
              </CommandGroup>
            ) : null}
            {recentTools.length > 0 ? (
              <CommandGroup heading="Recently used">
                {recentTools.map((t) => (
                  <PaletteItem
                    key={`rec-${t.slug}`}
                    tool={t}
                    onSelect={handleSelect}
                    icon={<Clock className="size-4 text-muted-foreground" />}
                  />
                ))}
              </CommandGroup>
            ) : null}
            <CommandSeparator />
          </>
        ) : null}

        {[...grouped.entries()].map(([cat, items]) => (
          <CommandGroup
            key={cat}
            heading={CATEGORY_META[cat].label}
          >
            {items.map((t) => (
              <PaletteItem
                key={`${cat}-${t.slug}`}
                tool={t}
                onSelect={handleSelect}
              />
            ))}
          </CommandGroup>
        ))}

        <CommandSeparator />
        <CommandGroup heading="Tips">
          <div className="flex items-center justify-between px-2 py-2 text-xs text-muted-foreground">
            <span>Navigate with ↑ ↓, open with Enter</span>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              esc
            </kbd>
          </div>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

function PaletteItem({
  tool,
  onSelect,
  icon,
}: {
  tool: Tool
  onSelect: (slug: string) => void
  icon?: React.ReactNode
}) {
  return (
    <CommandItem
      value={`${tool.name} ${tool.description} ${tool.category} ${
        tool.keywords?.join(' ') ?? ''
      }`}
      onSelect={() => onSelect(tool.slug)}
      className="group"
    >
      <span
        className="grid size-7 shrink-0 place-items-center rounded-md text-[10px] font-bold text-primary-foreground"
        style={{ backgroundColor: CATEGORY_META[tool.category].color }}
      >
        {tool.name.slice(0, 2).toUpperCase()}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{tool.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {tool.description}
        </span>
      </div>
      {icon ?? (
        <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 transition group-data-[selected=true]:translate-x-0.5 group-data-[selected=true]:text-foreground" />
      )}
    </CommandItem>
  )
}
