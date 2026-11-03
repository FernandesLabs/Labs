/// <reference types="bun-types" />
import { afterEach, describe, expect, test } from 'bun:test'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  aggregateRows,
  compareRecentPeriods,
  opportunity,
  parseArgs,
  parseCsv,
  render,
} from '../scripts/seo/gsc-report.mjs'

function dailyRows(start: string, count: number) {
  const startMs = Date.parse(`${start}T00:00:00Z`)
  return Array.from({ length: count }, (_, i) => ({
    Date: new Date(startMs + i * 86_400_000).toISOString().slice(0, 10),
    Clicks: i < 28 ? '1' : '2',
    Impressions: '100',
    CTR: i < 28 ? '1%' : '2%',
    Position: i < 28 ? '80' : '40',
  }))
}

describe('GSC CSV parsing and aggregation', () => {
  test('reads quoted queries, escaped quotes and Windows line endings', () => {
    expect(parseCsv('Top queries,Clicks,Impressions\r\n"a, b and ""c""",2,"1,000"\r\n'))
      .toEqual([{ 'Top queries': 'a, b and "c"', Clicks: '2', Impressions: '1,000' }])
  })

  test('weights position by impressions and recalculates CTR from totals', () => {
    const totals = aggregateRows([
      { Date: '2026-10-01', Clicks: '1', Impressions: '10', Position: '10' },
      { Date: '2026-10-02', Clicks: '1', Impressions: '30', Position: '30' },
    ])
    expect(totals.clicks).toBe(2)
    expect(totals.impressions).toBe(40)
    expect(totals.position).toBe(25)
    expect(totals.ctr).toBe(0.05)
    expect(aggregateRows([]).ctr).toBeNull()
    expect(aggregateRows([]).position).toBeNull()
  })
})

describe('complete 28-day comparison windows', () => {
  test('sorts dates and compares equal adjacent periods across a year boundary', () => {
    const result = compareRecentPeriods(dailyRows('2025-12-15', 56).reverse())
    expect(result.available).toBe(true)
    expect(result.previous).toMatchObject({ start: '2025-12-15', end: '2026-01-11', days: 28, clicks: 28, impressions: 2800, position: 80 })
    expect(result.current).toMatchObject({ start: '2026-01-12', end: '2026-02-08', days: 28, clicks: 56, impressions: 2800, position: 40 })
  })

  test('handles leap day and the daylight-saving boundary as calendar dates', () => {
    const leap = compareRecentPeriods(dailyRows('2024-02-01', 56))
    expect(leap.current?.start).toBe('2024-02-29')
    expect(leap.current?.end).toBe('2024-03-27')
    expect(compareRecentPeriods(dailyRows('2026-03-01', 56)).available).toBe(true)
  })

  test('refuses short periods, gaps, duplicate dates and invalid calendar dates', () => {
    expect(compareRecentPeriods(dailyRows('2026-01-01', 55)).available).toBe(false)
    const gapped = dailyRows('2026-01-01', 57).filter((_, i) => i !== 30)
    expect(compareRecentPeriods(gapped).reason).toContain('calendar gap')
    const duplicate = dailyRows('2026-01-01', 56)
    duplicate[1] = { ...duplicate[0] }
    expect(compareRecentPeriods(duplicate).reason).toContain('duplicate')
    const invalid = dailyRows('2026-01-01', 56)
    invalid[0].Date = '2026-02-30'
    expect(compareRecentPeriods(invalid).reason).toContain('invalid')
  })

  test('uses the latest 56 days even when the older history has a gap', () => {
    const rows = dailyRows('2026-01-01', 70).filter((_, i) => i !== 3)
    const result = compareRecentPeriods(rows)
    expect(result.available).toBe(true)
    expect(result.previous?.start).toBe('2026-01-15')
    expect(result.current?.end).toBe('2026-03-11')
  })
})

describe('report interpretation', () => {
  test('shows period changes, export coverage and the lack of query-to-page mapping', () => {
    const report = render({
      chart: dailyRows('2026-09-02', 56),
      queries: [{ 'Top queries': 'robots txt generator', Clicks: '0', Impressions: '100', Position: '18', CTR: '0%' }],
      pages: [], countries: [], devices: [], source: 'fixture.zip', generatedDate: '2026-10-29',
    })
    expect(report).toContain('| Clicks | 28 | 56 | +28 |')
    expect(report).toContain('| CTR | 1.00% | 2.00% | +1.00 percentage points |')
    expect(report).toContain('| Impression-weighted position | 80.00 | 40.00 | -40.00 |')
    expect(report).toContain('does not establish that an SEO change caused')
    expect(report).toContain('1,000 rows')
    expect(report).toContain('anonymized queries are omitted')
    expect(report).toContain('no query-to-page mapping')
    expect(report).toContain('**0 clicks**, compared with **84 chart clicks**')
    expect(report).toContain(`| robots txt generator | 100 | 0 | 18.0 | ${opportunity(100, 18)} |`)
    expect(report).toContain('assumes no target CTR')
  })

  test('shows unavailable comparison and no fabricated zero-position improvement', () => {
    const rows = dailyRows('2026-01-01', 56).map((r) => ({ ...r, Clicks: '0', Impressions: '0' }))
    const report = render({ chart: rows, queries: [], pages: [], countries: [], devices: [], source: 'empty.csv' })
    expect(report).toContain('| Impression-weighted position | — | — | — |')
    expect(render({ chart: rows.slice(0, 5), queries: [], pages: [], countries: [], devices: [], source: 'short.csv' }))
      .toContain('Comparison unavailable:')
  })

  test('triages a near-first-page query ahead of an equally visible deep result', () => {
    expect(opportunity(100, 18)).toBeGreaterThan(opportunity(100, 85))
    expect(opportunity(100, 100)).toBe(0)
  })
})

describe('GSC report CLI', () => {
  const tempRoots: string[] = []
  afterEach(() => { for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true }) })
  function rootDir() {
    const root = mkdtempSync(path.join(tmpdir(), 'fl-gsc-test-'))
    tempRoots.push(root)
    return root
  }
  const script = path.resolve('scripts/seo/gsc-report.mjs')
  function run(root: string, args: string[]) {
    const result = Bun.spawnSync([process.execPath, script, ...args], { cwd: root })
    if (result.exitCode !== 0) throw new Error(result.stderr.toString())
    expect(result.exitCode).toBe(0)
    return result.stdout.toString()
  }

  test('parses a positional date label, explicit output and stdout; rejects ambiguous flags', () => {
    expect(parseArgs(['export.zip', '2026-10-29'])).toEqual({ input: 'export.zip', label: '2026-10-29', out: null, stdout: false })
    expect(parseArgs(['2026-10-29']).label).toBe('2026-10-29')
    expect(parseArgs(['--', 'export.zip', '--out', 'report.md']).out).toBe('report.md')
    expect(parseArgs(['export.zip', '--stdout']).stdout).toBe(true)
    expect(() => parseArgs(['--out'])).toThrow('requires a file path')
    expect(() => parseArgs(['--out', 'r.md', '--stdout'])).toThrow('either')
    expect(() => parseArgs(['export.zip', '2026-02-30'])).toThrow('valid YYYY-MM-DD')
    expect(() => parseArgs(['2026-02-30'])).toThrow('valid YYYY-MM-DD')
    expect(() => parseArgs(['--typo'])).toThrow('Unknown option')
  })

  test('writes the default dated report, respects --out, and leaves --stdout file-free', () => {
    const root = rootDir()
    mkdirSync(path.join(root, 'export'))
    writeFileSync(path.join(root, 'export/Chart.csv'), 'Date,Clicks,Impressions,CTR,Position\n2026-10-27,1,10,10%,20\n')
    expect(run(root, ['export', '2026-10-29'])).toContain('Wrote docs/seo/gsc-2026-10-29.md')
    expect(readFileSync(path.join(root, 'docs/seo/gsc-2026-10-29.md'), 'utf8')).toContain('**Source:** `export`')
    run(root, ['export', '--out', 'custom/report.md'])
    expect(existsSync(path.join(root, 'custom/report.md'))).toBe(true)
    rmSync(path.join(root, 'docs'), { recursive: true })
    expect(run(root, ['export', '--stdout'])).toStartWith('# Google Search Console report')
    expect(existsSync(path.join(root, 'docs'))).toBe(false)
  })

  test('default input retains the real archive name and derives its report date', () => {
    const root = rootDir()
    // Stored ZIP containing one small Chart.csv; no zip-writing dependency is needed.
    const archive = 'UEsDBBQAAAAAAHh0XV13gpvBPAAAADwAAAAJAAAAQ2hhcnQuY3N2RGF0ZSxDbGlja3MsSW1wcmVzc2lvbnMsQ1RSLFBvc2l0aW9uCjIwMjYtMTAtMjcsMSwxMCwxMCUsMjAKUEsBAhQDFAAAAAAAeHRdXXeCm8E8AAAAPAAAAAkAAAAAAAAAAAAAAIABAAAAAENoYXJ0LmNzdlBLBQYAAAAAAQABADcAAABjAAAAAAA='
    writeFileSync(path.join(root, 'site-Performance-on-Search-2026-10-29.zip'), Buffer.from(archive, 'base64'))
    run(root, [])
    expect(readFileSync(path.join(root, 'docs/seo/gsc-2026-10-29.md'), 'utf8')).toContain('**Source:** `site-Performance-on-Search-2026-10-29.zip`')
  })
})
