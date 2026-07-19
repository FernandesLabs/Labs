'use client'
import * as React from 'react'
import { Eraser, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
import { toast } from 'sonner'
type ModeId =
  | 'eachWord'
  | 'sentence'
  | 'titleAp'
  | 'upper'
  | 'lower'
  | 'firstOnly'
  | 'toggle'
interface Mode {
  id: ModeId
  label: string
  description: string
  preview: string
}
const MODES: Mode[] = [
  { id: 'eachWord', label: 'Capitalize Each Word', description: 'First letter of every word uppercase', preview: 'Hello World From Here' },
  { id: 'sentence', label: 'Sentence case', description: 'Capitalize first letter of each sentence', preview: 'Hello world from here' },
  { id: 'titleAp', label: 'Title Case (AP)', description: 'AP-style title case with lowercase small words', preview: 'Hello World from Here' },
  { id: 'upper', label: 'ALL CAPS', description: 'Everything uppercase', preview: 'HELLO WORLD FROM HERE' },
  { id: 'lower', label: 'all lowercase', description: 'Everything lowercase', preview: 'hello world from here' },
  { id: 'firstOnly', label: 'First letter only', description: 'Capitalize only the very first letter', preview: 'Hello world from here' },
  { id: 'toggle', label: 'tOGGLE cASE', description: 'Invert the case of every letter', preview: 'hELLO wORLD fROM hERE' },
]
const AP_SMALL_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or',
  'the', 'to', 'vs', 'via',
])
function capitalizeWord(w: string): string {
  if (!w) return w
  const firstLetter = w.match(/^\p{L}/u)
  if (!firstLetter) return w
  return firstLetter[0].toUpperCase() + w.slice(1).toLowerCase()
}
function applyEachWord(text: string): string {
  return text.replace(/\p{L}[\p{L}'-]*/gu, (w) => capitalizeWord(w))
}
function applySentence(text: string): string {
  const lower = text.toLowerCase()
  // Capitalize the first letter of the text and any letter after a sentence boundary (. ! ?)
  return lower.replace(
    /(^\s*\p{L})|([.!?]\s+\p{L})/gu,
    (m) => m.toUpperCase()
  )
}
function applyTitleAp(text: string): string {
  const words = text.split(/(\s+)/) // keep whitespace tokens
  const wordIndices: number[] = []
  words.forEach((w, i) => {
    if (/\S/.test(w)) wordIndices.push(i)
  })
  const lastIdx = wordIndices.length - 1
  return words
    .map((tok, i) => {
      if (!/\S/.test(tok)) return tok
      const wordPos = wordIndices.indexOf(i)
      const firstWord = wordPos === 0
      const lastWord = wordPos === lastIdx
      const lower = tok.toLowerCase()
      const isSmall = AP_SMALL_WORDS.has(lower.replace(/[^a-z]/g, ''))
      if ((firstWord || lastWord) && isSmall) {
        return capitalizeWord(tok)
      }
      if (isSmall) {
        return lower
      }
      return capitalizeWord(tok)
    })
    .join('')
}
function applyUpper(text: string): string {
  return text.toUpperCase()
}
function applyLower(text: string): string {
  return text.toLowerCase()
}
function applyFirstOnly(text: string): string {
  const lower = text.toLowerCase()
  const m = lower.match(/^(\s*)(\p{L})/u)
  if (!m) return lower
  const idx = (m[1] ?? '').length
  return lower.slice(0, idx) + m[2].toUpperCase() + lower.slice(idx + 1)
}
function applyToggle(text: string): string {
  let out = ''
  for (const ch of text) {
    if (ch >= 'a' && ch <= 'z') out += ch.toUpperCase()
    else if (ch >= 'A' && ch <= 'Z') out += ch.toLowerCase()
    else out += ch
  }
  return out
}
function apply(text: string, mode: ModeId): string {
  if (!text) return ''
  switch (mode) {
    case 'eachWord': return applyEachWord(text)
    case 'sentence': return applySentence(text)
    case 'titleAp': return applyTitleAp(text)
    case 'upper': return applyUpper(text)
    case 'lower': return applyLower(text)
    case 'firstOnly': return applyFirstOnly(text)
    case 'toggle': return applyToggle(text)
  }
}
export default function CapitalizationTool(): React.JSX.Element {
  const [original, setOriginal] = React.useState<string>(
    'the quick brown fox jumps over the lazy dog. a great example of natural language.'
  )
  const [mode, setMode] = React.useState<ModeId>('titleAp')
  const { copy } = useCopy()
  const output = React.useMemo(() => apply(original, mode), [original, mode])
  const handleCopy = (): void => {
    if (!output) {
      toast.error('Nothing to copy')
      return
    }
    copy(output, 'Output copied')
  }
  const handleReset = (): void => {
    setOriginal('')
  }
  return (
    <div className="space-y-5">
      <Field
        label="Original text"
        htmlFor="cap-text"
        hint={`${original.length.toLocaleString()} chars`}
      >
        <Textarea
          id="cap-text"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          placeholder="Type or paste text. Pick a capitalization mode below — the result updates live."
          className="min-h-32 font-sans"
        />
      </Field>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">
          Capitalization mode
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              title={m.description}
              className={`flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left transition ${
                mode === m.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background hover:bg-muted/40'
              }`}
            >
              <span className="text-sm font-medium text-foreground">{m.label}</span>
              <span className="font-mono text-xs text-muted-foreground">{m.preview}</span>
              <span className="text-[11px] text-muted-foreground/80">{m.description}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={!original}
          className="text-muted-foreground"
        >
          <Eraser className="size-4" />
          Clear
        </Button>
        <Button
          type="button"
          onClick={handleCopy}
          disabled={!output}
          className="bg-primary text-primary-foreground"
        >
          <Copy className="size-4" />
          Copy output
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Input chars" value={original.length} />
        <Stat label="Output chars" value={output.length} />
        <Stat
          label="Words"
          value={original.trim() ? original.trim().split(/\s+/).length : 0}
        />
        <Stat
          label="Mode"
          value={MODES.find((m) => m.id === mode)?.label.split(' ')[0] ?? '—'}
        />
      </div>
      {mode === 'titleAp' ? (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span>AP small words kept lowercase (unless first/last):</span>
          {Array.from(AP_SMALL_WORDS).map((w) => (
            <Badge key={w} variant="outline" className="font-mono text-[10px]">
              {w}
            </Badge>
          ))}
        </div>
      ) : null}
      <ResultBox
        value={output}
        label="Converted text"
        rows={6}
        empty="Enter text above and pick a capitalization mode to see the live result."
      />
    </div>
  )
}