import type { ToolCategory } from '@/lib/tools/types'
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

/**
 * Local type accepted by all generator functions below.
 *
 * Uses `category: string` (not the strict `ToolCategory` union) so that both
 * the loose `ToolMeta` from `tool-metadata.ts` (which types category as
 * `string`) and the strict `Tool` from the registry (which types it as
 * `ToolCategory`) are accepted. `ToolCategory` is assignable to `string`, so
 * both call-sites compile without a cast.
 *
 * Internally, the functions cast `category` back to `ToolCategory` when
 * indexing `CATEGORY_META` (which is keyed by the union).
 */
interface ToolLike {
  slug: string
  category: string
  name: string
  description: string
  keywords?: string[]
}

export interface FaqItem {
  q: string
  a: string
}

/**
 * Hand-tuned <title> + <meta description> overrides for the highest-search
 * volume tools, optimised for the exact queries seen in Google Search
 * Console (see Queries.csv):
 *   - ip lookup / ip address lookup / what is my ip
 *   - email signature generator
 *   - redirect / 301 redirect checker
 *   - canonical url checker
 *   - robots.txt generator
 *   - css gradient generator
 *
 * Titles match the primary search intent (not just the tool name), and
 * descriptions lead with the search term + a concrete benefit + a CTA.
 * Any tool without an override falls back to the template generators below.
 */
const SEO_OVERRIDES: Record<
  string,
  { title: string; description: string }
> = {
  'ip-lookup': {
    title: 'IP Address Lookup — Find IP Location, ISP & More',
    description:
      'What is my IP? Look up any IPv4 address or hostname — location, ISP and timezone. Instant results, no sign-up. Your IP is detected automatically.',
  },
  'email-signature-generator': {
    title: 'Email Signature Generator — Free HTML Signature Maker',
    description:
      'Create a professional email signature in seconds — free HTML generator for Gmail, Outlook and more. No sign-up. Copy the code instantly.',
  },
  'redirect-checker': {
    title: 'Redirect Checker — Test 301 & 302 Redirects Online',
    description:
      'Follow the full redirect chain of any URL and detect 301, 302 redirects instantly. Free redirect tester with status codes — no sign-up.',
  },
  'canonical-url-checker': {
    title: 'Canonical URL Checker — Normalize Any URL',
    description:
      'Normalize the canonical form of any URL — strip tracking params (utm_*, gclid, fbclid), sort query strings and drop fragments. Free canonical tag generator, no sign-up.',
  },
  'robots-txt-generator': {
    title: 'Robots.txt Generator — Create robots.txt for Google',
    description:
      'Generate a robots.txt file online in seconds. Allow/disallow crawlers, add your sitemap URL and copy the finished robots.txt.',
  },
  'css-gradient-generator': {
    title: 'CSS Gradient Generator — Create & Copy Gradient CSS',
    description:
      'Generate beautiful CSS gradients with a live preview. Linear and radial — copy the CSS in one click. Free online tool.',
  },
  'image-metadata-viewer': {
    title: 'Image Metadata Viewer — View EXIF & GPS Online',
    description:
      'View EXIF metadata, GPS coordinates and camera settings from your JPEG and TIFF images. Free online metadata viewer — everything stays in your browser.',
  },
  'citation-generator': {
    title: 'Citation Generator — Free APA, MLA & Chicago Citations',
    description:
      'Generate citations and references online — APA, MLA and Chicago. Free citation generator, no sign-up, export-ready.',
  },
  'color-contrast-checker': {
    title: 'Color Contrast Checker — WCAG AA & AAA Test',
    description:
      'Test color contrast ratios against WCAG 2.1 AA/AAA guidelines instantly. Free contrast checker with pass/fail ratings.',
  },
  'jwt-decoder': {
    title: 'JWT Decoder — Decode JSON Web Tokens Online',
    description:
      'Decode JWT header and payload instantly — no server uploads. Inspect claims, algorithms and expiry of any JSON Web Token.',
  },
  'capitalization-tool': {
    title: 'Capitalization Tool — Title Case, Sentence Case & More',
    description:
      'Capitalize text online — title case, sentence case, ALL CAPS and more. Free capitalization tool, instant results, no sign-up.',
  },
  'file-signature-inspector': {
    title: 'File Signature Inspector — Identify File Types',
    description:
      'Identify the real type of any file from its binary signature (magic bytes). Detect spoofed extensions — free online tool.',
  },
  'lorem-ipsum-generator': {
    title: 'Lorem Ipsum Generator — Free Placeholder Text',
    description:
      'Generate lorem ipsum placeholder text — words, sentences or paragraphs. Copy in one click. Free, no sign-up.',
  },
  'regex-tester': {
    title: 'Regex Tester — Test Regular Expressions Online',
    description:
      'Test regular expressions with live match highlighting and flags. Free online regex tester with instant results.',
  },
  'dns-lookup': {
    title: 'DNS Lookup — Query A, MX, TXT & More Records',
    description:
      'Look up any domain\'s DNS records — A, AAAA, MX, TXT, NS, CNAME. Free DNS lookup tool, instant results.',
  },
  'ai-cost-calculator': {
    title: 'AI Cost Calculator — Compare LLM API Pricing',
    description:
      'Estimate and compare LLM API costs — tokens, model pricing and monthly spend. Free AI cost calculator for developers.',
  },
  'jwt-generator': {
    title: 'JWT Generator — Create Signed JWTs (HS256)',
    description:
      'Generate signed JSON Web Tokens with custom claims and expiry. Free JWT generator, client-side only, no data leaves your browser.',
  },
  'mime-detector': {
    title: 'MIME Type Detector — Identify File MIME Types',
    description:
      'Detect the MIME type of any file from its extension or file name. Free MIME detector, works offline in your browser.',
  },
  'user-agent-parser': {
    title: 'User Agent Parser — Identify Browser & Device',
    description:
      'Parse any user agent string — browser, OS, device and more. Free user agent parser, instant results.',
  },
  'headline-analyzer': {
    title: 'Headline Analyzer — Score & Improve Headlines',
    description:
      'Score your headlines for emotional value, power words and length. Free headline analyzer to boost CTR and engagement.',
  },
  'color-palette-extractor': {
    title: 'Color Palette Extractor — Extract Colors from Images',
    description:
      'Extract a color palette from any image — dominant colors and hex codes. Free online color palette extractor.',
  },
  'bmr-calculator': {
    title: 'BMR Calculator — Basal Metabolic Rate (Free)',
    description:
      'Calculate your BMR and daily calorie needs with Mifflin-St Jeor. Free BMR calculator with instant results.',
  },
  'unicode-inspector': {
    title: 'Unicode Inspector — Character & Codepoint Viewer',
    description:
      'Inspect Unicode characters, codepoints, and encodings in any text. Free Unicode inspector for developers.',
  },
  'http-header-checker': {
    title: 'HTTP Header Checker — Inspect Response Headers',
    description:
      'Check the HTTP response headers of any URL — server, security headers, caching and more. Free header checker.',
  },
  'campaign-url-builder': {
    title: 'Campaign URL Builder — Google Analytics UTM Tags',
    description:
      'Build campaign URLs with UTM parameters for Google Analytics. Free campaign URL builder, no sign-up.',
  },
  'qr-generator': {
    title: 'QR Code Generator — Free, No Watermark',
    description:
      'Generate free QR codes for URLs, text and more. Download high-resolution PNG or SVG — no watermark, no sign-up.',
  },
  'unix-timestamp-converter': {
    title: 'Unix Timestamp Converter — Epoch to Date Online',
    description:
      'Convert Unix timestamps to human-readable dates and back — milliseconds, seconds, timezones. Free online converter.',
  },
  'ai-persona-generator': {
    title: 'AI Persona Generator — Create Custom AI Personas',
    description:
      'Generate detailed AI personas and system prompts for ChatGPT, Claude and more. Free persona generator for prompt engineers.',
  },
  'image-resizer': {
    title: 'Image Resizer — Resize Images Online Free',
    description:
      'Resize images online — JPG, PNG, WebP in, PNG or JPEG out. Free image resizer, no upload, everything stays in your browser.',
  },
  'password-generator': {
    title: 'Password Generator — Strong Random Passwords',
    description:
      'Generate strong, cryptographically secure passwords instantly. Free password generator with strength meter — no data leaves your browser.',
  },
  'json-formatter': {
    title: 'JSON Formatter & Validator — Beautify JSON Online',
    description:
      'Format, validate and minify JSON with inline error reporting. Free JSON beautifier — works offline, no data leaves your browser.',
  },
  'base64-encoder-decoder': {
    title: 'Base64 Encoder & Decoder — Free Online Tool',
    description:
      'Encode text to Base64 or decode Base64 back to text with UTF-8 support. Free Base64 tool, client-side only.',
  },
  'uuid-generator': {
    title: 'UUID Generator — Generate UUID v4 Online (Bulk)',
    description:
      'Generate RFC 4122 v4 UUIDs in bulk using the Web Crypto API. Free UUID generator with batch support.',
  },
  'color-converter': {
    title: 'Color Converter — HEX, RGB, HSL Conversion',
    description:
      'Convert colors between HEX, RGB and HSL with a live preview. Free color converter for designers and developers.',
  },
  'url-encoder-decoder': {
    title: 'URL Encoder & Decoder — Free Online',
    description:
      'Encode or decode URLs and URL components (percent-encoding). Free URL encoder/decoder tool, no sign-up.',
  },
  'sql-formatter': {
    title: 'SQL Formatter — Beautify & Format SQL Queries',
    description:
      'Pretty-print and format SQL queries with keyword casing. Free SQL formatter, client-side only.',
  },
  'case-converter': {
    title: 'Case Converter — UPPERCASE, lowercase, Title Case',
    description:
      'Convert text between UPPERCASE, lowercase, Title Case, camelCase and more. Free case converter, instant results.',
  },
  'word-counter': {
    title: 'Word Counter — Count Words & Characters Online',
    description:
      'Count words, characters, sentences and paragraphs instantly. Free word counter, no sign-up, client-side only.',
  },
  'character-counter': {
    title: 'Character Counter — Count Characters & Letters',
    description:
      'Count characters, letters and words in any text instantly. Free character counter with limits tracking.',
  },
  'invoice-generator': {
    title: 'Invoice Generator — Create a Free PDF Invoice',
    description:
      'Create and download a professional invoice as PDF — line items, tax, totals. Free invoice generator, no sign-up.',
  },
  'vat-calculator': {
    title: 'VAT Calculator — Add & Remove VAT Online',
    description:
      'Add or remove VAT (including UK, EU rates) from any amount instantly. Free VAT calculator, client-side only.',
  },
  'unit-converter': {
    title: 'Unit Converter — Length, Weight, Temperature & More',
    description:
      'Convert between hundreds of units — length, weight, temperature, volume and more. Free unit converter.',
  },
  'token-counter': {
    title: 'Token Counter — Count Tokens for LLMs Online',
    description:
      'Estimate token counts for ChatGPT, Claude and other LLMs instantly. Free token counter for prompt engineering.',
  },
  'organization-schema-generator': {
    title: 'Organization Schema Generator — JSON-LD',
    description:
      'Generate Organization schema.org JSON-LD markup for SEO. Free schema generator with copy-ready output.',
  },
  'csp-generator': {
    title: 'CSP Generator — Content Security Policy Headers',
    description:
      'Generate Content Security Policy headers with a visual editor. Free CSP generator for web developers.',
  },
  'ssl-checker': {
    title: 'SSL Checker — Verify SSL/TLS Certificates',
    description:
      'Check the SSL/TLS certificate of any domain — issuer, expiry, SANs and validity. Free SSL checker tool, instant results.',
  },
  'aria-validator': {
    title: 'ARIA Validator — Check Accessibility Attributes',
    description:
      'Validate ARIA roles, states and accessibility attributes in HTML. Free ARIA validator for accessibility.',
  },
  'duplicate-line-remover': {
    title: 'Duplicate Line Remover — Remove Duplicates Online',
    description:
      'Remove duplicate lines from text instantly — exact or case-insensitive. Free duplicate remover tool.',
  },
  'remove-blank-lines': {
    title: 'Remove Blank Lines — Clean Text Online Free',
    description:
      'Remove empty lines from any text instantly. Free blank line remover, no sign-up, client-side only.',
  },
  'title-generator': {
    title: 'Title Generator — Create SEO Titles Online',
    description:
      'Generate SEO-friendly page titles with power words and optimal length. Free title generator for content writers.',
  },
}

/** Hand-tuned title + description for a tool (falls back to templates). */
export function getSeoOverride(
  tool: ToolLike
): { title: string; description: string } | null {
  return SEO_OVERRIDES[tool.slug] ?? null
}

/**
 * Generate a unique, keyword-rich <title> for a tool page.
 *
 * Format: "{ToolName} — Free Online {CategoryLabel} Tool | Fernandes Labs"
 *
 * Why this is better than the old "{ToolName} — Free Online Tool — Fernandes Labs":
 *   - Includes the category label (e.g. "Developer", "SEO") → adds a secondary
 *     keyword and helps Google understand topical relevance.
 *   - Uses a single em-dash + pipe separator for cleaner SERP display.
 *   - Stays within 50–60 characters for most tools (the brand tail is trimmed
 *     automatically if the total would exceed 62 chars).
 *
 * Example: "JSON Formatter — Free Online Developer Tool | Fernandes Labs"
 */
export function generateToolTitle(tool: ToolLike): string {
  const override = getSeoOverride(tool)
  if (override) return override.title
  const catLabel = CATEGORY_META[tool.category as ToolCategory]?.label ?? 'Utility'
  const brand = 'Fernandes Labs'
  const full = `${tool.name} — Free Online ${catLabel} Tool | ${brand}`
  // If the title is too long (> 62 chars), drop the category word to keep it
  // within Google's display limit. The brand stays so users recognise the
  // result in the SERP.
  if (full.length > 62) {
    const short = `${tool.name} — Free Online Tool | ${brand}`
    return short
  }
  return full
}

/**
 * Generate a unique, keyword-rich meta description for a tool page.
 *
 * Target length: 120–160 characters.
 *
 * Structure:
 *   "{activeVerb} {primaryKeyword} {detail}. Free, online, no sign-up — runs
 *    entirely in your browser. {categoryContext} tool by Fernandes Labs."
 *
 * This is richer than the raw `tool.description` (which averages only ~59
 * chars and lacks value props like "free", "no sign-up", "in your browser").
 */
export function generateToolDescription(tool: ToolLike): string {
  const override = getSeoOverride(tool)
  if (override) return override.description
  const catLabel = CATEGORY_META[tool.category as ToolCategory]?.label ?? 'utility'
  const primaryKw = tool.keywords?.[0] ?? tool.name.toLowerCase()
  // Start from the base description (already specific per tool), then append
  // the value-proposition tail.
  const base = tool.description.replace(/\.$/, '')
  const desc = `${base}. Free online ${primaryKw} tool — no sign-up, no tracking, runs entirely in your browser. ${catLabel} tool by Fernandes Labs.`
  // Truncate to 160 chars on a word boundary if needed.
  if (desc.length <= 160) return desc
  return desc.slice(0, 157).replace(/\s+\S*$/, '') + '…'
}
/** Longer, more specific intro paragraph (Priority 7 — improve content). */
export function generateToolIntro(tool: ToolLike): string {
  const cat = CATEGORY_META[tool.category as ToolCategory]
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
export function generateToolUseCases(tool: ToolLike): string[] {
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
export function generateToolTips(tool: ToolLike): string[] {
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
export function generateToolHowTo(tool: ToolLike): string[] {
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
export function generateToolFaq(tool: ToolLike): FaqItem[] {
  const cat = CATEGORY_META[tool.category as ToolCategory]
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

/**
 * Curated cross-category "related tools" links per tool slug.
 *
 * Purpose: internal linking between topically-related tools (not just
 * same-category neighbors). Google uses these links to understand topical
 * clusters and to distribute PageRank from high-traffic pages to their
 * satellites — e.g. the IP Lookup page (the site's biggest traffic magnet)
 * passes internal links to DNS Lookup, SSL Checker, etc.
 *
 * Tools not in this map fall back to their same-category neighbors.
 */
export const RELATED_TOOLS: Record<string, string[]> = {
  'ip-lookup': ['dns-lookup', 'ssl-checker', 'http-header-checker', 'user-agent-parser', 'redirect-checker', 'unix-timestamp-converter'],
  'dns-lookup': ['ip-lookup', 'ssl-checker', 'http-header-checker', 'redirect-checker', 'mime-detector'],
  'ssl-checker': ['ip-lookup', 'dns-lookup', 'http-header-checker', 'redirect-checker'],
  'http-header-checker': ['redirect-checker', 'canonical-url-checker', 'ssl-checker', 'ip-lookup'],
  'redirect-checker': ['canonical-url-checker', 'http-header-checker', 'url-encoder-decoder', 'ip-lookup'],
  'canonical-url-checker': ['redirect-checker', 'sitemap-generator', 'robots-txt-generator', 'json-ld-generator'],
  'robots-txt-generator': ['sitemap-generator', 'canonical-url-checker', 'redirect-checker', 'meta-tag-generator'],
  'sitemap-generator': ['robots-txt-generator', 'canonical-url-checker', 'json-ld-generator', 'redirect-checker'],
  'email-signature-generator': ['qr-generator', 'title-generator', 'headline-analyzer', 'campaign-url-builder'],
  'qr-generator': ['email-signature-generator', 'favicon-generator', 'base64-encoder-decoder', 'image-resizer'],
  'json-formatter': ['json-yaml-converter', 'base64-encoder-decoder', 'regex-tester', 'sql-formatter', 'jwt-decoder', 'html-entity-encoder'],
  'json-yaml-converter': ['json-formatter', 'xml-formatter', 'yaml-validator', 'markdown-to-html'],
  'base64-encoder-decoder': ['url-encoder-decoder', 'hash-generator', 'file-signature-inspector', 'mime-detector'],
  'jwt-decoder': ['jwt-generator', 'base64-encoder-decoder', 'hash-generator', 'json-formatter'],
  'jwt-generator': ['jwt-decoder', 'hash-generator', 'hmac-generator', 'base64-encoder-decoder'],
  'regex-tester': ['json-formatter', 'text-sorter', 'duplicate-line-remover', 'case-converter'],
  'hash-generator': ['hmac-generator', 'file-checksum', 'password-generator', 'base64-encoder-decoder'],
  'hmac-generator': ['hash-generator', 'jwt-generator', 'password-generator'],
  'password-generator': ['secure-passphrase', 'password-strength-checker', 'hash-generator', 'uuid-generator'],
  'color-converter': ['css-gradient-generator', 'color-palette-extractor', 'color-contrast-checker'],
  'css-gradient-generator': ['color-converter', 'color-palette-extractor', 'color-contrast-checker'],
  'color-palette-extractor': ['css-gradient-generator', 'color-converter', 'color-contrast-checker'],
  'color-contrast-checker': ['color-converter', 'color-palette-extractor', 'css-gradient-generator'],
  'image-resizer': ['image-compressor', 'image-metadata-viewer', 'png-to-webp', 'favicon-generator'],
  'image-metadata-viewer': ['file-signature-inspector', 'mime-detector', 'image-resizer'],
  'file-signature-inspector': ['mime-detector', 'hash-generator', 'file-checksum', 'image-metadata-viewer'],
  'mime-detector': ['file-signature-inspector', 'hash-generator', 'base64-encoder-decoder'],
  'lorem-ipsum-generator': ['word-counter', 'character-counter', 'case-converter', 'text-sorter'],
  'capitalization-tool': ['case-converter', 'title-generator', 'word-counter', 'text-sorter'],
  'citation-generator': ['word-counter', 'title-generator', 'headline-analyzer', 'capitalization-tool'],
  'headline-analyzer': ['title-generator', 'email-signature-generator', 'cta-generator'],
  'campaign-url-builder': ['utm-builder', 'email-signature-generator', 'headline-analyzer'],
  'unix-timestamp-converter': ['color-converter', 'base64-encoder-decoder', 'uuid-generator', 'ip-lookup'],
  'user-agent-parser': ['ip-lookup', 'http-header-checker', 'dns-lookup'],
  'ai-cost-calculator': ['token-counter', 'ai-persona-generator', 'prompt-optimizer'],
  'ai-persona-generator': ['prompt-optimizer', 'system-prompt-generator', 'ai-cost-calculator'],
  'bmr-calculator': ['macro-calculator', 'calorie-calculator', 'tdee-calculator'],
  'unicode-inspector': ['character-counter', 'html-entity-encoder', 'case-converter'],
  'csp-generator': ['http-header-checker', 'robots-txt-generator', 'ssl-checker'],
  'sql-formatter': ['json-formatter', 'json-yaml-converter', 'regex-tester'],
  'uuid-generator': ['password-generator', 'hash-generator', 'unix-timestamp-converter'],
  'invoice-generator': ['vat-calculator', 'unit-converter', 'bmr-calculator'],
  'token-counter': ['ai-cost-calculator', 'prompt-optimizer', 'word-counter'],
}

/** Related tool slugs for a given tool (curated map, else same-category). */
export function getRelatedTools(slug: string, category: string): string[] {
  const curated = RELATED_TOOLS[slug]
  if (curated && curated.length > 0) return curated
  return []
}