'use client'
import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Field, Stat } from '@/lib/tools/tool-ui'
const STOPWORDS = new Set<string>([
  'the',
  'a',
  'an',
  'and',
  'or',
  'but',
  'if',
  'then',
  'of',
  'in',
  'on',
  'at',
  'to',
  'for',
  'with',
  'by',
  'from',
  'as',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'this',
  'that',
  'these',
  'those',
  'it',
  'its',
  'i',
  'you',
  'he',
  'she',
  'we',
  'they',
  'them',
  'their',
  'our',
  'your',
  'his',
  'her',
  'my',
  'me',
  'us',
  'so',
  'not',
  'no',
  'do',
  'does',
  'did',
  'have',
  'has',
  'had',
])
interface TermRow {
  term: string
  count: number
  density: number
}
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9'-]+/i)
    .map((w) => w.trim())
    .filter((w) => w.length > 0)
}
function analyzeDensity(text: string): {
  totalWords: number
  uniqueTerms: number
  rows: TermRow[]
} {
  const tokens = tokenize(text)
  const kept: string[] = []
  for (const t of tokens) {
    if (STOPWORDS.has(t)) continue
    if (t.length < 2) continue
    kept.push(t)
  }
  const totalWords = tokens.length
  if (kept.length === 0) {
    return { totalWords, uniqueTerms: 0, rows: [] }
  }
  const freq = new Map<string, number>()
  for (const w of kept) {
    freq.set(w, (freq.get(w) ?? 0) + 1)
  }
  const rows: TermRow[] = Array.from(freq.entries()).map(([term, count]) => ({
    term,
    count,
    density: totalWords > 0 ? (count / totalWords) * 100 : 0,
  }))
  rows.sort((a, b) => b.count - a.count || a.term.localeCompare(b.term))
  return {
    totalWords,
    uniqueTerms: freq.size,
    rows: rows.slice(0, 20),
  }
}
export default function KeywordDensityChecker(): React.JSX.Element {
  const [text, setText] = React.useState('')
  const result = React.useMemo(() => analyzeDensity(text), [text])
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Keyword Density Checker</CardTitle>
          <CardDescription>
            Paste your body copy to see the most frequent terms and their
            density. Common English stopwords are ignored so the results focus on
            meaningful keywords.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Field
            label="Body text"
            htmlFor="kd-text"
            hint={`${text.trim().split(/\s+/).filter(Boolean).length} words`}
          >
            <Textarea
              id="kd-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your blog post or page content here..."
              rows={10}
            />
          </Field>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Total words" value={result.totalWords} />
        <Stat label="Unique terms" value={result.uniqueTerms} />
        <Stat
          label="Top keyword"
          value={result.rows[0] ? result.rows[0].term : '—'}
        />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            Keyword density
          </h3>
          <span className="text-xs text-muted-foreground">
            Top {result.rows.length} of {result.uniqueTerms}
          </span>
        </div>
        <Separator className="mb-3" />
        {result.rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Paste body text above to compute keyword density.
          </p>
        ) : (
          <div className="rounded-lg border border-border">
            <ScrollArea className="max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">Keyword</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Density</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.rows.map((row) => {
                    const high = row.density >= 3
                    return (
                      <TableRow key={row.term}>
                        <TableCell className="font-medium">
                          {row.term}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {row.count}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={high ? 'destructive' : 'secondary'}
                          >
                            {row.density.toFixed(2)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Densities above ~3% may read as keyword stuffing to search engines.
        </p>
      </div>
    </div>
  )
}