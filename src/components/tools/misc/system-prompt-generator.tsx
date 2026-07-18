'use client'

import * as React from 'react'
import { Code, PenTool, BarChart3, Wand2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Field, ResultBox } from '@/lib/tools/tool-ui'

type Tone = 'professional' | 'casual' | 'friendly' | 'authoritative'
type OutputFormat = 'text' | 'markdown' | 'json' | 'table' | 'bullet-list'

interface FormState {
  role: string
  task: string
  tone: Tone
  constraints: string
  outputFormat: OutputFormat
  language: string
}

const TONE_DESCRIPTIONS: Record<Tone, string> = {
  professional: 'Polished, neutral, third-person where appropriate.',
  casual: 'Conversational, first-person, contractions welcome.',
  friendly: 'Warm and approachable, encouraging.',
  authoritative: 'Direct, confident, decisive — minimal hedging.',
}

const FORMAT_DESCRIPTIONS: Record<OutputFormat, string> = {
  text: 'Plain prose paragraphs.',
  markdown: 'Markdown with appropriate headings and emphasis.',
  json: 'Strict, valid JSON — no prose outside the JSON.',
  table: 'Markdown table with headers.',
  'bullet-list': 'Concise bulleted list, one item per line.',
}

const PRESETS: {
  id: string
  label: string
  icon: React.ReactNode
  state: FormState
}[] = [
  {
    id: 'coding',
    label: 'Coding assistant',
    icon: <Code className="size-4" />,
    state: {
      role: 'a senior software engineer with deep expertise in TypeScript, React, and Node.js',
      task: 'Review code, suggest refactors, explain concepts, and write production-ready snippets. Prefer functional patterns and minimal dependencies.',
      tone: 'professional',
      constraints: [
        'Always show the full code snippet, not partial diffs',
        'Explain trade-offs when suggesting alternatives',
        'Flag security issues explicitly',
        'Prefer the standard library over third-party packages',
      ].join('\n'),
      outputFormat: 'markdown',
      language: 'English',
    },
  },
  {
    id: 'writing',
    label: 'Writing coach',
    icon: <PenTool className="size-4" />,
    state: {
      role: 'an experienced writing coach and editor specialising in non-fiction',
      task: 'Critique drafts for clarity, pacing, and voice. Suggest concrete revisions, not vague advice.',
      tone: 'friendly',
      constraints: [
        'Quote the specific phrase you are critiquing',
        'Offer at least one positive observation before critiques',
        'Suggest no more than 3 high-impact changes per pass',
      ].join('\n'),
      outputFormat: 'bullet-list',
      language: 'English',
    },
  },
  {
    id: 'analyst',
    label: 'Data analyst',
    icon: <BarChart3 className="size-4" />,
    state: {
      role: 'a senior data analyst with expertise in statistics and SQL',
      task: 'Analyse datasets, write queries, interpret results, and surface insights. Always state assumptions.',
      tone: 'authoritative',
      constraints: [
        'State assumptions before drawing conclusions',
        'Provide the SQL query alongside any interpretation',
        'Flag sample-size and bias concerns explicitly',
        'Round numbers sensibly and include units',
      ].join('\n'),
      outputFormat: 'table',
      language: 'English',
    },
  },
]

const DEFAULT_STATE: FormState = PRESETS[0].state

function buildPrompt(s: FormState): string {
  const parts: string[] = []

  if (s.role.trim()) {
    parts.push(`# Role\nYou are ${s.role.trim()}.`)
  }

  if (s.task.trim()) {
    parts.push(`# Task\n${s.task.trim()}`)
  }

  if (s.tone) {
    parts.push(`# Tone\nAdopt a ${s.tone} tone. ${TONE_DESCRIPTIONS[s.tone]}`)
  }

  const constraints = s.constraints
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
  if (constraints.length > 0) {
    parts.push(
      `# Constraints\n${constraints.map((c) => `- ${c}`).join('\n')}`
    )
  }

  if (s.outputFormat) {
    parts.push(
      `# Output format\nRespond in ${s.outputFormat}. ${FORMAT_DESCRIPTIONS[s.outputFormat]}`
    )
  }

  if (s.language.trim()) {
    parts.push(`# Language\nRespond in ${s.language.trim()}.`)
  }

  parts.push(
    `# Behaviour\n- If the request is ambiguous, ask one clarifying question before proceeding.\n- If you do not know, say so explicitly rather than guessing.`
  )

  return parts.join('\n\n')
}

export default function SystemPromptGenerator() {
  const [state, setState] = React.useState<FormState>(DEFAULT_STATE)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]): void => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const output = React.useMemo(() => buildPrompt(state), [state])

  const applyPreset = (id: string): void => {
    const preset = PRESETS.find((p) => p.id === id)
    if (preset) setState(preset.state)
  }

  const constraintCount = state.constraints
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0).length

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>System Prompt Generator</CardTitle>
          <CardDescription>
            Build a structured system prompt for any LLM. Fill in the role,
            task, tone, constraints, output format, and language — the
            generator assembles them into a clean, sectioned prompt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset(p.id)}
              >
                {p.icon}
                {p.label}
              </Button>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setState({
                  role: '',
                  task: '',
                  tone: 'professional',
                  constraints: '',
                  outputFormat: 'text',
                  language: 'English',
                })
              }
            >
              <Wand2 className="size-3.5" />
              Blank
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Role" htmlFor="sp-role" hint='e.g. "a senior copywriter"'>
            <Input
              id="sp-role"
              value={state.role}
              onChange={(e) => update('role', e.target.value)}
              placeholder="a senior copywriter specialised in B2B SaaS"
            />
          </Field>

          <Field
            label="Task description"
            htmlFor="sp-task"
            hint="what the model should do"
          >
            <Textarea
              id="sp-task"
              value={state.task}
              onChange={(e) => update('task', e.target.value)}
              placeholder="Write landing-page copy, edit drafts, suggest headlines…"
              rows={4}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Tone"
              htmlFor="sp-tone"
              hint={TONE_DESCRIPTIONS[state.tone]}
            >
              <Select
                value={state.tone}
                onValueChange={(v) => update('tone', v as Tone)}
              >
                <SelectTrigger id="sp-tone" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Output format"
              htmlFor="sp-format"
              hint={FORMAT_DESCRIPTIONS[state.outputFormat]}
            >
              <Select
                value={state.outputFormat}
                onValueChange={(v) => update('outputFormat', v as OutputFormat)}
              >
                <SelectTrigger id="sp-format" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Plain text</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="bullet-list">Bullet list</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field
            label="Constraints"
            htmlFor="sp-constraints"
            hint={`${constraintCount} constraint${constraintCount === 1 ? '' : 's'} · one per line`}
          >
            <Textarea
              id="sp-constraints"
              value={state.constraints}
              onChange={(e) => update('constraints', e.target.value)}
              placeholder={'Max 200 words\nAvoid jargon\nInclude a call-to-action'}
              rows={4}
            />
          </Field>

          <Field
            label="Language"
            htmlFor="sp-language"
            hint="the language to respond in"
          >
            <Input
              id="sp-language"
              value={state.language}
              onChange={(e) => update('language', e.target.value)}
              placeholder="English"
            />
          </Field>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2" role="status" aria-live="polite">
        <Badge variant="outline">Tone: {state.tone}</Badge>
        <Badge variant="outline">Format: {state.outputFormat}</Badge>
        <Badge variant="outline">{constraintCount} constraints</Badge>
        <Badge variant="outline">{output.length} chars</Badge>
      </div>

      <Separator />

      <ResultBox
        value={output}
        label="Generated system prompt"
        rows={14}
        mono
        downloadName="system-prompt.md"
        empty="Fill in the inputs to generate a prompt."
      />
    </div>
  )
}
