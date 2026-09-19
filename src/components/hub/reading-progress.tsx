'use client'
import * as React from 'react'
import { saveGuideProgress } from '@/lib/blog/reading-progress-store'

/**
 * ReadingProgress — a thin progress bar fixed to the top of the viewport that
 * fills as the user scrolls down the page.
 *
 * Implemented with a scroll listener + requestAnimationFrame throttling so it
 * stays smooth (60fps) even on long pages. Hidden on print and respects
 * reduced-motion preferences (renders static instead of transitioning).
 *
 * `persistSlug` (blog guides only): when set, the scroll position is ALSO
 * written to localStorage (fl-guide-progress) so the blog index can render a
 * "Continue reading" strip. Writes are throttled to whole-percent changes.
 * Tool pages omit the prop — their progress is not persisted.
 */
export function ReadingProgress({ persistSlug }: { persistSlug?: string } = {}) {
  const [progress, setProgress] = React.useState(0)
  const rafRef = React.useRef<number | null>(null)
  // Last whole-percent value written to storage — keeps localStorage writes
  // to one per percent instead of one per scroll event.
  const savedPctRef = React.useRef<number>(-1)

  React.useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
      setProgress(pct)
      if (persistSlug) {
        const whole = Math.floor(pct)
        if (whole >= 1 && whole !== savedPctRef.current) {
          savedPctRef.current = whole
          saveGuideProgress(persistSlug, whole)
        }
      }
      rafRef.current = null
    }
    const onScroll = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [persistSlug])

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-primary to-primary/70 shadow-[0_0_8px_-1px] shadow-primary/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
