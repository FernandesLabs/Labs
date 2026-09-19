// src/app/tools/[slug]/tool-page-client.tsx
'use client'
import { tools, toolsBySlug } from '@/lib/tools/registry'
import { ToolView } from '@/components/hub/tool-view'
import type { ToolGuide } from '@/components/hub/tool-related-guides'
import type { PalettePost } from '@/components/hub/command-palette'

/**
 * Client wrapper for the tool page. The server component resolves the tool's
 * related blog guides (sidebar card) and the slim all-guides list for the ⌘K
 * palette, then forwards both here as slim serializable props.
 */
export function ToolPageClient({
  slug,
  guides = [],
  posts = [],
}: {
  slug: string
  guides?: ToolGuide[]
  posts?: PalettePost[]
}) {
  const tool = toolsBySlug.get(slug)
  if (!tool) return null
  return (
    <ToolView
      tool={tool}
      tools={tools}
      toolsBySlug={toolsBySlug}
      recent={[]}
      guides={guides}
      posts={posts}
      onBack={() => window.history.back()}
      onSelect={(s) => {
        // Navigate to the new tool route
        window.location.href = `/tools/${s}`
      }}
    />
  )
}
