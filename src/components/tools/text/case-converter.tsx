'use client'
import * as React from 'react'
import { Copy, Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Field, ResultBox } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
import { toast } from 'sonner'
type CaseId =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant'
  | 'alternating'
  | 'inverse'
interface CaseOption {
  id: CaseId
  label: string
  description: string
}
const OPTIONS: CaseOption[] = [
  { id: 'upper', label: 'UPPERCASE', description: 'All letters uppercase' },
  { id: 'lower', label: 'lowercase', description: 'All letters lowercase' },
  { id: 'title', label: 'Title Case', description: 'Each word capitalized' },
  {
    id: 'sentence',
    label: 'Sentence case',
    description: 'First letter of each sentence',
  },
  { id: 'camel', label: 'camelCase', description: 'firstWord lower, rest capitalized' },
  { id: 'pascal', label: 'PascalCase', description: 'Each word capitalized, no separator' },
  { id: 'snake', label: 'snake_case', description: 'Words joined with underscore' },
  { id: 'kebab', label: 'kebab-case', description: 'Words joined with hyphen' },
  { id: 'constant', label: 'CONSTANT_CASE', description: 'Upper words, underscore separator' },
  { id: 'alternating', label: 'aLtErNaTiNg', description: 'Alternating letter case' },
  { id: 'inverse', label: 'InVeRsE', description: 'Swap case of each letter' },
]
function splitWords(input: string): string[] {
  // Split on non-alphanumeric (keep apostrophes and hyphens inside words).
  return (
    input
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .split(/[^A-Za-z0-9''-]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0)
  )
}
function applyCase(text: string, id: CaseId): string {
  if (!text) return ''
  switch (id) {
    case 'upper':
      return text.toUpperCase()
    case 'lower':
      return text.toLowerCase()
    case 'title':
      return text.replace(
        /\p{L}+/gu,
        (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      )
    case 'sentence': {
      const lower = text.toLowerCase()
      return lower.replace(
        /(^\s*\p{L})|([.!?]\s+\p{L})/gu,
        (m) => m.toUpperCase()
      )
    }
    case 'camel': {
      const words = splitWords(text)
      if (words.length === 0) return ''
      return (
        words[0].toLowerCase() +
        words
          .slice(1)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join('')
      )
    }
    case 'pascal': {
      const words = splitWords(text)
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('')
    }
    case 'snake':
      return splitWords(text)
        .map((w) => w.toLowerCase())
        .join('_')
    case 'kebab':
      return splitWords(text)
        .map((w) => w.toLowerCase())
        .join('-')
    case 'constant':
      return splitWords(text)
        .map((w) => w.toUpperCase())
        .join('_')
    case 'alternating': {
      let lower = true
      let out = ''
      for (const ch of text) {
        if (/\p{L}/u.test(ch)) {
          out += lower ? ch.toLowerCase() : ch.toUpperCase()
          lower = !lower
        } else {
          out += ch
        }
      }
      return out
    }
    case 'inverse': {
      let out = ''
      for (const ch of text) {
        if (ch >= 'a' && ch <= 'z') out += ch.toUpperCase()
        else if (ch >= 'A' && ch <= 'Z') out += ch.toLowerCase()
        else out += ch
      }
      return out
    }
  }
}
export default function CaseConverter() {
  const [original, setOriginal] = React.useState('')
  const [output, setOutput] = React.useState('')
  const [lastApplied, setLastApplied] = React.useState<CaseId | null>(null)
  const { copy } = useCopy()
  const handleApply = (id: CaseId) => {
    if (!original) {
      toast.error('Enter text to convert')
      return
    }
    setOutput(applyCase(original, id))
    setLastApplied(id)
  }
  return (
    <div className="space-y-5">
      <Field
        label="Original text"
        htmlFor="cv-text"
        hint={`${original.length.toLocaleString()} chars`}
      >
        <Textarea
          id="cv-text"
          value={original}
          onChange={(e) => {
            setOriginal(e.target.value)
            if (lastApplied) {
              setOutput(applyCase(e.target.value, lastApplied))
            }
          }}
          placeholder="Type or paste text. Pick a case below to transform it."
          className="min-h-32 font-sans"
        />
      </Field>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">
          Transformations
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {OPTIONS.map((opt) => (
            <Button
              key={opt.id}
              type="button"
              variant={lastApplied === opt.id ? 'default' : 'outline'}
              onClick={() => handleApply(opt.id)}
              title={opt.description}
              className="justify-start font-mono text-xs"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setOriginal('')
            setOutput('')
            setLastApplied(null)
          }}
          disabled={!original && !output}
          className="text-muted-foreground"
        >
          <Eraser className="size-4" />
          Reset
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (!output) {
              toast.error('Nothing to copy yet')
              return
            }
            copy(output, 'Output copied')
          }}
          disabled={!output}
          className="bg-primary text-primary-foreground"
        >
          <Copy className="size-4" />
          Copy output
        </Button>
      </div>
      <ResultBox
        value={output}
        label="Converted text"
        rows={5}
        empty="Apply a transformation to see the result. The original text is preserved above."
      />
    </div>
  )
}