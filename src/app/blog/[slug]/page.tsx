// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
// Explicit React import: this file uses `React.ReactNode` / `React.isValidElement`
// in the TOC helpers below, and with the automatic JSX runtime `React` is not
// in scope unless imported.
import * as React from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { siteConfig } from '@/lib/site-config'
import { blogPosts, getBlogPost } from '@/lib/blog/posts'
import { toolMetadata } from '@/lib/tools/tool-metadata'
import { AdUnit } from '@/components/ads/ad-unit'
import { BlogPostClient } from './blog-post-client'
import { BlogToc } from '@/components/hub/blog-toc'
import { MobileSidebar } from '@/components/hub/mobile-sidebar'
import {
  extractToc,
  getAdjacentPosts,
  getRelatedPosts,
  readingTimeMinutes,
  slugifyHeading,
  blogCategoryColor,
  splitBodyAtMiddleHeading,
  toPalettePosts,
  isFreshPost,
} from '@/lib/blog/blog-utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  const url = `https://${siteConfig.site.domain}/blog/${post.slug}`
  const ogImage = `/api/og?post=${encodeURIComponent(post.slug)}`
  return {
    // Absolute title — appending " | Fernandes Labs Blog" pushed every guide
    // past the ~60-character SERP budget (74–92 chars), so Google truncated
    // the part that actually matched the query.
    title: { absolute: post.title },
    description: post.description,
    alternates: { canonical: url },
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: siteConfig.site.name,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      images: [
        {
          // Per-post card: the guide's own title + category color (not the
          // first related tool's card) — social shares preview the article.
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()
  const url = `${siteConfig.site.url}/blog/${post.slug}`
  // An Article that documents the output of one of our own tools should say
  // which one, so the tool page and the post reinforce each other instead of
  // competing. Search Console showed cannibalisation on the IP-lookup cluster
  // (tool: 4,440 impressions / post: 742, both on the same head term).
  const toolRefs = post.relatedTools
    .map((slug) => toolMetadata.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
  const relatedTools = post.relatedTools
    .map((s) => toolMetadata.find((t) => t.slug === s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .slice(0, 6)
  const tocItems = extractToc(post.body)
  const readingMinutes = readingTimeMinutes(post.body)
  const relatedPosts = getRelatedPosts(post, blogPosts, 3)
  // Chronological neighbors for the prev/next footer navigation.
  const { newer, older } = getAdjacentPosts(post, blogPosts)
  // E-E-A-T: attribute the article to a real person when NEXT_PUBLIC_FOUNDER_NAME
  // is configured; otherwise fall back to the team identity (still linked to
  // the About page from the byline). The JSON-LD author mirrors the visible
  // byline — Google checks entity consistency between markup and page.
  const authorName = siteConfig.founder.name ?? 'The Fernandes Labs Team'
  const authorRole = siteConfig.founder.name
    ? siteConfig.founder.jobTitle
    : 'Editors & Developers'
  const jsonLdAuthor = siteConfig.founder.name
    ? {
        '@type': 'Person',
        // `#person` must match the @id on the homepage's Person node. Without
        // it, Google sees this byline author and the homepage's founder as two
        // unrelated people instead of one entity.
        '@id': `${siteConfig.site.url}/#person`,
        name: siteConfig.founder.name,
        jobTitle: siteConfig.founder.jobTitle,
        ...(siteConfig.founder.profileUrl
          ? { url: siteConfig.founder.profileUrl }
          : {}),
        // `sameAs` ties the Person to verifiable profiles — the strongest
        // single E-E-A-T signal. Falls back to profileUrl + GitHub.
        sameAs: (
          siteConfig.founder.sameAs.length > 0
            ? siteConfig.founder.sameAs
            : [siteConfig.founder.profileUrl, siteConfig.social.github]
        ).filter(Boolean) as string[],
        worksFor: {
          '@type': 'Organization',
          '@id': `${siteConfig.site.url}/#organization`,
          name: siteConfig.site.name,
          url: siteConfig.site.url,
        },
      }
    : {
        // The fallback byline is the editorial team, not the corporate
        // publisher. Giving it the same @id as the publisher made Google merge
        // two distinct entities (and lose the author/publisher distinction).
        '@type': 'Organization',
        '@id': `${siteConfig.site.url}/#team`,
        name: authorName,
        url: `${siteConfig.site.url}/about`,
        description: 'The editors and developers who write and review Fernandes Labs guides.',
      }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.description,
        // Google's Article guidance expects an image; without one the
        // article is ineligible for several rich treatments. Always emit the
        // absolute URL of the per-post OG card.
        image: [
          `${siteConfig.site.url}/api/og?post=${encodeURIComponent(post.slug)}`,
        ],
        datePublished: post.date,
        // `dateModified` was hardcoded to `datePublished`, so Google had no
        // way to tell updated posts from untouched ones. Posts now carry a
        // real `updated` date (post.updated ?? post.date).
        dateModified: post.updated ?? post.date,
        inLanguage: 'en',
        mainEntityOfPage: url,
        author: jsonLdAuthor,
        publisher: {
          '@type': 'Organization',
          '@id': `${siteConfig.site.url}/#organization`,
          name: siteConfig.site.name,
          url: siteConfig.site.url,
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.site.url}/fl-logo-512.png`,
            width: 512,
            height: 512,
          },
        },
        // Tie the article to the tools it documents.
        ...(toolRefs.length > 0
          ? {
              about: toolRefs.map((t) => ({
                '@type': 'SoftwareApplication',
                name: t.name,
                url: `${siteConfig.site.url}/tools/${t.slug}`,
              })),
            }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.site.url },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.site.url}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  }

  // Mid-content ad split — at the `## ` heading closest to the middle
  // (fence-aware, only for long posts; null for short ones → single block).
  const bodyParts = splitBodyAtMiddleHeading(post.body)

  // Shared renderer config — both halves must produce identical markup so the
  // h2 anchor ids and TOC scroll-spy keep working across the split.
  //
  // Typed as `Components` so each renderer gets the correct contextual props.
  // Without the annotation every callback infers `{ children: any }` with
  // `children` REQUIRED, which fails to satisfy ReactMarkdown's expected
  // types (HTML props all make children optional).
  const markdownComponents: Components = {
    h2: ({ children }) => {
      // Anchor ids for the TOC scroll-spy — slugified exactly like
      // extractToc does on the raw markdown (see blog-utils).
      const id = slugifyHeading(childrenToText(children))
      return (
        <h2
          id={id}
          className="mb-3 mt-10 scroll-mt-24 text-2xl font-bold tracking-tight text-foreground"
        >
          {children}
        </h2>
      )
    },
    h3: ({ children }) => (
      <h3 className="mb-2 mt-8 text-xl font-bold tracking-tight text-foreground">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>
    ),
    // `href` is optional in React's anchor props, so destructuring it as a
    // required parameter fails the Components type. Type it explicitly and
    // fall back to '#' for anchor-only markdown links.
    a: ({ href, children }: React.ComponentProps<'a'>) => (
      <a
        href={href ?? '#'}
        className="font-medium text-primary underline decoration-primary/40 underline-offset-2 transition hover:decoration-primary"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 list-disc space-y-1.5 pl-6 text-muted-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-1.5 pl-6 text-muted-foreground">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    table: ({ children }) => (
      <div className="mb-4 overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b border-border/60 bg-muted/40 text-left">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="px-3 py-2 font-semibold text-foreground">{children}</th>
    ),
    td: ({ children }) => (
      <td className="border-t border-border/40 px-3 py-2 align-top text-muted-foreground">
        {children}
      </td>
    ),
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="mb-4 overflow-x-auto rounded-lg border border-border/60 bg-muted/30 p-4 font-mono text-sm leading-relaxed">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-4 border-l-4 border-primary/40 pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  }

  return (
    <BlogPostClient
      postSlug={post.slug}
      postTitle={post.title}
      postExcerpt={post.description}
      postDate={post.date}
      postUpdated={post.updated}
      postCategory={post.category}
      readingMinutes={readingMinutes}
      fresh={isFreshPost(post.date)}
      olderPost={older ? { slug: older.slug, title: older.title, category: older.category } : null}
      newerPost={newer ? { slug: newer.slug, title: newer.title, category: newer.category } : null}
      authorName={authorName}
      authorRole={authorRole}
      posts={toPalettePosts(blogPosts)}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Content + sticky TOC rail (toc collapses into a disclosure above the
          article on mobile — same pattern as the tool pages). */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start lg:gap-8">
        <aside className="lg:order-2">
          <MobileSidebar>
            <section className="rounded-xl border border-border/70 bg-card p-4">
              <BlogToc items={tocItems} />
            </section>
          </MobileSidebar>
        </aside>
        <article className="mx-auto max-w-3xl lg:order-1 lg:mx-0 lg:max-w-none">
        {bodyParts ? (
          <>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {bodyParts[0]}
            </ReactMarkdown>

            {/* Mid-content in-article ad — placed at a section boundary so it
                never interrupts a paragraph or code example. Explicitly
                labelled per AdSense ad-placement policy (ads must not be
                mistaken for content). */}
            <div className="my-10" role="complementary" aria-label="Advertisement">
              <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                Sponsored
              </p>
              <AdUnit slot="inArticle" />
            </div>

            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {bodyParts[1]}
            </ReactMarkdown>
          </>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {post.body}
          </ReactMarkdown>
        )}

        {/* In-article ad */}
        <div className="my-10">
          <AdUnit slot="horizontal" />
        </div>

        {/* Related tools — internal linking to the tool pages */}
        {relatedTools.length > 0 ? (
          <section className="mt-8 rounded-xl border border-border/60 bg-gradient-to-br from-muted/40 to-muted/10 p-5">
            <h2 className="text-sm font-bold tracking-tight text-foreground">
              Related free tools
            </h2>
            <p className="mb-3 mt-1 text-xs text-muted-foreground">
              Try these free online tools — all run in your browser with no sign-up.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {relatedTools.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 font-medium text-foreground transition hover:border-primary hover:text-primary hover:shadow-sm"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* Related guides — cross-links between posts (topical cluster). */}
        {relatedPosts.length > 0 ? (
          <section className="mt-6">
            <h2 className="text-sm font-bold tracking-tight text-foreground">
              Keep reading
            </h2>
            <p className="mb-3 mt-1 text-xs text-muted-foreground">
              More hand-written guides from the blog.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col rounded-xl border border-border/70 bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                >
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: blogCategoryColor(p.category) }}
                      aria-hidden
                    />
                    <span style={{ color: blogCategoryColor(p.category) }}>
                      {p.category}
                    </span>
                  </span>
                  <span className="mt-1.5 text-sm font-semibold leading-snug text-foreground transition group-hover:text-primary">
                    {p.title}
                  </span>
                  {isFreshPost(p.date) ? (
                    <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      New
                    </span>
                  ) : null}
                  <span className="mt-auto pt-2 text-[11px] text-muted-foreground">
                    {readingTimeMinutes(p.body)} min read
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
      </div>
    </BlogPostClient>
  )
}

/**
 * Flatten ReactMarkdown heading children into plain text so the h2 anchor id
 * (rendered DOM) matches the TOC id extracted from the raw markdown.
 */
function childrenToText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(childrenToText).join('')
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode }
    return childrenToText(props.children)
  }
  return ''
}
