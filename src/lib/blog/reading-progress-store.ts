// src/lib/blog/reading-progress-store.ts
//
// Persists per-guide reading progress in localStorage so the blog index can
// offer a "Continue reading" strip. Pure localStorage — nothing is sent to
// any server (documented in /privacy).
//
// Client-safe module: NO React, NO 'use client' needed. The default storage
// is window.localStorage guarded by typeof window (SSR returns [] / no-op),
// and an injectable Storage makes the helpers unit-testable.
//
// Hydration rule (same as use-tool-history / offline page): consumers MUST
// read this in an effect, never during the first render.

const KEY = 'fl-guide-progress'

/** Entries older than this are pruned on read (guides change; stale pointers mislead). */
export const PROGRESS_TTL_MS = 30 * 86_400_000

/** Cap the stored history so the key can never grow unbounded. */
export const MAX_PROGRESS_ENTRIES = 12

/** Saved percentages are clamped into [MIN_PCT, MAX_PCT]: below 1% is noise,
 *  and a finished read stays "resumable" (99%) so the strip never lies. */
export const MIN_PCT = 1
export const MAX_PCT = 99

export interface GuideProgressEntry {
  slug: string
  /** Reading position, 1–99 (see MIN_PCT/MAX_PCT). */
  pct: number
  /** Last-read timestamp (epoch ms) — used for recency ordering + TTL. */
  ts: number
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

function defaultStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    /* private mode with storage disabled */
    return null
  }
}

/** Read all entries, newest first. Corrupt/TTL-expired entries are dropped. */
export function readGuideProgress(
  storage: StorageLike | null = defaultStorage()
): GuideProgressEntry[] {
  if (!storage) return []
  try {
    const raw = storage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const now = Date.now()
    return parsed
      .filter(
        (e): e is GuideProgressEntry =>
          !!e &&
          typeof e === 'object' &&
          typeof (e as GuideProgressEntry).slug === 'string' &&
          typeof (e as GuideProgressEntry).pct === 'number' &&
          typeof (e as GuideProgressEntry).ts === 'number' &&
          now - (e as GuideProgressEntry).ts < PROGRESS_TTL_MS
      )
      .sort((a, b) => b.ts - a.ts)
  } catch {
    /* corrupted JSON — start clean */
    return []
  }
}

/** Save (or update) progress for one guide. Prunes + caps the stored list. */
export function saveGuideProgress(
  slug: string,
  pct: number,
  storage: StorageLike | null = defaultStorage()
): void {
  if (!storage || !slug) return
  const clamped = Math.min(MAX_PCT, Math.max(MIN_PCT, Math.round(pct)))
  try {
    const now = Date.now()
    const rest = readGuideProgress(storage).filter((e) => e.slug !== slug)
    const next = [{ slug, pct: clamped, ts: now }, ...rest].slice(
      0,
      MAX_PROGRESS_ENTRIES
    )
    storage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* quota exceeded / storage unavailable — progress is best-effort */
  }
}

/** Remove one guide from the history (the strip's dismiss button). */
export function removeGuideProgress(
  slug: string,
  storage: StorageLike | null = defaultStorage()
): void {
  if (!storage) return
  try {
    const rest = readGuideProgress(storage).filter((e) => e.slug !== slug)
    if (rest.length === 0) storage.removeItem(KEY)
    else storage.setItem(KEY, JSON.stringify(rest))
  } catch {
    /* storage unavailable — nothing to do */
  }
}
