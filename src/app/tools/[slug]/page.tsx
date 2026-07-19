// src/app/tools/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { toolMetadata } from '@/lib/tools/tool-metadata'
import { siteConfig } from '@/lib/site-config'
import { ToolPageClient } from './tool-page-client'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // Now .map() works perfectly because toolMetadata is a pure server-safe array
  return toolMetadata.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = toolMetadata.find((t) => t.slug === slug)
  if (!tool) return {}
  const title = `${tool.name} — Free Online Tool — Fernandes Labs`
  const description = tool.description
  const url = `https://${siteConfig.site.domain}/tools/${tool.slug}`
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.site.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = toolMetadata.find((t) => t.slug === slug)
  if (!tool) notFound()
  // Delegate client-side rendering (which needs the Component) to the client wrapper
  return <ToolPageClient slug={tool.slug} />
}
