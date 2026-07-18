'use client'

import * as React from 'react'
import { CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Field, Stat } from '@/lib/tools/tool-ui'

const POWER_WORDS = new Set<string>([
  'you',
  'free',
  'new',
  'proven',
  'instantly',
  'now',
  'secret',
  'ultimate',
  'easy',
  'quick',
  'best',
  'guide',
  'tips',
  'today',
  'guaranteed',
  'exclusive',
  'discover',
  'boost',
  'unlock',
  'powerful',
  'essential',
  'simple',
  'fast',
  'surprising',
  'limited',
  'love',
  'save',
  'win',
  'stop',
  'avoid',
  'mistakes',
])

const EMOTIONAL_WORDS = new Set<string>([
  'amazing',
  'incredible',
  'shocking',
  'heartbreaking',
  'inspiring',
  'unbelievable',
  'brilliant',
  'terrible',
  'wonderful',
  'fear',
  'love',
  'hate',
  'joy',
  'anger',
  'happy',
  'sad',
  'furious',
  'thrilled',
  'devastated',
  'passionate',
])

interface Analysis {
  score: number
  length: number
  wordCount: number
  powerCount: number
  emotionalCount: number
  hasNumber: boolean
  powerWords: string[]
  emotionalWords: string[]
  suggestions: string[]
}

function analyze(headline: string): Analysis {
  const length = headline.length
  const words = headline
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
  const wordCount = words.length
  const lower = words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ''))
  const powerWords: string[] = []
  const emotionalWords: string[] = []
  for (const w of lower) {
    if (POWER_WORDS.has(w) && !powerWords.includes(w)) powerWords.push(w)
    if (EMOTIONAL_WORDS.has(w) && !emotionalWords.includes(w)) {
      emotionalWords.push(w)
    }
  }
  const hasNumber = /\d/.test(headline)

  // Length score (ideal 50-60)
  let lengthScore = 0
  if (length >= 50 && length <= 60) lengthScore = 25
  else if (length >= 40 && length <= 70) lengthScore = 18
  else if (length >= 30 && length <= 80) lengthScore = 12
  else if (length > 0) lengthScore = 6

  // Word count score (ideal 6-12)
  let wordScore = 0
  if (wordCount >= 6 && wordCount <= 12) wordScore = 25
  else if (wordCount >= 4 && wordCount <= 14) wordScore = 18
  else if (wordCount > 0) wordScore = 10

  // Power words (max 25)
  const powerScore = Math.min(25, powerWords.length * 8)

  // Emotional + number (max 25)
  let extraScore = 0
  if (emotionalWords.length > 0) extraScore += 10
  if (hasNumber) extraScore += 15
  extraScore = Math.min(25, extraScore)

  const score = lengthScore + wordScore + powerScore + extraScore

  const suggestions: string[] = []
  if (length === 0) suggestions.push('Enter a headline to analyze.')
  if (length > 0 && length < 50) {
    suggestions.push('Headline is short — aim for 50–60 characters for SERP visibility.')
  }
  if (length > 60) {
    suggestions.push('Headline may be truncated in search results — trim to 60 characters.')
  }
  if (wordCount > 0 && wordCount < 6) {
    suggestions.push('Add more words — 6 to 12 words tends to perform best.')
  }
  if (wordCount > 12) {
    suggestions.push('Consider tightening — fewer than 12 words reads better.')
  }
  if (powerWords.length === 0 && wordCount > 0) {
    suggestions.push('Add a power word like "ultimate", "proven", or "secret".')
  }
  if (!hasNumber && wordCount > 0) {
    suggestions.push('Headlines with numbers (e.g. "7 tips…") often get more clicks.')
  }
  if (emotionalWords.length === 0 && wordCount > 0) {
    suggestions.push('Add an emotional word to drive engagement.')
  }
  if (suggestions.length === 0 && wordCount > 0) {
    suggestions.push('Great headline — all key signals are present.')
  }

  return {
    score: wordCount === 0 ? 0 : score,
    length,
    wordCount,
    powerCount: powerWords.length,
    emotionalCount: emotionalWords.length,
    hasNumber,
    powerWords,
    emotionalWords,
    suggestions,
  }
}

function scoreColor(score: number): string {
  if (score >= 70) return 'oklch(0.6 0.17 150)'
  if (score >= 40) return 'oklch(0.72 0.16 75)'
  return 'oklch(0.6 0.2 25)'
}

function scoreLabel(score: number): string {
  if (score >= 70) return 'Strong'
  if (score >= 40) return 'OK'
  return 'Weak'
}

export default function HeadlineAnalyzer(): React.JSX.Element {
  const [headline, setHeadline] = React.useState('')

  const a = React.useMemo(() => analyze(headline), [headline])

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Headline Analyzer</CardTitle>
          <CardDescription>
            Score your headline on length, word count, power words, emotional
            words, and numbers — the signals most tied to click-through rate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Headline" htmlFor="ha-h" hint={`${a.length}/60`}>
            <Input
              id="ha-h"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="The Ultimate Guide to Sustainable Coffee in 2025"
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Headline score
              </div>
              <div
                className="font-mono text-3xl font-bold tabular-nums"
                style={{ color: scoreColor(a.score) }}
              >
                {a.score}
                <span className="text-base font-normal text-muted-foreground">
                  /100
                </span>
              </div>
            </div>
            <Badge
              variant="secondary"
              style={{ color: scoreColor(a.score) }}
            >
              {scoreLabel(a.score)}
            </Badge>
          </div>
          <Progress value={a.score} className="h-2" />
          <Separator />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <Stat label="Length" value={a.length} />
            <Stat label="Words" value={a.wordCount} />
            <Stat
              label="Power words"
              value={a.powerCount}
              accent={a.powerCount > 0 ? 'oklch(0.6 0.17 150)' : undefined}
            />
            <Stat
              label="Emotional"
              value={a.emotionalCount}
              accent={a.emotionalCount > 0 ? 'oklch(0.6 0.17 150)' : undefined}
            />
            <Stat
              label="Has number"
              value={a.hasNumber ? 'Yes' : 'No'}
              accent={a.hasNumber ? 'oklch(0.6 0.17 150)' : undefined}
            />
          </div>
          {(a.powerWords.length > 0 || a.emotionalWords.length > 0) && (
            <div className="space-y-2">
              {a.powerWords.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    Power:
                  </span>
                  {a.powerWords.map((w) => (
                    <Badge key={`p-${w}`} variant="outline">
                      {w}
                    </Badge>
                  ))}
                </div>
              ) : null}
              {a.emotionalWords.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    Emotional:
                  </span>
                  {a.emotionalWords.map((w) => (
                    <Badge key={`e-${w}`} variant="outline">
                      {w}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Lightbulb className="size-4" />
          Suggestions
        </h3>
        <Separator className="mb-3" />
        {a.suggestions.length === 0 ? null : (
          <ul className="space-y-1.5">
            {a.suggestions.map((s, i) => {
              const isPositive = s.startsWith('Great')
              return (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-md border border-border bg-card p-2 text-sm"
                >
                  {isPositive ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  )}
                  <span className="text-foreground">{s}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
