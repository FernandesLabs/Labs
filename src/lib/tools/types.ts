import type { ComponentType } from 'react'
export type ToolCategory =
  | 'developer'
  | 'text'
  | 'finance'
  | 'seo'
  | 'security'
  | 'network'
  | 'media'
  | 'misc'
export interface ToolMeta {
  slug: string
  category: ToolCategory
  name: string
  description: string
  keywords?: string[]
}
export interface Tool extends ToolMeta {
  Component: ComponentType
}
export const CATEGORY_META: Record<
  ToolCategory,
  {
    label: string
    blurb: string
    /** Expanded SEO intro (2–4 sentences) for the category landing page. */
    seoIntro: string
    /**
     * Longer, genuinely category-specific prose rendered as a
     * "When to use these" section on the category landing page.
     *
     * WHY THIS EXISTS: category pages carried only ~60 words of unique text
     * (blurb + seoIntro), while the rest of the page was a grid repeating
     * tool descriptions that already appear on each tool page. That made
     * /category/* the thinnest indexable content on the site — and they are
     * the hub pages that internal linking routes authority through. Each
     * entry below is unique, describes real decisions between tools in that
     * category, and links onward to the individual tools.
     */
    guide: string
    color: string
  }
> = {
  developer: {
    label: 'Developer',
    blurb: 'JSON, encoders, hashes, regex, and code utilities.',
    seoIntro:
      'Free online developer tools that run entirely in your browser. Format and validate JSON, encode and decode Base64, generate UUIDs and hashes, test regex, and convert timestamps — all without sending a single byte to a server. Perfect for quick debugging, CI scripts, or working with sensitive data like API keys and JWT payloads.',
    guide:
      'Start with the format you are working in. If you have raw JSON, the JSON Formatter will validate it and point at the exact line that breaks parsing — useful when a production API response 500s and you are reading the payload by eye. If the data has crossed a config boundary, JWT Decoder and Base64 Encoder & Decoder handle the two encodings you meet most often; both decode locally, so tokens and credentials never touch a server. Regex Tester is the tool to reach for when a pattern works in one language and not another: it flags the differences in escape handling and capture-group numbering that cause most of those failures. For anything you paste into a test fixture or a local script, UUID Generator and Hash Generator cover the common needs without a terminal. The one caveat worth stating plainly: these tools help you inspect and transform data, they do not validate that your schema is correct in production.',
    color: 'oklch(0.546 0.215 262.6)',
  },
  text: {
    label: 'Text',
    blurb: 'Count, convert, clean, and transform text.',
    seoIntro:
      'Free online text tools for counting words, converting case, generating lorem ipsum, sorting lines, and cleaning up content. Whether you are writing, editing, or processing data, these tools handle text transformations instantly in your browser — no sign-up, no tracking, works offline.',
    guide:
      'Most text problems are really cleanup problems. Text pasted out of a PDF, an email client or a chat log arrives with stray blank lines, duplicated entries and inconsistent whitespace; Duplicate Line Remover and the blank-line cleaner fix that in a single pass, which is usually faster than hunting for the original source. When you need a count you can defend in an argument, Word Counter and Character Counter distinguish between the conventions that cause most disputes — whitespace included or not, and how hyphenated words are treated. Capitalization and Case tools cover the title styles that publishing platforms disagree about. For bulk reordering, Text Sorter keeps the original line intact rather than splitting on whitespace, so list items with spaces survive. Lorem Ipsum Generator fills a layout at a realistic word count instead of a fixed paragraph, which is what makes it useful for checking how a design holds up. Everything here runs locally, so pasting unpublished copy into these tools does not share it with anyone.',
    color: 'oklch(0.62 0.17 150)',
  },
  finance: {
    label: 'Finance',
    blurb: 'Calculators for money, health, and school.',
    seoIntro:
      'Free online finance and health calculators for mortgages, loans, compound interest, BMI, calories, GPA, and more. Run instant what-if scenarios with live recalculation — all client-side, so your financial inputs never leave your device. Ideal for personal finance planning, schoolwork, and health tracking.',
    guide:
      'These calculators exist to make a rough number easy to reach, not to replace advice. For debt, the Mortgage, Loan and Compound Interest calculators show the effect of rate and term changes side by side, which is the fastest way to see whether a shorter term is worth the higher monthly payment. For tax, the VAT and Break-Even calculators are what you reach for when comparing a freelance rate against a salary. The health and fitness calculators — BMI, BMR, TDEE, calorie and macro targets — all rest on published population formulas, and those formulas have documented limits: BMR in particular is an estimate derived from height, weight, age and sex, and it can be off by a wide margin for anyone whose expenditure does not match their body composition. Treat the output as a starting point to sanity-check against how you actually feel, not as a prescription. Grade and GPA calculators cover the common institutional weighting schemes, though published grading policies differ enough that you should confirm the convention your school uses before relying on a result.',
    color: 'oklch(0.72 0.16 75)',
  },
  seo: {
    label: 'SEO',
    blurb: 'Meta tags, schema, sitemaps, and content QA.',
    seoIntro:
      'Free online SEO tools to generate meta tags, JSON-LD schema, sitemaps, Open Graph previews, and analyze headlines. Audit your site\u2019s metadata, build UTM-tagged campaign URLs, and create SEO-optimized titles — all in your browser, no sign-up required. Perfect for marketers, content teams, and solo site owners.',
    guide:
      'The recurring theme in this category is verifying what you already shipped, not authoring new strategy. Robots.txt Generator and Sitemap Generator produce the files themselves, but the more valuable tools here are the inspectors: the Canonical URL Checker and Redirect Checker tell you whether the URL Google actually indexed is the one you intended, which is the usual explanation for a page ranking lower than its content deserves. HTTP Header Checker reads back what your server returns, settling HSTS, CSP and cache-header questions without waiting for a third-party scan. The schema generators cover the structured data Google reads for rich results; treat their output as a starting point and check it against schema.org, because a malformed or overstated type is worse than none. Title Generator and Headline Analyzer help with the snippet text that decides whether an already-ranking page gets clicked. The limit worth naming: a tool can show you the markup you have, but nothing here substitutes for Search Console data on what Google actually indexed.',
    color: 'oklch(0.6 0.2 20)',
  },
  security: {
    label: 'Security',
    blurb: 'Passwords, passphrases, and headers.',
    seoIntro:
      'Free online security tools to generate strong passwords and passphrases, check password strength, and build Content Security Policy (CSP) headers. All randomness uses the Web Crypto API (cryptographically secure), and generated values never leave your browser — safer than most online generators that may log your data.',
    guide:
      'Two distinct jobs live here, and the difference matters. Password and passphrase generation produces secrets, so the security property that counts is where the randomness comes from: these tools draw from the Web Crypto API, which is a cryptographically secure generator, rather than the Math.random function most casual generators use and which is predictable by design. Run these offline, in a private window, and paste the result straight into your password manager rather than into a chat or a notes app. Password Strength Checker is the reverse task: it tells you whether a password you already have would survive a cracking attempt, which is more useful when you are auditing an existing set than when you are creating a new one. The CSP generator builds a Content Security Policy header for your site, and it is the one here worth treating as a starting draft rather than a finished policy — a policy set too tightly breaks your own site in ways that take time to diagnose, so deploy it in report-only mode first and read what it flags. None of this substitutes for a password manager and multi-factor authentication.',
    color: 'oklch(0.55 0.18 300)',
  },
  network: {
    label: 'Network',
    blurb: 'DNS, IP, SSL, headers, and connectivity checks.',
    seoIntro:
      'Free online network tools for DNS lookups, IP geolocation, SSL certificate inspection, HTTP header checks, redirect tracing, and ping. Diagnose connectivity issues, audit TLS configurations, and inspect server responses — all through a server-side proxy that bypasses CORS so you get real, accurate results.',
    guide:
      'These are the tools for answering a question about a connection: why is this domain not resolving, what does my server actually return, is this certificate valid. DNS Lookup distinguishes the failure modes people usually conflate — NXDOMAIN means the name does not exist, while a NOERROR answer with no A record means it exists but has no address for that type, and the two point at entirely different problems. SSL Checker reads the presented chain so you can catch a hostname mismatch or an expiry date before your users do. HTTP Header Checker is how you verify what your server sends rather than what you intended it to send, which is the fastest way to confirm HSTS, CSP and cache-control are actually in effect. Redirect Checker traces the full chain, so you can see the hop where a 301 turns into an error page. IP Lookup returns the registered holder of an address block — worth reading the caveat on that page, because a city in the result is the registration location of the block, not the physical location of a person. Unlike every other category on this site, these lookups are proxied through our server because browsers block cross-origin requests; the values you enter are not stored or logged.',
    color: 'oklch(0.6 0.15 195)',
  },
  media: {
    label: 'Media',
    blurb: 'Images, colors, SVG, and file utilities.',
    seoIntro:
      'Free online media tools to compress and resize images, generate QR codes and favicons, extract color palettes, optimize SVGs, and merge, split, or rotate PDFs. All file processing happens locally in your browser — your images and documents are never uploaded, making these tools safe for sensitive files.',
    guide:
      'The reason this category exists in browser form is file size and privacy. Design handoffs and CMS upload limits make re-exporting through a desktop app a hassle, and re-encoding on someone else’s server means handing over drafts and unreleased assets. Every tool here works on a local copy of your file, so the originals never leave the machine. Image Resizer and the compressor handle the common case of a file that a platform rejects on dimensions or weight, and Favicon Generator covers the several sizes modern browsers and mobile home screens expect. Color Palette Extractor samples an uploaded image so you can carry a palette into CSS by hand rather than eyeballing hex values. QR Generator and the favicon tools output assets you will publish, so check a generated code with a phone camera before you ship it — encoding looks valid but can still point at the wrong destination. The PDF tools merge, split and rotate existing documents; they edit what you give them and do not repair a corrupt or encrypted source.',
    color: 'oklch(0.65 0.18 160)',
  },
  misc: {
    label: 'Misc',
    blurb: 'AI helpers, tokens, and other utilities.',
    seoIntro:
      'Free online AI and utility tools including token counters, AI cost calculators, prompt optimizers, and prompt library managers. Count tokens before sending to an LLM, estimate API costs, and build structured system prompts — all client-side, no sign-up, works offline.',
    guide:
      'These tools answer the questions that come up around an API bill rather than model quality itself. Token Counter estimates the size of a prompt before you send it, which is the fastest way to find the part of a long document that is quietly dominating your context window. AI Cost Calculator turns that count into a figure, but treat the result as an estimate: provider pricing changes, tiered rates and batch discounts are not always reflected, so confirm against the live pricing page before committing to a budget. The prompt tools — Persona Generator, Prompt Optimizer, System Prompt Generator and Prompt Library — help you write and reuse a prompt structure, and they work best when you already know what you want the model to do and just need it phrased consistently. None of these connect to a model, so they cannot tell you whether an answer is accurate; they shorten the path to a prompt you can evaluate. Treat any prompt output as a starting draft, since a well-structured request can still be the wrong request.',
    color: 'oklch(0.55 0.16 200)',
  },
}
export const CATEGORY_ORDER: ToolCategory[] = [
  'developer',
  'text',
  'finance',
  'seo',
  'security',
  'network',
  'media',
  'misc',
]