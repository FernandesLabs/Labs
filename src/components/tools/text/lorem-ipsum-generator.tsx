'use client'

import * as React from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, ResultBox, randomInt } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'

const WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'eiusmod',
  'tempor',
  'incididunt',
  'labore',
  'magna',
  'aliqua',
  'enim',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'laborum',
  'perspiciatis',
  'unde',
  'omnis',
  'iste',
  'natus',
  'error',
  'voluptatem',
  'accusantium',
  'doloremque',
  'laudantium',
  'totam',
  'rem',
  'aperiam',
  'eaque',
  'ipsa',
  'quae',
  'ab',
  'illo',
  'inventore',
  'veritatis',
  'quasi',
  'architecto',
  'beatae',
  'vitae',
  'dicta',
  'explicabo',
  'nemo',
  'ipsam',
  'quia',
  'voluptas',
]

type Unit = 'paragraphs' | 'sentences' | 'words'

const OPENING = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'

function randomWord(): string {
  return WORDS[randomInt(WORDS.length)] as string
}

function buildSentence(): string {
  const len = 8 + randomInt(10) // 8..17 words
  const parts: string[] = []
  for (let i = 0; i < len; i++) parts.push(randomWord())
  let sentence = parts.join(' ')
  // Capitalize first letter, append period.
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
  return sentence
}

function buildParagraph(minSentences = 3, maxSentences = 6): string {
  const count = minSentences + randomInt(maxSentences - minSentences + 1)
  const sentences: string[] = []
  for (let i = 0; i < count; i++) sentences.push(buildSentence())
  return sentences.join(' ')
}

export default function LoremIpsumGenerator() {
  const [count, setCount] = React.useState(3)
  const [unit, setUnit] = React.useState<Unit>('paragraphs')
  const [startClassic, setStartClassic] = React.useState(true)
  const [output, setOutput] = React.useState('')

  const generate = React.useCallback(() => {
    const safeCount = Math.max(1, Math.min(100, count))
    if (unit === 'words') {
      const words: string[] = []
      if (startClassic) {
        // Use the classic opening as the first words.
        const opening = OPENING.replace(/,/g, '').split(' ')
        const take = Math.min(opening.length, safeCount)
        for (let i = 0; i < take; i++) words.push(opening[i]!.toLowerCase())
        while (words.length < safeCount) words.push(randomWord())
      } else {
        while (words.length < safeCount) words.push(randomWord())
      }
      let text = words.slice(0, safeCount).join(' ')
      text = text.charAt(0).toUpperCase() + text.slice(1)
      if (safeCount > 1) text += '.'
      setOutput(text)
      return
    }

    if (unit === 'sentences') {
      const sentences: string[] = []
      if (startClassic && safeCount > 0) {
        sentences.push(OPENING + '.')
      }
      while (sentences.length < safeCount) sentences.push(buildSentence())
      setOutput(sentences.slice(0, safeCount).join(' '))
      return
    }

    // paragraphs
    const paras: string[] = []
    if (startClassic && safeCount > 0) {
      // First paragraph begins with the classic opening sentence,
      // followed by a couple more generated sentences.
      const first = [OPENING + '.', buildSentence(), buildSentence()].join(' ')
      paras.push(first)
    }
    while (paras.length < safeCount) paras.push(buildParagraph())
    setOutput(paras.slice(0, safeCount).join('\n\n'))
  }, [count, unit, startClassic])

  const handleGenerate = () => {
    if (count < 1 || count > 100) {
      toast.error('Count must be between 1 and 100')
      return
    }
    generate()
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Count" htmlFor="li-count" hint="1 — 100">
          <Input
            id="li-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => {
              const n = Number(e.target.value)
              setCount(Number.isFinite(n) ? n : 0)
            }}
          />
        </Field>
        <Field label="Unit" htmlFor="li-unit">
          <Select
            value={unit}
            onValueChange={(v) => setUnit(v as Unit)}
          >
            <SelectTrigger id="li-unit" className="w-full">
              <SelectValue placeholder="Pick unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraphs">Paragraphs</SelectItem>
              <SelectItem value="sentences">Sentences</SelectItem>
              <SelectItem value="words">Words</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
        <div className="pr-3">
          <Label
            htmlFor="li-classic"
            className="text-sm font-medium text-foreground"
          >
            Start with “Lorem ipsum”
          </Label>
          <p className="text-xs text-muted-foreground">
            Open with the classic Latin first sentence.
          </p>
        </div>
        <Switch
          id="li-classic"
          checked={startClassic}
          onCheckedChange={setStartClassic}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleGenerate}
          className="bg-primary text-primary-foreground"
        >
          <Sparkles className="size-4" />
          Generate
        </Button>
      </div>

      <ResultBox
        value={output}
        label="Generated text"
        rows={8}
        downloadName="lorem-ipsum.txt"
        empty="Click Generate to produce Lorem Ipsum placeholder text."
      />
    </div>
  )
}
