import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  aggregateFeedbackRows,
  feedbackTotals,
  type FeedbackGroupRow,
} from '@/lib/feedback/aggregate'

/**
 * Aggregate feedback for the /insights dashboard.
 *
 * GET /api/feedback/all → { ok, totals, pages: FeedbackAggregate[] }
 *
 * NOTE: this intentionally mirrors the privacy posture of /api/feedback — it
 * exposes ONLY aggregate yes/no counts per page slug (the same numbers the
 * per-slug GET already returns publicly), never timestamps-per-vote, IPs or
 * any other identifier. The /insights page that consumes it is noindex.
 */
export async function GET() {
  try {
    const rows = (await db.toolFeedback.groupBy({
      by: ['pageSlug', 'helpful'],
      _count: { _all: true },
      _max: { createdAt: true },
    })) as FeedbackGroupRow[]

    const pages = aggregateFeedbackRows(rows)
    return NextResponse.json({ ok: true, totals: feedbackTotals(pages), pages })
  } catch (error) {
    console.error('[api/feedback/all] GET failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to load feedback' },
      { status: 500 }
    )
  }
}
