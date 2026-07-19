'use client'
import * as React from 'react'
import { Copy, FileText, ListTree } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
type Tone = 'informative' | 'conversational' | 'persuasive' | 'technical' | 'inspirational'
interface FormState {
  topic: string
  audience: string
  tone: Tone
  sections: number
  wordCount: number
}
const TONE_HINTS: Record<Tone, string> = {
  informative: 'Clear, fact-led, neutral voice.',
  conversational: 'Warm, first-person, accessible.',
  persuasive: 'Argument-driven, calls to action.',
  technical: 'Precise, terminology-aware, deep.',
  inspirational: 'Uplifting, story-led, motivational.',
}
function titleVariations(topic: string, tone: Tone): string[] {
  const t = topic.trim() || 'your topic'
  const lower = t.charAt(0).toLowerCase() + t.slice(1)
  const cap = t.charAt(0).toUpperCase() + t.slice(1)
  const variations: Record<Tone, string[]> = {
    informative: [
      `The Complete Guide to ${cap}`,
      `What Is ${cap}? A Practical Overview`,
      `${cap}: Everything You Need to Know`,
    ],
    conversational: [
      `Let's Talk About ${lower}`,
      `${cap}, Explained Without the Jargon`,
      `A Friendly Walkthrough of ${lower}`,
    ],
    persuasive: [
      `Why ${cap} Matters More Than You Think`,
      `Stop Ignoring ${lower}: Here's What to Do Instead`,
      `The Case for Taking ${lower} Seriously`,
    ],
    technical: [
      `${cap}: A Technical Deep Dive`,
      `Understanding ${lower}: Architecture, Trade-offs, and Patterns`,
      `${cap} — A Practitioner's Reference`,
    ],
    inspirational: [
      `${cap}: A New Way Forward`,
      `Reimagining ${lower} for the Next Decade`,
      `From Spark to System: The ${cap} Story`,
    ],
  }
  return variations[tone]
}
interface Section {
  heading: string
  summary: string
  words: number
}
function buildSections(s: FormState): Section[] {
  const topic = s.topic.trim() || 'the topic'
  const cap = topic.charAt(0).toUpperCase() + topic.slice(1)
  const templates: { heading: string; summary: string }[] = [
    {
      heading: `What ${cap} Really Means`,
      summary: `Define ${topic} on your own terms and surface the common misconceptions your audience arrives with.`,
    },
    {
      heading: `Why ${cap} Matters Right Now`,
      summary: `Tie the topic to current trends, numbers, or events that make it urgent for the reader today.`,
    },
    {
      heading: `The Core Principles of ${cap}`,
      summary: `Lay out the 3–5 mental models a beginner needs before going deeper into ${topic}.`,
    },
    {
      heading: `How to Get Started with ${cap}`,
      summary: `Walk through the first concrete steps a reader can take this week, with one worked example.`,
    },
    {
      heading: `Common Pitfalls in ${cap}`,
      summary: `List the mistakes practitioners make early on and how to spot them before they compound.`,
    },
    {
      heading: `${cap} in Practice: A Mini Case Study`,
      summary: `Tell a 200-word story of a team or person who applied these ideas — what worked, what didn't.`,
    },
    {
      heading: `Measuring Success with ${cap}`,
      summary: `Suggest 2–3 metrics or signals the reader can track to know ${topic} is working.`,
    },
    {
      heading: `Tools & Resources for ${cap}`,
      summary: `Recommend a short, curated list of books, tools, and communities to go deeper.`,
    },
    {
      heading: `${cap} for Different Audiences`,
      summary: `Show how the approach shifts for beginners vs. advanced practitioners, with quick contrasts.`,
    },
    {
      heading: `Advanced Patterns in ${cap}`,
      summary: `For readers who want more: edge cases, integrations, and the non-obvious tricks that compound.`,
    },
  ]
  const count = Math.max(3, Math.min(10, s.sections))
  const picked = templates.slice(0, count)
  const perSection = Math.max(50, Math.floor(s.wordCount / (count + 1)))
  return picked.map((p) => ({
    heading: p.heading,
    summary: p.summary,
    words: perSection,
  }))
}
function introHook(topic: string, tone: Tone, audience: string): string {
  const t = topic.trim() || 'this topic'
  const aud = audience.trim() || 'curious readers'
  const cap = t.charAt(0).toUpperCase() + t.slice(1)
  const hooks: Record<Tone, string> = {
    informative: `If you've ever felt overwhelmed by ${t}, this introduction sets the stage for ${aud}.`,
    conversational: `Let's be honest — most of us stumble into ${t} without a map. This post is that map, written for ${aud}.`,
    persuasive: `${cap} isn't optional anymore. For ${aud}, understanding it now is the difference between leading and catching up.`,
    technical: `This article assumes ${aud} already know the basics of ${t} and want a rigorous treatment of the parts that matter.`,
    inspirational: `Every breakthrough in ${t} starts with a question. For ${aud}, that question begins here.`,
  }
  return hooks[tone]
}
function conclusion(topic: string, tone: Tone): string {
  const t = topic.trim() || 'the topic'
  const cap = t.charAt(0).toUpperCase() + t.slice(1)
  const closers: Record<Tone, string> = {
    informative: `To recap: ${cap} rewards clear definitions, careful measurement, and steady iteration. Pick one principle and start.`,
    conversational: `So that's ${t} — less mysterious than it sounded, right? Take one idea from above and try it this week.`,
    persuasive: `${cap} will keep moving whether you act or not. The only question is whether you'll be ahead of it.`,
    technical: `The path forward is iterative: instrument, measure, refactor. Revisit this reference as your ${t} system matures.`,
    inspirational: `The next chapter of ${t} hasn't been written yet. Yours might be the one that defines it.`,
  }
  return closers[tone]
}
function buildOutline(s: FormState): string {
  const sections = buildSections(s)
  const titles = titleVariations(s.topic, s.tone)
  const totalWords = sections.reduce((sum, sec) => sum + sec.words, 0) + 150 // intro + outro
  const lines: string[] = []
  lines.push(`# ${titles[0]}`)
  lines.push('')
  lines.push(`> Suggested title variations:`)
  titles.forEach((t, i) => lines.push(`> ${i + 1}. ${t}`))
  lines.push('')
  lines.push(`**Target audience:** ${s.audience.trim() || '—'}`)
  lines.push(`**Tone:** ${s.tone} — ${TONE_HINTS[s.tone]}`)
  lines.push(`**Target word count:** ~${s.wordCount.toLocaleString()} words`)
  lines.push(`**Estimated total:** ~${totalWords.toLocaleString()} words`)
  lines.push('')
  lines.push(`## Introduction`)
  lines.push(`${introHook(s.topic, s.tone, s.audience)}`)
  lines.push(`_${150} words_`)
  lines.push('')
  sections.forEach((sec, i) => {
    lines.push(`## ${i + 1}. ${sec.heading}`)
    lines.push(sec.summary)
    lines.push(`_${sec.words} words_`)
    lines.push('')
  })
  lines.push(`## Conclusion`)
  lines.push(conclusion(s.topic, s.tone))
  lines.push(`_${150} words_`)
  return lines.join('\n')
}
const DEFAULT_STATE: FormState = {
  topic: 'technical SEO audits',
  audience: 'junior-to-mid SEO specialists',
  tone: 'informative',
  sections: 5,
  wordCount: 1500,
}
export default function BlogOutlineGenerator() {
  const { copy } = useCopy()
  const [state, setState] = React.useState<FormState>(DEFAULT_STATE)
  const update = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ): void => {
    setState((prev) => ({ ...prev, [key]: value }))
  }
  const outline = React.useMemo(() => buildOutline(state), [state])
  const titles = React.useMemo(
    () => titleVariations(state.topic, state.tone),
    [state.topic, state.tone]
  )
  const sections = React.useMemo(() => buildSections(state), [state])
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Blog Outline Generator</CardTitle>
          <CardDescription>
            Turn a topic into a structured blog outline: 3 title variations,
            an intro hook, N section headings with summaries and word
            budgets, and a conclusion. Output as markdown — copy or
            download.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Topic" htmlFor="bo-topic">
              <Input
                id="bo-topic"
                value={state.topic}
                onChange={(e) => update('topic', e.target.value)}
                placeholder="technical SEO audits"
              />
            </Field>
            <Field
              label="Target audience"
              htmlFor="bo-audience"
              hint="who this is for"
            >
              <Input
                id="bo-audience"
                value={state.audience}
                onChange={(e) => update('audience', e.target.value)}
                placeholder="junior-to-mid SEO specialists"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Tone"
              htmlFor="bo-tone"
              hint={TONE_HINTS[state.tone]}
            >
              <Select
                value={state.tone}
                onValueChange={(v) => update('tone', v as Tone)}
              >
                <SelectTrigger id="bo-tone" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="informative">Informative</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field
              label="Target word count"
              htmlFor="bo-words"
              hint="total article length"
            >
              <Input
                id="bo-words"
                inputMode="numeric"
                value={String(state.wordCount)}
                onChange={(e) => {
                  const n = Number(e.target.value)
                  if (Number.isFinite(n) && n > 0) {
                    update('wordCount', Math.min(50000, Math.round(n)))
                  } else if (e.target.value === '') {
                    update('wordCount', 0)
                  }
                }}
                placeholder="1500"
              />
            </Field>
          </div>
          <Field
            label="Number of sections"
            htmlFor="bo-sections"
            hint={`${state.sections} section${state.sections === 1 ? '' : 's'}`}
          >
            <Slider
              id="bo-sections"
              min={3}
              max={10}
              step={1}
              value={[state.sections]}
              onValueChange={(v) => update('sections', v[0] ?? 3)}
              aria-label="Number of sections from 3 to 10"
            />
            <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
              <span>3</span>
              <span>10</span>
            </div>
          </Field>
        </CardContent>
      </Card>
      <div
        className="grid gap-3 sm:grid-cols-3"
        role="status"
        aria-live="polite"
      >
        <Stat
          label="Sections"
          value={state.sections}
          accent="#0891b2"
        />
        <Stat
          label="Words / section"
          value={Math.max(0, Math.floor(state.wordCount / (state.sections + 1)))}
        />
        <Stat
          label="Titles generated"
          value={titles.length}
          accent="#16a34a"
        />
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Title variations</CardTitle>
          <CardDescription>
            Three angles on the same topic — click any to copy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {titles.map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => copy(t, `Title ${i + 1} copied`)}
              className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted/20 p-3 text-left text-sm transition hover:border-primary/40 hover:bg-muted/40"
            >
              <Badge variant="outline" className="font-mono text-[10px]">
                {i + 1}
              </Badge>
              <span className="flex-1 font-medium">{t}</span>
              <Copy className="size-3.5 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Outline preview</CardTitle>
          <CardDescription>
            <span className="inline-flex items-center gap-1.5">
              <ListTree className="size-3.5" />
              {state.sections} sections ·{' '}
              {sections.reduce((sum, s) => sum + s.words, 0) + 300} est. words
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Intro hook
            </div>
            <p className="mt-1">
              {introHook(state.topic, state.tone, state.audience)}{' '}
              <span className="text-xs text-muted-foreground">(~150 words)</span>
            </p>
          </div>
          {sections.map((s, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-3 text-sm"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium">
                  {i + 1}. {s.heading}
                </span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {s.words}w
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground">{s.summary}</p>
            </div>
          ))}
          <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Conclusion
            </div>
            <p className="mt-1">
              {conclusion(state.topic, state.tone)}{' '}
              <span className="text-xs text-muted-foreground">(~150 words)</span>
            </p>
          </div>
        </CardContent>
      </Card>
      <ResultBox
        value={outline}
        label="Markdown outline"
        rows={14}
        mono
        downloadName="blog-outline.md"
        empty="Fill in the topic to generate an outline."
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => copy(outline, 'Outline copied as markdown')}
        >
          <FileText className="size-3.5" />
          Copy as markdown
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            setState({
              topic: '',
              audience: '',
              tone: 'informative',
              sections: 5,
              wordCount: 1500,
            })
          }
        >
          Reset
        </Button>
      </div>
    </div>
  )
}