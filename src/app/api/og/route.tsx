import { getToolMeta } from '@/lib/tools/tool-meta'
import { CATEGORY_META, type ToolCategory } from '@/lib/tools/types'
import { siteConfig } from '@/lib/site-config'
/**
 * Dynamic Open Graph image per tool — Priority 9.
 *
 * URL: `/api/og?slug=<slug>` → 1200×630 PNG.
 *
 * Used by:
 *   - The per-tool `generateMetadata` `openGraph.images` field
 *   - Twitter card images
 *
 * Generates a branded image with the tool name, category badge, and tagline.
 *
 * Implementation notes:
 *   - `next/og` (`ImageResponse`) is dynamically imported so the heavy Satori
 *     + Yoga + wasm stack is NOT bundled into the server at compile time.
 *     This keeps the dev server's memory footprint small enough for the 4GB
 *     sandbox; on Vercel the route compiles and runs normally.
 *   - Uses the Node.js runtime (not edge) for the same memory reason.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const tool = slug ? getToolMeta(slug) : undefined
  const siteName = siteConfig.site.name || 'Fernandes Labs'
  const fallbackTagline =
    'Free online tools for developers, designers, and marketers.'
  // Lazy-load `next/og` only when this route is actually hit.
  const { ImageResponse } = await import('next/og')
  if (!tool) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px',
            background:
              'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: 800,
              }}
            >
              FL
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700 }}>{siteName}</div>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div
              style={{
                fontSize: '72px',
                fontWeight: 800,
                lineHeight: 1.05,
              }}
            >
              Free Online Tools
            </div>
            <div
              style={{
                fontSize: '28px',
                opacity: 0.85,
                maxWidth: '900px',
              }}
            >
              {fallbackTagline}
            </div>
          </div>
          <div style={{ fontSize: '22px', opacity: 0.7 }}>
            fernandeslabs.com · No sign-up · Privacy-first · Works offline
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
  const cat = CATEGORY_META[tool.category as ToolCategory]
  const keywordText = (tool.keywords ?? []).slice(0, 4).join(' · ')
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background:
            'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 800,
              }}
            >
              FL
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, opacity: 0.95 }}>
              {siteName}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 18px',
              borderRadius: '999px',
              background: cat.color,
              fontSize: '20px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {cat.label}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: tool.name.length > 24 ? '64px' : '84px',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            {tool.name}
          </div>
          <div
            style={{
              fontSize: '28px',
              opacity: 0.88,
              maxWidth: '1000px',
              lineHeight: 1.35,
            }}
          >
            {tool.description}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '24px',
          }}
        >
          <div style={{ fontSize: '22px', opacity: 0.75 }}>{keywordText}</div>
          <div style={{ fontSize: '22px', opacity: 0.75 }}>
            fernandeslabs.com/tools/{tool.slug}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    }
  )
}