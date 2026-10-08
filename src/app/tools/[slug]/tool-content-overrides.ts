// src/app/tools/[slug]/tool-content-overrides.ts
/**
 * Central content-override module.
 *
 * The 132 hand-written tool overrides live in per-category modules under
 * ./overrides/ (see overrides/index.ts for the merge). This file keeps the
 * public API used by the rest of the app (tool-content.tsx, tool-json-ld.tsx
 * and tests) stable: re-exports the merged OVERRIDES map + the
 * ContentOverride type, and defines the lookup helper.
 *
 * The template fallbacks used to be duplicated here AND in `tool-seo.ts`.
 * The two copies had already drifted (this one was missing the SEO FAQ
 * branch), and both hardcoded "your data never leaves your browser", which is
 * false for the six server-proxied network tools. They now live only in
 * `tool-seo.ts`, which branches on `category === 'network'`.
 */
import type { ToolMeta } from '@/lib/tools/types'
import { OVERRIDES } from './overrides'
import type { ContentOverride, ToolOverrideMap } from './overrides'
export type { ContentOverride, ToolOverrideMap } from './overrides'
export { OVERRIDES }

/**
 * Get a hand-written content override for a tool, or null if none exists.
 * The server component and the client component both call this so the
 * visible content and the JSON-LD stay in sync.
 */
export function getToolContentOverride(slug: string): ContentOverride | null {
  return OVERRIDES[slug] ?? null
}
/**
 * Get the intro text for a tool — override if available, else template.
 * Re-exported from `tool-seo.ts`; see the note below on why these live there.
 */
export { generateToolIntro as getToolIntro } from './tool-seo'
/** Get the FAQ list for a tool — override if available, else template. */
export { generateToolFaq as getToolFaqs } from './tool-seo'
/** Get the how-to steps for a tool — override if available, else template. */
export { generateToolHowTo as getToolHowTo } from './tool-seo'