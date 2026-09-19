import Link from 'next/link'
import { ArrowRight, BookOpen, Wrench, Info } from 'lucide-react'
import { blogPosts } from '@/lib/blog/posts'

/**
 * SeoLinksSection — homepage internal-linking block (Phase 2 link equity).
 *
 * Renders crawlable, keyword-rich anchors from the homepage to:
 *   - the 14 highest-value tool pages (Search-Console-validated first)
 *   - all blog posts
 *   - the About page (E-E-A-T entity)
 *
 * Everything uses <Link> (renders a real <a href> in the HTML payload —
 * no client-side routing, no JavaScript needed for crawlers to follow).
 */
const TOP_TOOLS: { slug: string; anchor: string; blurb: string }[] = [
  {
    slug: 'ip-lookup',
    anchor: 'IP Address Lookup — Find IP Location & ISP',
    blurb: 'Look up any IPv4, IPv6 or hostname: location, ISP, ASN and timezone.',
  },
  {
    slug: 'redirect-checker',
    anchor: 'Redirect Checker — Test 301 & 302 Chains',
    blurb: 'Follow the full redirect chain of any URL, step by step, with status codes.',
  },
  {
    slug: 'canonical-url-checker',
    anchor: 'Canonical URL Checker — Fix Duplicate URLs',
    blurb: 'Normalize URLs, strip tracking params and build clean canonical tags.',
  },
  {
    slug: 'robots-txt-generator',
    anchor: 'Robots.txt Generator for Google',
    blurb: 'Generate a valid robots.txt online — allow/block crawlers, declare your sitemap.',
  },
  {
    slug: 'json-formatter',
    anchor: 'JSON Formatter & Validator',
    blurb: 'Format, validate and minify JSON with inline error reporting.',
  },
  {
    slug: 'email-signature-generator',
    anchor: 'Email Signature Generator (Free HTML)',
    blurb: 'Create professional HTML signatures for Gmail, Outlook and more.',
  },
  {
    slug: 'css-gradient-generator',
    anchor: 'CSS Gradient Generator with Live Preview',
    blurb: 'Generate linear, radial and conic gradients — copy the CSS in one click.',
  },
  {
    slug: 'font-accessibility-checker',
    anchor: 'Font Accessibility Checker (WCAG)',
    blurb: 'Check font size, weight and legibility against WCAG accessibility guidelines.',
  },
  {
    slug: 'file-signature-inspector',
    anchor: 'File Signature Inspector — Magic Bytes',
    blurb: 'Identify the real type of any file from its binary signature, not its extension.',
  },
  {
    slug: 'mime-detector',
    anchor: 'MIME Type Detector — Content-Type Lookup',
    blurb: 'Detect the true MIME type of any file from its content — offline and private.',
  },
  {
    slug: 'qr-generator',
    anchor: 'QR Code Generator — High-Res PNG & SVG',
    blurb: 'Create QR codes that never expire — no sign-up, no watermark, print-ready.',
  },
  {
    slug: 'password-generator',
    anchor: 'Password Generator — Secure & Random',
    blurb: 'Generate strong passwords with the Web Crypto API — never leaves your device.',
  },
  {
    slug: 'invoice-generator',
    anchor: 'Invoice Generator — Free Online Invoices',
    blurb: 'Build professional invoices with tax and discount lines, ready to send.',
  },
  {
    slug: 'unicode-inspector',
    anchor: 'Unicode Inspector — Code Point Lookup',
    blurb: 'Inspect any character: code point, UTF-8 bytes, escapes and name.',
  },
]

export function SeoLinksSection() {
  return (
    <section
      aria-label="Popular tools and blog guides"
      className="border-t border-border/60 bg-muted/20"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top tools */}
        <div className="mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-primary" aria-hidden />
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
            <Wrench className="size-5 text-primary" />
            Top tools
          </h2>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          The most popular free tools in the network — each one runs entirely
          in your browser with no sign-up.
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TOP_TOOLS.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tools/${t.slug}`}
                className="group flex h-full flex-col rounded-xl border border-border/70 bg-card p-4 shadow-sm transition hover:border-primary/60 hover:shadow"
              >
                <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                  {t.anchor}
                </span>
                <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {t.blurb}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Blog */}
        <div className="mb-3 mt-10 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-primary" aria-hidden />
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
            <BookOpen className="size-5 text-primary" />
            From the blog
          </h2>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          Hand-written guides on the topics our tools cover — redirects,
          canonical tags, robots.txt, IP lookups and more.
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {blogPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col rounded-xl border border-border/70 bg-card p-4 shadow-sm transition hover:border-primary/60 hover:shadow"
              >
                <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                  {post.title}
                </span>
                <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {post.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Entity links */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 border-t border-border/60 pt-6 text-sm">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-4 py-2 font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            <Info className="size-4" />
            About Fernandes Labs
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-4 py-2 font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            All blog guides
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
