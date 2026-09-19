// src/app/tools/[slug]/tool-page-client.tsx
'use client'
import { tools, toolsBySlug } from '@/lib/tools/registry'
import { ToolView } from '@/components/hub/tool-view'
import type { ToolGuide } from '@/components/hub/tool-related-guides'

/**
 * Client wrapper for the tool page. The server component resolves the tool's
 * related blog guides (see page.tsx) and forwards them here as a slim,
 * serializable prop — they render as the sidebar "Guides & tutorials" card.
 */
export function ToolPageClient({
  slug,
  guides = [],
}: {
  slug: string
  guides?: ToolGuide[]
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
      onBack={() => window.history.back()}
      onSelect={(s) => {
        // Navigate to the new tool route
        window.location.href = `/tools/${s}`
      }}
    />
  )
}
