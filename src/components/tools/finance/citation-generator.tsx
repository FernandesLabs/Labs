'use client'
import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Field, ResultBox } from '@/lib/tools/tool-ui'
type SourceType = 'book' | 'website' | 'journal' | 'newspaper'
type Style = 'APA' | 'MLA' | 'Chicago'
interface Fields {
  title: string
  authors: string
  year: string
  publisher: string
  city: string
  url: string
  accessDate: string
  siteName: string
  journalName: string
  volume: string
  issue: string
  pages: string
}
const EMPTY: Fields = {
  title: '',
  authors: '',
  year: '',
  publisher: '',
  city: '',
  url: '',
  accessDate: '',
  siteName: '',
  journalName: '',
  volume: '',
  issue: '',
  pages: '',
}
function splitAuthors(s: string): string[] {
  return s
    .split(/[;\n]/)
    .map((a) => a.trim())
    .filter(Boolean)
}
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => `${p[0]?.toUpperCase() ?? ''}.`)
    .join(' ')
}
function apaFirstAuthor(name: string): string {
  const trimmed = name.trim()
  if (trimmed.includes(',')) {
    const [last, rest] = trimmed.split(',', 2).map((s) => s.trim())
    return rest ? `${last}, ${initials(rest)}` : last
  }
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  const last = parts.pop() as string
  return `${last}, ${initials(parts.join(' '))}`
}
function apaAuthors(authors: string[]): string {
  if (authors.length === 0) return ''
  const formatted = authors.map(apaFirstAuthor)
  if (formatted.length === 1) return formatted[0]
  if (formatted.length === 2) return `${formatted[0]} & ${formatted[1]}`
  return `${formatted.slice(0, -1).join(', ')}, & ${formatted[formatted.length - 1]}`
}
function mlaFirstAuthor(name: string): string {
  const trimmed = name.trim()
  if (trimmed.includes(',')) return trimmed
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  const last = parts.pop() as string
  return `${last}, ${parts.join(' ')}`
}
function mlaAuthors(authors: string[]): string {
  if (authors.length === 0) return ''
  if (authors.length === 1) return mlaFirstAuthor(authors[0])
  if (authors.length === 2) return `${mlaFirstAuthor(authors[0])}, and ${authors[1]}`
  return `${mlaFirstAuthor(authors[0])}, et al.`
}
function chicagoFirstAuthor(name: string): string {
  const trimmed = name.trim()
  if (trimmed.includes(',')) {
    const [last, rest] = trimmed.split(',', 2).map((s) => s.trim())
    return rest ? `${rest} ${last}` : last
  }
  return trimmed
}
function chicagoAuthors(authors: string[]): string {
  if (authors.length === 0) return ''
  const first = chicagoFirstAuthor(authors[0])
  if (authors.length === 1) return first
  if (authors.length === 2) return `${first} and ${chicagoFirstAuthor(authors[1])}`
  return `${first} et al.`
}
function buildCitation(type: SourceType, style: Style, f: Fields): string {
  const authors = splitAuthors(f.authors)
  const year = f.year.trim()
  const title = f.title.trim()
  const publisher = f.publisher.trim()
  const url = f.url.trim()
  const accessDate = f.accessDate.trim()
  const journal = f.journalName.trim()
  const siteName = f.siteName.trim()
  const city = f.city.trim()
  const vol = f.volume.trim()
  const iss = f.issue.trim()
  const pages = f.pages.trim()
  const parts: string[] = []
  const a =
    style === 'APA'
      ? apaAuthors(authors)
      : style === 'MLA'
        ? mlaAuthors(authors)
        : chicagoAuthors(authors)
  if (a) parts.push(`${a}.`)
  if (style === 'APA') {
    if (year) parts.push(`(${year}).`)
    if (type === 'book') {
      if (title) parts.push(`*${title}*.`)
      if (publisher) parts.push(`${publisher}.`)
    } else if (type === 'website') {
      if (title) parts.push(`${title}.`)
      if (siteName) parts.push(`*${siteName}*.`)
      if (url) parts.push(url)
      if (accessDate) parts.push(`Retrieved ${accessDate}`)
    } else if (type === 'journal') {
      if (title) parts.push(`${title}.`)
      if (journal) parts.push(`*${journal}*`)
      if (vol && iss) parts.push(`${vol}(${iss})`)
      else if (vol) parts.push(vol)
      if (pages) parts.push(`${pages}.`)
    } else if (type === 'newspaper') {
      if (title) parts.push(`${title}.`)
      if (journal) parts.push(`*${journal}*.`)
      if (url) parts.push(url)
    }
  } else if (style === 'MLA') {
    if (title) parts.push(`"${title}."`)
    if (type === 'book') {
      if (publisher) parts.push(`${publisher},`)
      if (year) parts.push(`${year}.`)
    } else if (type === 'website') {
      if (siteName) parts.push(`*${siteName}*.`)
      if (year) parts.push(`${year},`)
      if (url) parts.push(`${url}.`)
      if (accessDate) parts.push(`Accessed ${accessDate}.`)
    } else if (type === 'journal') {
      if (journal) parts.push(`*${journal}*.`)
      if (vol && iss) parts.push(`vol. ${vol}, no. ${iss},`)
      else if (vol) parts.push(`vol. ${vol},`)
      if (year) parts.push(`${year},`)
      if (pages) parts.push(`pp. ${pages}.`)
    } else if (type === 'newspaper') {
      if (journal) parts.push(`*${journal}*.`)
      if (year) parts.push(`${year},`)
      if (url) parts.push(`${url}.`)
    }
  } else {
    // Chicago
    if (type === 'book') {
      if (title) parts.push(`*${title}*.`)
      if (city && publisher) parts.push(`${city}: ${publisher},`)
      else if (publisher) parts.push(`${publisher},`)
      if (year) parts.push(`${year}.`)
    } else if (type === 'website') {
      if (title) parts.push(`"${title}."`)
      if (siteName) parts.push(`*${siteName}*.`)
      if (year) parts.push(`${year}.`)
      if (url) parts.push(`${url}.`)
    } else if (type === 'journal') {
      if (title) parts.push(`"${title}."`)
      if (journal) parts.push(`*${journal}*`)
      const volIss: string[] = []
      if (vol) volIss.push(vol)
      if (iss) volIss.push(`no. ${iss}`)
      if (volIss.length > 0) parts.push(volIss.join(', '))
      if (year) parts.push(`(${year})`)
      if (pages) parts.push(`: ${pages}.`)
    } else if (type === 'newspaper') {
      if (title) parts.push(`"${title}."`)
      if (journal) parts.push(`*${journal}*.`)
      if (year) parts.push(`${year}.`)
    }
  }
  let result = parts
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\.\s*\./g, '.')
    .replace(/,\s*\./g, '.')
    .replace(/\s+\./g, '.')
    .trim()
  if (result && !/[.!?)]$/.test(result)) result += '.'
  return result
}
const SOURCE_TYPES: { value: SourceType; label: string }[] = [
  { value: 'book', label: 'Book' },
  { value: 'website', label: 'Website' },
  { value: 'journal', label: 'Journal article' },
  { value: 'newspaper', label: 'Newspaper article' },
]
/**
 * Citation Generator
 * Pick a source type and fill in the relevant fields. Generates a citation in
 * three styles (APA / MLA / Chicago) live in a ResultBox with copy & download.
 * Missing fields are skipped gracefully.
 */
export default function CitationGenerator() {
  const [type, setType] = React.useState<SourceType>('book')
  const [style, setStyle] = React.useState<Style>('APA')
  const [fields, setFields] = React.useState<Fields>(EMPTY)
  const update = (patch: Partial<Fields>) =>
    setFields((prev) => ({ ...prev, ...patch }))
  const citation = React.useMemo(
    () => buildCitation(type, style, fields),
    [type, style, fields],
  )
  const downloadName = `citation-${type}-${style.toLowerCase()}.txt`
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Source type" htmlFor="cite-type">
            <Select value={type} onValueChange={(v) => setType(v as SourceType)}>
              <SelectTrigger id="cite-type" className="w-full sm:w-72" aria-label="Source type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_TYPES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Title"
              htmlFor="cite-title"
              hint={
                type === 'book' ? 'italicized in output' : 'quoted in output'
              }
            >
              <Input
                id="cite-title"
                value={fields.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder={
                  type === 'book'
                    ? 'The Great Gatsby'
                    : 'A brief history of time'
                }
                aria-label="Title"
              />
            </Field>
            <Field
              label="Author(s)"
              htmlFor="cite-authors"
              hint="separate with ; or newline"
            >
              <Input
                id="cite-authors"
                value={fields.authors}
                onChange={(e) => update({ authors: e.target.value })}
                placeholder="Jane Doe; John Smith"
                aria-label="Authors"
              />
            </Field>
            <Field label="Year" htmlFor="cite-year">
              <Input
                id="cite-year"
                inputMode="numeric"
                value={fields.year}
                onChange={(e) => update({ year: e.target.value })}
                placeholder="2024"
                aria-label="Publication year"
              />
            </Field>
            {type === 'book' ? (
              <>
                <Field label="Publisher" htmlFor="cite-publisher">
                  <Input
                    id="cite-publisher"
                    value={fields.publisher}
                    onChange={(e) => update({ publisher: e.target.value })}
                    placeholder="Penguin Books"
                    aria-label="Publisher"
                  />
                </Field>
                <Field label="City" htmlFor="cite-city" hint="Chicago only">
                  <Input
                    id="cite-city"
                    value={fields.city}
                    onChange={(e) => update({ city: e.target.value })}
                    placeholder="New York"
                    aria-label="Publication city"
                  />
                </Field>
              </>
            ) : null}
            {type === 'website' || type === 'newspaper' ? (
              <>
                <Field label="URL" htmlFor="cite-url">
                  <Input
                    id="cite-url"
                    value={fields.url}
                    onChange={(e) => update({ url: e.target.value })}
                    placeholder="https://example.com/article"
                    aria-label="URL"
                  />
                </Field>
                {type === 'website' ? (
                  <Field label="Site name" htmlFor="cite-site">
                    <Input
                      id="cite-site"
                      value={fields.siteName}
                      onChange={(e) => update({ siteName: e.target.value })}
                      placeholder="Example News"
                      aria-label="Site name"
                    />
                  </Field>
                ) : null}
                {type === 'website' ? (
                  <Field
                    label="Access date"
                    htmlFor="cite-access"
                    hint="APA: retrieved; MLA: accessed"
                  >
                    <Input
                      id="cite-access"
                      value={fields.accessDate}
                      onChange={(e) => update({ accessDate: e.target.value })}
                      placeholder="October 5, 2024"
                      aria-label="Access date"
                    />
                  </Field>
                ) : null}
              </>
            ) : null}
            {type === 'journal' || type === 'newspaper' ? (
              <Field
                label={type === 'journal' ? 'Journal name' : 'Newspaper name'}
                htmlFor="cite-journal"
              >
                <Input
                  id="cite-journal"
                  value={fields.journalName}
                  onChange={(e) => update({ journalName: e.target.value })}
                  placeholder={type === 'journal' ? 'Nature' : 'The New York Times'}
                  aria-label={type === 'journal' ? 'Journal name' : 'Newspaper name'}
                />
              </Field>
            ) : null}
            {type === 'journal' ? (
              <>
                <Field label="Volume" htmlFor="cite-vol">
                  <Input
                    id="cite-vol"
                    inputMode="numeric"
                    value={fields.volume}
                    onChange={(e) => update({ volume: e.target.value })}
                    placeholder="42"
                    aria-label="Volume"
                  />
                </Field>
                <Field label="Issue" htmlFor="cite-issue">
                  <Input
                    id="cite-issue"
                    inputMode="numeric"
                    value={fields.issue}
                    onChange={(e) => update({ issue: e.target.value })}
                    placeholder="3"
                    aria-label="Issue"
                  />
                </Field>
                <Field label="Pages" htmlFor="cite-pages">
                  <Input
                    id="cite-pages"
                    value={fields.pages}
                    onChange={(e) => update({ pages: e.target.value })}
                    placeholder="145–167"
                    aria-label="Pages"
                  />
                </Field>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Tabs value={style} onValueChange={(v) => setStyle(v as Style)}>
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              <TabsTrigger value="APA">APA</TabsTrigger>
              <TabsTrigger value="MLA">MLA</TabsTrigger>
              <TabsTrigger value="Chicago">Chicago</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{style}</Badge>
            <Badge variant="outline" className="capitalize">{type}</Badge>
          </div>
          <ResultBox
            value={citation}
            label={`${style} citation`}
            mono={false}
            rows={3}
            downloadName={downloadName}
            empty="Fill in the fields above to generate a citation."
          />
          <p className="text-xs text-muted-foreground">
            Citations are built from whatever fields you provide. Author names
            accept “First Last” or “Last, First” — separate multiple authors
            with <span className="font-mono">;</span> or a newline. Asterisks
            indicate italicized titles; quotes indicate article titles.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}