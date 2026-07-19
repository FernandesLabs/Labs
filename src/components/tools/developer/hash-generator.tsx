'use client'
import * as React from 'react'
import { Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'
type Algo = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'
const ALGOS: Algo[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
function bytesToHex(bytes: Uint8Array): string {
  let out = ''
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0')
  }
  return out
}
async function hashText(text: string, algo: Algo): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest(algo, data)
  return bytesToHex(new Uint8Array(buf))
}
export default function HashGenerator() {
  const [input, setInput] = React.useState(
    'The quick brown fox jumps over the lazy dog'
  )
  const [hashes, setHashes] = React.useState<Record<Algo, string>>({
    'SHA-1': '',
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': '',
  })
  const [busy, setBusy] = React.useState(false)
  React.useEffect(() => {
    let cancelled = false
    const run = async () => {
      setBusy(true)
      try {
        const text = input
        const results = await Promise.all(
          ALGOS.map(async (a) => [a, await hashText(text, a)] as const)
        )
        if (cancelled) return
        const next: Record<Algo, string> = {
          'SHA-1': '',
          'SHA-256': '',
          'SHA-384': '',
          'SHA-512': '',
        }
        for (const [a, h] of results) next[a] = h
        setHashes(next)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        toast.error('Hashing failed: ' + msg)
      } finally {
        if (!cancelled) setBusy(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [input])
  const inputBytes = new Blob([input]).size
  return (
    <div className="space-y-5">
      <Field
        label="Input text"
        htmlFor="hash-input"
        hint={`${inputBytes} bytes · all four hashes computed`}
      >
        <Textarea
          id="hash-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          className="font-mono text-sm"
          spellCheck={false}
          placeholder="Type text to hash…"
        />
      </Field>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setInput('')}>
          <Eraser className="size-4" />
          Clear
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Input bytes" value={inputBytes} />
        <Stat label="SHA-1 len" value={hashes['SHA-1'].length / 2 || 0} />
        <Stat label="SHA-256 len" value={hashes['SHA-256'].length / 2 || 0} />
        <Stat label="SHA-512 len" value={hashes['SHA-512'].length / 2 || 0} />
      </div>
      <div className="space-y-4">
        {input.trim() === '' ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
            Enter text above to compute all four hashes simultaneously.
          </div>
        ) : null}
        {ALGOS.map((algo) => (
          <ResultBox
            key={algo}
            value={hashes[algo]}
            label={algo}
            rows={algo === 'SHA-512' || algo === 'SHA-384' ? 4 : 3}
            downloadName={`${algo.toLowerCase().replace('-', '')}.txt`}
            empty={busy ? 'Computing…' : '—'}
          />
        ))}
      </div>
    </div>
  )
}