'use client'

import * as React from 'react'
import { Info, CheckCircle2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { useCopy } from '@/lib/tools/use-copy'

type Context = 'decorative' | 'button' | 'link' | 'content' | 'photo'
type Tone = 'concise' | 'detailed'

interface AltState {
  description: string
  context: Context
  tone: Tone
  linkTarget: string
}

function escAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function capitalize(s: string): string {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function buildVariants(state: AltState): string[] {
  const desc = state.description.trim()
  const ctx = state.context
  const tone = state.tone

  if (ctx === 'decorative') {
    return ['', '', '']
  }

  if (!desc) return ['', '', '']

  const variants: string[] = []

  switch (ctx) {
    case 'button': {
      variants.push(`Icon: ${desc}`)
      if (tone === 'detailed') {
        variants.push(`Button showing ${desc}`)
        variants.push(`${capitalize(desc)} button`)
      } else {
        variants.push(`${capitalize(desc)} icon`)
        variants.push(`Button: ${desc}`)
      }
      break
    }
    case 'link': {
      const target = state.linkTarget.trim() || 'the next page'
      variants.push(`${desc} — links to ${target}`)
      if (tone === 'detailed') {
        variants.push(`Image of ${desc} that links to ${target}`)
        variants.push(`Linked image: ${desc} (goes to ${target})`)
      } else {
        variants.push(`${capitalize(desc)} linking to ${target}`)
        variants.push(`Link to ${target}: ${desc}`)
      }
      break
    }
    case 'photo': {
      variants.push(`Photo of ${desc}`)
      if (tone === 'detailed') {
        variants.push(`Photograph showing ${desc}`)
        variants.push(`${capitalize(desc)} — photograph`)
      } else {
        variants.push(`${capitalize(desc)} photo`)
        variants.push(`Photograph of ${desc}`)
      }
      break
    }
    case 'content':
    default: {
      const base = capitalize(desc).replace(/\.$/, '')
      variants.push(`${base}.`)
      if (tone === 'detailed') {
        variants.push(`${base}. Illustration used in the body of the article.`)
        variants.push(`Illustration of ${desc}.`)
      } else {
        variants.push(`Illustration: ${desc}`)
        variants.push(`${base}`)
      }
      break
    }
  }

  return variants.slice(0, 3)
}

function htmlSnippet(alt: string): string {
  return `<img src="image.jpg" alt="${escAttr(alt)}" />`
}

const CONTEXT_HINTS: Record<Context, string> = {
  decorative: 'Hidden from screen readers — use empty alt="" for purely decorative images.',
  button: 'Conveys the action of an icon-only button.',
  link: 'Describes both the image and the link destination.',
  content: 'Informative image embedded in page content.',
  photo: 'Photograph — describe what is shown.',
}

export default function AltTextGenerator(): React.JSX.Element {
  const { copy } = useCopy()
  const [state, setState] = React.useState<AltState>({
    description: 'a golden retriever puppy playing fetch in a park',
    context: 'content',
    tone: 'concise',
    linkTarget: 'the gallery page',
  })

  const update = <K extends keyof AltState>(key: K, value: AltState[K]): void => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const variants = React.useMemo(() => buildVariants(state), [state])
  const snippet = React.useMemo(() => {
    const primary = variants.find((v) => v !== '') ?? ''
    return htmlSnippet(primary)
  }, [variants])

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Alt Text Generator</CardTitle>
          <CardDescription>
            Generate accessible alt text suggestions based on image context.
            Templates adapt to the image&apos;s purpose (decorative, button,
            link, content, photo). Always review the output for accuracy —
            these are starting points, not a substitute for human judgment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Image description"
            htmlFor="at-desc"
            hint="what the image shows"
          >
            <Textarea
              id="at-desc"
              value={state.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="a golden retriever puppy playing fetch in a park"
              rows={3}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Context" htmlFor="at-ctx" hint={CONTEXT_HINTS[state.context]}>
              <Select
                value={state.context}
                onValueChange={(v) => update('context', v as Context)}
              >
                <SelectTrigger id="at-ctx">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decorative">Decorative (alt=&quot;&quot;)</SelectItem>
                  <SelectItem value="button">Icon button</SelectItem>
                  <SelectItem value="link">Linked image</SelectItem>
                  <SelectItem value="content">Content / illustration</SelectItem>
                  <SelectItem value="photo">Photograph</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tone" htmlFor="at-tone">
              <Select
                value={state.tone}
                onValueChange={(v) => update('tone', v as Tone)}
              >
                <SelectTrigger id="at-tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {state.context === 'link' ? (
            <Field label="Link target" htmlFor="at-link">
              <Input
                id="at-link"
                value={state.linkTarget}
                onChange={(e) => update('linkTarget', e.target.value)}
                placeholder="the gallery page"
              />
            </Field>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Suggested alt text</CardTitle>
          <CardDescription>
            Three variations to choose from. Click any to copy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {variants.every((v) => v === '') ? (
            <div
              role="status"
              className="flex items-start gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              <div>
                <div className="font-medium">Use empty alt text</div>
                <div className="text-xs">
                  Decorative images should be hidden from assistive tech with{' '}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                    alt=&quot;&quot;
                  </code>
                  .
                </div>
              </div>
            </div>
          ) : (
            variants.map((v, i) => (
              v ? (
                <button
                  key={i}
                  type="button"
                  onClick={() => copy(v, `Alt text ${i + 1} copied`)}
                  className="flex w-full items-start gap-3 rounded-lg border border-border bg-muted/20 p-3 text-left text-sm transition hover:border-primary/40 hover:bg-muted/40"
                >
                  <Badge variant="outline" className="mt-0.5 font-mono text-[10px]">
                    {i + 1}
                  </Badge>
                  <span className="flex-1">{v}</span>
                </button>
              ) : null
            ))
          )}
        </CardContent>
      </Card>

      <ResultBox
        value={snippet}
        label="HTML snippet"
        rows={2}
        mono
        empty="Fill in the description to generate the snippet."
      />

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">WCAG guidance</CardTitle>
          <CardDescription>
            Quick reference based on WCAG 2.1 Success Criterion 1.1.1
            (Non-text Content).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">Informative images:</strong>{' '}
                alt text should convey the same meaning as the image.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">Decorative images:</strong>{' '}
                use empty <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">alt=&quot;&quot;</code> so screen readers skip them.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">Functional images</strong>{' '}
                (buttons/links): describe the action, not the appearance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <span>
                <strong className="text-foreground">Avoid</strong>{' '}
                &quot;image of&quot; or &quot;picture of&quot; — screen readers
                already announce the image role.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">Keep it concise</strong>{' '}
                — usually under 125 characters.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
