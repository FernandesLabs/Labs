'use client'

import * as React from 'react'
import { Eye, EyeOff, Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'

type Algo = 'SHA-256' | 'SHA-384' | 'SHA-512'

const ALGOS: Algo[] = ['SHA-256', 'SHA-384', 'SHA-512']

function bytesToHex(bytes: Uint8Array): string {
  let out = ''
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0')
  }
  return out
}

async function computeHmac(
  message: string,
  secret: string,
  algo: Algo
): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: algo },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return bytesToHex(new Uint8Array(sig))
}

export default function HmacGenerator() {
  const [message, setMessage] = React.useState(
    'The quick brown fox jumps over the lazy dog'
  )
  const [secret, setSecret] = React.useState('my-secret-key')
  const [showSecret, setShowSecret] = React.useState(false)
  const [algo, setAlgo] = React.useState<Algo>('SHA-256')
  const [output, setOutput] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    if (!secret) {
      setError('Secret is required for HMAC.')
      setOutput('')
      return
    }
    if (!message) {
      setError('Message is empty.')
      setOutput('')
      return
    }
    let cancelled = false
    const run = async () => {
      setBusy(true)
      try {
        const hex = await computeHmac(message, secret, algo)
        if (cancelled) return
        setOutput(hex)
        setError(null)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        if (!cancelled) {
          setError(msg)
          setOutput('')
          toast.error('HMAC computation failed')
        }
      } finally {
        if (!cancelled) setBusy(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [message, secret, algo])

  return (
    <div className="space-y-5">
      <Field
        label="Message"
        htmlFor="hmac-msg"
        hint="The data to authenticate"
      >
        <Textarea
          id="hmac-msg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="font-mono text-sm"
          spellCheck={false}
          placeholder="Message to sign…"
        />
      </Field>

      <Field label="Secret key" htmlFor="hmac-secret" hint="Never shared">
        <div className="flex items-center gap-2">
          <Input
            id="hmac-secret"
            type={showSecret ? 'text' : 'password'}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter secret…"
            autoComplete="off"
            spellCheck={false}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowSecret((s) => !s)}
            aria-label={showSecret ? 'Hide secret' : 'Show secret'}
          >
            {showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
      </Field>

      <Field label="Algorithm" htmlFor="hmac-algo">
        <Select value={algo} onValueChange={(v) => setAlgo(v as Algo)}>
          <SelectTrigger id="hmac-algo" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALGOS.map((a) => (
              <SelectItem key={a} value={a}>
                HMAC-{a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setMessage('')
            setSecret('')
            setOutput('')
            setError(null)
          }}
        >
          <Eraser className="size-4" />
          Clear
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Algorithm" value={`HMAC-${algo}`} />
        <Stat
          label="Output bits"
          value={
            algo === 'SHA-256' ? 256 : algo === 'SHA-384' ? 384 : 512
          }
        />
        <Stat label="Message bytes" value={new Blob([message]).size} />
        <Stat label="Secret bytes" value={new Blob([secret]).size} />
      </div>

      <ResultBox
        value={output}
        label={`HMAC-${algo} (hex)`}
        rows={4}
        downloadName={`hmac-${algo.toLowerCase().replace('-', '')}.txt`}
        empty={busy ? 'Computing…' : error ? 'Fix the error above.' : 'HMAC will appear here.'}
      />
    </div>
  )
}
