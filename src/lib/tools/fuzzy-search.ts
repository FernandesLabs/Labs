/**
 * Lightweight fuzzy search + ranking for tool discovery.
 *
 * Scoring (higher = better match):
 *  - Exact substring match in name:        +100
 *  - Word-prefix match in name:            +60
 *  - Substring match in name:              +40
 *  - Substring match in description:       +15
 *  - Keyword exact match:                  +25
 *  - Keyword prefix match:                 +12
 *  - Fuzzy subsequence match (typo-tolerant): +5..30 scaled by tightness
 *
 * Tools with a score of 0 are excluded. Results are sorted by score desc,
 * then name asc.
 */

import type { Tool } from './types'

interface Scored {
  tool: Tool
  score: number
}

/** Normalise a string for matching: lowercase, collapse whitespace. */
function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim()
}

/**
 * Fuzzy subsequence match: does `query` appear as a subsequence of `text`?
 * Returns the tightness (0..1) — 1 = exact substring, lower = more spread out.
 * Returns 0 if not a subsequence.
 */
function subsequenceScore(query: string, text: string): number {
  if (!query) return 0
  if (text.includes(query)) return 1 // exact substring = tightest
  let qi = 0
  let lastMatchPos = -1
  let totalGaps = 0
  for (let ti = 0; ti < text.length && qi < query.length; ti++) {
    if (text[ti] === query[qi]) {
      if (lastMatchPos >= 0) totalGaps += ti - lastMatchPos - 1
      lastMatchPos = ti
      qi++
    }
  }
  if (qi < query.length) return 0 // not all query chars matched
  // Tightness: fewer gaps = higher score. Normalise by text length.
  const spread = totalGaps / Math.max(1, text.length)
  return Math.max(0.1, 1 - spread)
}

function scoreTool(tool: Tool, qNorm: string): number {
  if (!qNorm) return 1
  const name = norm(tool.name)
  const desc = norm(tool.description)
  const kws = (tool.keywords ?? []).map(norm)

  let score = 0

  // Exact name match
  if (name === qNorm) score += 150
  // Name starts with query
  if (name.startsWith(qNorm)) score += 100
  // Name substring
  if (name.includes(qNorm)) score += 60
  // Word-prefix in name (e.g. "json" matches "JSON Formatter")
  const nameWords = name.split(' ')
  if (nameWords.some((w) => w.startsWith(qNorm))) score += 50

  // Keyword exact / prefix
  for (const k of kws) {
    if (k === qNorm) score += 35
    else if (k.startsWith(qNorm)) score += 20
    else if (k.includes(qNorm)) score += 12
  }

  // Description substring
  if (desc.includes(qNorm)) score += 15

  // Fuzzy subsequence fallback (typo tolerance) — only if no strong match yet
  if (score < 30) {
    const fuzzy = subsequenceScore(qNorm, name)
    if (fuzzy > 0) score += Math.round(fuzzy * 25)
  }

  return score
}

/** Fuzzy-filter and rank tools by query. Returns tools with score > 0, sorted. */
export function fuzzySearchTools(tools: Tool[], query: string): Tool[] {
  const q = norm(query)
  if (!q) return tools

  const scored: Scored[] = []
  for (const tool of tools) {
    const s = scoreTool(tool, q)
    if (s > 0) scored.push({ tool, score: s })
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.tool.name.localeCompare(b.tool.name)
  })

  return scored.map((s) => s.tool)
}

/** Quick boolean: does the tool match the query (fuzzy)? */
export function fuzzyMatch(tool: Tool, query: string): boolean {
  return scoreTool(tool, norm(query)) > 0
}
