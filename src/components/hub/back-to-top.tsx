'use client'

import * as React from 'react'
import { ArrowUp } from 'lucide-react'

/**
 * Floating "back to top" button. Appears after scrolling down 400px.
 * Smooth-scrolls to the top on click.
 */
export function BackToTop() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = React.useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Back to top"
      title="Back to top"
      className="fl-fade-in fixed bottom-6 right-6 z-40 grid size-11 place-items-center rounded-full border border-border/70 bg-background/90 text-foreground shadow-lg backdrop-blur transition hover:border-primary hover:text-primary hover:shadow-xl"
    >
      <ArrowUp className="size-5" />
    </button>
  )
}
