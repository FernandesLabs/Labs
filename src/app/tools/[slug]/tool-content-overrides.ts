// src/app/tools/[slug]/tool-content-overrides.ts
/**
 * Central content-override module.
 *
 * The 132 hand-written tool overrides live in per-category modules under
 * ./overrides/ (see overrides/index.ts for the merge). This file keeps the
 * public API used by the rest of the app (tool-content.tsx, tool-json-ld.tsx,
 * the server page component, and tests) stable: re-exports the merged
 * OVERRIDES map + the ContentOverride type, and defines the lookup helpers
 * plus the template fallbacks.
 */
import type { ToolMeta } from '@/lib/tools/types'
import { CATEGORY_META } from '@/lib/tools/types'
import { OVERRIDES } from './overrides'
import type { ContentOverride, ToolOverrideMap } from './overrides'
export type { ContentOverride, ToolOverrideMap } from './overrides'
export { OVERRIDES }

/**
 * Get a hand-written content override for a tool, or null if none exists.
 * The server component and the client component both call this so the
 * visible content and the JSON-LD stay in sync.
 */
export function getToolContentOverride(slug: string): ContentOverride | null {
  return OVERRIDES[slug] ?? null
}
/**
 * Get the intro text for a tool — override if available, else template.
 * Used by the server component for the <noscript> block and JSON-LD.
 */
export function getToolIntro(tool: ToolMeta): string {
  const override = getToolContentOverride(tool.slug)
  if (override) return override.intro
  return generateTemplateIntro(tool)
}
/**
 * Get the FAQ list for a tool — override if available, else template.
 */
export function getToolFaqs(
  tool: ToolMeta
): { q: string; a: string }[] {
  const override = getToolContentOverride(tool.slug)
  if (override) return override.faqs
  return generateTemplateFaq(tool)
}
/**
 * Get the how-to steps for a tool — override if available, else template.
 */
export function getToolHowTo(tool: ToolMeta): string[] {
  const override = getToolContentOverride(tool.slug)
  if (override) return override.howTo
  return generateTemplateHowTo(tool)
}
// --- Template fallbacks (re-exported from tool-seo.ts logic) ---
// These mirror the generators in tool-seo.ts but are kept here so this file
// is self-contained for the server component.
function generateTemplateIntro(tool: ToolMeta): string {
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
function generateTemplateFaq(tool: ToolMeta): { q: string; a: string }[] {
  const cat = CATEGORY_META[tool.category]
  const kws = tool.keywords || []
  const faqs: { q: string; a: string }[] = [
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
function generateTemplateHowTo(tool: ToolMeta): string[] {
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