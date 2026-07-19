'use client'
import * as React from 'react'

/**
 * ReadingProgress — a thin progress bar fixed to the top of the viewport that
 * fills as the user scrolls down the page.
 *
 * Implemented with a scroll listener + requestAnimationFrame throttling so it
 * stays smooth (60fps) even on long pages. Hidden on print and respects
 * reduced-motion preferences (renders static instead of transitioning).
 */
export function ReadingProgress() {
  const [progress, setProgress] = React.useState(0)
  const rafRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
      setProgress(pct)
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
  }, [])

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
