'use client'

import * as React from 'react'
import { Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Field, Stat } from '@/lib/tools/tool-ui'

const TWEET_MAX = 280

interface CharStats {
  characters: number
  charactersNoSpaces: number
  letters: number
  digits: number
  whitespace: number
  lines: number
  bytes: number
}

function computeStats(text: string): CharStats {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      letters: 0,
      digits: 0,
      whitespace: 0,
      lines: 0,
      bytes: 0,
    }
  }
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  let letters = 0
  let digits = 0
  let whitespace = 0
  for (const ch of text) {
    if (/\p{L}/u.test(ch)) letters++
    else if (/\p{N}/u.test(ch)) digits++
    if (/\s/.test(ch)) whitespace++
  }
  const lines = text === '' ? 0 : text.split('\n').length
  const bytes = new TextEncoder().encode(text).length
  return {
    characters,
    charactersNoSpaces,
    letters,
    digits,
    whitespace,
    lines,
    bytes,
  }
}

export default function CharacterCounter() {
  const [text, setText] = React.useState('')
  const stats = React.useMemo(() => computeStats(text), [text])

  const tweetPct = Math.min(100, (stats.characters / TWEET_MAX) * 100)
  const tweetRemaining = TWEET_MAX - stats.characters
  const tweetOver = stats.characters > TWEET_MAX

  return (
    <div className="space-y-5">
      <Field
        label="Text"
        htmlFor="cc-text"
        hint={`${stats.characters.toLocaleString()} characters`}
      >
        <Textarea
          id="cc-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text — counts update live."
          className="min-h-40 font-sans"
          aria-describedby="cc-stats"
        />
      </Field>

      <div
        id="cc-stats"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        role="status"
        aria-live="polite"
      >
        <Stat label="Characters" value={stats.characters.toLocaleString()} />
        <Stat
          label="No spaces"
          value={stats.charactersNoSpaces.toLocaleString()}
        />
        <Stat label="Letters" value={stats.letters.toLocaleString()} />
        <Stat label="Digits" value={stats.digits.toLocaleString()} />
        <Stat label="Whitespace" value={stats.whitespace.toLocaleString()} />
        <Stat label="Lines" value={stats.lines.toLocaleString()} />
        <Stat
          label="Bytes (UTF-8)"
          value={stats.bytes.toLocaleString()}
          accent={
            stats.bytes > stats.characters * 4
              ? 'oklch(0.6 0.2 20)'
              : undefined
          }
        />
        <Stat
          label="Bytes / chars"
          value={
            stats.characters > 0
              ? (stats.bytes / stats.characters).toFixed(2)
              : '0'
          }
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            Tweet length
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              Limit {TWEET_MAX} characters
            </span>
          </h3>
          <span
            className={`font-mono text-sm tabular-nums ${
              tweetOver
                ? 'text-destructive'
                : tweetRemaining <= 20
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-muted-foreground'
            }`}
          >
            {stats.characters.toLocaleString()} / {TWEET_MAX}
          </span>
        </div>
        <Progress
          value={tweetPct}
          className={
            tweetOver
              ? 'bg-destructive/20 [&>[data-slot=progress-indicator]]:bg-destructive'
              : undefined
          }
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {tweetOver
            ? `${Math.abs(tweetRemaining).toLocaleString()} characters over the limit.`
            : `${tweetRemaining.toLocaleString()} characters remaining.`}
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setText('')}
          disabled={text.length === 0}
          className="text-muted-foreground"
        >
          <Eraser className="size-4" />
          Clear
        </Button>
      </div>
    </div>
  )
}
