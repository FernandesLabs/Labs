import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Anonymous page feedback (tools + blog guides).
 *
 * POST /api/feedback  { slug: string, helpful: boolean } → { ok: true }
 * GET  /api/feedback?slug=<slug>                        → { ok, up, down }
 *
 * Privacy: we store ONLY the page slug and a yes/no flag — no accounts, no
 * emails, no tracking identifiers (documented in /privacy).
 */

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,119}$/

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const slug = typeof (body as { slug?: unknown })?.slug === 'string' ? (body as { slug: string }).slug : ''
  const helpful = (body as { helpful?: unknown })?.helpful

  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ ok: false, error: 'Invalid slug' }, { status: 400 })
  }
  if (typeof helpful !== 'boolean') {
    return NextResponse.json({ ok: false, error: 'Invalid vote' }, { status: 400 })
  }

  try {
    await db.toolFeedback.create({ data: { pageSlug: slug, helpful } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[api/feedback] POST failed:', error)
    return NextResponse.json({ ok: false, error: 'Failed to record feedback' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? ''
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ ok: false, up: 0, down: 0 }, { status: 400 })
  }

  try {
    const [up, down] = await Promise.all([
      db.toolFeedback.count({ where: { pageSlug: slug, helpful: true } }),
      db.toolFeedback.count({ where: { pageSlug: slug, helpful: false } }),
    ])
    return NextResponse.json({ ok: true, up, down })
  } catch (error) {
    console.error('[api/feedback] GET failed:', error)
    // Degrade gracefully — the widget hides counts when the API is down.
    return NextResponse.json({ ok: false, up: 0, down: 0 }, { status: 500 })
  }
}
