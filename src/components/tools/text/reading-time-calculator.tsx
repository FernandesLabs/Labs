'use client'
import * as React from 'react'
import { Clock, Mic, BookOpen, Eraser, FileText } from 'lucide-react'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, Stat } from '@/lib/tools/tool-ui'
interface ReadingSpeed {
  label: string
  wpm: number
  kind: 'reading' | 'speaking'
  icon: React.ReactNode
}
const SPEEDS: ReadingSpeed[] = [
  { label: 'Slow reader', wpm: 150, kind: 'reading', icon: <BookOpen className="size-3.5" /> },
  { label: 'Average reader', wpm: 250, kind: 'reading', icon: <BookOpen className="size-3.5" /> },
  { label: 'Fast reader', wpm: 400, kind: 'reading', icon: <BookOpen className="size-3.5" /> },
  { label: 'Speaking pace', wpm: 130, kind: 'speaking', icon: <Mic className="size-3.5" /> },
]
interface Stats {
  words: number
  characters: number
  charactersNoSpaces: number
  sentences: number
  paragraphs: number
  avgWordsPerSentence: number
}
function computeStats(text: string): Stats {
  if (!text || text.trim() === '') {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      avgWordsPerSentence: 0,
    }
  }
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const words = (text.match(/\S+/g) || []).length
  const sentenceMatches = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || []
  const sentences = sentenceMatches.filter((s) => s.trim().length > 0).length
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
    avgWordsPerSentence: sentences > 0 ? words / sentences : 0,
  }
}
function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0s'
  const totalSeconds = Math.round(minutes * 60)
  if (totalSeconds < 60) return `${totalSeconds}s`
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) {
    return s === 0 ? `${h}h ${m}m` : `${h}h ${m}m ${s}s`
  }
  return s === 0 ? `${m}m` : `${m}m ${s}s`
}
const SAMPLE_TEXT = `Reading speed varies widely between individuals. The average adult
reads non-technical prose at roughly 250 words per minute, while a
fast reader can skim at 400 words per minute. Public speakers, on
the other hand, deliver at around 130 words per minute — much slower
than silent reading, because spoken delivery needs pauses, emphasis,
and breath.
This tool estimates how long it would take to read or speak the text
you provide at four common speeds. Paste in a blog post, a script,
or your next speech, and the stats update live as you type.`
export default function ReadingTimeCalculator() {
  const [text, setText] = React.useState(SAMPLE_TEXT)
  const stats = React.useMemo(() => computeStats(text), [text])
  const readings = React.useMemo(
    () =>
      SPEEDS.map((s) => ({
        ...s,
        minutes: stats.words / s.wpm,
        seconds: (stats.words / s.wpm) * 60,
      })),
    [stats.words]
  )
  const avgReading = readings.find((r) => r.label === 'Average reader')
  const speaking = readings.find((r) => r.kind === 'speaking')
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="size-4" />
            Reading Time Calculator
          </CardTitle>
          <CardDescription>
            Live word/sentence counts and estimated reading and speaking
            times at multiple speeds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field
            label="Your text"
            htmlFor="rt-input"
            hint={`${stats.characters} chars · ${stats.words} words`}
          >
            <Textarea
              id="rt-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder="Paste or type your text here. Times update live."
              aria-describedby="rt-stats"
            />
          </Field>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setText(SAMPLE_TEXT)}
            >
              <FileText className="size-4" />
              Load sample
            </Button>
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
        </CardContent>
      </Card>
      <div
        id="rt-stats"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
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
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 pt-6">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <BookOpen className="size-3.5" />
              Estimated reading time
            </div>
            <div className="text-3xl font-bold tabular-nums text-foreground">
              {avgReading ? formatDuration(avgReading.minutes) : '0s'}
            </div>
            <div className="text-xs text-muted-foreground">
              At 250 words per minute (average adult reader).
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 pt-6">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <Mic className="size-3.5" />
              Estimated speaking time
            </div>
            <div className="text-3xl font-bold tabular-nums text-foreground">
              {speaking ? formatDuration(speaking.minutes) : '0s'}
            </div>
            <div className="text-xs text-muted-foreground">
              At 130 words per minute (typical presentation pace).
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Speed breakdown</CardTitle>
          <CardDescription>
            Estimated time at four common reading and speaking speeds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Speed</TableHead>
                  <TableHead className="text-right">WPM</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                  <TableHead className="text-right">Seconds</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {readings.map((r) => (
                  <TableRow key={r.label}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{r.icon}</span>
                        <span className="font-medium">{r.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {r.wpm}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatDuration(r.minutes)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground tabular-nums">
                      {r.seconds > 0
                        ? Math.round(r.seconds).toLocaleString()
                        : 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat
              label="Avg words / sentence"
              value={
                stats.avgWordsPerSentence > 0
                  ? stats.avgWordsPerSentence.toFixed(1)
                  : '—'
              }
            />
            <Stat
              label="Avg chars / word"
              value={
                stats.words > 0
                  ? (stats.charactersNoSpaces / stats.words).toFixed(1)
                  : '—'
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}