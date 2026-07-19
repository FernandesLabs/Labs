import type { ToolMeta } from '@/lib/tools/types'
import { CATEGORY_META } from '@/lib/tools/types'

/**
 * SEO content generators shared by:
 *   - The server component `app/tools/[slug]/page.tsx` (for JSON-LD)
 *   - The client component `tool-content.tsx` (for visible content)
 *
 * Centralizing here means the visible page text and the structured data
 * stay in sync — Google sees the same Q&A in the rendered HTML and in the
 * FAQPage JSON-LD.
 */

export interface FaqItem {
  q: string
  a: string
}

/** Longer, more specific intro paragraph (Priority 7 — improve content). */
export function generateToolIntro(tool: ToolMeta): string {
  const cat = CATEGORY_META[tool.category]
  const kws = tool.keywords?.slice(0, 3).join(', ') || tool.name.toLowerCase()
  const kwsList = tool.keywords?.slice(0, 3).join(', ') || 'this task'

  return (
    `The ${tool.name} is a free online ${cat.label.toLowerCase()} tool that ${tool.description.toLowerCase().replace(/\.$/, '')}. ` +
    `It runs entirely in your browser — no data is sent to any server, no sign-up is required, and it works offline once the page has loaded. ` +
    `Whether you need to ${kws}, or complete related tasks like ${kwsList}, this tool provides a fast, privacy-first solution. ` +
    `All processing happens client-side using modern Web APIs, which means your input never leaves your device — making it safe for sensitive data such as passwords, private keys, personal documents, or confidential business information. ` +
    `The tool is fully responsive and works on phones, tablets, and desktops. It is also installable as a Progressive Web App (PWA), so you can add it to your home screen and launch it like a native app, even when you're offline.`
  )
}

/** "Common use cases" bullets — Priority 7. */
export function generateToolUseCases(tool: ToolMeta): string[] {
  const kws = tool.keywords ?? []
  const base: string[] = []

  if (kws.length > 0) {
    base.push(
      `Quick, ad-hoc ${kws[0]} work without installing software or signing up.`
    )
  }
  base.push(
    `Privacy-sensitive scenarios where data must not leave your device (e.g. passwords, financial inputs, private documents).`
  )
  base.push(
    `Offline use — once the page is loaded, no internet connection is required.`
  )
  base.push(
    `Cross-platform access from any modern browser on desktop, tablet, or mobile.`
  )

  if (tool.category === 'developer') {
    base.push(
      `Pasting into your editor or CI scripts — copy the output straight into your codebase.`
    )
  } else if (tool.category === 'finance') {
    base.push(
      `Personal finance planning — run "what-if" scenarios with instant recalculation.`
    )
  } else if (tool.category === 'media') {
    base.push(
      `Batch-processing files locally before uploading them to a CMS or design tool.`
    )
  } else if (tool.category === 'seo') {
    base.push(
      `Auditing your site's metadata, schema, and link structure before publishing.`
    )
  }

  return base.slice(0, 5)
}

/** "Tips" — Priority 7. */
export function generateToolTips(tool: ToolMeta): string[] {
  const tips: string[] = [
    `Press the Copy button (or ⌘C / Ctrl+C in the result area) to grab the output without selecting it manually.`,
    `Use the command palette (⌘K / Ctrl+K) to jump between tools instantly — no need to scroll back to the hub.`,
  ]

  if (tool.category === 'developer') {
    tips.push(
      `Pin frequently-used tools with the star icon — they appear at the top of the hub and in your Favorites list.`
    )
  } else if (tool.category === 'media') {
    tips.push(
      `For large files, give the browser a moment — all processing is local, so speed depends on your device's CPU.`
    )
  } else if (tool.category === 'security') {
    tips.push(
      `Generated values use the Web Crypto API (cryptographically secure) — safer than most online generators that may log your data.`
    )
  } else if (tool.category === 'network') {
    tips.push(
      `Network tools query external services; if a lookup fails, wait a moment and try again — rate limits are common.`
    )
  } else {
    tips.push(
      `Pin this tool with the star icon so you can come back to it from your Favorites list.`
    )
  }

  return tips
}

/** How-to steps (Priority 6 — HowTo JSON-LD). */
export function generateToolHowTo(tool: ToolMeta): string[] {
  const cat = tool.category
  const steps: string[] = []

  steps.push(
    `Locate the primary input area at the top of the tool card. This is where you enter your data — text, a file, a URL, or numbers depending on the tool.`
  )

  if (cat === 'finance' || cat === 'developer' || cat === 'text') {
    steps.push(
      `Adjust any options below the input. Most tools offer toggles, sliders, or dropdowns to customize the output — try different settings to see live results update instantly.`
    )
  } else if (cat === 'media' || cat === 'network') {
    steps.push(
      `If the tool requires a file, click the upload area or drag-and-drop your file. For URL-based tools, paste a valid URL into the input field.`
    )
  } else {
    steps.push(
      `Configure the available options to customize the output. Most settings update the result live as you change them.`
    )
  }

  steps.push(
    `View the result in the output area below. Use the Copy button to copy the result to your clipboard, or the Download/Save button to save it as a file.`
  )

  steps.push(
    `All processing happens client-side in your browser. Your data never leaves your device, making this tool safe for sensitive inputs like passwords, private keys, or personal documents.`
  )

  return steps
}

/** FAQs (Priority 5 — FAQPage JSON-LD). */
export function generateToolFaq(tool: ToolMeta): FaqItem[] {
  const cat = CATEGORY_META[tool.category]
  const kws = tool.keywords || []

  const faqs: FaqItem[] = [
    {
      q: `Is the ${tool.name} free to use?`,
      a: `Yes, completely free. There are no sign-ups, no hidden costs, and no usage limits. The tool is supported by ads (shown above and below the tool card).`,
    },
    {
      q: `Is my data safe when using this tool?`,
      a: `Absolutely. All processing happens entirely in your browser. Your input is never sent to any server, stored, or tracked. You can safely use this tool with sensitive data like passwords, private documents, or personal information. You can even use it offline once the page is loaded.`,
    },
    {
      q: `Does the ${tool.name} work offline?`,
      a: `Yes. Once the page has loaded, the tool runs entirely client-side. You can disconnect from the internet and continue using it. The site is also installable as a Progressive Web App (PWA) for offline access from your home screen.`,
    },
  ]

  if (cat.label === 'Developer') {
    faqs.push({
      q: `Can I use the output in my code or production project?`,
      a: `Yes. The output is standard ${kws[0] || 'code'} that you can copy directly into your projects. There are no restrictions on how you use the results.`,
    })
  } else if (cat.label === 'Finance') {
    faqs.push({
      q: `Are the calculations accurate?`,
      a: `Yes, the calculations use standard, well-established formulas. However, this tool is for informational purposes only and should not replace professional financial advice for important decisions.`,
    })
  } else if (cat.label === 'Media') {
    faqs.push({
      q: `What file formats and sizes are supported?`,
      a: `The tool supports common file formats related to ${kws[0] || 'the tool\'s purpose'}. There are no hard file size limits, but very large files (>100MB) may be slow to process depending on your device. All processing happens in your browser.`,
    })
  } else if (cat.label === 'SEO') {
    faqs.push({
      q: `Will using this tool improve my SEO?`,
      a: `The tool helps you create or analyze ${kws[0] || 'SEO elements'} that can improve your search rankings. However, SEO depends on many factors — content quality, backlinks, site speed, and more. Use this tool as part of a broader SEO strategy.`,
    })
  } else if (cat.label === 'Security') {
    faqs.push({
      q: `Is it safe to generate passwords and security tokens here?`,
      a: `Yes. All randomness is generated using the Web Crypto API (cryptographically secure), never Math.random(). Your generated values never leave your browser. This is safer than most online generators that may log or transmit your data.`,
    })
  } else if (cat.label === 'Network') {
    faqs.push({
      q: `Why do some network lookups fail?`,
      a: `Network tools query external services (like DNS resolvers or IP databases). If a service is temporarily unavailable or rate-limits requests, the lookup may fail. Try again in a few moments. The tool itself is working correctly.`,
    })
  }

  faqs.push({
    q: `Can I use this tool on mobile?`,
    a: `Yes. The tool is fully responsive and works on phones, tablets, and desktops. The layout adapts to your screen size, and all features are available on every device.`,
  })

  return faqs
}
