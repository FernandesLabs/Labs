/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import {
  aggregateFeedbackRows,
  feedbackTotals,
  MIN_VOTES_FOR_PERCENTAGE,
  type FeedbackGroupRow,
} from '@/lib/feedback/aggregate'

function row(pageSlug: string, helpful: boolean, count: number, daysAgo = 1): FeedbackGroupRow {
  return {
    pageSlug,
    helpful,
    _count: { _all: count },
    _max: { createdAt: new Date(Date.now() - daysAgo * 86_400_000) },
  }
}

describe('aggregateFeedbackRows', () => {
  test('merges up/down halves of the same slug', () => {
    const out = aggregateFeedbackRows([
      row('json-formatter', true, 7),
      row('json-formatter', false, 2),
    ])
    expect(out).toHaveLength(1)
    expect(out[0].slug).toBe('json-formatter')
    expect(out[0].up).toBe(7)
    expect(out[0].down).toBe(2)
    expect(out[0].total).toBe(9)
    expect(out[0].helpfulPct).toBe(78)
  })

  test('suppresses helpful % below the noise floor', () => {
    const out = aggregateFeedbackRows([row('ip-lookup', true, 2), row('ip-lookup', false, 0)])
    expect(out[0].total).toBe(2)
    expect(out[0].helpfulPct).toBeNull()
  })

  test('shows helpful % exactly at the noise floor', () => {
    const out = aggregateFeedbackRows([
      row('uuid-generator', true, MIN_VOTES_FOR_PERCENTAGE),
      row('uuid-generator', false, 0),
    ])
    expect(out[0].helpfulPct).toBe(100)
  })

  test('keeps the most recent vote timestamp across both halves', () => {
    const out = aggregateFeedbackRows([
      row('qr-generator', true, 3, 5), // older
      row('qr-generator', false, 1, 0), // today
    ])
    expect(out[0].lastAt).not.toBeNull()
    const ageMs = Date.now() - new Date(out[0].lastAt as string).getTime()
    expect(ageMs).toBeLessThan(86_400_000)
  })

  test('sorts by total votes desc, then up desc, then slug asc', () => {
    const out = aggregateFeedbackRows([
      row('b-tool', true, 1),
      row('a-tool', true, 1),
      row('big-tool', true, 10),
      row('big-tool', false, 2),
    ])
    expect(out.map((a) => a.slug)).toEqual(['big-tool', 'a-tool', 'b-tool'])
  })

  test('ignores zero-count rows (defensive against empty groupBy halves)', () => {
    const out = aggregateFeedbackRows([row('ghost-tool', true, 0)])
    expect(out).toHaveLength(0)
  })

  test('handles null timestamps', () => {
    const out = aggregateFeedbackRows([
      { pageSlug: 'x', helpful: true, _count: { _all: 4 }, _max: { createdAt: null } },
    ])
    expect(out[0].lastAt).toBeNull()
    expect(out[0].up).toBe(4)
  })
})

describe('feedbackTotals', () => {
  test('sums across pages and computes the site-wide share', () => {
    const aggregates = aggregateFeedbackRows([
      row('a', true, 8),
      row('a', false, 2),
      row('b', true, 3),
    ])
    const totals = feedbackTotals(aggregates)
    expect(totals.votes).toBe(13)
    expect(totals.up).toBe(11)
    expect(totals.down).toBe(2)
    expect(totals.pages).toBe(2)
    expect(totals.helpfulPct).toBe(85)
  })

  test('returns null share when the site has too few votes', () => {
    const totals = feedbackTotals(aggregateFeedbackRows([row('a', true, 1)]))
    expect(totals.helpfulPct).toBeNull()
  })

  test('handles the empty dashboard', () => {
    const totals = feedbackTotals([])
    expect(totals).toEqual({ votes: 0, up: 0, down: 0, pages: 0, helpfulPct: null })
  })
})
