'use client'

import * as React from 'react'
import { toolImporters } from './registry'

/** Preload a tool's chunk (idempotent — only fetches once per slug). */
export function preloadTool(slug: string) {
  const importer = toolImporters[slug]
  if (importer) {
    // Fire and forget — the dynamic() cache will hold the result.
    importer().catch(() => {
      /* ignore preload errors — will retry on actual open */
    })
  }
}

/** React hook returning hover/focus handlers that preload a tool's chunk. */
export function usePreloadOnHover(slug: string) {
  const done = React.useRef(false)
  const handle = React.useCallback(() => {
    if (done.current) return
    done.current = true
    preloadTool(slug)
  }, [slug])

  return {
    onMouseEnter: handle,
    onFocus: handle,
  }
}
