// src/components/ads/adblock-banner.tsx
'use client'
import * as React from 'react'
import { useAdblockDetect } from '@/hooks/use-adblock-detect'
import { X } from 'lucide-react'
const STORAGE_KEY = 'fl_adblock_dismissed_at'
const DISMISS_DURATION_DAYS = 7
export function AdblockBanner() {
  const adblockDetected = useAdblockDetect()
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    if (!adblockDetected) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const dismissedAt = new Date(raw)
        const now = new Date()
        const daysSinceDismiss =
          (now.getTime() - dismissedAt.getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceDismiss < DISMISS_DURATION_DAYS) {
          return
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    setVisible(true)
  }, [adblockDetected])
  const handleDismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString())
    } catch {
      // Ignore localStorage errors
    }
  }
  if (!visible) return null
  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 text-sm">
        <p className="flex-1">
          Ads help pay for the <strong>fernandeslabs.com</strong> domain and server costs,
          keeping all 132 tools 100% free and private. Please whitelist us or disable your
          adblocker. 🙏
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          className="-m-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Dismiss adblock banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}