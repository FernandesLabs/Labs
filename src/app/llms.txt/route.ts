// src/app/llms.txt/route.ts
import { toolMetaList } from '@/lib/tools/tool-meta'
import { CATEGORY_META, CATEGORY_ORDER, type ToolCategory } from '@/lib/tools/types'
import { blogPosts } from '@/lib/blog/posts'
import { postsByDateDesc, readingTimeMinutes } from '@/lib/blog/blog-utils'
import { siteConfig } from '@/lib/site-config'

/**
 * /llms.txt — the emerging convention for giving AI assistants and crawlers a
 * curated, markdown map of a site (see llmstxt.org). Cheap to serve, keeps the
 * site legible to AI answer engines as they become a discovery channel, and
 * doubles as a human-readable site overview.
 *
 * Generated from the same source data as the UI (toolMetaList + blogPosts), so
 * it never goes stale the way a hand-written file would.
 */

export const dynamic = 'force-static'

export async function GET(): Promise<Response> {
  const base = `https://${siteConfig.site.domain}`

  const lines: string[] = [
    `# ${siteConfig.site.name}`,
    '',
    `> ${siteConfig.site.description ?? ''} Everything runs client-side in the browser — no sign-up, no uploads, no tracking of tool inputs.`,
    '',
    `Main entry: ${base}/ — searchable hub of every tool. Sitemap: ${base}/sitemap.xml. RSS: ${base}/feed.xml.`,
    '',
    '## Categories',
    '',
  ]

  for (const cat of CATEGORY_ORDER) {
    const meta = CATEGORY_META[cat as ToolCategory]
    const tools = toolMetaList.filter((t) => t.category === cat)
    lines.push(`### ${meta.label} (${tools.length} tools)`)
    lines.push('')
    for (const t of tools) {
      lines.push(`- [${t.name}](${base}/tools/${t.slug}): ${t.description}`)
    }
    lines.push('')
  }

  lines.push('## Guides & tutorials', '')
  for (const post of postsByDateDesc(blogPosts)) {
    lines.push(
      `- [${post.title}](${base}/blog/${post.slug}) (${post.category}, ${readingTimeMinutes(post.body)} min read): ${post.description}`
    )
  }
  lines.push('')
  lines.push('## Optional', '')
  lines.push(`- [About](${base}/about): who runs the site and how the tools are built.`)
  lines.push(`- [Contact](${base}/contact): feedback and support.`)
  lines.push(`- [Privacy policy](${base}/privacy) and [terms](${base}/terms).`)

  return new Response(`${lines.join('\n')}\n`, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
