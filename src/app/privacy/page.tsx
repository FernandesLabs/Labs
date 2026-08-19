import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'
import { LegalPage } from '@/components/hub/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy — Fernandes Labs',
  description:
    'How Fernandes Labs handles your data. All tools run client-side; we do not collect or store your input.',
  robots: { index: true, follow: true },
}

const SECTIONS = [
  { id: 'summary', label: 'Summary' },
  { id: 'tool-data', label: 'Tool data' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'advertising', label: 'Advertising' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'consent', label: 'Consent' },
  { id: 'donations', label: 'Crypto donations' },
  { id: 'children', label: "Children's privacy" },
  { id: 'rights', label: 'Your rights' },
  { id: 'changes', label: 'Changes' },
  { id: 'contact', label: 'Contact' },
]

export default function PrivacyPage() {
  const domain = siteConfig.site.domain
  const email = siteConfig.site.contactEmail
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle={`Last updated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`}
      sections={SECTIONS}
    >
      <section id="summary" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">Summary</h2>
        <p className="mt-2">
          {domain} provides free online tools that run entirely in your
          browser. We do not collect, store, or transmit the data you enter
          into our tools. This page explains the limited data we do collect
          (analytics and ad data) and how it is used.
        </p>
      </section>
      <section id="tool-data" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">
          Tool Data (Not Collected)
        </h2>
        <p className="mt-2">
          All tools on {domain} process data client-side in your browser.
          The text, files, passwords, URLs, or other inputs you enter are
          <strong> never sent to our servers</strong>. We cannot see, access,
          or recover your data. This makes our tools safe for sensitive
          inputs like passwords, private keys, and personal documents.
        </p>
      </section>
      <section id="analytics" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">Analytics Data</h2>
        <p className="mt-2">
          We use Google Analytics to understand how visitors find and use
          our site. This collects anonymized data including: pages visited,
          time on page, approximate geographic location (country/city
          level), device type, and referral source. We use this data to
          improve the site and decide which tools to develop next. You can
          opt out by using an ad blocker or browser privacy extension.
        </p>
      </section>
      <section id="advertising" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">Advertising Data</h2>
        <p className="mt-2">
          We display ads via Google AdSense. Google and its partners may use
          cookies to serve ads based on your prior visits to our website or
          other websites. You can opt out of personalized advertising by
          visiting{' '}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            Google Ad Settings
          </a>
          . Third-party vendors and ad networks may also serve ads on our
          site; their privacy practices are governed by their respective
          policies.
        </p>
        <p className="mt-2">
          To understand how Google uses data when you visit sites or apps that
          partner with it, please read{' '}
          <a
            href="https://www.google.com/policies/privacy/partners/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            How Google uses data when you use our partners&apos; sites or apps
          </a>
          .
        </p>
      </section>
      <section id="cookies" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">Cookies</h2>
        <p className="mt-2">We use a small number of cookies and browser storage:</p>
        <ul className="mt-2 ml-6 list-disc space-y-1">
          <li>
            <strong>Theme preference</strong> (localStorage): remembers
            your light/dark mode choice.
          </li>
          <li>
            <strong>Favorites &amp; history</strong> (localStorage): stores
            your favorited and recently-used tools.
          </li>
          <li>
            <strong>Feedback votes</strong> (localStorage): remembers your
            tool feedback.
          </li>
          <li>
            <strong>Analytics cookies</strong>: set by Google Analytics.
          </li>
          <li>
            <strong>Advertising cookies</strong>: set by Google AdSense.
          </li>
        </ul>
        <p className="mt-2">
          None of this data is sent to our servers — all localStorage data
          stays in your browser and can be cleared at any time via your
          browser settings.
        </p>
      </section>
      <section id="consent" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">
          Consent &amp; Choices
        </h2>
        <p className="mt-2">
          When you first visit our site, a consent banner asks whether you
          accept non-essential cookies (personalized advertising and
          analytics). We implement Google Consent Mode v2: until you choose
          &quot;Accept all&quot;, AdSense and analytics run in a
          non-personalized, cookie-free mode, and the AdSense script is not
          loaded at all. Your choice is stored locally on your device and can
          be changed at any time by clearing your browser storage for this
          site.
        </p>
        <p className="mt-2">
          Choosing &quot;Reject&quot; does not affect your ability to use any
          of our tools — every tool works fully without cookies.
        </p>
      </section>
      <section id="donations" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">Crypto Donations</h2>
        <p className="mt-2">
          If you send a crypto donation to one of our wallet addresses, the
          transaction is public on the blockchain. We do not collect
          personal information alongside donations.
        </p>
      </section>
      <section id="children" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">
          Children&apos;s Privacy
        </h2>
        <p className="mt-2">
          Our services are not directed to children under 13. We do not
          knowingly collect personal information from children.
        </p>
      </section>
      <section id="rights" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">Your Rights</h2>
        <p className="mt-2">
          Depending on your location (e.g., GDPR in the EU, CCPA in
          California), you may have rights to access, delete, or export
          your personal data. Since we do not collect personal data beyond
          anonymized analytics, most of these rights are automatically
          satisfied. To opt out of analytics, use a privacy-focused browser
          extension or contact us.
        </p>
      </section>
      <section id="changes" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">
          Changes to This Policy
        </h2>
        <p className="mt-2">
          We may update this Privacy Policy from time to time. Changes will
          be posted on this page with an updated date.
        </p>
      </section>
      <section id="contact" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p className="mt-2">
          Questions about this policy? Email us at{' '}
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
