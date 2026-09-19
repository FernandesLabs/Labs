// src/lib/feedback/aggregate.ts
//
// Pure aggregation for the anonymous ToolFeedback votes. Kept out of the API
// route so the merge logic is unit-testable without a database.
//
// Input rows come from a Prisma groupBy:
//   db.toolFeedback.groupBy({ by: ['pageSlug', 'helpful'], _count: { _all: true }, _max: { createdAt: true } })
// which yields one row per (slug × helpful) pair. This function merges the
// true/false halves of each slug into a single aggregate record.

export interface FeedbackGroupRow {
  pageSlug: string
  helpful: boolean
  _count: { _all: number }
  _max: { createdAt: Date | null }
}

export interface FeedbackAggregate {
  slug: string
  up: number
  down: number
  total: number
  /** 0–100 share of 👍 votes; null when a page has too few votes to be meaningful. */
  helpfulPct: number | null
  /** Most recent vote for this page (ISO string); null when unknown. */
  lastAt: string | null
}

/** Vote count below which a helpful % is too noisy to display. */
export const MIN_VOTES_FOR_PERCENTAGE = 3

export function aggregateFeedbackRows(rows: FeedbackGroupRow[]): FeedbackAggregate[] {
  const bySlug = new Map<string, { up: number; down: number; last: Date | null }>()

  for (const row of rows) {
    const count = row._count?._all ?? 0
    if (count <= 0) continue
    const entry = bySlug.get(row.pageSlug) ?? { up: 0, down: 0, last: null }
    if (row.helpful) {
      entry.up += count
    } else {
      entry.down += count
    }
    const at = row._max?.createdAt ?? null
    if (at && (!entry.last || at > entry.last)) entry.last = at
    bySlug.set(row.pageSlug, entry)
  }

  return Array.from(bySlug.entries())
    .map(([slug, { up, down, last }]) => {
      const total = up + down
      const helpfulPct =
        total > 0 && total >= MIN_VOTES_FOR_PERCENTAGE
          ? Math.round((up / total) * 100)
          : null
      return {
        slug,
        up,
        down,
        total,
        helpfulPct,
        lastAt: last ? last.toISOString() : null,
      }
    })
    // Most-voted pages first — the default view answers "what are people
    // actually using?", with re-sorting handled client-side.
    .sort((a, b) => b.total - a.total || b.up - a.up || a.slug.localeCompare(b.slug))
}

export interface FeedbackTotals {
  votes: number
  up: number
  down: number
  pages: number
  /** Site-wide 👍 share, null when there are fewer than MIN_VOTES_FOR_PERCENTAGE votes. */
  helpfulPct: number | null
}

export function feedbackTotals(aggregates: FeedbackAggregate[]): FeedbackTotals {
  const up = aggregates.reduce((n, a) => n + a.up, 0)
  const down = aggregates.reduce((n, a) => n + a.down, 0)
  const votes = up + down
  return {
    votes,
    up,
    down,
    pages: aggregates.length,
    helpfulPct:
      votes > 0 && votes >= MIN_VOTES_FOR_PERCENTAGE
        ? Math.round((up / votes) * 100)
        : null,
  }
}
