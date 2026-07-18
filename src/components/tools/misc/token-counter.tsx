'use client'

import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Field, Stat } from '@/lib/tools/tool-ui'

interface ModelCost {
  name: string
  inPerM: number // USD per million input tokens
  outPerM: number // USD per million output tokens
}

const MODELS: ModelCost[] = [
  { name: 'GPT-4', inPerM: 30, outPerM: 60 },
  { name: 'GPT-3.5', inPerM: 0.5, outPerM: 1.5 },
]

function countWords(text: string): number {
  const t = text.trim()
  if (!t) return 0
  return t.split(/\s+/).filter(Boolean).length
}

function usd(n: number): string {
  if (n < 0.01) return `$${n.toFixed(5)}`
  if (n < 1) return `$${n.toFixed(4)}`
  return `$${n.toFixed(2)}`
}

export default function TokenCounter() {
  const [text, setText] = React.useState(
    'The quick brown fox jumps over the lazy dog. Paste your text here to estimate token counts and LLM inference costs.'
  )

  const stats = React.useMemo(() => {
    const chars = text.length
    const words = countWords(text)
    const tokensChars = Math.ceil(chars / 4)
    const tokensWords = Math.ceil(words / 0.75) // words/3 — alternate heuristic
    const estTokens = Math.max(tokensChars, tokensWords)

    const costs = MODELS.map((m) => ({
      name: m.name,
      input: (estTokens / 1_000_000) * m.inPerM,
      output: (estTokens / 1_000_000) * m.outPerM,
    }))

    return {
      chars,
      words,
      tokensChars,
      tokensWords,
      estTokens,
      costs,
    }
  }, [text])

  return (
    <div className="space-y-5">
      <Field
        label="Text"
        htmlFor="tc-text"
        hint={`${stats.chars.toLocaleString()} chars · ${stats.words.toLocaleString()} words`}
      >
        <Textarea
          id="tc-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Paste any text — a prompt, an article, code, etc."
          className="font-mono text-sm"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat
          label="Est. tokens"
          value={stats.estTokens.toLocaleString()}
          accent="oklch(0.6 0.2 20)"
        />
        <Stat label="Words" value={stats.words.toLocaleString()} />
        <Stat label="Characters" value={stats.chars.toLocaleString()} />
        <Stat
          label="Tokens (words/3)"
          value={stats.tokensWords.toLocaleString()}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Estimated inference cost (per request, same token count)
          </div>
          <div className="mt-3 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Model</th>
                  <th className="px-3 py-2 text-right font-medium">Input</th>
                  <th className="px-3 py-2 text-right font-medium">Output</th>
                  <th className="px-3 py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.costs.map((c, i) => (
                  <tr
                    key={c.name}
                    className={i % 2 === 1 ? 'bg-muted/20' : ''}
                  >
                    <td className="px-3 py-2 font-medium">{c.name}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">
                      {usd(c.input)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">
                      {usd(c.output)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-semibold tabular-nums">
                      {usd(c.input + c.output)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Heuristic: ~4 chars per token (English). Costs are list prices per
            1M tokens — GPT-4 ($30 in / $60 out), GPT-3.5 ($0.50 in / $1.50 out).
            Actual tokenizer counts may vary by ~10–20%.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
