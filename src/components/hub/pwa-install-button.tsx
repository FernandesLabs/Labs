'use client'
import * as React from 'react'
import { MonitorDown } from 'lucide-react'

/**
 * PWA install affordance. Renders NOTHING until the browser fires
 * `beforeinstallprompt` (Chromium/Edge/Android criteria: manifest + service
 * worker + not already installed), so pages without install support — and
 * browsers like Safari desktop — never see a dead button.
 *
 * While the app runs standalone (installed), the button hides itself.
 */
export function PwaInstallButton({ className }: { className?: string }) {
  const [promptEvent, setPromptEvent] = React.useState<BeforeInstallPromptEvent | null>(null)

  React.useEffect(() => {
    const nav = window.navigator as Navigator & { standalone?: boolean }
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
    if (standalone) return

    const onPrompt = (e: Event) => {
      e.preventDefault() // suppress the mini-infobar; we own the UX
      setPromptEvent(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setPromptEvent(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!promptEvent) return null

  const install = async () => {
    try {
      await promptEvent.prompt()
      const { outcome } = await promptEvent.userChoice
      if (outcome === 'accepted') setPromptEvent(null)
    } catch {
      setPromptEvent(null)
    }
  }

  return (
    <button
      type="button"
      onClick={install}
      className={className}
      aria-label="Install Fernandes Labs as an app"
    >
      <MonitorDown className="size-3.5" aria-hidden />
      Install app
    </button>
  )
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
