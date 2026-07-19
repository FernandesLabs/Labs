'use client'
import * as React from 'react'
import { CheckCircle2, XCircle, Lightbulb, ArrowRight } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Field, ResultBox } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
interface Check {
  key: string
  label: string
  present: boolean
  weight: number
  hint: string
}
interface Analysis {
  score: number
  checks: Check[]
  suggestions: string[]
  lengthOk: boolean
  wordCount: number
}
function hasRole(text: string): boolean {
  return /\b(you are|you're|act as|as an?|your role|behave as|imagine you're)\b/i.test(
    text
  )
}
function hasContext(text: string): boolean {
  return /\b(context|background|given that|assuming|situation|scenario|previously|here is|the user is|our product|our team)\b/i.test(
    text
  )
}
function hasInstructions(text: string): boolean {
  return /\b(write|create|generate|list|analyze|summarize|explain|describe|translate|convert|extract|compare|evaluate|design|draft|review|outline|identify|provide|return)\b/i.test(
    text
  )
}
function hasOutputFormat(text: string): boolean {
  return /\b(format|json|markdown|bullet|numbered list|table|step[- ]by[- ]step|output (in|as|the)|respond (in|with|using)|paragraph|heading)\b/i.test(
    text
  )
}
function hasExamples(text: string): boolean {
  return /\b(example|e\.g\.|for instance|such as|e\.g\.,|for example|sample)\b/i.test(
    text
  )
}
function analyze(prompt: string): Analysis {
  const trimmed = prompt.trim()
  const wordCount = trimmed === '' ? 0 : trimmed.split(/\s+/).length
  const len = trimmed.length
  const lengthOk = len >= 40 && len <= 4000
  const checks: Check[] = [
    {
      key: 'role',
      label: 'Role definition',
      present: hasRole(trimmed),
      weight: 20,
      hint: 'Start with "You are…" or "Act as…" to anchor the model.',
    },
    {
      key: 'context',
      label: 'Context',
      present: hasContext(trimmed),
      weight: 15,
      hint: 'Provide background: who, what, why.',
    },
    {
      key: 'instructions',
      label: 'Specific instructions',
      present: hasInstructions(trimmed),
      weight: 20,
      hint: 'Use clear imperative verbs (write, list, analyze…).',
    },
    {
      key: 'format',
      label: 'Output format',
      present: hasOutputFormat(trimmed),
      weight: 15,
      hint: 'Specify JSON, markdown, table, list, etc.',
    },
    {
      key: 'examples',
      label: 'Examples',
      present: hasExamples(trimmed),
      weight: 15,
      hint: 'Add 1–2 examples ("e.g. …") to disambiguate.',
    },
    {
      key: 'length',
      label: 'Appropriate length',
      present: lengthOk,
      weight: 15,
      hint: 'Aim for 40–4000 chars. Too short lacks detail; too long dilutes focus.',
    },
  ]
  let score = 0
  for (const c of checks) {
    if (c.present) score += c.weight
  }
  const suggestions: string[] = []
  if (!checks[0].present)
    suggestions.push(
      'Add a role definition — e.g. "You are a senior copywriter specialised in B2B SaaS."'
    )
  if (!checks[1].present)
    suggestions.push(
      'Add context — describe the audience, product, or situation the model should consider.'
    )
  if (!checks[2].present)
    suggestions.push(
      'State the task with a clear imperative verb: "Write…", "Summarize…", "List…".'
    )
  if (!checks[3].present)
    suggestions.push(
      'Specify the output format — "Respond in markdown with H2 section headings."'
    )
  if (!checks[4].present)
    suggestions.push(
      'Include 1–2 examples so the model understands the expected style and tone.'
    )
  if (!lengthOk && len < 40)
    suggestions.push(
      'Your prompt is very short — add specifics, constraints, and expectations.'
    )
  if (!lengthOk && len > 4000)
    suggestions.push(
      'Your prompt is very long — consider splitting it or removing redundant detail.'
    )
  if (suggestions.length === 0)
    suggestions.push(
      'Strong prompt. Consider edge-case instructions ("If unsure, ask clarifying questions").'
    )
  return { score, checks, suggestions, lengthOk, wordCount }
}
const WEAK_EXAMPLE =
  'Write a blog intro about SEO.'
const STRONG_EXAMPLE = `You are a senior SEO content strategist with 10 years of experience.
Context: We are launching a new blog post targeting the keyword "technical SEO audit" for an audience of junior-to-mid SEO specialists.
Task: Write an engaging 150-word blog introduction that hooks the reader and previews the article's value.
Format: Plain text, no headings. Use a question or statistic in the opening line.
Example: "Did you know that 91% of pages never get organic traffic from Google? A technical SEO audit is how you avoid joining them."`
function scoreColor(score: number): string {
  if (score >= 80) return '#16a34a'
  if (score >= 50) return '#f59e0b'
  return '#dc2626'
}
function scoreLabel(score: number): string {
  if (score >= 80) return 'Strong'
  if (score >= 50) return 'Needs work'
  return 'Weak'
}
export default function PromptOptimizer() {
  const { copy } = useCopy()
  const [prompt, setPrompt] = React.useState(WEAK_EXAMPLE)
  const analysis = React.useMemo(() => analyze(prompt), [prompt])
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Prompt Optimizer</CardTitle>
          <CardDescription>
            Score a prompt (0–100) against six heuristics: role, context,
            instructions, output format, examples, and length. Get specific
            suggestions to improve it. Everything runs locally — your prompt
            never leaves the browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Your prompt"
            htmlFor="po-prompt"
            hint={`${analysis.wordCount} words`}
          >
            <Textarea
              id="po-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste a prompt you want to optimize…"
              rows={6}
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPrompt(WEAK_EXAMPLE)}
            >
              Load weak example
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPrompt(STRONG_EXAMPLE)}
            >
              Load strong example
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPrompt('')}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="font-mono text-4xl font-bold tabular-nums"
              style={{ color: scoreColor(analysis.score) }}
              aria-label={`Prompt score ${analysis.score} out of 100`}
            >
              {analysis.score}
            </div>
            <div className="flex-1">
              <Progress
                value={analysis.score}
                className="h-3"
                aria-hidden="true"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{scoreLabel(analysis.score)}</span>
                <span>out of 100</span>
              </div>
            </div>
          </div>
          <Separator />
          <div className="grid gap-2 sm:grid-cols-2" role="status" aria-live="polite">
            {analysis.checks.map((c) => (
              <div
                key={c.key}
                className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3"
              >
                {c.present ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0 text-rose-500" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{c.label}</span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {c.weight} pts
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.hint}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Suggestions</CardTitle>
          <CardDescription>
            {analysis.suggestions.length} actionable improvement
            {analysis.suggestions.length === 1 ? '' : 's'}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.suggestions.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-sm"
              >
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Before / after</CardTitle>
          <CardDescription>
            A weak prompt rewritten using all six heuristics.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-rose-600">
                Weak
              </Badge>
              <span className="text-xs text-muted-foreground">
                score {analyze(WEAK_EXAMPLE).score}/100
              </span>
            </div>
            <pre className="fl-scroll max-h-48 overflow-auto rounded-lg border border-border bg-muted/30 p-3 text-xs">
              {WEAK_EXAMPLE}
            </pre>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-emerald-600">
                Strong
              </Badge>
              <span className="text-xs text-muted-foreground">
                score {analyze(STRONG_EXAMPLE).score}/100
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto h-7 px-2 text-xs"
                onClick={() => copy(STRONG_EXAMPLE, 'Strong prompt copied')}
              >
                <ArrowRight className="size-3.5" />
                Use
              </Button>
            </div>
            <pre className="fl-scroll max-h-48 overflow-auto rounded-lg border border-border bg-muted/30 p-3 text-xs">
              {STRONG_EXAMPLE}
            </pre>
          </div>
        </CardContent>
      </Card>
      <ResultBox
        value={analysis.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}
        label="Suggestions (plain text)"
        rows={4}
        mono={false}
        downloadName="prompt-suggestions.txt"
        empty="Type a prompt to see suggestions."
      />
    </div>
  )
}