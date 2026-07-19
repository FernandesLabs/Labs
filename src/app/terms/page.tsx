import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'
import { LegalPage } from '@/components/hub/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service — Fernandes Labs',
  description:
    'Terms governing the use of Fernandes Labs free online tools.',
  robots: { index: true, follow: true },
}

const SECTIONS = [
  { id: 'acceptance', label: 'Acceptance' },
  { id: 'service', label: 'Description of service' },
  { id: 'warranty', label: 'No warranty' },
  { id: 'liability', label: 'Limitation of liability' },
  { id: 'use', label: 'Acceptable use' },
  { id: 'ip', label: 'Intellectual property' },
  { id: 'ads', label: 'Advertising & affiliates' },
  { id: 'third-party', label: 'Third-party links' },
  { id: 'changes', label: 'Changes to terms' },
  { id: 'contact', label: 'Contact' },
]

export default function TermsPage() {
  const domain = siteConfig.site.domain
  const email = siteConfig.site.contactEmail
  return (
    <LegalPage
      title="Terms of Service"
      subtitle={`Last updated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`}
      sections={SECTIONS}
    >
      <section id="acceptance" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">Acceptance</h2>
        <p className="mt-2">
          By accessing or using {domain} (the &quot;Service&quot;), you
          agree to be bound by these Terms of Service. If you do not agree,
          please do not use the Service.
        </p>
      </section>
      <section id="service" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">
          Description of Service
        </h2>
        <p className="mt-2">
          {domain} provides free, browser-based online tools for
          developers, designers, and marketers. All tools run client-side;
          we do not host, process, or store your input data on our servers.
        </p>
      </section>
      <section id="warranty" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">No Warranty</h2>
        <p className="mt-2">
          The Service is provided &quot;as is&quot; and &quot;as
          available&quot; without warranties of any kind, either express or
          implied. We do not guarantee that the tools will be accurate,
          reliable, error-free, or suitable for any particular purpose. You
          use the tools at your own risk.
        </p>
        <p className="mt-2">Specifically, we do not warrant that:</p>
        <ul className="ml-6 mt-1 list-disc space-y-1">
          <li>Financial calculations are suitable for professional advice.</li>
          <li>Generated passwords or security tokens are secure for all use cases.</li>
          <li>File conversions produce identical results to desktop software.</li>
          <li>Network lookups reflect real-time DNS or IP data.</li>
        </ul>
      </section>
      <section id="liability" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">
          Limitation of Liability
        </h2>
        <p className="mt-2">
          To the maximum extent permitted by law, {siteConfig.site.name}{' '}
          shall not be liable for any direct, indirect, incidental,
          consequential, or punitive damages arising from your use of (or
          inability to use) the Service. This includes, but is not limited
          to, data loss, business interruption, or financial loss.
        </p>
      </section>
      <section id="use" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">
          Acceptable Use
        </h2>
        <p className="mt-2">You agree not to:</p>
        <ul className="ml-6 mt-1 list-disc space-y-1">
          <li>Use the Service for any unlawful purpose.</li>
          <li>Attempt to disrupt, overload, or attack the Service.</li>
          <li>
            Use automated systems (bots, scrapers) to access the Service at
            a volume that degrades performance for other users.
          </li>
          <li>
            Misrepresent the Service&apos;s output as professional advice
            (financial, legal, medical, or security).
          </li>
        </ul>
      </section>
      <section id="ip" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">
          Intellectual Property
        </h2>
        <p className="mt-2">
          The Service&apos;s design, code, and branding are the property of{' '}
          {siteConfig.site.name} and are licensed under the FLSL v1.0
          license. The output you generate using the tools belongs to you.
        </p>
      </section>
      <section id="ads" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">
          Advertising &amp; Affiliate Links
        </h2>
        <p className="mt-2">
          The Service displays advertisements via Google AdSense and may
          include affiliate links. We may earn a commission when you click
          affiliate links and sign up for third-party services. Affiliate
          links are marked as such. We are not responsible for the products
          or services of third-party advertisers.
        </p>
      </section>
      <section id="third-party" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">
          Third-Party Links
        </h2>
        <p className="mt-2">
          The Service may link to third-party websites. We are not
          responsible for the content, privacy policies, or practices of
          third-party sites.
        </p>
      </section>
      <section id="changes" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">
          Changes to Terms
        </h2>
        <p className="mt-2">
          We may revise these Terms at any time. Continued use of the
          Service after changes constitutes acceptance of the new Terms.
        </p>
      </section>
      <section id="contact" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p className="mt-2">
          Questions about these Terms? Email us at{' '}
          <a
            href={`mailto:${email}`}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            {email}
          </a>
          .
        </p>
      </section>
    </LegalPage>
  )
}
