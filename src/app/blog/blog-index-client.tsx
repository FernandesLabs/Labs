'use client'
import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/hub/site-header'
import { SiteFooter } from '@/components/hub/site-footer'
import { BackToTop } from '@/components/hub/back-to-top'
import { ReadingProgress } from '@/components/hub/reading-progress'
import { SkipToContent } from '@/components/hub/skip-to-content'
import { FileText, ArrowRight } from 'lucide-react'
import { toolMetaList } from '@/lib/tools/tool-meta'

/**
 * BlogIndexClient — client-side wrapper for the blog index.
 *
 * The blog page itself (`page.tsx`) is a server component that exports the
 * `metadata` (title, description, canonical). This client component handles
 * the interactive parts: the SiteHeader navigation (needs `router.push`) and
 * the post list.
 */
const POSTS: { slug: string; title: string; excerpt: string; category: string }[] = [
  // Posts will be added here as content is written.
  // See /home/z/my-project/SEO-BLOG-PLAN.md for the content plan.
]

export function BlogIndexClient() {
  const router = useRouter()
  return (
    <div className="flex min-h-screen flex-col">
      <ReadingProgress />
      <SkipToContent />
      <SiteHeader
        onHome={() => router.push('/')}
        toolCount={toolMetaList.length}
        onOpenPalette={() => router.push('/')}
      />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8"
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link href="/" className="inline-flex items-center gap-1 transition hover:text-foreground">
            Home
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-medium text-foreground">Blog</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Guides &amp; Tutorials
          </h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            In-depth guides, best practices, and tutorials for developers,
            designers, and marketers. Learn about the tools you use every day.
          </p>
        </header>

        {POSTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 p-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-base font-medium text-foreground">
              Articles coming soon
            </p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              We&apos;re working on guides covering JSON, QR codes, passwords,
              SEO, and more. Check back shortly — or explore our{' '}
              <Link href="/" className="font-medium text-primary hover:underline">
                {toolMetaList.length} free tools
              </Link>{' '}
              in the meantime.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-xl border border-border/70 bg-card p-5 transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {post.category}
                </span>
                <h2 className="mt-1 text-lg font-bold text-foreground transition group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read more
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  )
}
