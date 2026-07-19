'use client'

/**
 * SkipToContent — an accessibility affordance.
 *
 * Renders a visually-hidden link that becomes visible when focused (e.g. via
 * Tab key), letting keyboard and screen-reader users jump straight to the
 * main content and skip the repeated header / nav on every page.
 *
 * Place the matching `id="main-content"` on the <main> element of each page.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only z-[100] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      Skip to content
    </a>
  )
}
