// src/app/tools/[slug]/tool-page-client.tsx
'use client'
import { tools, toolsBySlug } from '@/lib/tools/registry'
import { ToolView } from '@/components/hub/tool-view'
export function ToolPageClient({ slug }: { slug: string }) {
  const tool = toolsBySlug.get(slug)
  if (!tool) return null
  return (
    <ToolView
      tool={tool}
      tools={tools}
      toolsBySlug={toolsBySlug}
      recent={[]}
      onBack={() => window.history.back()}
      onSelect={(s) => {
        // Navigate to the new tool route
        window.location.href = `/tools/${s}`
      }}
    />
  )
}