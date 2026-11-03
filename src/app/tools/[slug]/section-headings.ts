// section-headings.ts — query-phrase section headings for tool pages.
//
// WHY THIS EXISTS (GSC-driven, export 2026-09-19):
// The Search Console performance report shows the site's impression volume
// is concentrated on ~10 tool pages (ip-lookup alone = 4,429 of 7,960
// impressions; the 301-redirect, email-signature, canonical, robots.txt,
// mime clusters follow). All of those pages sat at positions 65–95 — the
// content is deep, but every one of the 132 tool pages used the SAME
// generic section headings ("How to use", "Common use cases", "Tips",
// "Frequently asked questions"), which carry zero query relevance.
//
// This map replaces those generic H2s with headings that contain the exact
// phrases people search for on the highest-impression pages, e.g.
//   ip-lookup  → "How to look up an IP address"  (queries: "ip address
//                 lookup", "lookup ip address", "find ip", "ip finder")
//   redirect-checker → "How to check 301 redirects" (queries: "check
//                 redirect 301", "test 301 redirect", "301 redirect check")
//
// Headings are page structure signals — doing this on the pages that
// already earn the most impressions is the cheapest relevance upgrade
// available. All other tools keep sensible name-aware template fallbacks
// (see resolveSectionHeading), so every page still gets a unique,
// keyword-bearing heading set without needing hand-tuning.

export type ToolSectionKey =
  | 'about'
  | 'examples'
  | 'howTo'
  | 'useCases'
  | 'bestPractices'
  | 'tips'
  | 'faq'

export type ToolSectionHeadings = Partial<Record<ToolSectionKey, string>>

/**
 * Hand-tuned section headings for the highest-impression tool pages,
 * keyed by tool slug. Any missing key falls back to the name-aware
 * templates in `resolveSectionHeading`.
 *
 * Phrase sources: the exact query strings observed in the GSC export
 * (Queries.csv), mapped to natural heading copy.
 */
export const SECTION_HEADINGS: Record<string, ToolSectionHeadings> = {
  // ── #1 impression page: 4,429 impressions (queries: ip address lookup,
  //    ip lookup, ip finder, lookup ip, find ip, ip address search …) ──
  'ip-lookup': {
    about: 'About this IP address lookup tool',
    examples: 'IP lookup examples',
    howTo: 'How to look up an IP address',
    useCases: 'What to use an IP address lookup for',
    bestPractices: 'IP lookup best practices',
    tips: 'IP lookup tips',
    faq: 'IP address lookup FAQ',
  },
  // ── 301-redirect cluster: ~350 query impressions + 227 on the page
  //    (queries: check redirect 301, test 301 redirect, 301 redirect
  //    check, 301 status code …) ──
  'redirect-checker': {
    about: 'About this redirect checker',
    examples: 'Redirect checker examples',
    howTo: 'How to check 301 redirects',
    useCases: 'When to test a redirect chain',
    bestPractices: 'Redirect best practices for SEO',
    tips: 'Redirect checker tips',
    faq: '301 redirect checker FAQ',
  },
  // ── 540 impressions (queries: email signature generator, email sig
  //    generator …) ──
  'email-signature-generator': {
    about: 'About this email signature generator',
    examples: 'Email signature examples',
    howTo: 'How to generate an email signature',
    useCases: 'Who needs an email signature generator',
    bestPractices: 'Email signature best practices',
    tips: 'Email signature tips',
    faq: 'Email signature generator FAQ',
  },
  // ── 251 impressions, closest big page to page 1 (pos 55) ──
  'mime-detector': {
    about: 'About this MIME type detector',
    examples: 'MIME type examples',
    howTo: "How to detect a file's MIME type",
    useCases: 'What to use a MIME detector for',
    tips: 'MIME detector tips',
    faq: 'MIME type FAQ',
  },
  // ── 143 impressions (queries: canonical checker …) ──
  'canonical-url-checker': {
    about: 'About this canonical URL checker',
    examples: 'Canonical URL checker examples',
    howTo: 'How to check a canonical URL',
    useCases: 'When to use a canonical URL checker',
    bestPractices: 'Canonical tag best practices',
    tips: 'Canonical URL tips',
    faq: 'Canonical URL checker FAQ',
  },
  // ── 125 impressions (queries: make robots txt online, robot txt
  //    generator google, create robot txt online …) ──
  'robots-txt-generator': {
    about: 'About this robots.txt generator',
    examples: 'Robots.txt examples',
    howTo: 'How to make a robots.txt file online',
    useCases: 'Why generate a robots.txt',
    bestPractices: 'Robots.txt best practices',
    tips: 'Robots.txt generator tips',
    faq: 'Robots.txt generator FAQ',
  },
  // ── 116 impressions at position 36.7 — one hop from page 3 ──
  'file-signature-inspector': {
    about: 'About this file signature inspector',
    examples: 'File signature examples (magic bytes)',
    howTo: 'How to identify a file type by its signature',
    useCases: 'When to inspect file signatures',
    tips: 'File signature inspector tips',
    faq: 'File signature FAQ',
  },
  // ── 69 impressions ──
  'ssl-checker': {
    about: 'About this SSL checker',
    examples: 'SSL checker examples',
    howTo: 'How to check an SSL certificate',
    useCases: 'When to run an SSL check',
    tips: 'SSL checker tips',
    faq: 'SSL certificate checker FAQ',
  },
  // ── 44 impressions at position 47.8 ──
  'unicode-inspector': {
    about: 'About this Unicode inspector',
    examples: 'Unicode inspector examples',
    howTo: 'How to inspect Unicode characters',
    useCases: 'What to use a Unicode inspector for',
    tips: 'Unicode inspector tips',
    faq: 'Unicode inspector FAQ',
  },
  // ── 35 impressions ──
  'capitalization-tool': {
    about: 'About this capitalization tool',
    examples: 'Capitalization tool examples',
    howTo: 'How to capitalize text online',
    useCases: 'What to use a capitalization tool for',
    tips: 'Capitalization tips',
    faq: 'Capitalization tool FAQ',
  },
  // ── 26 impressions at position 24.3 — the BEST organic position on the
  //    site (queries anonymized in the export; phrase set: aria validator,
  //    accessibility checker, check ARIA attributes) ──
  'aria-validator': {
    about: 'About this ARIA and accessibility validator',
    examples: 'ARIA validation examples',
    howTo: 'How to validate ARIA attributes in HTML',
    useCases: 'When to run an accessibility check on markup',
    bestPractices: 'ARIA and accessibility best practices',
    tips: 'ARIA validator tips',
    faq: 'ARIA validator FAQ',
  },
  // ── 87 impressions at position 45.5 — the only page earning real
  //    organic clicks (4, 4.6% CTR; queries: font accessibility checker,
  //    WCAG font size, readable font size check) ──
  'font-accessibility-checker': {
    about: 'About this font accessibility checker',
    examples: 'Font accessibility check examples',
    howTo: 'How to check font accessibility against WCAG',
    useCases: 'When to test font readability',
    tips: 'Font accessibility tips',
    faq: 'Font accessibility checker FAQ',
  },
}

interface HeadingTool {
  slug: string
  name: string
  category: string
}

/**
 * Resolve the visible H2 for a tool-page section.
 *
 * Priority: hand-tuned map entry → name-aware template. The templates keep
 * the other 122 pages' headings unique and keyword-bearing ("How to use the
 * SQL Formatter") instead of the old bare "How to use".
 */
export function resolveSectionHeading(key: ToolSectionKey, tool: HeadingTool): string {
  const explicit = SECTION_HEADINGS[tool.slug]?.[key]
  if (explicit) return explicit
  switch (key) {
    case 'about':
      return `About the ${tool.name}`
    case 'examples':
      return `${tool.name} examples`
    case 'howTo':
      return `How to use the ${tool.name}`
    // Keep every fallback name-aware. Four identical H2s across 118 pages
    // ("Common use cases", "Best practices", "Tips", "FAQ") wasted a
    // relevance signal and made the pages look templated. The explicit
    // SECTION_HEADINGS above still win for the high-impression pages.
    case 'useCases':
      return `${tool.name} use cases`
    case 'bestPractices':
      return `${tool.name} best practices`
    case 'tips':
      return `${tool.name} tips`
    case 'faq':
      return `${tool.name} FAQ`
  }
}
