'use client'
import * as React from 'react'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
type ChangeFreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'
const FREQS: ChangeFreq[] = [
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
]
function isValidUrl(url: string): boolean {
  if (!url) return false
  try {
    const u = new URL(url.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}
function escXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
interface ParsedUrl {
  url: string
  valid: boolean
}
function parseUrls(raw: string): ParsedUrl[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((url) => ({ url, valid: isValidUrl(url) }))
}
function buildSitemap(
  urls: ParsedUrl[],
  changefreq: ChangeFreq,
  priority: number
): string {
  const validUrls = urls.filter((u) => u.valid)
  if (validUrls.length === 0) return ''
  const lastmod = new Date().toISOString().split('T')[0]
  const priorityStr = priority.toFixed(1)
  const body = validUrls
    .map((u) => {
      const lines: string[] = ['  <url>']
      lines.push(`    <loc>${escXml(u.url)}</loc>`)
      lines.push(`    <lastmod>${lastmod}</lastmod>`)
      lines.push(`    <changefreq>${changefreq}</changefreq>`)
      lines.push(`    <priority>${priorityStr}</priority>`)
      lines.push('  </url>')
      return lines.join('\n')
    })
    .join('\n')
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    body +
    '\n</urlset>\n'
  )
}
export default function SitemapGenerator(): React.JSX.Element {
  const [raw, setRaw] = React.useState('')
  const [changefreq, setChangefreq] = React.useState<ChangeFreq>('weekly')
  const [priority, setPriority] = React.useState(0.8)
  const parsed = React.useMemo(() => parseUrls(raw), [raw])
  const validCount = parsed.filter((p) => p.valid).length
  const invalidCount = parsed.length - validCount
  const output = React.useMemo(
    () => buildSitemap(parsed, changefreq, priority),
    [parsed, changefreq, priority]
  )
  const loadSample = (): void => {
    setRaw(
      [
        'https://example.com/',
        'https://example.com/about',
        'https://example.com/blog',
        'https://example.com/blog/post-1',
        'not-a-url',
      ].join('\n')
    )
    toast.success('Sample URLs loaded')
  }
  const clearAll = (): void => {
    setRaw('')
    toast.success('Cleared')
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Sitemap Generator</CardTitle>
          <CardDescription>
            Paste a list of URLs (one per line) to produce a valid XML sitemap
            with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">lastmod</code>,{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">changefreq</code>, and{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">priority</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="URLs"
            htmlFor="sm-urls"
            hint={`${validCount} valid · ${invalidCount} invalid`}
          >
            <Textarea
              id="sm-urls"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder={'https://example.com/\nhttps://example.com/about'}
              rows={8}
              className="font-mono"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Change frequency" htmlFor="sm-freq">
              <Select
                value={changefreq}
                onValueChange={(v) => setChangefreq(v as ChangeFreq)}
              >
                <SelectTrigger id="sm-freq">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Priority" htmlFor="sm-priority" hint={priority.toFixed(1)}>
              <Slider
                id="sm-priority"
                min={0}
                max={1}
                step={0.1}
                value={[priority]}
                onValueChange={(vals) => setPriority(vals[0] ?? 0.8)}
              />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadSample}
            >
              Load sample
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearAll}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total URLs" value={parsed.length} />
        <Stat
          label="Valid"
          value={validCount}
          accent="oklch(0.6 0.17 150)"
        />
        <Stat
          label="Invalid"
          value={invalidCount}
          accent={invalidCount > 0 ? 'oklch(0.6 0.2 25)' : undefined}
        />
        <Stat label="Priority" value={priority.toFixed(1)} />
      </div>
      {invalidCount > 0 ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium text-amber-700 dark:text-amber-400">
            <AlertTriangle className="size-4" />
            {invalidCount} invalid URL{invalidCount > 1 ? 's' : ''} ignored
          </div>
          <ul className="mt-2 space-y-1">
            {parsed
              .filter((p) => !p.valid)
              .map((p, i) => (
                <li
                  key={`${p.url}-${i}`}
                  className="font-mono text-xs text-amber-700 dark:text-amber-400"
                >
                  {p.url}
                </li>
              ))}
          </ul>
        </div>
      ) : validCount > 0 ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          All URLs valid and ready for the sitemap.
        </div>
      ) : null}
      <ResultBox
        value={output}
        label="sitemap.xml"
        downloadName="sitemap.xml"
        rows={12}
        empty="Paste URLs above to generate a sitemap."
      />
    </div>
  )
}