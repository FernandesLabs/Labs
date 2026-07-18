'use client'

import { Loader2 } from 'lucide-react'

/** Loading skeleton shown while a lazy-loaded tool component fetches its chunk. */
export function ToolLoadingSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span>Loading tool…</span>
      </div>
      <div className="space-y-3">
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted/60" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-muted/60" />
        <div className="h-10 w-2/3 animate-pulse rounded-lg bg-muted/60" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
        <div className="h-32 w-full animate-pulse rounded-lg bg-muted/60" />
      </div>
    </div>
  )
}
