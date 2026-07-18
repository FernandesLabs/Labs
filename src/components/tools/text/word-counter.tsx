'use client'

import * as React from 'react'
import { Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Field, Stat } from '@/lib/tools/tool-ui'

interface WordStats {
  words: number
  characters: number
  charactersNoSpaces: number
  sentences: number
  paragraphs: number
  readingTimeMin: number
  speakingTimeMin: number
}

interface FreqEntry {
  word: string
  count: number
}

const READING_WPM = 200
const SPEAKING_WPM = 130

function computeStats(text: string): WordStats {
  if (!text) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeMin: 0,
      speakingTimeMin: 0,
    }
  }
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const words = (text.match(/\S+/g) || []).length
  const sentences = (text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || []).filter(
    (s) => s.trim().length > 0
  ).length
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length
  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTimeMin: words / READING_WPM,
    speakingTimeMin: words / SPEAKING_WPM,
  }
}

function formatMinutes(minutes: number): string {
  if (minutes <= 0) return '0s'
  const totalSeconds = Math.round(minutes * 60)
  if (totalSeconds < 60) return `${totalSeconds}s`
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return s === 0 ? `${m}m` : `${m}m ${s}s`
}

function computeFrequency(text: string, limit: number): FreqEntry[] {
  const tokens = (text.toLowerCase().match(/[a-z0-9''-]+/g) || []) as string[]
  const stops = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'of',
    'to',
    'in',
    'on',
    'at',
    'for',
    'is',
    'it',
    'as',
    'by',
    'with',
    'this',
    'that',
    'i',
    'you',
    'be',
    'are',
    'was',
    'were',
  ])
  const counts = new Map<string, number>()
  for (const t of tokens) {
    if (t.length < 2 || stops.has(t)) continue
    counts.set(t, (counts.get(t) || 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, limit)
}

export default function WordCounter() {
  const [text, setText] = React.useState('')

  const stats = React.useMemo(() => computeStats(text), [text])
  const freq = React.useMemo(() => computeFrequency(text, 10), [text])

  return (
    <div className="space-y-5">
      <Field label="Text" htmlFor="wc-text" hint={`${stats.characters} chars`}>
        <Textarea
          id="wc-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here. Stats update live."
          className="min-h-40 font-sans"
          aria-describedby="wc-stats"
        />
      </Field>

      <div
        id="wc-stats"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        role="status"
        aria-live="polite"
      >
        <Stat label="Words" value={stats.words.toLocaleString()} />
        <Stat label="Characters" value={stats.characters.toLocaleString()} />
        <Stat
          label="No spaces"
          value={stats.charactersNoSpaces.toLocaleString()}
        />
        <Stat label="Sentences" value={stats.sentences.toLocaleString()} />
        <Stat label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
        <Stat
          label="Reading time"
          value={formatMinutes(stats.readingTimeMin)}
        />
        <Stat
          label="Speaking time"
          value={formatMinutes(stats.speakingTimeMin)}
        />
        <Stat
          label="WPM read / speak"
          value={`${READING_WPM} / ${SPEAKING_WPM}`}
        />
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setText('')
          }}
          disabled={text.length === 0}
          className="text-muted-foreground"
        >
          <Eraser className="size-4" />
          Clear
        </Button>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Top 10 word frequency
          </h3>
          <span className="text-xs text-muted-foreground">
            Common stop words excluded
          </span>
        </div>
        {freq.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 px-3 py-6 text-center text-sm text-muted-foreground">
            Enter text to see word frequency.
          </div>
        ) : (
          <div className="rounded-lg border border-border">
            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-right">#</TableHead>
                    <TableHead>Word</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    const total = freq.reduce((s, e) => s + e.count, 0)
                    return freq.map((entry, idx) => {
                      const pct = total > 0 ? (entry.count / total) * 100 : 0
                      return (
                        <TableRow key={entry.word}>
                          <TableCell className="text-right text-muted-foreground tabular-nums">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-mono">
                            {entry.word}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {entry.count.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground tabular-nums">
                            {pct.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      )
                    })
                  })()}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
