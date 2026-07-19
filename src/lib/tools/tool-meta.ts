/**
 * Server-safe tool metadata.
 *
 * This module contains NO React components and NO `'use client'` directive,
 * so it can be imported from Server Components (e.g. the per-tool
 * `app/tools/[slug]/page.tsx` route) and from metadata-generating functions
 * like `generateMetadata` and `sitemap`.
 *
 * The actual tool registry (`registry.tsx`) imports this JSON and attaches
 * the lazy-loaded React `Component` to each entry — keeping a single source
 * of truth for slug / name / description / keywords / category.
 *
 * Generated from `registry.tsx` — re-run the extractor if tools are added.
 */
import type { ToolMeta } from './types'
import toolMeta from './tool-meta.json'

export const toolMetaList: ToolMeta[] = toolMeta as ToolMeta[]

export const toolMetaBySlug: Map<string, ToolMeta> = new Map(
  toolMetaList.map((t) => [t.slug, t])
)

export const toolSlugs: string[] = toolMetaList.map((t) => t.slug)

/** Get a tool's metadata by slug, or `undefined` if not found. */
export function getToolMeta(slug: string): ToolMeta | undefined {
  return toolMetaBySlug.get(slug)
}

/** All tools in a given category. */
export function toolsByCategory(category: string): ToolMeta[] {
  return toolMetaList.filter((t) => t.category === category)
}
