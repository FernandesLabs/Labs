'use client'

import * as React from 'react'
import { Eye, EyeOff, KeyRound, Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'

const DEFAULT_HEADER = `{"alg":"HS256","typ":"JWT"}`
const DEFAULT_PAYLOAD = `{
  "sub": "1234567890",
  "name": "Fernandes Labs",
  "iat": 1700000000,
  "exp": 1800000000
}`

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  const b64 = btoa(binary)
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function parseJsonOrThrow(text: string, label: string): unknown {
  try {
    return JSON.parse(text)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    throw new Error(`Invalid ${label} JSON: ${msg}`)
  }
}

async function signHmacSha256(
  data: string,
  secret: string
): Promise<Uint8Array> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return new Uint8Array(sig)
}

async function generateJwt(
  headerJson: string,
  payloadJson: string,
  secret: string
): Promise<string> {
  if (!secret) throw new Error('Secret is required to sign the JWT.')
  const headerObj = parseJsonOrThrow(headerJson, 'header')
  const payloadObj = parseJsonOrThrow(payloadJson, 'payload')
  const enc = new TextEncoder()
  const headerB64 = bytesToBase64Url(
    enc.encode(JSON.stringify(headerObj))
  )
  const payloadB64 = bytesToBase64Url(
    enc.encode(JSON.stringify(payloadObj))
  )
  const signingInput = `${headerB64}.${payloadB64}`
  const sig = await signHmacSha256(signingInput, secret)
  const sigB64 = bytesToBase64Url(sig)
  return `${signingInput}.${sigB64}`
}

export default function JwtGenerator() {
  const [secret, setSecret] = React.useState('your-256-bit-secret')
  const [showSecret, setShowSecret] = React.useState(false)
  const [header, setHeader] = React.useState(DEFAULT_HEADER)
  const [payload, setPayload] = React.useState(DEFAULT_PAYLOAD)
  const [token, setToken] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState(false)

  const generate = React.useCallback(async () => {
    if (!secret) {
      setError('Secret is required to sign the JWT.')
      setToken('')
      toast.error('Secret is required')
      return
    }
    setBusy(true)
    try {
      const t = await generateJwt(header, payload, secret)
      setToken(t)
      setError(null)
      toast.success('JWT generated')
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      setToken('')
      toast.error(msg)
    } finally {
      setBusy(false)
    }
  }, [header, payload, secret])

  // Generate on first mount.
  React.useEffect(() => {
    void generate()
  }, [])

  return (
    <div className="space-y-5">
      <Field label="Secret key" htmlFor="jwt-secret" hint="Used for HMAC-SHA256 signing">
        <div className="flex items-center gap-2">
          <Input
            id="jwt-secret"
            type={showSecret ? 'text' : 'password'}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter signing secret…"
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

      <Field label="Header JSON" htmlFor="jwt-header" hint='Default: HS256'>
        <Textarea
          id="jwt-header"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          rows={4}
          className="font-mono text-xs"
          spellCheck={false}
        />
      </Field>

      <Field label="Payload JSON" htmlFor="jwt-payload" hint="Claims to encode">
        <Textarea
          id="jwt-payload"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          rows={8}
          className="font-mono text-xs"
          spellCheck={false}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={generate}
          disabled={busy}
          className="bg-primary text-primary-foreground"
        >
          <KeyRound className="size-4" />
          {busy ? 'Signing…' : 'Generate JWT'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setHeader(DEFAULT_HEADER)
            setPayload(DEFAULT_PAYLOAD)
            setSecret('')
            setToken('')
            setError(null)
          }}
        >
          <Eraser className="size-4" />
          Reset
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="font-mono text-xs">
            {error}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Algorithm" value="HS256" />
        <Stat label="Secret bytes" value={new Blob([secret]).size} />
        <Stat label="Header bytes" value={new Blob([header]).size} />
        <Stat label="Token bytes" value={new Blob([token]).size} />
      </div>

      <ResultBox
        value={token}
        label="JWT token"
        rows={6}
        downloadName="token.jwt"
        empty={busy ? 'Signing…' : error ? 'Fix the error above.' : 'Token will appear here.'}
      />
    </div>
  )
}
