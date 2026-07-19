'use client'
import * as React from 'react'
import { ChevronDown, Compass } from 'lucide-react'

/**
 * MobileSidebar — renders children inside a collapsible disclosure on mobile
 * (below the `lg` breakpoint) and as a plain sticky block on desktop.
 *
 * On mobile the disclosure is collapsed by default to avoid pushing the tool
 * content far down the page. On `lg+` the disclosure chrome is hidden and the
 * children render directly (sticky, top-20).
 */
export function MobileSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const id = React.useId()
  return (
    <div className="lg:sticky lg:top-20 lg:self-start">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border/70 bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/50 lg:hidden"
      >
        <span className="flex items-center gap-2">
          <Compass className="size-4 text-primary" />
          Quick navigation
        </span>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {/* Collapsible content on mobile; always visible on desktop */}
      <div
        id={id}
        className={`mt-3 space-y-6 lg:mt-0 ${
          open ? 'block' : 'hidden lg:block'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
