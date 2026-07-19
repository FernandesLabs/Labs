'use client'
import * as React from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  Sparkles,
  Wrench,
  CheckCircle2,
  Code2,
  Lightbulb,
  ArrowRight,
} from 'lucide-react'
import type { Tool } from '@/lib/tools/types'
import { CATEGORY_META } from '@/lib/tools/types'
import {
  generateToolFaq,
  generateToolHowTo,
  generateToolIntro,
  generateToolTips,
  generateToolUseCases,
} from '@/app/tools/[slug]/tool-seo'
import { getToolContentOverride } from '@/app/tools/[slug]/tool-content-overrides'
/**
 * Generates SEO content for a tool page: an intro paragraph, concrete
 * input→output examples, "how to use" steps, "common use cases", "tips",
 * and an FAQ accordion.
 *
 * Content priority:
 *   1. Hand-written override (tool-content-overrides.ts) — for the top
 *      tools with the highest search intent. Unique, specific, deep.
 *   2. Template generator (tool-seo.ts) — for the other 129 tools.
 *
 * The same content is emitted as FAQPage + HowTo JSON-LD by the server
 * component (`page.tsx`), so the visible text and structured data match.
 */
// Re-export so ToolJsonLd (and other consumers) can build FAQPage schema
// from the same source as the visible accordion.
export const generateFaq = (tool: Tool) =>
  getToolContentOverride(tool.slug)?.faqs ?? generateToolFaq(tool)
export function ToolContent({ tool }: { tool: Tool }) {
  // Check for a hand-written override first; fall back to templates.
  const override = React.useMemo(() => getToolContentOverride(tool.slug), [tool.slug])
  const intro = React.useMemo(
    () => override?.intro ?? generateToolIntro(tool),
    [override, tool]
  )
  const howTo = React.useMemo(
    () => override?.howTo ?? generateToolHowTo(tool),
    [override, tool]
  )
  const faqs = React.useMemo(
    () => override?.faqs ?? generateToolFaq(tool),
    [override, tool]
  )
  const useCases = React.useMemo(
    () => override?.useCases ?? generateToolUseCases(tool),
    [override, tool]
  )
  const tips = React.useMemo(
    () => override?.tips ?? generateToolTips(tool),
    [override, tool]
  )
  const examples = override?.examples ?? []
  const [openFaq, setOpenFaq] = React.useState<number | null>(0)
  const cat = CATEGORY_META[tool.category]
  return (
    <div className="mt-12 space-y-10">
      {/* Intro */}
      <section id="about" className="scroll-mt-20">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-primary" aria-hidden />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            About the {tool.name}
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {intro}
        </p>
        {override ? (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3" />
            Hand-written guide
          </div>
        ) : null}
      </section>
      {/* Concrete examples (only for tools with overrides) */}
      {examples.length > 0 ? (
        <section id="examples" className="scroll-mt-20">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-primary" aria-hidden />
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
              <Code2 className="size-5 text-primary" />
              Examples
            </h2>
          </div>
          <div className="space-y-3">
            {examples.map((ex, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="border-b border-border/60 bg-muted/30 p-3 md:border-b-0 md:border-r">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <ArrowRight className="size-3" />
                      Input
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground/80">
                      {ex.input}
                    </pre>
                  </div>
                  <div className="p-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <CheckCircle2 className="size-3 text-emerald-500" />
                      Output
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground/80">
                      {ex.output}
                    </pre>
                  </div>
                </div>
                {ex.note ? (
                  <div className="border-t border-border/60 bg-amber-500/5 px-3 py-2 text-[11px] text-muted-foreground">
                    <span className="font-medium text-amber-600 dark:text-amber-400">Note:</span>{' '}
                    {ex.note}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {/* How to use */}
      <section id="how-to" className="scroll-mt-20">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-primary" aria-hidden />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            How to use
          </h2>
        </div>
        <ol className="space-y-3">
          {howTo.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground pt-0.5">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>
      {/* Common use cases */}
      <section id="use-cases" className="scroll-mt-20">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-primary" aria-hidden />
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
            <Sparkles className="size-5 text-primary" />
            Common use cases
          </h2>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {useCases.map((u, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-lg border border-border/60 bg-card p-3 text-sm leading-relaxed text-muted-foreground transition hover:border-border hover:bg-muted/20"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary/80" />
              <span>{u}</span>
            </li>
          ))}
        </ul>
      </section>
      {/* Tips */}
      <section id="tips" className="scroll-mt-20">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-primary" aria-hidden />
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
            <Lightbulb className="size-5 text-amber-500" />
            Tips
          </h2>
        </div>
        <ul className="space-y-2">
          {tips.map((t, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm leading-relaxed text-muted-foreground"
            >
              <Wrench className="mt-0.5 size-3.5 shrink-0 text-primary/60" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>
      {/* FAQ */}
      <section id="faq" className="scroll-mt-20">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-primary" aria-hidden />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Frequently asked questions
          </h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const open = openFaq === i
            return (
              <div
                key={i}
                className={`overflow-hidden rounded-lg border bg-card transition-colors ${
                  open ? 'border-primary/40' : 'border-border/70'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-muted/30"
                  aria-expanded={open}
                >
                  <span className="text-sm font-medium text-foreground">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {open ? (
                  <div className="border-t border-border/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </section>
      {/* Internal linking footer */}
      <section className="rounded-xl border border-border/60 bg-gradient-to-br from-muted/40 to-muted/10 p-4 sm:p-5">
        <h2 className="mb-1 text-sm font-bold tracking-tight text-foreground">
          Explore more {cat.label.toLowerCase()} tools
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Browse the full collection of {cat.label.toLowerCase()} tools on the
          hub, or jump back to all categories.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href={`/category/${tool.category}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 font-medium text-foreground transition hover:border-primary hover:text-primary hover:shadow-sm"
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            All {cat.label} tools
            <ArrowRight className="size-3" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 font-medium text-foreground transition hover:border-primary hover:text-primary hover:shadow-sm"
          >
            All categories
          </Link>
        </div>
      </section>
    </div>
  )
}