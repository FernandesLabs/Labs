'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChevronDown, Sparkles, Wrench, CheckCircle2 } from 'lucide-react'
import type { Tool } from '@/lib/tools/types'
import { CATEGORY_META } from '@/lib/tools/types'
import {
  generateToolFaq,
  generateToolHowTo,
  generateToolIntro,
  generateToolTips,
  generateToolUseCases,
} from '@/app/tools/[slug]/tool-seo'

/**
 * Generates SEO content for a tool page: an intro paragraph, "how to use"
 * steps, "common use cases", "tips", and an FAQ accordion.
 *
 * The same generators are used by the server component at
 * `app/tools/[slug]/page.tsx` to produce FAQPage + HowTo JSON-LD, so the
 * visible text and the structured data stay in sync.
 */

export function ToolContent({ tool }: { tool: Tool }) {
  const intro = React.useMemo(() => generateToolIntro(tool), [tool])
  const howTo = React.useMemo(() => generateToolHowTo(tool), [tool])
  const faqs = React.useMemo(() => generateToolFaq(tool), [tool])
  const useCases = React.useMemo(() => generateToolUseCases(tool), [tool])
  const tips = React.useMemo(() => generateToolTips(tool), [tool])
  const [openFaq, setOpenFaq] = React.useState<number | null>(0)

  const cat = CATEGORY_META[tool.category]

  return (
    <div className="mt-12 space-y-8">
      {/* Intro (Priority 7 — longer, more specific) */}
      <section>
        <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground">
          About the {tool.name}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {intro}
        </p>
      </section>

      {/* How to use */}
      <section>
        <h2 className="mb-3 text-xl font-bold tracking-tight text-foreground">
          How to use
        </h2>
        <ol className="space-y-3">
          {howTo.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground pt-0.5">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Common use cases (Priority 7) */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
          <Sparkles className="size-5 text-primary" />
          Common use cases
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {useCases.map((u, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-lg border border-border/60 bg-card p-3 text-sm leading-relaxed text-muted-foreground"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary/80" />
              <span>{u}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tips (Priority 7) */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
          <Wrench className="size-5 text-primary" />
          Tips
        </h2>
        <ul className="space-y-2">
          {tips.map((t, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
            >
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70"
                aria-hidden="true"
              />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="mb-3 text-xl font-bold tracking-tight text-foreground">
          Frequently asked questions
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-border/70 bg-card"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-muted/30"
                aria-expanded={openFaq === i}
              >
                <span className="text-sm font-medium text-foreground">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === i ? (
                <div className="px-4 pb-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* Internal linking footer (Priority 8) */}
      <section className="rounded-xl border border-border/60 bg-muted/20 p-4">
        <h2 className="mb-2 text-sm font-bold tracking-tight text-foreground">
          Explore more {cat.label.toLowerCase()} tools
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Browse the full collection of {cat.label.toLowerCase()} tools on the hub,
          or jump back to all categories.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href={`/#cat=${tool.category}`}
            className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-3 py-1 font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            All {cat.label} tools
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-3 py-1 font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            All categories
          </Link>
        </div>
      </section>
    </div>
  )
}
