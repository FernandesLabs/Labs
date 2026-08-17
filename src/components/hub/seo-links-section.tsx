import Link from 'next/link'
import { ArrowRight, BookOpen, Wrench, Info } from 'lucide-react'
import { blogPosts } from '@/lib/blog/posts'

/**
 * SeoLinksSection — homepage internal-linking block (Phase 2 link equity).
 *
 * Renders crawlable, keyword-rich anchors from the homepage to:
 *   - the 10 highest-value tool pages (the 4 hand-written overrides first)
 *   - all 6 blog posts
 *   - the About page (E-E-A-T entity)
 *
 * Everything uses <Link> (renders a real <a href> in the HTML payload —
 * no client-side routing, no JavaScript needed for crawlers to follow).
 */
const TOP_TOOLS: { slug: string; anchor: string; blurb: string }[] = [
  {
    slug: 'ip-lookup',
    anchor: 'IP Address Lookup',
    blurb: 'Find IP address location, ISP & ASN for any IPv4 or hostname.',
  },
  {
    slug: 'redirect-checker',
    anchor: 'Redirect Checker',
    blurb: 'Test 301 & 302 redirect chains step by step, exactly like Googlebot.',
  },
  {
    slug: 'canonical-url-checker',
    anchor: 'Canonical URL Checker',
    blurb: 'Check canonical URLs and build duplicate-free canonical tags.',
  },
  {
    slug: 'robots-txt-generator',
    anchor: 'Robots.txt Generator',
    blurb: 'Make a robots.txt online — block crawlers, declare your sitemap.',
  },
  {
    slug: 'json-formatter',
    anchor: 'JSON Formatter',
    blurb: 'Format, validate and minify JSON with inline error reporting.',
  },
  {
    slug: 'email-signature-generator',
    anchor: 'Email Signature Generator',
    blurb: 'Create professional HTML email signatures for Gmail & Outlook.',
  },
  {
    slug: 'css-gradient-generator',
    anchor: 'CSS Gradient Generator',
    blurb: 'Generate linear, radial and conic CSS gradients with live preview.',
  },
  {
    slug: 'font-accessibility-checker',
    anchor: 'Font Accessibility Checker',
    blurb: 'Check font accessibility — size, contrast and WCAG legibility.',
  },
  {
    slug: 'file-signature-inspector',
    anchor: 'File Signature Inspector',
    blurb: 'Identify real file types from magic bytes, not extensions.',
  },
  {
    slug: 'mime-detector',
    anchor: 'MIME Type Detector',
    blurb: 'Detect the MIME type of any file from its content.',
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
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
