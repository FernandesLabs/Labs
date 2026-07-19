'use client'
import { Github, Sparkles, Search } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { Button } from '@/components/ui/button'
export function SiteHeader({
  onHome,
  toolCount = 0,
  onOpenPalette,
}: {
  onHome?: () => void
  toolCount?: number
  onOpenPalette?: () => void
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <button
          type="button"
          onClick={onHome}
          className="group flex items-center gap-2.5"
          aria-label="Fernandes Labs home"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm transition group-hover:scale-105">
            <svg
              viewBox="0 0 32 32"
              className="size-5"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 22V10h5.5a3.5 3.5 0 0 1 0 7H12"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="20" r="1.6" fill="currentColor" />
            </svg>
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-[15px] font-bold tracking-tight text-foreground">
              Fernandes Labs
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:block">
              Tool Network
            </span>
          </span>
        </button>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenPalette}
            className="hidden h-8 gap-2 text-muted-foreground sm:inline-flex"
            aria-label="Open command palette"
          >
            <Search className="size-3.5" />
            <span className="text-xs">Search</span>
            <kbd className="ml-1 rounded border border-border bg-muted px-1 font-mono text-[10px] font-semibold">
              ⌘K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenPalette}
            className="size-8 text-muted-foreground sm:hidden"
            aria-label="Search tools"
          >
            <Search className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden text-muted-foreground hover:text-foreground lg:inline-flex"
          >
            <a
              href="https://github.com/FernandesLabs/Labs"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Github className="size-4" />
              <span>Source</span>
            </a>
          </Button>
          <span className="hidden items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground md:inline-flex">
            <Sparkles className="size-3 text-primary" />
            {`${toolCount} tools`}
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}