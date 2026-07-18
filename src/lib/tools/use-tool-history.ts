'use client'

import * as React from 'react'

/**
 * Persists recently-used tools and favorites in localStorage.
 * Shared across the hub, tool cards, and command palette.
 */

const RECENT_KEY = 'fl-recent-tools'
const FAV_KEY = 'fl-fav-tools'
const MAX_RECENT = 8

function readArr(key: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x) => typeof x === 'string')
  } catch {
    return []
  }
}

function writeArr(key: string, arr: string[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(arr))
  } catch {
    /* quota / private mode — ignore */
  }
}

type Listener = () => void
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((l) => l())
}

export interface ToolHistory {
  recent: string[]
  favorites: string[]
  recordUse: (slug: string) => void
  toggleFavorite: (slug: string) => void
  isFavorite: (slug: string) => boolean
  clearRecent: () => void
}

export function useToolHistory(): ToolHistory {
  const [recent, setRecent] = React.useState<string[]>([])
  const [favorites, setFavorites] = React.useState<string[]>([])

  // Hydrate from localStorage on mount
  React.useEffect(() => {
    setRecent(readArr(RECENT_KEY))
    setFavorites(readArr(FAV_KEY))
  }, [])

  // Subscribe to cross-component changes
  React.useEffect(() => {
    const l: Listener = () => {
      setRecent(readArr(RECENT_KEY))
      setFavorites(readArr(FAV_KEY))
    }
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }, [])

  const recordUse = React.useCallback((slug: string) => {
    if (!slug) return
    const next = [slug, ...readArr(RECENT_KEY).filter((s) => s !== slug)].slice(
      0,
      MAX_RECENT
    )
    writeArr(RECENT_KEY, next)
    emit()
  }, [])

  const toggleFavorite = React.useCallback((slug: string) => {
    const cur = readArr(FAV_KEY)
    const next = cur.includes(slug)
      ? cur.filter((s) => s !== slug)
      : [slug, ...cur]
    writeArr(FAV_KEY, next)
    emit()
  }, [])

  const isFavorite = React.useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites]
  )

  const clearRecent = React.useCallback(() => {
    writeArr(RECENT_KEY, [])
    emit()
  }, [])

  return { recent, favorites, recordUse, toggleFavorite, isFavorite, clearRecent }
}
