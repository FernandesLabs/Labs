#!/usr/bin/env node
/**
 * gsc-report.mjs — turn a Google Search Console "Performance on Search" export
 * into a prioritised, human-readable report.
 *
 * Why this exists
 * ---------------
 * Every meaningful SEO change on this site starts with the same question:
 * "which pages already earn impressions, and which query language do they
 * earn them for?" GSC's UI answers that one page at a time and does not
 * cluster queries or calculate opportunity. This script does the boring part
 * deterministically so the content work can be reviewed in a PR.
 *
 * Usage
 * -----
 *   bun run seo:gsc -- <path-to-export.zip|directory> [YYYY-MM-DD] [--out path|--stdout]
 *
 *   # defaults to the newest export zip and writes docs/seo/gsc-<export-date>.md
 *   bun run seo:gsc
 *
 * Requirements: Node 20+, and `unzip` on PATH when the input is a .zip.
 * No npm dependencies — the export format is simple CSV and the script is
 * intentionally runnable in CI without installing anything.
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

/** Minimal RFC-4180-ish CSV parser (quoted fields, escaped quotes, CRLF). */
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (ch === '"') {
        quoted = false
      } else {
        field += ch
      }
      continue
    }
    if (ch === '"') {
      quoted = true
    } else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n') {
      row.push(field.replace(/\r$/, ''))
      rows.push(row)
      row = []
      field = ''
    } else if (ch !== '\r') {
      field += ch
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  if (rows.length === 0) return []
  const header = rows.shift().map((h) => h.trim())
  return rows
    .filter((r) => r.some((v) => v.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])))
}

const int = (v) => {
  const n = Number.parseInt(String(v ?? '').replace(/[^\d-]/g, ''), 10)
  return Number.isFinite(n) ? n : 0
}
const float = (v) => {
  const n = Number.parseFloat(String(v ?? '').replace('%', ''))
  return Number.isFinite(n) ? n : 0
}
const pct = (n, d) => (d > 0 ? `${((n / d) * 100).toFixed(2)}%` : '—')
const num = (n) => n.toLocaleString('en-US')

/** Read a CSV from a directory, tolerating BOMs and missing optional files. */
function readTable(dir, name) {
  const file = path.join(dir, name)
  if (!fs.existsSync(file)) return []
  return parseCsv(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
}

/**
 * Query clusters. Order matters: the first matching pattern wins, so put
 * narrow intent clusters before broad ones (e.g. "email signature" before
 * the generic "developer/text utility" fallback).
 */
const CLUSTERS = [
  { name: 'Font / accessibility', re: /\bfont|accessib|wcag|readab|type ?size|contrast check/i },
  { name: 'Email signature', re: /email signature|signature generator|signature maker|signature creator|html signature|gmail signature|outlook signature|thunderbird signature/i },
  { name: '301 / redirect', re: /301|302|307|308|redirect/i },
  { name: 'Robots.txt', re: /robots?[\s.]?txt|robot\.txt|robot txt/i },
  { name: 'Canonical URL', re: /canonical/i },
  { name: 'CSS gradient', re: /gradient/i },
  { name: 'MIME / file type', re: /mime|file type|file signature|magic byte|file header/i },
  { name: 'Image metadata / EXIF', re: /metadata|exif|photo meta/i },
  { name: 'IP lookup / geolocation', re: /\bip\b|ipv4|ipv6|adress|address finder|internet protocol|geolocation|isp lookup/i },
  { name: 'Unix / timestamps', re: /unix|timestamp|epoch/i },
  { name: 'JWT', re: /jwt|json web token/i },
  { name: 'JSON / developer', re: /json|regex|base64|uuid|hash|yaml|xml|sql|cron|url encod|diff/i },
  { name: 'PDF / media', re: /\bpdf\b|image (compressor|resizer)|png|webp|qr code|qr generator|svg|favicon/i },
  { name: 'SEO metadata / schema', re: /meta tag|schema|structured data|open graph|twitter card|title generator|headline|utm|sitemap/i },
  { name: 'Finance / calculators', re: /calculator|bmi|bmr|loan|mortgage|vat|gpa|interest|roi|salary|tax|calorie|macro/i },
]

function clusterFor(query) {
  for (const c of CLUSTERS) if (c.re.test(query)) return c.name
  return 'Other / unclassified'
}

export function weightedPosition(rows) {
  const impressions = rows.reduce((a, r) => a + int(r.Impressions), 0)
  if (!impressions) return 0
  return rows.reduce((a, r) => a + int(r.Impressions) * float(r.Position), 0) / impressions
}

/**
 * Opportunity score: impressions × remaining position headroom × depth weight.
 * This is a triage heuristic, not a click forecast. It deliberately favours
 * pages already close to page 1: a page at position 85 needs a different
 * (much larger) intervention than a page at position 18.
 */
function depthWeight(position) {
  if (position <= 10) return 0.6
  if (position <= 20) return 1
  if (position <= 30) return 0.85
  if (position <= 50) return 0.55
  if (position <= 70) return 0.3
  return 0.12
}
export function opportunity(impressions, position) {
  return Math.round(impressions * ((100 - Math.min(position, 100)) / 100) * depthWeight(position))
}

function extractZip(zipPath) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fl-gsc-'))
  try {
    execFileSync('unzip', ['-o', '-q', zipPath, '-d', dir], { stdio: 'pipe' })
    return dir
  } catch (error) {
    fs.rmSync(dir, { recursive: true, force: true })
    throw error
  }
}

/** Keep the archive identity separate from the temporary extraction path. */
export function resolveInput(arg, root = process.cwd()) {
  let input = arg ? path.resolve(root, arg) : null
  if (!input) {
    const zip = fs
      .readdirSync(root)
      .filter((f) => /Performance-on-Search.*\.zip$/i.test(f))
      .map((f) => ({ f, m: fs.statSync(path.join(root, f)).mtimeMs }))
      .sort((a, b) => b.m - a.m || a.f.localeCompare(b.f))[0]
    if (!zip) {
      throw new Error('No GSC export found. Pass a .zip or directory: bun run seo:gsc -- <path>')
    }
    input = path.join(root, zip.f)
  }
  if (!fs.existsSync(input)) throw new Error(`GSC export not found: ${input}`)
  const zipped = /\.zip$/i.test(input)
  return {
    dir: zipped ? extractZip(input) : input,
    source: path.basename(input),
    temporary: zipped,
  }
}

const DAY_MS = 86_400_000
function dateNumber(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return null
  const valueMs = Date.parse(`${value}T00:00:00Z`)
  return Number.isFinite(valueMs) && new Date(valueMs).toISOString().slice(0, 10) === value
    ? valueMs
    : null
}

/** CLI labels are dates so output names remain predictable across runs. */
export function parseArgs(args) {
  const positional = []
  let out = null
  let stdout = false
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--') continue
    if (arg === '--out') {
      const value = args[++i]
      if (!value || value.startsWith('--')) throw new Error('--out requires a file path')
      out = value
    } else if (arg === '--stdout') {
      stdout = true
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`)
    } else {
      positional.push(arg)
    }
  }
  if (out && stdout) throw new Error('Choose either --out or --stdout')
  if (positional.length > 2) throw new Error('Expected an export path and optional YYYY-MM-DD label')
  // A date alone labels the newest export, as documented in AGENTS.md.
  const dateOnly = positional.length === 1 && /^\d{4}-\d{2}-\d{2}$/.test(positional[0])
  const input = dateOnly ? null : positional[0] ?? null
  const label = dateOnly ? positional[0] : positional[1] ?? null
  if (label && dateNumber(label) === null) throw new Error('The report label must be a valid YYYY-MM-DD date')
  return { input, label, out, stdout }
}

export function aggregateRows(rows) {
  const clicks = rows.reduce((sum, row) => sum + int(row.Clicks), 0)
  const impressions = rows.reduce((sum, row) => sum + int(row.Impressions), 0)
  return {
    start: rows[0]?.Date ?? null,
    end: rows[rows.length - 1]?.Date ?? null,
    days: rows.length,
    clicks,
    impressions,
    ctr: impressions ? clicks / impressions : null,
    position: impressions ? weightedPosition(rows) : null,
  }
}

/** Require complete, consecutive calendar days, rather than comparing unequal months. */
export function compareRecentPeriods(chart, days = 28) {
  if (!Number.isInteger(days) || days < 1) throw new Error('Period length must be a positive integer')
  if (chart.some((row) => dateNumber(row.Date) === null)) {
    return { available: false, reason: 'Chart.csv contains an invalid daily date.' }
  }
  const sorted = [...chart].sort((a, b) => a.Date.localeCompare(b.Date))
  if (new Set(sorted.map((row) => row.Date)).size !== sorted.length) {
    return { available: false, reason: 'Chart.csv contains duplicate daily dates.' }
  }
  if (sorted.length < days * 2) {
    return { available: false, reason: `At least ${days * 2} daily rows are required for two full ${days}-day periods.` }
  }
  const recent = sorted.slice(-days * 2)
  if (recent.some((row, i) => i > 0 && dateNumber(row.Date) - dateNumber(recent[i - 1].Date) !== DAY_MS)) {
    return { available: false, reason: `The latest ${days * 2} daily rows contain a calendar gap; unequal or incomplete periods are not compared.` }
  }
  return {
    available: true,
    previous: aggregateRows(recent.slice(0, days)),
    current: aggregateRows(recent.slice(days)),
  }
}

function monthlyTrend(chart) {
  const months = new Map()
  for (const r of chart) {
    const date = r.Date
    if (!date) continue
    const key = date.slice(0, 7)
    const m = months.get(key) ?? { clicks: 0, impressions: 0, weight: 0, days: 0 }
    const im = int(r.Impressions)
    m.clicks += int(r.Clicks)
    m.impressions += im
    m.weight += im * float(r.Position)
    m.days++
    months.set(key, m)
  }
  return [...months.entries()].map(([month, m]) => ({
    month,
    ...m,
    position: m.impressions ? m.weight / m.impressions : 0,
  }))
}

export function render({ chart, queries, pages, countries, devices, source, generatedDate = new Date().toISOString().slice(0, 10) }) {
  chart = [...chart].sort((a, b) => a.Date.localeCompare(b.Date))
  const clicks = chart.reduce((a, r) => a + int(r.Clicks), 0)
  const impressions = chart.reduce((a, r) => a + int(r.Impressions), 0)
  const weighted =
    impressions > 0
      ? chart.reduce((a, r) => a + int(r.Impressions) * float(r.Position), 0) / impressions
      : 0
  const days = chart.length

  // Page-level table, highest impressions first.
  const pageRows = pages
    .map((r) => ({
      url: r['Top pages'],
      clicks: int(r.Clicks),
      impressions: int(r.Impressions),
      position: float(r.Position),
    }))
    .filter((r) => r.url)
    .sort((a, b) => b.impressions - a.impressions)
  const pageImpressions = pageRows.reduce((a, r) => a + r.impressions, 0)

  // Query clusters.
  const clusters = new Map()
  for (const r of queries) {
    const name = clusterFor(r['Top queries'])
    const c = clusters.get(name) ?? { name, queries: [], clicks: 0, impressions: 0 }
    c.queries.push(r)
    c.clicks += int(r.Clicks)
    c.impressions += int(r.Impressions)
    clusters.set(name, c)
  }
  const clusterRows = [...clusters.values()]
    .map((c) => ({
      ...c,
      position: weightedPosition(c.queries),
      top: [...c.queries]
        .sort((a, b) => int(b.Impressions) - int(a.Impressions))
        .slice(0, 8),
    }))
    .sort((a, b) => b.impressions - a.impressions)

  const queryImpressions = queries.reduce((a, r) => a + int(r.Impressions), 0)
  const queryClicks = queries.reduce((a, r) => a + int(r.Clicks), 0)

  // Position bands from the page table.
  const bands = [
    ['1–10', (p) => p <= 10],
    ['11–30', (p) => p > 10 && p <= 30],
    ['31–50', (p) => p > 30 && p <= 50],
    ['51–70', (p) => p > 50 && p <= 70],
    ['71+', (p) => p > 70],
  ].map(([label, test]) => {
    const rows = pageRows.filter((r) => test(r.position))
    return {
      label,
      pages: rows.length,
      impressions: rows.reduce((a, r) => a + r.impressions, 0),
      clicks: rows.reduce((a, r) => a + r.clicks, 0),
    }
  })

  const lines = []
  const h = (s) => lines.push('', s, '')
  const p = (s) => lines.push(s)

  p(`# Google Search Console report`)
  p('')
  p(`- **Source:** \`${source}\``)
  p(`- **Generated:** ${generatedDate} by \`scripts/seo/gsc-report.mjs\``)
  p(`- **Range:** ${chart[0]?.Date ?? '—'} → ${chart[chart.length - 1]?.Date ?? '—'} (${days} days)`)

  h('## Headline')
  p('| Metric | Value |')
  p('|---|---:|')
  p(`| Clicks | **${num(clicks)}** |`)
  p(`| Impressions | **${num(impressions)}** |`)
  p(`| CTR | **${pct(clicks, impressions)}** |`)
  p(`| Average position (impression-weighted) | **${weighted.toFixed(2)}** |`)
  p(`| Clicks / day | ${(clicks / Math.max(days, 1)).toFixed(2)} |`)
  p(`| Impressions / day | ${(impressions / Math.max(days, 1)).toFixed(1)} |`)
  p(`| Pages with ≥1 impression | ${pageRows.length} |`)
  p(`| Pages with ≥1 click | ${pageRows.filter((r) => r.clicks > 0).length} |`)

  h('## Latest 28 days vs previous 28 days')
  const comparison = compareRecentPeriods(chart)
  if (comparison.available) {
    const { current, previous } = comparison
    p(`Latest: **${current.start} → ${current.end}**; previous: **${previous.start} → ${previous.end}**. Each period contains 28 consecutive exported daily rows.`)
    p('')
    p('| Metric | Previous 28 days | Latest 28 days | Change (latest − previous) |')
    p('|---|---:|---:|---:|')
    const signed = (value, decimals = 0) => `${value > 0 ? '+' : ''}${value.toFixed(decimals)}`
    p(`| Clicks | ${num(previous.clicks)} | ${num(current.clicks)} | ${signed(current.clicks - previous.clicks)} |`)
    p(`| Impressions | ${num(previous.impressions)} | ${num(current.impressions)} | ${signed(current.impressions - previous.impressions)} |`)
    p(`| CTR | ${pct(previous.clicks, previous.impressions)} | ${pct(current.clicks, current.impressions)} | ${current.ctr === null || previous.ctr === null ? '—' : `${signed((current.ctr - previous.ctr) * 100, 2)} percentage points`} |`)
    p(`| Impression-weighted position | ${previous.position?.toFixed(2) ?? '—'} | ${current.position?.toFixed(2) ?? '—'} | ${current.position === null || previous.position === null ? '—' : signed(current.position - previous.position, 2)} |`)
    p('')
    p('A lower position number is better. This comparison describes the export; it does not establish that an SEO change caused a movement. Search demand, query mix and preliminary data can affect the totals.')
  } else {
    p(`Comparison unavailable: ${comparison.reason}`)
  }

  h('## Monthly trend')
  p('| Month | Days | Clicks | Impressions | CTR | Avg position |')
  p('|---|---:|---:|---:|---:|---:|')
  for (const m of monthlyTrend(chart)) {
    p(`| ${m.month} | ${m.days} | ${m.clicks} | ${num(m.impressions)} | ${pct(m.clicks, m.impressions)} | ${m.position.toFixed(1)} |`)
  }

  h('## Position distribution (pages)')
  p('| Position band | Pages | Impressions | Clicks | CTR |')
  p('|---|---:|---:|---:|---:|')
  for (const b of bands) {
    p(`| ${b.label} | ${b.pages} | ${num(b.impressions)} | ${b.clicks} | ${pct(b.clicks, b.impressions)} |`)
  }

  h('## Top pages by impressions')
  p('Opportunity = impressions × position headroom × depth weight. This triage score prioritises review; it is not a click forecast or a ranking prediction.')
  p('')
  p('| # | Page | Clicks | Impressions | CTR | Position | Opportunity |')
  p('|---:|---|---:|---:|---:|---:|---:|')
  pageRows.slice(0, 30).forEach((r, i) => {
    p(`| ${i + 1} | \`${r.url.replace(/^https?:\/\/(www\.)?fernandeslabs\.com/, '')}\` | ${r.clicks} | ${num(r.impressions)} | ${pct(r.clicks, r.impressions)} | ${r.position.toFixed(1)} | ${opportunity(r.impressions, r.position)} |`)
  })

  h('## Query clusters')
  p(`The query table contains **${queries.length} rows**, **${num(queryImpressions)} impressions** (${pct(queryImpressions, impressions)} of the chart total) and **${queryClicks} clicks**, compared with **${clicks} chart clicks**. GSC table exports are limited to 1,000 rows; anonymized queries are omitted. The chart can include clicks and impressions absent from this query table, so visible-query clusters do not explain all site traffic.`)
  p('')
  p('Queries.csv and Pages.csv are separate aggregate tables: this export has no query-to-page mapping. Assigning a query cluster to a page is an editorial hypothesis; verify it using page and query filters in Search Console. Page and property aggregation can also differ, so their totals need not match.')
  p('')
  p('| Cluster | Queries | Impressions | Clicks | CTR | Weighted position |')
  p('|---|---:|---:|---:|---:|---:|')
  for (const c of clusterRows) {
    p(`| ${c.name} | ${c.queries.length} | ${num(c.impressions)} | ${c.clicks} | ${pct(c.clicks, c.impressions)} | ${c.position.toFixed(1)} |`)
  }

  h('## Cluster detail (top exact queries)')
  for (const c of clusterRows.slice(0, 10)) {
    p(`### ${c.name} — ${num(c.impressions)} impressions, ${c.clicks} clicks`)
    p('')
    p('| Query | Impressions | Clicks | CTR | Position |')
    p('|---|---:|---:|---:|---:|')
    for (const q of c.top) {
      p(`| ${q['Top queries'].replace(/\|/g, '\\|')} | ${num(int(q.Impressions))} | ${int(q.Clicks)} | ${q.CTR} | ${float(q.Position).toFixed(1)} |`)
    }
    p('')
  }

  h('## Top query opportunities')
  const opps = queries
    .map((r) => ({
      query: r['Top queries'],
      impressions: int(r.Impressions),
      clicks: int(r.Clicks),
      position: float(r.Position),
      score: opportunity(int(r.Impressions), float(r.Position)),
    }))
    .filter((r) => r.impressions >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30)
  p('Uses the same impression × position-headroom × depth-weight triage score as pages, with a minimum of 5 impressions. It is not expected extra clicks and assumes no target CTR.')
  p('')
  p('| Query | Impressions | Clicks | Position | Triage score |')
  p('|---|---:|---:|---:|---:|')
  for (const r of opps) {
    p(`| ${r.query.replace(/\|/g, '\\|')} | ${num(r.impressions)} | ${r.clicks} | ${r.position.toFixed(1)} | ${r.score} |`)
  }

  h('## Device and country')
  p('| Device | Clicks | Impressions | CTR | Position |')
  p('|---|---:|---:|---:|---:|')
  for (const r of devices) {
    p(`| ${r.Device} | ${int(r.Clicks)} | ${num(int(r.Impressions))} | ${r.CTR} | ${float(r.Position).toFixed(1)} |`)
  }
  p('')
  p('| Country | Clicks | Impressions | CTR | Position |')
  p('|---|---:|---:|---:|---:|')
  for (const r of [...countries].sort((a, b) => int(b.Impressions) - int(a.Impressions)).slice(0, 15)) {
    p(`| ${r.Country} | ${int(r.Clicks)} | ${num(int(r.Impressions))} | ${r.CTR} | ${float(r.Position).toFixed(1)} |`)
  }

  h('## How to use this report')
  p('1. Start with clusters that already have demand but no clicks (position 11–30 is a near-miss; 70+ needs a content/authority plan, not a title tweak).')
  p('2. Verify the page that owns each query in Search Console, then compare its title, H1, first paragraph and actual capabilities with the search intent. Add useful explanations rather than repeated query variants.')
  p('3. Treat blog posts and tool pages separately: a guide should answer the informational query and link to the tool; the tool should own the transactional query.')
  p('4. Re-run this script after each export and commit the generated report under `docs/seo/` so changes are reviewable.')
  p('')

  return lines.join('\n').trimEnd()
}

export function main(args = process.argv.slice(2), root = process.cwd()) {
  const options = parseArgs(args)
  const input = resolveInput(options.input, root)
  try {
    const chart = readTable(input.dir, 'Chart.csv')
    if (!chart.length) throw new Error('Chart.csv is missing or contains no daily rows')
    const report = render({
      chart,
      queries: readTable(input.dir, 'Queries.csv'),
      pages: readTable(input.dir, 'Pages.csv'),
      countries: readTable(input.dir, 'Countries.csv'),
      devices: readTable(input.dir, 'Devices.csv'),
      source: input.source,
    })
    if (options.stdout) {
      console.log(report)
      return null
    }
    const sourceDate = input.source.match(/(\d{4}-\d{2}-\d{2})(?=\.zip$|$)/i)?.[1]
    const label = options.label ?? (dateNumber(sourceDate) !== null ? sourceDate : new Date().toISOString().slice(0, 10))
    const target = path.resolve(root, options.out ?? `docs/seo/gsc-${label}.md`)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, report + '\n')
    console.log(`Wrote ${path.relative(root, target)} (${report.length} chars)`)
    return target
  } finally {
    if (input.temporary) fs.rmSync(input.dir, { recursive: true, force: true })
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main()
