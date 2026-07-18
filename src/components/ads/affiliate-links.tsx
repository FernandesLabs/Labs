'use client'

import * as React from 'react'
import { ExternalLink, Sparkles } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import type { ToolCategory } from '@/lib/tools/types'

/**
 * Contextual affiliate recommendations per tool category.
 * Only shows when affiliate links are configured in site-config.ts.
 * These earn commission when users click through and sign up.
 */

interface AffiliateRec {
  name: string
  description: string
  url: string | null
}

const CATEGORY_AFFILIATES: Record<ToolCategory, AffiliateRec[]> = {
  developer: [
    {
      name: 'Cloudflare',
      description: 'Free CDN, DNS, and edge hosting for developers.',
      url: 'https://cloudflare.com',
    },
    {
      name: 'Namecheap',
      description: 'Affordable domains and SSL certificates.',
      url: 'https://namecheap.com',
    },
  ],
  text: [
    {
      name: 'Grammarly',
      description: 'AI-powered writing assistant for flawless text.',
      url: null,
    },
  ],
  finance: [],
  seo: [
    {
      name: 'Ahrefs',
      description: 'The industry-standard SEO research toolkit.',
      url: siteConfig.affiliate.links.seoTool,
    },
    {
      name: 'Namecheap',
      description: 'Register domains for your SEO projects.',
      url: 'https://namecheap.com',
    },
  ],
  security: [
    {
      name: '1Password',
      description: 'Secure password manager for teams and individuals.',
      url: siteConfig.affiliate.links.passwordManager,
    },
    {
      name: 'ProtonVPN',
      description: 'Privacy-first VPN with no-logs policy.',
      url: siteConfig.affiliate.links.vpn,
    },
  ],
  network: [
    {
      name: 'Cloudflare',
      description: 'Fast, secure DNS and CDN for your domains.',
      url: 'https://cloudflare.com',
    },
  ],
  media: [
    {
      name: 'Cloudflare',
      description: 'Image optimization and delivery at the edge.',
      url: 'https://cloudflare.com',
    },
  ],
  misc: [],
}

export function AffiliateLinks({ category }: { category: ToolCategory }) {
  if (!siteConfig.affiliate.enabled) return null

  const recs = (CATEGORY_AFFILIATES[category] || []).filter((r) => r.url)
  if (recs.length === 0) return null

  return (
    <div className="mt-6 rounded-xl border border-border/60 bg-muted/20 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="size-3.5 text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Recommended tools
        </h3>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {recs.map((rec) => (
          <a
            key={rec.name}
            href={rec.url!}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="group flex items-start gap-2 rounded-lg border border-border/50 bg-background p-2.5 transition hover:border-primary/40 hover:bg-muted/40"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-foreground">
                  {rec.name}
                </span>
                <ExternalLink className="size-3 shrink-0 text-muted-foreground/40 transition group-hover:text-primary" />
              </div>
              <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                {rec.description}
              </p>
            </div>
          </a>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground/60">
        Affiliate links — we may earn a commission if you sign up.
      </p>
    </div>
  )
}
