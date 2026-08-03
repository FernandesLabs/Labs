// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { siteConfig } from '@/lib/site-config'
import { blogPosts, getBlogPost } from '@/lib/blog/posts'
import { toolMetadata } from '@/lib/tools/tool-metadata'
import { AdUnit } from '@/components/ads/ad-unit'
import { BlogPostClient } from './blog-post-client'

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
  return {
    title: `${post.title} | Fernandes Labs Blog`,
    description: post.description,
    alternates: { canonical: url },
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: siteConfig.site.name,
      type: 'article',
      images: [
        {
          url: `/api/og?slug=${encodeURIComponent(post.relatedTools[0] ?? '')}`,
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
  const url = `https://${siteConfig.site.domain}/blog/${post.slug}`
  const relatedTools = post.relatedTools
    .map((s) => toolMetadata.find((t) => t.slug === s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .slice(0, 6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: 'en',
        mainEntityOfPage: url,
        author: {
          '@type': 'Organization',
          name: siteConfig.site.name,
          url: siteConfig.site.url,
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.site.name,
          url: siteConfig.site.url,
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.site.url}/fl-logo.svg`,
            width: 512,
            height: 512,
          },
        },
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

  return (
    <BlogPostClient
      postTitle={post.title}
      postExcerpt={post.description}
      postDate={post.date}
      postCategory={post.category}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h2 className="mb-3 mt-10 text-2xl font-bold tracking-tight text-foreground">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-2 mt-8 text-xl font-bold tracking-tight text-foreground">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
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
          }}
        >
          {post.body}
        </ReactMarkdown>

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
      </article>
    </BlogPostClient>
  )
}
