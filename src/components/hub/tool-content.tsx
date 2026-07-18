'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import type { Tool } from '@/lib/tools/types'
import { CATEGORY_META } from '@/lib/tools/types'

/**
 * Generates SEO content for a tool page: an intro paragraph, a "how to use"
 * section, and an FAQ accordion. This text content is what Google needs to
 * rank the page — tools without body text rarely rank well.
 *
 * Content is generated from the tool's metadata (name, description, category,
 * keywords) using templates, so every tool gets unique, relevant content
 * without manual writing.
 */

interface FaqItem {
  q: string
  a: string
}

function generateIntro(tool: Tool): string {
  const cat = CATEGORY_META[tool.category]
  const kws = tool.keywords?.slice(0, 3).join(', ') || tool.name.toLowerCase()
  return `The ${tool.name} is a free online ${cat.label.toLowerCase()} tool that ${tool.description.toLowerCase().replace(/\.$/, '')}. It runs entirely in your browser — no data is sent to any server, no sign-up is required, and it works offline once loaded. Whether you need to ${kws}, or related tasks, this tool provides a fast, privacy-first solution.`
}

function generateHowTo(tool: Tool): string[] {
  const cat = tool.category
  const steps: string[] = []

  // Generic steps that apply to most tools
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

function generateFaq(tool: Tool): FaqItem[] {
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

  // Add tool-specific FAQs based on category
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

export function ToolContent({ tool }: { tool: Tool }) {
  const intro = React.useMemo(() => generateIntro(tool), [tool])
  const howTo = React.useMemo(() => generateHowTo(tool), [tool])
  const faqs = React.useMemo(() => generateFaq(tool), [tool])
  const [openFaq, setOpenFaq] = React.useState<number | null>(0)

  return (
    <div className="mt-12 space-y-8">
      {/* Intro */}
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
    </div>
  )
}
