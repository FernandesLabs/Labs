import * as React from 'react'
import { preloadFunctions } from './registry'
/**
 * Preload a tool's chunk (idempotent — only fetches once per slug).
 *
 * Uses the `preloadFunctions` map exported by the registry, which holds the
 * raw `() => import('...')` factory for every tool. Calling it triggers the
 * dynamic import so the chunk is fetched and cached by the browser before the
 * user actually clicks — making subsequent navigation feel instant.
 */
const preloaded = new Set<string>()
export function preloadTool(slug: string) {
  if (preloaded.has(slug)) return
  const factory = preloadFunctions.get(slug)
  if (factory) {
    preloaded.add(slug)
    // Fire-and-forget; errors are swallowed because a failed preload should
    // never break the UI — the real import will retry on navigation.
    factory().catch(() => {
      preloaded.delete(slug)
    })
  }
}
/** React hook to preload a tool on hover/focus. */
export function usePreloadOnHover(slug: string) {
  const preloadedRef = React.useRef(false)
  const preload = React.useCallback(() => {
    if (preloadedRef.current) return
    preloadedRef.current = true
    preloadTool(slug)
  }, [slug])
  return {
    onMouseEnter: preload,
    onFocus: preload,
  }
}
