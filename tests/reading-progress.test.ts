/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import {
  readGuideProgress,
  saveGuideProgress,
  removeGuideProgress,
  PROGRESS_TTL_MS,
  MAX_PROGRESS_ENTRIES,
  MIN_PCT,
  MAX_PCT,
} from '@/lib/blog/reading-progress-store'

/** Minimal Map-backed Storage double — same surface the helpers use. */
function fakeStorage() {
  const map = new Map<string, string>()
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    _dump: () => (map.has('fl-guide-progress') ? map.get('fl-guide-progress')! : null),
  }
}

describe('reading-progress-store', () => {
  test('save clamps pct into [MIN_PCT, MAX_PCT]', () => {
    const s = fakeStorage()
    saveGuideProgress('a', 0, s)
    saveGuideProgress('b', 150, s)
    saveGuideProgress('c', 37.4, s)
    const out = readGuideProgress(s)
    expect(out.map((e) => [e.slug, e.pct])).toEqual([
      ['c', 37],
      ['b', MAX_PCT],
      ['a', MIN_PCT],
    ])
  })

  test('saving the same slug updates in place and bumps recency order', () => {
    const s = fakeStorage()
    saveGuideProgress('first', 10, s)
    saveGuideProgress('second', 20, s)
    saveGuideProgress('first', 50, s)
    const out = readGuideProgress(s)
    expect(out.map((e) => e.slug)).toEqual(['first', 'second'])
    expect(out[0].pct).toBe(50)
    expect(out).toHaveLength(2)
  })

  test('removes only the requested slug and deletes the key when empty', () => {
    const s = fakeStorage()
    saveGuideProgress('a', 10, s)
    saveGuideProgress('b', 20, s)
    removeGuideProgress('a', s)
    expect(readGuideProgress(s).map((e) => e.slug)).toEqual(['b'])
    removeGuideProgress('b', s)
    expect(s._dump()).toBeNull()
    // Removing from an empty store is a no-op, not a throw.
    removeGuideProgress('b', s)
  })

  test('caps history at MAX_PROGRESS_ENTRIES, keeping the most recent', () => {
    const s = fakeStorage()
    for (let i = 0; i < MAX_PROGRESS_ENTRIES + 5; i++) {
      saveGuideProgress(`guide-${i}`, 10 + i, s)
    }
    const out = readGuideProgress(s)
    expect(out).toHaveLength(MAX_PROGRESS_ENTRIES)
    expect(out[0].slug).toBe(`guide-${MAX_PROGRESS_ENTRIES + 4}`)
  })

  test('drops corrupt JSON and malformed entries instead of throwing', () => {
    const bad = fakeStorage()
    bad.setItem('fl-guide-progress', '{not json')
    expect(readGuideProgress(bad)).toEqual([])

    const junk = fakeStorage()
    junk.setItem(
      'fl-guide-progress',
      JSON.stringify([
        { slug: 'ok', pct: 42, ts: Date.now() },
        null,
        'string',
        { slug: 7, pct: 10, ts: Date.now() },
        { slug: 'old', pct: 10, ts: Date.now() - PROGRESS_TTL_MS - 1 },
      ])
    )
    expect(readGuideProgress(junk).map((e) => e.slug)).toEqual(['ok'])
  })

  test('prunes entries beyond the TTL on read', () => {
    const s = fakeStorage()
    const stale = [{ slug: 'old', pct: 30, ts: Date.now() - PROGRESS_TTL_MS - 1000 }]
    s.setItem('fl-guide-progress', JSON.stringify(stale))
    saveGuideProgress('new', 40, s)
    expect(readGuideProgress(s).map((e) => e.slug)).toEqual(['new'])
  })

  test('unknown slugs and empty stores read back as empty arrays', () => {
    const s = fakeStorage()
    expect(readGuideProgress(s)).toEqual([])
    expect(readGuideProgress(null)).toEqual([])
  })
})

// ─── isFreshPost (blog-utils) ───────────────────────────────────────────
import { isFreshPost, FRESH_WINDOW_MS } from '@/lib/blog/blog-utils'

describe('isFreshPost', () => {
  const NOW = new Date('2026-09-20T12:00:00Z').getTime()

  test('post published today is fresh', () => {
    expect(isFreshPost('2026-09-20', NOW)).toBe(true)
  })

  test('post exactly at the 7-day boundary is no longer fresh (strictly younger)', () => {
    expect(isFreshPost(new Date(NOW - FRESH_WINDOW_MS).toISOString(), NOW)).toBe(false)
  })

  test('post one second past the boundary is not fresh', () => {
    expect(isFreshPost(new Date(NOW - FRESH_WINDOW_MS - 1).toISOString(), NOW)).toBe(false)
  })

  test('old posts are not fresh', () => {
    expect(isFreshPost('2026-08-03', NOW)).toBe(false)
  })

  test('future dates are not fresh (clock-skew guard)', () => {
    expect(isFreshPost('2026-09-25', NOW)).toBe(false)
  })

  test('invalid dates are not fresh', () => {
    expect(isFreshPost('not-a-date', NOW)).toBe(false)
  })
})
