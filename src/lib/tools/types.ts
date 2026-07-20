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
    color: string
  }
> = {
  developer: {
    label: 'Developer',
    blurb: 'JSON, encoders, hashes, regex, and code utilities.',
    seoIntro:
      'Free online developer tools that run entirely in your browser. Format and validate JSON, encode and decode Base64, generate UUIDs and hashes, test regex, and convert timestamps — all without sending a single byte to a server. Perfect for quick debugging, CI scripts, or working with sensitive data like API keys and JWT payloads.',
    color: 'oklch(0.546 0.215 262.6)',
  },
  text: {
    label: 'Text',
    blurb: 'Count, convert, clean, and transform text.',
    seoIntro:
      'Free online text tools for counting words, converting case, generating lorem ipsum, sorting lines, and cleaning up content. Whether you are writing, editing, or processing data, these tools handle text transformations instantly in your browser — no sign-up, no tracking, works offline.',
    color: 'oklch(0.62 0.17 150)',
  },
  finance: {
    label: 'Finance',
    blurb: 'Calculators for money, health, and school.',
    seoIntro:
      'Free online finance and health calculators for mortgages, loans, compound interest, BMI, calories, GPA, and more. Run instant what-if scenarios with live recalculation — all client-side, so your financial inputs never leave your device. Ideal for personal finance planning, schoolwork, and health tracking.',
    color: 'oklch(0.72 0.16 75)',
  },
  seo: {
    label: 'SEO',
    blurb: 'Meta tags, schema, sitemaps, and content QA.',
    seoIntro:
      'Free online SEO tools to generate meta tags, JSON-LD schema, sitemaps, Open Graph previews, and analyze headlines. Audit your site\u2019s metadata, build UTM-tagged campaign URLs, and create SEO-optimized titles — all in your browser, no sign-up required. Perfect for marketers, content teams, and solo site owners.',
    color: 'oklch(0.6 0.2 20)',
  },
  security: {
    label: 'Security',
    blurb: 'Passwords, passphrases, and headers.',
    seoIntro:
      'Free online security tools to generate strong passwords and passphrases, check password strength, and build Content Security Policy (CSP) headers. All randomness uses the Web Crypto API (cryptographically secure), and generated values never leave your browser — safer than most online generators that may log your data.',
    color: 'oklch(0.55 0.18 300)',
  },
  network: {
    label: 'Network',
    blurb: 'DNS, IP, SSL, headers, and connectivity checks.',
    seoIntro:
      'Free online network tools for DNS lookups, IP geolocation, SSL certificate inspection, HTTP header checks, redirect tracing, and ping. Diagnose connectivity issues, audit TLS configurations, and inspect server responses — all through a server-side proxy that bypasses CORS so you get real, accurate results.',
    color: 'oklch(0.6 0.15 195)',
  },
  media: {
    label: 'Media',
    blurb: 'Images, colors, SVG, and file utilities.',
    seoIntro:
      'Free online media tools to compress and resize images, generate QR codes and favicons, extract color palettes, optimize SVGs, and merge, split, or rotate PDFs. All file processing happens locally in your browser — your images and documents are never uploaded, making these tools safe for sensitive files.',
    color: 'oklch(0.65 0.18 160)',
  },
  misc: {
    label: 'Misc',
    blurb: 'AI helpers, tokens, and other utilities.',
    seoIntro:
      'Free online AI and utility tools including token counters, AI cost calculators, prompt optimizers, and prompt library managers. Count tokens before sending to an LLM, estimate API costs, and build structured system prompts — all client-side, no sign-up, works offline.',
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