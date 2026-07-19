'use client'
import * as React from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Field, ResultBox, Stat, randomInt } from '@/lib/tools/tool-ui'
interface FaqPair {
  id: string
  question: string
  answer: string
}
function makeId(): string {
  return `faq-${Date.now().toString(36)}-${randomInt(1_000_000).toString(36)}`
}
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
function buildHtml(pairs: FaqPair[]): string {
  const filled = pairs.filter((p) => p.question.trim() || p.answer.trim())
  if (filled.length === 0) return ''
  const items = filled
    .map((p) => {
      const q = p.question.trim() || 'Untitled question'
      const a = p.answer.trim()
      const body = a ? `  <p>${escapeHtml(a)}</p>` : '  <p></p>'
      return `<details>\n  <summary>${escapeHtml(q)}</summary>\n${body}\n</details>`
    })
    .join('\n')
  return `<section class="faq">\n${items}\n</section>`
}
function buildJsonLd(pairs: FaqPair[]): string {
  const filled = pairs
    .filter((p) => p.question.trim() && p.answer.trim())
    .map((p) => ({
      '@type': 'Question',
      name: p.question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: p.answer.trim(),
      },
    }))
  if (filled.length === 0) return ''
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: filled,
  }
  return JSON.stringify(schema, null, 2)
}
const SAMPLE: FaqPair[] = [
  {
    id: 'seed-1',
    question: 'What is your return policy?',
    answer:
      'You can return any item within 30 days of delivery for a full refund, provided it is unused and in its original packaging.',
  },
  {
    id: 'seed-2',
    question: 'How long does shipping take?',
    answer:
      'Standard shipping takes 3-5 business days within the continental US. Express options are available at checkout.',
  },
]
export default function FaqGenerator(): React.JSX.Element {
  const [pairs, setPairs] = React.useState<FaqPair[]>(SAMPLE)
  const update = (id: string, field: 'question' | 'answer', value: string): void => {
    setPairs((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }
  const addPair = (): void => {
    if (pairs.length >= 50) {
      toast.error('Maximum of 50 FAQ pairs reached')
      return
    }
    setPairs((prev) => [...prev, { id: makeId(), question: '', answer: '' }])
  }
  const removePair = (id: string): void => {
    setPairs((prev) => (prev.length === 1 ? prev : prev.filter((p) => p.id !== id)))
  }
  const move = (index: number, direction: 'up' | 'down'): void => {
    setPairs((prev) => {
      const next = [...prev]
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }
  const htmlOutput = React.useMemo(() => buildHtml(pairs), [pairs])
  const jsonLdOutput = React.useMemo(() => buildJsonLd(pairs), [pairs])
  const filledCount = pairs.filter((p) => p.question.trim() && p.answer.trim()).length
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>FAQ Generator</CardTitle>
          <CardDescription>
            Build an FAQ section with interactive Q&amp;A pairs. Generates
            accessible HTML markup ({'<details>'} elements) and FAQPage
            JSON-LD schema for rich search results. Both outputs update live.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {pairs.map((pair, index) => (
              <div
                key={pair.id}
                className="space-y-2 rounded-lg border border-border bg-muted/20 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    Q{index + 1}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => move(index, 'up')}
                      disabled={index === 0}
                      aria-label={`Move question ${index + 1} up`}
                    >
                      <ArrowUp className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => move(index, 'down')}
                      disabled={index === pairs.length - 1}
                      aria-label={`Move question ${index + 1} down`}
                    >
                      <ArrowDown className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-rose-500 hover:text-rose-600"
                      onClick={() => removePair(pair.id)}
                      disabled={pairs.length === 1}
                      aria-label={`Remove question ${index + 1}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <Field label="Question" htmlFor={`q-${pair.id}`}>
                  <Input
                    id={`q-${pair.id}`}
                    value={pair.question}
                    onChange={(e) => update(pair.id, 'question', e.target.value)}
                    placeholder="What is your return policy?"
                  />
                </Field>
                <Field label="Answer" htmlFor={`a-${pair.id}`}>
                  <Textarea
                    id={`a-${pair.id}`}
                    value={pair.answer}
                    onChange={(e) => update(pair.id, 'answer', e.target.value)}
                    placeholder="You can return any item within 30 days…"
                    rows={3}
                  />
                </Field>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addPair}>
            <Plus className="size-4" />
            Add question
          </Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total pairs" value={pairs.length} />
        <Stat label="Complete" value={filledCount} accent="oklch(0.6 0.17 150)" />
        <Stat
          label="Incomplete"
          value={pairs.length - filledCount}
          accent={pairs.length - filledCount > 0 ? 'oklch(0.7 0.18 75)' : undefined}
        />
        <Stat label="HTML size" value={`${htmlOutput.length} chars`} />
      </div>
      <Tabs defaultValue="html">
        <TabsList>
          <TabsTrigger value="html">HTML markup</TabsTrigger>
          <TabsTrigger value="jsonld">FAQPage JSON-LD</TabsTrigger>
        </TabsList>
        <TabsContent value="html" className="mt-3">
          <ResultBox
            value={htmlOutput}
            label="HTML markup"
            rows={10}
            downloadName="faq.html"
            empty="Add at least one question and answer to generate the HTML markup."
          />
        </TabsContent>
        <TabsContent value="jsonld" className="mt-3">
          <ResultBox
            value={jsonLdOutput}
            label="FAQPage JSON-LD schema"
            rows={10}
            downloadName="faq-schema.json"
            empty="Both question and answer are required for a valid JSON-LD entry."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}