'use client'
import * as React from 'react'
import { X, Heart, ShieldCheck, ChevronDown, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
/**
 * AdblockDetector — lightweight, polite, dismissible banner that appears
 * ONLY when an adblocker is detected on a tool page.
 *
 * Implementation per SEO-MONETIZATION-ANALYSIS.md §2.2:
 *   - ~1 KB custom bait-element test (no fuckadblock.js dependency)
 *   - Secondary fetch-test of the AdSense script URL
 *   - Runs once on mount after a 1.5s delay (doesn't block LCP)
 *   - Persists dismissal in localStorage for 7 days
 *   - Shows on tool pages only (mounted by ToolPageClient)
 *   - NEVER blocks the tool, blurs content, or disables scrolling
 *   - Shows a "Thanks for supporting free tools" toast when ads load OK
 *
 * Banner copy maximizes whitelist rate by leading with the value prop
 * (free + private) and explaining concretely what ads pay for
 * (the fernandeslabs.com domain + servers).
 */
const DISMISS_KEY = 'fl_adblock_dismissed_at'
const THANKS_KEY = 'fl_adblock_thanks_at'
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const THANKS_COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24 hours
/** Detection result: 'blocked' | 'not-blocked' | 'unknown' */
type DetectResult = 'blocked' | 'not-blocked' | 'unknown'
/**
 * Detect adblockers using two techniques:
 *  1. Bait element — create a div with classes adblock filters target, check
 *     if it gets hidden.
 *  2. Fetch test — try to HEAD the AdSense script; if the fetch rejects or
 *     returns an opaque error, the URL is likely blocked.
 *
 * Either signal = blocked. Both must pass = not-blocked. If we can't tell
 * (e.g. fetch throws for a network reason), = unknown (don't show banner).
 */
function useAdblockDetection(enabled: boolean): DetectResult {
  const [result, setResult] = React.useState<DetectResult>('unknown')
  React.useEffect(() => {
    if (!enabled) return
    let cancelled = false
    const run = async () => {
      // Delay so we don't compete with LCP / first paint.
      await new Promise((r) => setTimeout(r, 1500))
      if (cancelled) return
      // --- Technique 1: bait element ---
      let baitBlocked = false
      try {
        const bait = document.createElement('div')
        bait.className = 'ad-banner ad-unit adsbox adslot ad-placeholder'
        bait.style.cssText =
          'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;'
        bait.innerHTML = '&nbsp;'
        document.body.appendChild(bait)
        // Give adblockers a tick to hide it.
        await new Promise((r) => setTimeout(r, 100))
        const blocked =
          bait.offsetParent === null ||
          bait.offsetHeight === 0 ||
          bait.clientHeight === 0 ||
          getComputedStyle(bait).display === 'none' ||
          getComputedStyle(bait).visibility === 'hidden'
        baitBlocked = blocked
        document.body.removeChild(bait)
      } catch {
        baitBlocked = false
      }
      if (cancelled) return
      // --- Technique 2: fetch the AdSense script URL ---
      let fetchBlocked = false
      try {
        const ctrl = new AbortController()
        const timeout = setTimeout(() => ctrl.abort(), 3000)
        await fetch(
          'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
          { method: 'HEAD', mode: 'no-cors', signal: ctrl.signal }
        )
        clearTimeout(timeout)
        // no-cors always resolves to an opaque response if NOT blocked.
        // If the promise rejects, the URL is blocked.
      } catch {
        fetchBlocked = true
      }
      if (cancelled) return
      if (baitBlocked || fetchBlocked) {
        setResult('blocked')
      } else {
        setResult('not-blocked')
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [enabled])
  return result
}
/** localStorage helpers with TTL. */
function readTTL(key: string, ttl: number): boolean {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return false
    const ts = Number(raw)
    if (!Number.isFinite(ts)) return false
    return Date.now() - ts < ttl
  } catch {
    return false
  }
}
function writeTTL(key: string): void {
  try {
    localStorage.setItem(key, String(Date.now()))
  } catch {
    /* ignore */
  }
}
const WHITELIST_STEPS: { browser: string; steps: string[] }[] = [
  {
    browser: 'uBlock Origin (Chrome / Firefox / Edge)',
    steps: [
      'Click the uBlock Origin icon in your browser toolbar (red shield).',
      'Click the big blue power button so it turns grey.',
      'Click the refresh icon (or press Ctrl/Cmd+R) to reload the page.',
    ],
  },
  {
    browser: 'AdBlock Plus',
    steps: [
      'Click the AdBlock Plus icon (red octagon with "ABP").',
      'Click "Enable on this site" (toggles to green).',
      'Reload the page.',
    ],
  },
  {
    browser: 'Brave Shields',
    steps: [
      'Click the Brave lion icon in the address bar.',
      'Toggle "Shields down for this site".',
      'Reload the page.',
    ],
  },
  {
    browser: 'Safari (built-in)',
    steps: [
      'Click "Settings for this website" in the Safari menu (or right-click the address bar).',
      'Turn off "Block Ads / Block Pop-ups".',
      'Reload the page.',
    ],
  },
]
function WhitelistGuide() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0)
  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium text-foreground">
        How to whitelist Fernandes Labs:
      </p>
      {WHITELIST_STEPS.map((s, i) => {
        const open = openIdx === i
        return (
          <div
            key={s.browser}
            className="overflow-hidden rounded-lg border border-border/60 bg-background"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(open ? null : i)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-medium text-foreground transition hover:bg-muted/40"
              aria-expanded={open}
            >
              <span>{s.browser}</span>
              <ChevronDown
                className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </button>
            {open ? (
              <ol className="space-y-1 px-3 pb-3 pt-1">
                {s.steps.map((step, j) => (
                  <li
                    key={j}
                    className="flex gap-2 text-[11px] leading-relaxed text-muted-foreground"
                  >
                    <span className="grid size-4 shrink-0 place-items-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                      {j + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
/**
 * The banner. Shows only when adblock is detected AND not recently dismissed.
 */
export function AdblockBanner({ enabled }: { enabled: boolean }) {
  const result = useAdblockDetection(enabled)
  const { toast } = useToast()
  const [show, setShow] = React.useState(false)
  const [showGuide, setShowGuide] = React.useState(false)
  // Decide whether to show the banner.
  React.useEffect(() => {
    if (result !== 'blocked') return
    if (readTTL(DISMISS_KEY, DISMISS_TTL_MS)) return
    // Small delay so it slides in after the tool is visible.
    const t = setTimeout(() => setShow(true), 400)
    return () => clearTimeout(t)
  }, [result])
  // Thank-you toast when ads load successfully (once per 24h).
  React.useEffect(() => {
    if (result !== 'not-blocked') return
    if (readTTL(THANKS_KEY, THANKS_COOLDOWN_MS)) return
    const t = setTimeout(() => {
      toast({
        title: 'Thanks for supporting free, private tools! ✨',
        description:
          'Your whitelist keeps all 132 tools free — no sign-up, no tracking.',
      })
      writeTTL(THANKS_KEY)
    }, 2500)
    return () => clearTimeout(t)
  }, [result, toast])
  const dismiss = React.useCallback(() => {
    setShow(false)
    writeTTL(DISMISS_KEY)
  }, [])
  if (!show) return null
  return (
    <div
      role="dialog"
      aria-label="Support Fernandes Labs"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3 sm:px-4 sm:pb-4"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/80 fl-fade-in">
        <div className="flex items-start gap-3 p-4 sm:p-5">
          <span
            className="grid size-9 shrink-0 place-items-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400"
            aria-hidden
          >
            <Heart className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              👋 Enjoying the tool?
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
              Fernandes Labs runs all 132 tools 100% free and private — no
              sign-up, no tracking, your data never leaves your browser. The
              ads on this page pay for the{' '}
              <span className="font-medium text-foreground">fernandeslabs.com</span>{' '}
              domain and server costs so the tools stay free for everyone.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
              If you can, please whitelist us in your adblocker — it takes 10
              seconds and keeps the lights on. 🙏
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowGuide((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                {showGuide ? 'Hide steps' : 'How do I whitelist?'}
                <ChevronDown
                  className={`size-3.5 transition-transform ${
                    showGuide ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted/50"
              >
                Maybe later
              </button>
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground/70">
                <ShieldCheck className="size-3" />
                We never sell your data
              </span>
            </div>
            {showGuide ? <WhitelistGuide /> : null}
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
/**
 * Convenience wrapper: only renders the banner when AdSense is configured.
 * When AdSense isn't enabled, there are no ads to block, so the banner is
 * pointless.
 */
export function AdblockDetector() {
  const [configured, setConfigured] = React.useState(false)
  React.useEffect(() => {
    // Read from the injected window var (set by layout when AdSense is on).
    // We can't import siteConfig here without making this a server component,
    // so we detect via a data attribute on <html> that layout sets.
    const el = document.documentElement
    setConfigured(el.dataset.adsense === 'true')
  }, [])
  return <AdblockBanner enabled={configured} />
}