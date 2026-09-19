// src/app/contact/page.tsx
import type { Metadata } from 'next'
import { Mail, Github, Bug, Lightbulb, Handshake, Clock } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { LegalPage } from '@/components/hub/legal-page'

export const metadata: Metadata = {
  title: 'Contact Fernandes Labs — Support, Feedback & Bug Reports',
  description:
    'Get in touch with the Fernandes Labs team: tool support, bug reports, feature requests, privacy questions and partnership inquiries. We answer every email.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: `https://${siteConfig.site.domain}/contact`,
  },
  openGraph: {
    title: 'Contact Fernandes Labs',
    description:
      'Support, bug reports, feature requests and partnership inquiries — we answer every email.',
    url: `https://${siteConfig.site.domain}/contact`,
    siteName: siteConfig.site.name,
    type: 'website',
  },
}

const SECTIONS = [
  { id: 'email', label: 'Email us' },
  { id: 'github', label: 'GitHub' },
  { id: 'topics', label: 'What to contact us about' },
  { id: 'response', label: 'Response time' },
]

/**
 * Contact page — a dedicated, crawlable contact route.
 *
 * WHY this matters: AdSense's "Low value content" review explicitly checks
 * whether a site is a real, operated property. A dedicated contact page
 * (linked from the footer, listed in the sitemap) is one of the standard
 * trust signals reviewers look for — alongside About, Privacy and Terms,
 * which the site already had.
 */
export default function ContactPage() {
  const domain = siteConfig.site.domain
  const email = siteConfig.site.contactEmail
  const github = siteConfig.social.github
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `https://${domain}/contact#contactpage`,
        url: `https://${domain}/contact`,
        name: `Contact ${siteConfig.site.name}`,
        mainEntity: { '@id': `https://${domain}/#organization` },
        about: { '@id': `https://${domain}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${domain}/` },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: `https://${domain}/contact` },
        ],
      },
    ],
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LegalPage
        title="Contact Fernandes Labs"
        subtitle="Support, feedback and business inquiries — we read everything."
        sections={SECTIONS}
      >
        <section id="email" className="scroll-mt-20">
          <h2 className="text-xl font-semibold text-foreground">Email us</h2>
          <p className="mt-2">
            The fastest way to reach us is by email. One address, one team —
            no ticket systems, no bots:
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/60 hover:text-primary"
          >
            <Mail className="size-4 text-primary" aria-hidden />
            {email}
          </a>
        </section>

        <section id="github" className="scroll-mt-20">
          <h2 className="text-xl font-semibold text-foreground">GitHub</h2>
          <p className="mt-2">
            The entire site is developed in the open. Bug reports and feature
            requests can also be filed directly on the public repository —
            they are public, trackable, and often fixed faster:
          </p>
          <a
            href={`${github}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/60 hover:text-primary"
          >
            <Github className="size-4 text-primary" aria-hidden />
            FernandesLabs/Labs — open an issue
          </a>
        </section>

        <section id="topics" className="scroll-mt-20">
          <h2 className="text-xl font-semibold text-foreground">
            What to contact us about
          </h2>
          <ul className="mt-3 space-y-3">
            <li className="flex gap-3">
              <Bug className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>
                <strong className="text-foreground">Broken tools or bugs</strong>{' '}
                <span className="text-muted-foreground">
                  — tell us the tool name, what you did, and what happened.
                  A screenshot helps.
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>
                <strong className="text-foreground">Feature requests</strong>{' '}
                <span className="text-muted-foreground">
                  — missing an option in a tool, or want a tool we don&apos;t
                  have yet? Suggest it; the roadmap is driven by user demand.
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>
                <strong className="text-foreground">Privacy questions</strong>{' '}
                <span className="text-muted-foreground">
                  — questions about data handling, consent, or GDPR/CCPA
                  requests. See the{' '}
                  <a href="/privacy" className="text-primary underline underline-offset-2">
                    privacy policy
                  </a>{' '}
                  for how little we collect.
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <Handshake className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>
                <strong className="text-foreground">Business &amp; partnerships</strong>{' '}
                <span className="text-muted-foreground">
                  — advertising questions, sponsorships, or tool-embedding
                  partnerships.
                </span>
              </span>
            </li>
          </ul>
        </section>

        <section id="response" className="scroll-mt-20">
          <h2 className="text-xl font-semibold text-foreground">Response time</h2>
          <p className="mt-2 flex items-start gap-2">
            <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span>
              We are a small team, but we answer <strong>every</strong> email
              — usually within 2–3 business days. If your message is about a
              bug, include the browser and operating system you used so we
              can reproduce it faster.
            </span>
          </p>
        </section>
      </LegalPage>
    </>
  )
}
