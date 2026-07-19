'use client'
import * as React from 'react'
import { Shuffle, UserCircle, Sparkles } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Field, ResultBox, randomInt } from '@/lib/tools/tool-ui'
const ALL_TRAITS = [
  'analytical',
  'creative',
  'empathetic',
  'direct',
  'humorous',
  'serious',
  'optimistic',
  'pragmatic',
] as const
type Trait = (typeof ALL_TRAITS)[number]
interface PersonaState {
  name: string
  role: string
  traits: Trait[]
  expertise: number
  background: string
  speakingStyle: string
}
const DEFAULT_STATE: PersonaState = {
  name: 'Maya Chen',
  role: 'Senior Product Designer',
  traits: ['analytical', 'empathetic', 'pragmatic'],
  expertise: 8,
  background:
    'Twelve years in consumer SaaS, previously led design at two early-stage startups that reached Series B. Holds an MS in Human-Computer Interaction.',
  speakingStyle:
    'Calm and structured. Uses concrete examples, references user research, and asks clarifying questions before committing to a direction.',
}
const SAMPLE_NAMES = [
  'Maya Chen',
  'Idris Okafor',
  'Sofia Rinaldi',
  'Kenji Watanabe',
  'Priya Nair',
  'Lukas Bauer',
  'Aisha Rahman',
  'Diego Vargas',
  'Nora Lindqvist',
  'Tariq Hassan',
]
const SAMPLE_ROLES = [
  'Senior Product Designer',
  'Staff Engineer',
  'Growth Marketing Lead',
  'Data Scientist',
  'UX Researcher',
  'Technical Writer',
  'Engineering Manager',
  'Customer Success Director',
  'Security Analyst',
  'Financial Planner',
]
const SAMPLE_BACKGROUNDS = [
  'Fifteen years across startups and enterprise, with deep experience leading cross-functional teams through ambiguity.',
  'Background in research academia, transitioned to industry six years ago and now bridges theory and shipping.',
  'Self-taught, then formalised via a CS degree. Built and sold two small SaaS products before joining the team.',
  'Spent a decade in agency land before moving in-house. Loves the craft of shipping, hates theatre-of-work.',
]
const SAMPLE_STYLES = [
  'Calm and structured. Uses concrete examples, references user research, and asks clarifying questions before committing.',
  'Energetic and direct. Speaks in metaphors, pushes for decisions, and owns the outcome publicly.',
  'Quiet and analytical. Pauses before answering, cites sources, and prefers written follow-ups.',
  'Warm and story-driven. Weaves anecdotes into explanations, celebrates small wins, and coaches through questions.',
]
function expertiseLabel(level: number): string {
  if (level <= 3) return 'Beginner'
  if (level <= 6) return 'Intermediate'
  if (level <= 8) return 'Advanced'
  return 'Expert'
}
function buildProfile(s: PersonaState): string {
  const traits =
    s.traits.length > 0 ? s.traits.join(', ') : 'no dominant traits specified'
  return [
    `# Persona Profile: ${s.name || 'Unnamed'}`,
    '',
    `**Role / Profession:** ${s.role || '—'}`,
    `**Expertise level:** ${s.expertise}/10 (${expertiseLabel(s.expertise)})`,
    `**Traits:** ${traits}`,
    '',
    '## Background',
    s.background.trim() || '—',
    '',
    '## Speaking style',
    s.speakingStyle.trim() || '—',
  ].join('\n')
}
function buildSystemPrompt(s: PersonaState): string {
  const traits =
    s.traits.length > 0 ? s.traits.join(', ') : 'neutral and balanced'
  const lines: string[] = []
  lines.push(
    `You are ${s.name || 'an AI assistant'}, ${s.role || 'a professional'} with ${s.expertise}/10 expertise (${expertiseLabel(s.expertise)}).`
  )
  lines.push('')
  if (s.background.trim()) {
    lines.push('Background:')
    lines.push(s.background.trim())
    lines.push('')
  }
  lines.push(`Personality traits: ${traits}.`)
  if (s.speakingStyle.trim()) {
    lines.push('')
    lines.push(`Speaking style: ${s.speakingStyle.trim()}`)
  }
  lines.push('')
  lines.push(
    'Stay in character at all times. Draw on your background and expertise when answering. If a question is outside your domain, acknowledge it as your persona would.'
  )
  return lines.join('\n')
}
export default function AiPersonaGenerator() {
  const [state, setState] = React.useState<PersonaState>(DEFAULT_STATE)
  const update = <K extends keyof PersonaState>(
    key: K,
    value: PersonaState[K]
  ): void => {
    setState((prev) => ({ ...prev, [key]: value }))
  }
  const toggleTrait = (trait: Trait): void => {
    setState((prev) => {
      const has = prev.traits.includes(trait)
      return {
        ...prev,
        traits: has
          ? prev.traits.filter((t) => t !== trait)
          : [...prev.traits, trait],
      }
    })
  }
  const randomize = (): void => {
    const name = SAMPLE_NAMES[randomInt(SAMPLE_NAMES.length)]
    const role = SAMPLE_ROLES[randomInt(SAMPLE_ROLES.length)]
    const background = SAMPLE_BACKGROUNDS[randomInt(SAMPLE_BACKGROUNDS.length)]
    const speakingStyle = SAMPLE_STYLES[randomInt(SAMPLE_STYLES.length)]
    // Pick 2-4 random traits.
    const targetCount = 2 + randomInt(3)
    const pool = [...ALL_TRAITS]
    const picked: Trait[] = []
    for (let i = 0; i < targetCount && pool.length > 0; i++) {
      const idx = randomInt(pool.length)
      picked.push(pool.splice(idx, 1)[0])
    }
    setState({
      name,
      role,
      traits: picked,
      expertise: 4 + randomInt(7),
      background,
      speakingStyle,
    })
  }
  const profile = React.useMemo(() => buildProfile(state), [state])
  const systemPrompt = React.useMemo(() => buildSystemPrompt(state), [state])
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>AI Persona Generator</CardTitle>
          <CardDescription>
            Build detailed AI personas with a role, traits, expertise level,
            background, and speaking style. Output a formatted profile and a
            ready-to-use system prompt for any LLM.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" onClick={randomize}>
            <Shuffle className="size-4" />
            Randomize persona
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Persona name" htmlFor="ap-name">
              <Input
                id="ap-name"
                value={state.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Maya Chen"
              />
            </Field>
            <Field label="Role / profession" htmlFor="ap-role">
              <Input
                id="ap-role"
                value={state.role}
                onChange={(e) => update('role', e.target.value)}
                placeholder="Senior Product Designer"
              />
            </Field>
          </div>
          <Field
            label="Expertise level"
            htmlFor="ap-expertise"
            hint={`${state.expertise}/10 · ${expertiseLabel(state.expertise)}`}
          >
            <Slider
              id="ap-expertise"
              min={1}
              max={10}
              step={1}
              value={[state.expertise]}
              onValueChange={(v) => update('expertise', v[0] ?? 1)}
              aria-label="Expertise level from 1 to 10"
            />
          </Field>
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm font-medium text-foreground">
                Traits
              </span>
              <span className="text-xs text-muted-foreground">
                {state.traits.length} selected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ALL_TRAITS.map((trait) => {
                const id = `ap-trait-${trait}`
                const checked = state.traits.includes(trait)
                return (
                  <div
                    key={trait}
                    className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 p-2.5"
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={() => toggleTrait(trait)}
                      aria-label={`Trait: ${trait}`}
                    />
                    <Label
                      htmlFor={id}
                      className="cursor-pointer text-xs font-normal capitalize"
                    >
                      {trait}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>
          <Field label="Background" htmlFor="ap-background" hint="free-form">
            <Textarea
              id="ap-background"
              value={state.background}
              onChange={(e) => update('background', e.target.value)}
              placeholder="Twelve years in consumer SaaS…"
              rows={4}
            />
          </Field>
          <Field label="Speaking style" htmlFor="ap-style" hint="free-form">
            <Textarea
              id="ap-style"
              value={state.speakingStyle}
              onChange={(e) => update('speakingStyle', e.target.value)}
              placeholder="Calm and structured. Uses concrete examples…"
              rows={3}
            />
          </Field>
        </CardContent>
      </Card>
      <div className="flex flex-wrap items-center gap-2" role="status" aria-live="polite">
        <Badge variant="outline">
          <UserCircle className="size-3" />
          {state.name || 'Unnamed'}
        </Badge>
        <Badge variant="outline">{state.role || 'No role'}</Badge>
        <Badge variant="outline">Lv {state.expertise}/10</Badge>
        {state.traits.map((t) => (
          <Badge key={t} variant="secondary" className="capitalize">
            {t}
          </Badge>
        ))}
      </div>
      <Separator />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <Sparkles className="size-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="prompt">System prompt</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <ResultBox
            value={profile}
            label="Persona profile"
            rows={12}
            mono={false}
            downloadName="persona-profile.md"
            empty="Fill in identity fields to generate a profile."
          />
        </TabsContent>
        <TabsContent value="prompt" className="mt-4">
          <ResultBox
            value={systemPrompt}
            label="System prompt"
            rows={12}
            mono
            downloadName="persona-system-prompt.md"
            empty="Fill in identity fields to generate a system prompt."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}