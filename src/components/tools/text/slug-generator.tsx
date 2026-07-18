'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, ResultBox } from '@/lib/tools/tool-ui'

const STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'the',
  'of',
  'to',
  'in',
  'on',
  'at',
  'for',
  'with',
  'or',
  'but',
  'is',
  'are',
  'be',
  'as',
  'by',
  'this',
  'that',
  'it',
  'from',
  'into',
  'your',
  'you',
  'i',
  'me',
  'my',
  'we',
  'our',
])

type SeparatorId = 'dash' | 'underscore'

function stripDiacritics(input: string): string {
  return input.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
}

function buildSlug(
  raw: string,
  separator: SeparatorId,
  lowercase: boolean,
  stripStopwords: boolean,
  maxLength: number
): string {
  if (!raw.trim()) return ''
  let work = stripDiacritics(raw)
  // Replace any non-alphanumeric run with a space to mark word boundaries.
  work = work.replace(/[^A-Za-z0-9]+/g, ' ').trim()
  let words = work.split(/\s+/).filter((w) => w.length > 0)
  if (lowercase) {
    words = words.map((w) => w.toLowerCase())
  }
  if (stripStopwords) {
    words = words.filter((w) => !STOPWORDS.has(w.toLowerCase()))
  }
  const sep = separator === 'dash' ? '-' : '_'
  let slug = words.join(sep)
  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.slice(0, maxLength)
    // Trim any trailing separator fragment to keep it clean.
    slug = slug.replace(new RegExp(`${sep}$`), '')
  }
  return slug
}

export default function SlugGenerator() {
  const [text, setText] = React.useState('')
  const [separator, setSeparator] = React.useState<SeparatorId>('dash')
  const [lowercase, setLowercase] = React.useState(true)
  const [stripStopwords, setStripStopwords] = React.useState(false)
  const [maxLength, setMaxLength] = React.useState(80)

  const slug = React.useMemo(
    () =>
      buildSlug(text, separator, lowercase, stripStopwords, maxLength),
    [text, separator, lowercase, stripStopwords, maxLength]
  )

  return (
    <div className="space-y-5">
      <Field
        label="Text"
        htmlFor="sg-input"
        hint="Live preview — types as you type"
      >
        <Input
          id="sg-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. The Quick Brown Fox — A Tale of Two Cities"
          autoComplete="off"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Separator" htmlFor="sg-sep">
          <Select
            value={separator}
            onValueChange={(v) => setSeparator(v as SeparatorId)}
          >
            <SelectTrigger id="sg-sep" className="w-full">
              <SelectValue placeholder="Pick separator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dash">Hyphen ( - )</SelectItem>
              <SelectItem value="underscore">Underscore ( _ )</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field
          label="Max length"
          htmlFor="sg-max"
          hint={`${maxLength} characters`}
        >
          <div className="flex items-center gap-3 pt-2">
            <Slider
              id="sg-max"
              value={[maxLength]}
              min={0}
              max={200}
              step={1}
              onValueChange={(vals) => setMaxLength(vals[0] ?? 80)}
              className="flex-1"
              aria-label="Maximum slug length"
            />
            <span className="w-10 text-right font-mono text-sm tabular-nums text-muted-foreground">
              {maxLength === 0 ? '∞' : maxLength}
            </span>
          </div>
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <div className="pr-3">
            <Label
              htmlFor="sg-lower"
              className="text-sm font-medium text-foreground"
            >
              Lowercase
            </Label>
            <p className="text-xs text-muted-foreground">
              Convert all letters to lowercase.
            </p>
          </div>
          <Switch
            id="sg-lower"
            checked={lowercase}
            onCheckedChange={setLowercase}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <div className="pr-3">
            <Label
              htmlFor="sg-stop"
              className="text-sm font-medium text-foreground"
            >
              Strip stopwords
            </Label>
            <p className="text-xs text-muted-foreground">
              Remove common words (the, a, of, …).
            </p>
          </div>
          <Switch
            id="sg-stop"
            checked={stripStopwords}
            onCheckedChange={setStripStopwords}
          />
        </div>
      </div>

      <ResultBox
        value={slug}
        label="Slug"
        downloadName="slug.txt"
        empty="Type something above to generate a URL-safe slug."
      />
    </div>
  )
}
