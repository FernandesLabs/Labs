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
  { label: string; blurb: string; color: string }
> = {
  developer: {
    label: 'Developer',
    blurb: 'JSON, encoders, hashes, regex, and code utilities.',
    color: 'oklch(0.546 0.215 262.6)',
  },
  text: {
    label: 'Text',
    blurb: 'Count, convert, clean, and transform text.',
    color: 'oklch(0.62 0.17 150)',
  },
  finance: {
    label: 'Finance',
    blurb: 'Calculators for money, health, and school.',
    color: 'oklch(0.72 0.16 75)',
  },
  seo: {
    label: 'SEO',
    blurb: 'Meta tags, schema, sitemaps, and content QA.',
    color: 'oklch(0.6 0.2 20)',
  },
  security: {
    label: 'Security',
    blurb: 'Passwords, passphrases, and headers.',
    color: 'oklch(0.55 0.18 300)',
  },
  network: {
    label: 'Network',
    blurb: 'DNS, IP, SSL, headers, and connectivity checks.',
    color: 'oklch(0.6 0.15 195)',
  },
  media: {
    label: 'Media',
    blurb: 'Images, colors, SVG, and file utilities.',
    color: 'oklch(0.65 0.18 160)',
  },
  misc: {
    label: 'Misc',
    blurb: 'AI helpers, tokens, and other utilities.',
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