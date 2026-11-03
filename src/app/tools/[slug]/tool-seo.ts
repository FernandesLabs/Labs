import type { ToolCategory } from '@/lib/tools/types'
import { CATEGORY_META } from '@/lib/tools/types'
// `toolMetaList` is the single source of truth for the registry metadata.
// The proxy helper must be slug-based: the `network` category also contains
// the User-Agent Parser, which runs entirely in the browser.
import { toolMetaList } from '@/lib/tools/tool-meta'
import { usesServerProxy } from '@/lib/privacy'
/**
 * SEO content generators shared by:
 *   - The server component `app/tools/[slug]/page.tsx` (for JSON-LD)
 *   - The client component `tool-content.tsx` (for visible content)
 *
 * Centralizing here means the visible page text and the structured data
 * stay in sync — Google sees the same Q&A in the rendered HTML and in the
 * FAQPage JSON-LD.
 */

const KNOWN_SLUGS = new Set(toolMetaList.map((t) => t.slug))

/** True when `slug` matches a real tool in the registry. */
function isKnownSlug(slug: string): boolean {
  return KNOWN_SLUGS.has(slug)
}

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
interface SeoOverride {
  title: string
  description: string
  /**
   * Optional H1. The visible <h1> used the registry `name`, which is often
   * narrower than the query language the page already ranks for — e.g.
   * "IP Lookup" vs the 567-impression query "ip address lookup". Only set
   * this when the override phrase is materially better than the tool name.
   */
  h1?: string
  /**
   * Short, answer-first paragraph rendered above the intro. This is the
   * snippet/featured-result candidate: it answers the head query in the
   * first 2–3 sentences before the long-form content starts.
   */
  summary?: string
}

const SEO_OVERRIDES: Record<string, SeoOverride> = {
  'ip-lookup': {
    title: 'IP Address Lookup & IP Finder — Location, ISP & ASN',
    h1: 'IP Address Lookup & IP Finder',
    summary:
      'An IP address lookup shows the approximate location, ISP, ASN and timezone behind an IPv4 or IPv6 address or hostname. Enter an address in the IP finder below, or choose Use my IP to check your public address.',
    description:
      'What is my IP? Free IP address lookup for IPv4, IPv6 and hostnames. Check location, ISP, ASN and timezone, or choose Use my IP to find your public address.',
  },
  'email-signature-generator': {
    title: 'HTML Email Signature Generator — Gmail, Outlook & Thunderbird',
    h1: 'Free HTML Email Signature Generator',
    summary:
      'An email signature generator builds table-based HTML that renders in Gmail, Outlook, Apple Mail and Thunderbird. Fill in your details, pick a template, then paste the copied HTML into your email client.',
    description:
      'Create a free HTML email signature for Gmail, Outlook, Apple Mail or Thunderbird. Pick a template, copy the table-based HTML, paste it into your client.',
  },
  'redirect-checker': {
    title: '301 Redirect Checker — Test Redirect Chains Online',
    h1: '301 Redirect Checker',
    summary:
      'A redirect checker follows every 301, 302, 307 and 308 hop from a URL to its final destination, so you can confirm that a permanent move is a single hop to the correct page.',
    description:
      'Check any URL for 301 and 302 redirects, follow every hop to the final destination, and spot redirect chains. Free redirect checker, no sign-up.',
  },
  'canonical-url-checker': {
    title: 'Canonical Checker & Generator — Normalize Any URL',
    h1: 'Canonical URL Checker & Canonical Tag Generator',
    summary:
      'A canonical URL is the single version of a page you want Google to index. This tool normalizes a URL you paste in — lowercases the host, strips tracking parameters, sorts the query and removes fragments — and generates the canonical tag. It does not fetch the live page to read an existing tag.',
    description:
      'Check the URL you paste and generate a canonical tag: strip utm_*, gclid and fbclid, sort query strings, drop fragments. Free, no sign-up.',
  },
  'robots-txt-generator': {
    title: 'Robots.txt Generator — Free Robot.txt Maker for Google',
    h1: 'Robots.txt Generator & Robot.txt Maker',
    summary:
      'A robots.txt file tells Googlebot and other crawlers which URLs they may request. Add an Allow or Disallow rule, include your sitemap URL, and copy the generated file to your domain root.',
    description:
      'Make a robots.txt file for Google in seconds. Allow or block crawlers, add your sitemap, and copy a valid robots.txt file. Free robot.txt maker, no sign-up.',
  },
  'css-gradient-generator': {
    title: 'CSS Gradient Generator — Create & Copy Gradient CSS',
    summary:
      'A CSS gradient is a background image defined in code with linear-gradient() or radial-gradient(). Pick two or more colors, set the angle, and copy the generated CSS.',
    description:
      'Generate a CSS linear-gradient or radial-gradient with a live preview. Copy the background CSS in one click. Free online gradient generator.',
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
    title: 'File Signature Inspector — File Type Checker by Magic Bytes',
    h1: 'File Signature Inspector & File Type Checker',
    summary:
      'A file signature (magic bytes) is the first few bytes of a file that reveal its real format, regardless of the extension. This inspector identifies common signatures and flags extension mismatches.',
    description:
      'Identify a file’s real type from its magic bytes. Detect spoofed extensions and compare with the declared MIME type — free, in your browser.',
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
  'ping-tool': {
    title: 'Ping Tool — HTTP Latency (TTFB) Test for Any URL',
    description:
      'Measure HTTP latency and time to first byte (TTFB) for any URL with one or three pings. Free, no sign-up; the request runs through our server.',
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
    title: 'MIME Type Detector — Find a File’s MIME Type by Extension',
    summary:
      'A MIME type tells a browser how to handle a file, such as text/html or image/png. This detector maps a file name or extension to its MIME type; use the File Signature Inspector when you need to verify the actual bytes.',
    description:
      'Find the MIME type for any file extension or file name — text/html, application/pdf, image/png and more. Free MIME type detector, works offline.',
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
    title: 'Unicode Inspector — Character & Code Point Lookup',
    description:
      'Look up any Unicode character — code point, name, UTF-8 bytes and category. Free Unicode inspector for developers, works in your browser.',
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
    title: 'Base64 Encoder & Decoder — Encode or Decode Text',
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
    title: 'URL Encoder & Decoder — Encode or Decode URLs',
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
    title: 'ARIA Validator — 12-Point HTML Accessibility Check',
    summary:
      'ARIA roles, states and properties make custom widgets understandable to assistive technology. This validator checks 12 automated HTML/ARIA rules and explains each fix; it does not test color contrast, keyboard navigation or screen-reader output.',
    description:
      'Check ARIA roles, states and HTML accessibility issues instantly — 12 automated rules with concrete fix suggestions. Free, runs entirely in your browser.',
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
  // Breakout tools from Search Console (Sep 2026 export):
  // font-accessibility-checker is the site's highest-CTR page (4 clicks /
  // 87 impressions, 4.6% CTR) but had no hand-tuned snippet. diff-checker
  // shows steady long-tail impressions. Both were falling back to the
  // generic template titles before.
  'font-accessibility-checker': {
    title: 'Font Readability Test & Font Accessibility Checker',
    h1: 'Font Accessibility Checker & Readability Test',
    summary:
      'Run a font readability test with your own text: compare font size, weight, line height and measured line length in a live preview. The font accessibility checker offers typography guidance; a full WCAG audit also needs contrast, zoom and spacing checks.',
    description:
      'Test font readability with your own text. Compare size, weight, line height and measured line length in a live preview. Free font accessibility checker.',
  },
  'diff-checker': {
    title: 'Diff Checker — Compare Two Texts & Highlight Changes',
    description:
      'Compare two texts or code snippets side by side and highlight every difference instantly. Free online diff checker — private, runs in your browser.',
  },
  'reading-time-calculator': {
    title: 'Reading Time Calculator — Words per Minute & Speaking Time',
    h1: 'Reading Time Calculator & WPM Estimator',
    summary:
      'Reading time is word count divided by reading speed — typically 200–250 words per minute for adults, and 130–150 for speaking. Paste your text to estimate reading and speaking time.',
    description:
      'Estimate reading and speaking time from any text at 150, 250, 400 and 130 WPM. See word counts and a full speed breakdown. Free and private.',
  },
}

/** Hand-tuned title + description for a tool (falls back to templates). */
export function getSeoOverride(tool: ToolLike): SeoOverride | null {
  return SEO_OVERRIDES[tool.slug] ?? null
}

/** Google renders roughly 55–60 characters of a desktop title before truncating. */
const TITLE_MAX = 62
/** Meta descriptions are truncated around 155–160 characters. */
const DESC_MAX = 158
/** Below this, a trimmed capability fragment reads worse than the tool name alone. */
const MIN_CAPABILITY_BUDGET = 24

function stripTrailingPeriod(s: string): string {
  return s.trim().replace(/\.$/, '')
}

/** Uppercase the first character, leave the rest as authored. */
function sentenceCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Conjunctions / prepositions that read badly when a title is cut mid-phrase
 * ("…Build cron schedules visually and"). Trimmed after truncation.
 */
const TRAILING_STOPWORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'of',
  'on', 'or', 'that', 'the', 'to', 'up', 'via', 'with', 'without', 'your',
])

/**
 * Truncate to `max` characters without cutting a word in half, then drop any
 * dangling trailing function word so the title still reads as a phrase.
 * Returns an empty string when nothing usable remains.
 */
function truncateOnWordBoundary(s: string, max: number): string {
  if (s.length <= max) return s
  const clipped = s.slice(0, max)
  const lastSpace = clipped.lastIndexOf(' ')
  const out = lastSpace > 0 ? clipped.slice(0, lastSpace) : ''
  return dropTrailingStopword(out.replace(/[\s,.;:—-]+$/, ''))
}

/**
 * A title cut at a word boundary can still end in a bare number, a comma, or
 * a function word ("…rotate pages by 90, 180," / "…with 1 or 3"). Those read
 * like a broken sentence in the SERP, so trim them iteratively.
 */
function isDroppableTitleToken(token: string): boolean {
  const cleaned = token.replace(/[^\p{L}\p{N}]+/gu, '')
  if (!cleaned) return true
  if (/^\d+$/.test(cleaned)) return true
  return TRAILING_STOPWORDS.has(cleaned.toLowerCase())
}

function dropTrailingStopword(s: string): string {
  let parts = s.split(' ').filter(Boolean)
  while (parts.length > 1) {
    const last = parts[parts.length - 1].replace(/[\s,.;:—-]+$/, '')
    if (!isDroppableTitleToken(last)) break
    parts = parts.slice(0, -1)
  }
  return parts.join(' ').replace(/[\s,.;:—-]+$/, '')
}

/**
 * Generate a unique, keyword-rich <title> for a tool page.
 *
 * Format: "{ToolName} — {capability from the tool's own description}".
 *
 * The capability is the tool's hand-written `description`, which is already
 * specific and per-tool (e.g. "Count words, characters, sentences, and
 * reading time"). Titles are longer than the previous template, so the
 * category label and brand tail were dropped — they were generic filler that
 * cost real keyword space and made 82 titles near-identical.
 *
 * Example: "Word Counter — Count words, characters, sentences, and reading time"
 */
export function generateToolTitle(tool: ToolLike): string {
  const override = getSeoOverride(tool)
  if (override) return override.title

  // Lead with the tool's own searchable name plus its concrete capability,
  // rather than the old "{Name} — Free Online {Category} Tool | {Brand}"
  // template. That template spent its most valuable SERP real estate on the
  // generic words "Free Online ... Tool", pushed the actual capability off the
  // end, and produced 82 near-identical titles.
  const capability = sentenceCase(stripTrailingPeriod(tool.description))
  const candidate = `${tool.name} — ${capability}`
  if (candidate.length <= TITLE_MAX) return candidate

  // Capability is too long to fit whole — trim it on a word boundary rather
  // than discarding it for generic filler like "Free Online Tool", which is a
  // weak use of the most valuable pixels in the SERP.
  const budget = TITLE_MAX - tool.name.length - ' — '.length
  if (budget >= MIN_CAPABILITY_BUDGET) {
    const trimmed = truncateOnWordBoundary(capability, budget)
    if (trimmed) return `${tool.name} — ${trimmed}`
  }
  return tool.name
}

/**
 * Generate a unique, keyword-rich meta description for a tool page.
 *
 * Target length: 120–160 characters.
 *
 * The previous version appended a fixed 100-character tail to every tool
 * (" Free online {kw} tool — no sign-up, no tracking, runs entirely in your
 * browser. {Category} tool by Fernandes Labs."), which meant all 82
 * non-override tools ended in the same boilerplate and most got truncated
 * mid-sentence with an ellipsis before the useful part even rendered.
 *
 * Now: the hand-written capability sentence leads, followed by one accurate
 * differentiator. The privacy claim is slug-aware — the six server-proxied
 * tools proxy through our server to bypass CORS, while the network category's
 * User-Agent Parser stays in the browser.
 */
export function generateToolDescription(tool: ToolLike): string {
  const override = getSeoOverride(tool)
  if (override) return override.description

  const base = stripTrailingPeriod(tool.description)

  const differentiator = usesServerProxy(tool.slug)
    ? // Server-side proxy: be accurate rather than maximally flattering.
      "Free — proxied server-side to bypass CORS; we don't log queries."
    : 'Free — no sign-up, no uploads.'

  const full = `${base}. ${differentiator}`
  if (full.length <= DESC_MAX) return full
  return truncateOnWordBoundary(full, DESC_MAX - 1) + '…'
}

/** Longer, more specific intro paragraph (Priority 7 — improve content). */
export function generateToolIntro(tool: ToolLike): string {
  const cat = CATEGORY_META[tool.category as ToolCategory]
  const kws = tool.keywords?.slice(0, 3).join(', ') || tool.name.toLowerCase()
  const kwsList = tool.keywords?.slice(0, 3).join(', ') || 'this task'
  const proxied = usesServerProxy(tool.slug)
  return (
    `The ${tool.name} is a free online ${cat.label.toLowerCase()} tool that ${tool.description.toLowerCase().replace(/\.$/, '')}. ` +
    `${proxied
      ? `Lookups run through our server so your browser can reach the upstream data source — nothing is stored or logged, but the address or URL you enter does transit our infrastructure. `
      : `It runs entirely in your browser — no data is sent to any server, no sign-up is required, and it works offline once the page has loaded. `}` +
    `Whether you need to ${kws}, or complete related tasks like ${kwsList}, this tool provides a fast, privacy-first solution. ` +
    `${proxied
      ? `Results come from public registry and routing data, so treat them as reference information rather than proof of anything. `
      : `All processing happens client-side using modern Web APIs, which means your input never leaves your device — making it safe for sensitive data such as passwords, private keys, personal documents, or confidential business information. `}` +
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
  // Offline use and "data never leaves your device" are both untrue for the
  // server-proxied tools. Use the slug, not the category: User-Agent Parser is
  // in the network category but runs locally.
  if (usesServerProxy(tool.slug)) {
    base.push(
      `Checking infrastructure you are responsible for — your own domains, servers and email flows.`
    )
    base.push(
      `Verifying a third party before trusting them with a link, certificate or header set.`
    )
  } else {
    base.push(
      `Privacy-sensitive scenarios where data must not leave your device (e.g. passwords, financial inputs, private documents).`
    )
    base.push(
      `Offline use — once the page is loaded, no internet connection is required.`
    )
  }
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
  } else if (usesServerProxy(tool.slug)) {
    tips.push(
      `Network lookups query external services; if a lookup fails, wait a moment and try again — rate limits are common.`
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
    usesServerProxy(tool.slug)
      ? `Read the result critically. This lookup returns public registry and routing data, so treat a city or country as a rough registration location rather than proof of a physical location.`
      : `All processing happens client-side in your browser. Your data never leaves your device, making this tool safe for sensitive inputs like passwords, private keys, or personal documents.`
  )
  return steps
}
/** FAQs (Priority 5 — FAQPage JSON-LD). */
export function generateToolFaq(tool: ToolLike): FaqItem[] {
  const cat = CATEGORY_META[tool.category as ToolCategory]
  const kws = tool.keywords || []
  const proxied = usesServerProxy(tool.slug)
  const faqs: FaqItem[] = [
    {
      q: `Is the ${tool.name} free to use?`,
      a: `Yes, completely free. There are no sign-ups, no hidden costs, and no usage limits. The tool is supported by ads (shown above and below the tool card).`,
    },
    proxied
      ? {
          q: `Does my ${kws[0] || 'input'} get sent to a server?`,
          a: `Yes. Browsers block this kind of cross-origin lookup, so the request is made by our server on your behalf. We do not store or log it — the proxy runs with caching disabled and writes nothing to a database — but the value you enter does transit our infrastructure and the upstream public data provider. Do not enter private or internal hostnames.`,
        }
      : {
          q: `Is my data safe when using this tool?`,
          a: `Absolutely. All processing happens entirely in your browser. Your input is never sent to any server, stored, or tracked. You can safely use this tool with sensitive data like passwords, private documents, or personal information. You can even use it offline once the page is loaded.`,
        },
    proxied
      ? {
          q: `Does the ${tool.name} work offline?`,
          a: `No. This tool queries live public data, so it needs an internet connection each time you run a lookup.`,
        }
      : {
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
  } else if (proxied) {
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
  'json-yaml-converter': ['json-formatter', 'xml-formatter', 'json-ld-generator', 'markdown-to-html'],
  'base64-encoder-decoder': ['url-encoder-decoder', 'hash-generator', 'file-signature-inspector', 'mime-detector'],
  'jwt-decoder': ['jwt-generator', 'base64-encoder-decoder', 'hash-generator', 'json-formatter'],
  'jwt-generator': ['jwt-decoder', 'hash-generator', 'hmac-generator', 'base64-encoder-decoder'],
  'regex-tester': ['json-formatter', 'text-sorter', 'duplicate-line-remover', 'case-converter'],
  'hash-generator': ['hmac-generator', 'file-checksum', 'password-generator', 'base64-encoder-decoder'],
  'hmac-generator': ['hash-generator', 'jwt-generator', 'password-generator'],
  'password-generator': ['secure-passphrase-generator', 'password-strength-checker', 'hash-generator', 'uuid-generator'],
  'color-converter': ['css-gradient-generator', 'color-palette-extractor', 'color-contrast-checker'],
  'css-gradient-generator': ['color-converter', 'color-palette-extractor', 'color-contrast-checker'],
  'color-palette-extractor': ['css-gradient-generator', 'color-converter', 'color-contrast-checker'],
  'color-contrast-checker': ['color-converter', 'color-palette-extractor', 'css-gradient-generator'],
  'font-accessibility-checker': ['color-contrast-checker', 'aria-validator', 'reading-time-calculator', 'lorem-ipsum-generator'],
  'aria-validator': ['font-accessibility-checker', 'color-contrast-checker', 'html-entity-encoder'],
  'reading-time-calculator': ['word-counter', 'character-counter', 'font-accessibility-checker'],
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

/**
 * Related tool slugs for a given tool: the curated map, else same-category
 * fallback, capped at `limit`.
 *
 * The fallback is what gives every tool page a crawl path to its siblings and
 * distributes category-hub authority. `RELATED_TOOLS` covers only 43 of 132
 * tools; before this existed the other 89 rendered ZERO related-tool links
 * (the docstring always promised same-category neighbours, the code returned
 * an empty array) — verified live against /tools/remove-blank-lines, which had
 * no `/tools/*` hrefs at all.
 *
 * Curated links come first (they are intentional, hand-picked), then the list
 * is topped up with same-category siblings. Links are deduped, the tool itself
 * is excluded, and every slug is validated against the registry so a typo in
 * the curated map degrades to a missing link rather than a broken anchor.
 *
 * `limit` defaults to 6 to match the sidebar rail's width. All three call
 * sites pass an explicit limit (tool-content 8, tool-view 6, tool page nav 12).
 */
export function getRelatedTools(
  slug: string,
  category: string,
  limit = 6
): string[] {
  const curated = RELATED_TOOLS[slug] ?? []

  // Same-category siblings that aren't already linked from the curated map.
  const siblings = toolMetaList
    .filter((t) => t.category === category && t.slug !== slug)
    .map((t) => t.slug)

  const seen = new Set<string>()
  const out: string[] = []
  for (const candidate of [...curated, ...siblings]) {
    if (candidate === slug || seen.has(candidate)) continue
    if (!isKnownSlug(candidate)) continue
    seen.add(candidate)
    out.push(candidate)
    if (out.length >= limit) break
  }
  return out
}
