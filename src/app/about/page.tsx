import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'
import { socialMetadata } from '@/lib/seo-metadata'
import { LegalPage } from '@/components/hub/legal-page'
import { serverProxiedToolList } from '@/lib/privacy'

const TITLE = 'About Fernandes Labs — The Team Behind the Free Tools Network'
const DESCRIPTION =
  'Meet the team behind Fernandes Labs: developers and technical SEO specialists building fast, private, free online tools for developers, designers and marketers.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: true, follow: true },
  alternates: {
    canonical: `https://${siteConfig.site.domain}/about`,
  },
  ...socialMetadata('/about', TITLE, DESCRIPTION),
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
        // The page referenced this @id but never defined it, leaving a
        // dangling node. Define the Organization here so the AboutPage's
        // mainEntity/about references resolve within the same graph.
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: siteConfig.site.name,
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/fl-logo-512.png`,
          width: 512,
          height: 512,
        },
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
            with most processing staying in your browser, and without paying a
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
            and text tools.
          </p>
          <p className="mt-2">
            Almost every tool runs entirely in your browser using modern Web
            APIs, which is what makes them safe for sensitive data such as API
            keys, passwords, and private documents. The six network tools are
            the deliberate exception:{' '}
            <strong className="font-medium text-foreground">
              {serverProxiedToolList()}
            </strong>{' '}
            have to send the address or URL you enter to our server, because
            browsers block those cross-origin requests outright. Those lookups
            are proxied without being stored or logged, and the{' '}
            <Link href="/privacy" className="underline underline-offset-2">
              privacy policy
            </Link>{' '}
            spells this out in full.
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
            tools. The project is funded by clearly labelled ads and nothing else —
            there are no affiliate links and no paid placements, and we never
            sell data. We publish how the site works in our open
            documentation and review every piece of feedback we receive — bug
            reports, tool ideas, and corrections all shape the roadmap.
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
