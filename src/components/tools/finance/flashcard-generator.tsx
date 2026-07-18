'use client'

import * as React from 'react'
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Field, downloadBlob } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'

interface Flashcard {
  id: number
  front: string
  back: string
}

let _nextId = 3
function nextId(): number {
  _nextId += 1
  return _nextId
}

/**
 * Flashcard Generator
 * Dynamic card list (front / back). Two tabs: Editor (manage cards) and
 * Study (flip one card at a time). Export & import JSON. Handles empty deck
 * gracefully in study mode.
 */
export default function FlashcardGenerator() {
  const [cards, setCards] = React.useState<Flashcard[]>([
    { id: 1, front: 'What is the capital of France?', back: 'Paris' },
    { id: 2, front: 'What is 2 + 2?', back: '4' },
  ])
  const [tab, setTab] = React.useState<'editor' | 'study'>('editor')
  const [studyIndex, setStudyIndex] = React.useState(0)
  const [flipped, setFlipped] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const add = () =>
    setCards((prev) => [...prev, { id: nextId(), front: '', back: '' }])

  const remove = (id: number) =>
    setCards((prev) => prev.filter((c) => c.id !== id))

  const update = (id: number, patch: Partial<Flashcard>) =>
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    )

  const safeStudyIndex =
    cards.length === 0 ? 0 : Math.min(studyIndex, cards.length - 1)
  const current = cards.length > 0 ? cards[safeStudyIndex] : null

  const goNext = () => {
    if (cards.length === 0) return
    setFlipped(false)
    setStudyIndex((i) => (i + 1) % cards.length)
  }

  const goPrev = () => {
    if (cards.length === 0) return
    setFlipped(false)
    setStudyIndex((i) => (i - 1 + cards.length) % cards.length)
  }

  const flip = () => {
    if (cards.length === 0) return
    setFlipped((f) => !f)
  }

  const exportJson = () => {
    if (cards.length === 0) {
      toast.error('Nothing to export — your deck is empty')
      return
    }
    const data = JSON.stringify(
      cards.map(({ front, back }) => ({ front, back })),
      null,
      2,
    )
    downloadBlob(
      new Blob([data], { type: 'application/json' }),
      'flashcards.json',
    )
    toast.success(`Exported ${cards.length} card${cards.length === 1 ? '' : 's'}`)
  }

  const importJson = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (!Array.isArray(parsed)) {
          toast.error('File must contain a JSON array of cards')
          return
        }
        const valid: Flashcard[] = parsed
          .filter(
            (c) =>
              c &&
              typeof c === 'object' &&
              typeof c.front === 'string' &&
              typeof c.back === 'string',
          )
          .map((c: { front: string; back: string }) => ({
            id: nextId(),
            front: c.front,
            back: c.back,
          }))
        if (valid.length === 0) {
          toast.error('No valid cards found (need {front, back} objects)')
          return
        }
        setCards(valid)
        setStudyIndex(0)
        setFlipped(false)
        toast.success(`Imported ${valid.length} card${valid.length === 1 ? '' : 's'}`)
      } catch {
        toast.error('Invalid JSON file')
      }
    }
    reader.onerror = () => toast.error('Could not read file')
    reader.readAsText(file)
  }

  return (
    <div className="space-y-5">
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as typeof tab)}
      >
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="study">Study</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-base">
                Cards
                <Badge variant="outline" className="ml-2">
                  {cards.length}
                </Badge>
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="size-4" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportJson}
                  disabled={cards.length === 0}
                >
                  <Download className="size-4" />
                  Export
                </Button>
                <Button
                  size="sm"
                  onClick={add}
                  className="bg-primary text-primary-foreground"
                >
                  <Plus className="size-4" />
                  Add card
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) importJson(f)
                  e.target.value = ''
                }}
              />
              <ScrollArea className="max-h-96">
                <div className="space-y-3 pr-3">
                  {cards.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No cards yet. Click “Add card” to get started, or import a
                      JSON file.
                    </p>
                  ) : null}
                  {cards.map((c, idx) => (
                    <div
                      key={c.id}
                      className="grid gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-[1fr_1fr_auto]"
                    >
                      <Field
                        label={`Card ${idx + 1} · Front`}
                        htmlFor={`card-${c.id}-front`}
                      >
                        <Textarea
                          id={`card-${c.id}-front`}
                          value={c.front}
                          placeholder="Question or term"
                          rows={2}
                          onChange={(e) => update(c.id, { front: e.target.value })}
                          aria-label={`Card ${idx + 1} front`}
                        />
                      </Field>
                      <Field label="Back" htmlFor={`card-${c.id}-back`}>
                        <Textarea
                          id={`card-${c.id}-back`}
                          value={c.back}
                          placeholder="Answer or definition"
                          rows={2}
                          onChange={(e) => update(c.id, { back: e.target.value })}
                          aria-label={`Card ${idx + 1} back`}
                        />
                      </Field>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(c.id)}
                        aria-label={`Remove card ${idx + 1}`}
                        className="h-9 w-9 self-end"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="study" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-base">Study mode</CardTitle>
              <Badge variant="outline">
                {cards.length === 0
                  ? '0 / 0'
                  : `${safeStudyIndex + 1} / ${cards.length}`}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {current ? (
                <button
                  type="button"
                  onClick={flip}
                  className="block min-h-48 w-full rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-left transition hover:from-primary/15 hover:to-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Card ${safeStudyIndex + 1} — click to flip. Currently showing ${flipped ? 'the back' : 'the front'}.`}
                  aria-pressed={flipped}
                >
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {flipped ? 'Back' : 'Front'}
                  </div>
                  <div className="mt-3 whitespace-pre-wrap break-words text-lg font-medium text-foreground sm:text-xl">
                    {flipped
                      ? current.back || '(empty)'
                      : current.front || '(empty)'}
                  </div>
                  <div className="mt-6 text-xs text-muted-foreground">
                    Click card to flip
                  </div>
                </button>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                  Your deck is empty. Switch to the Editor tab to add cards or
                  import a JSON file.
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={goPrev}
                  disabled={cards.length === 0}
                >
                  <ChevronLeft className="size-4" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  onClick={flip}
                  disabled={cards.length === 0}
                >
                  <RefreshCw className="size-4" />
                  Flip
                </Button>
                <Button
                  onClick={goNext}
                  disabled={cards.length === 0}
                  className="bg-primary text-primary-foreground"
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
