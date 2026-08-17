import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'
import { LegalPage } from '@/components/hub/legal-page'

export const metadata: Metadata = {
  title: 'About Fernandes Labs — The Team Behind the Free Tools Network',
  description:
    'Meet the team behind Fernandes Labs: developers and technical SEO specialists building fast, private, free online tools — 132+ utilities for developers, designers, and marketers.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: `https://${siteConfig.site.domain}/about`,
  },
}

const SECTIONS = [
  { id: 'who-we-are', label: 'Who we are' },
  { id: 'mission', label: 'Our mission' },
  { id: 'what-we-build', label: 'What we build' },
  { id: 'how-we-work', label: 'How we work' },
  { id: 'contact', label: 'Contact' },
]

/**
 * About page — E-E-A-T entity page for Fernandes Labs.
 *
 * This page exists so Google can answer "who runs this site?" (Experience,
 * Expertise, Authoritativeness, Trust). It is linked from the homepage,
 * the footer, and the Organization/Person JSON-LD (`mainEntityOfPage`,
 * `sameAs`) on the homepage.
 */
export default function AboutPage() {
  const baseUrl = `https://${siteConfig.site.domain}`
  const email = siteConfig.site.contactEmail
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${baseUrl}/about#aboutpage`,
        url: `${baseUrl}/about`,
        name: `About ${siteConfig.site.name}`,
        mainEntity: { '@id': `${baseUrl}/#organization` },
        about: { '@id': `${baseUrl}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About',
            item: `${baseUrl}/about`,
          },
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
        title="About Fernandes Labs"
        subtitle="The team behind the free online tools network."
        sections={SECTIONS}
      >
        <section id="who-we-are" className="scroll-mt-20">
          <h2 className="text-xl font-semibold text-foreground">
            Who we are
          </h2>
          <p className="mt-2">
            Fernandes Labs is a small team of developers, designers, and
            technical SEO specialists who build fast, reliable, free online
            tools. We started this project with a simple observation: most
            developer utilities on the web are slow, loaded with trackers, or
            hidden behind sign-up walls. We believe a free tool should be
            instant to load, private by default, and genuinely useful — so we
            built our own network of 132+ tools and the guides that go with
            them.
          </p>
        </section>
        <section id="mission" className="scroll-mt-20">
          <h2 className="text-xl font-semibold text-foreground">
            Our mission
          </h2>
          <p className="mt-2">
            Our mission is to make technical SEO and developer tooling
            accessible to everyone. Whether you are a student learning how DNS
            works, a marketer auditing a redirect chain, or a senior engineer
            debugging a production incident, you should be able to open a tool
            and get the answer in seconds — without creating an account,
            without watching your data leave the browser, and without paying a
            subscription. If a tool needs to be explained, we write the guide
            ourselves instead of pointing you elsewhere.
          </p>
        </section>
        <section id="what-we-build" className="scroll-mt-20">
          <h2 className="text-xl font-semibold text-foreground">
            What we build
          </h2>
          <p className="mt-2">
            The network spans eight categories: developer utilities like the{' '}
            JSON Formatter and Regex Tester, SEO tools like the Redirect
            Checker, Canonical URL Checker, and Robots.txt Generator, network
            diagnostics like IP Lookup and DNS Lookup, plus media, finance,
            and text tools. Every tool runs entirely in your browser using
            modern Web APIs — nothing you type or upload is sent to our
            servers, stored, or logged. That is why the tools are safe for
            sensitive data such as API keys, passwords, and private
            documents.
          </p>
        </section>
        <section id="how-we-work" className="scroll-mt-20">
          <h2 className="text-xl font-semibold text-foreground">
            How we work
          </h2>
          <p className="mt-2">
            Every tool ships with hand-written documentation, real
            input-to-output examples, and answers we verify against the
            current standards — RFCs for network protocols, WCAG for
            accessibility tools, and Google&apos;s own documentation for SEO
            tools. The project is supported by clearly labeled ads and
            affiliate links, never by selling data. We publish how the site
            works in our open documentation and review every piece of
            feedback we receive — bug reports, tool ideas, and corrections
            all shape the roadmap.
          </p>
        </section>
        <section id="contact" className="scroll-mt-20">
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Questions, bug reports, or an idea for a new tool? Email us at{' '}
            <a
              href={`mailto:${email}`}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {email}
            </a>{' '}
            or open an issue in the{' '}
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Fernandes Labs GitHub repository
            </a>{' '}
            — we read everything.
          </p>
        </section>
      </LegalPage>
    </>
  )
}
