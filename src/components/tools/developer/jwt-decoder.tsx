'use client'

import * as React from 'react'
import { Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'

interface DecodedPart {
  raw: string
  pretty: string
  bytes: number
}

function base64UrlToBytes(s: string): Uint8Array {
  let str = s.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4 !== 0) str += '='
  const binary = atob(str)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  let out = ''
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0')
  }
  return out
}

interface Decoded {
  header: DecodedPart
  payload: DecodedPart
  signatureHex: string
  signatureBytes: number
  parts: string[]
}

function decodeJwt(token: string): Decoded {
  const trimmed = token.trim()
  const parts = trimmed.split('.')
  if (parts.length !== 3) {
    throw new Error(
      `Expected 3 segments separated by '.', got ${parts.length}.`
    )
  }
  if (!parts[0] || !parts[1] || !parts[2]) {
    throw new Error('One or more JWT segments are empty.')
  }

  const decodePart = (label: string, segment: string): DecodedPart => {
    let bytes: Uint8Array
    try {
      bytes = base64UrlToBytes(segment)
    } catch {
      throw new Error(`Invalid Base64URL in ${label} segment.`)
    }
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
    let obj: unknown
    try {
      obj = JSON.parse(text)
    } catch {
      throw new Error(`${label} is not valid JSON: ${text.slice(0, 80)}…`)
    }
    return {
      raw: text,
      pretty: JSON.stringify(obj, null, 2),
      bytes: bytes.length,
    }
  }

  const header = decodePart('header', parts[0])
  const payload = decodePart('payload', parts[1])
  const sigBytes = base64UrlToBytes(parts[2])

  return {
    header,
    payload,
    signatureHex: bytesToHex(sigBytes),
    signatureBytes: sigBytes.length,
    parts,
  }
}

export default function JwtDecoder() {
  const [token, setToken] = React.useState('')
  const [decoded, setDecoded] = React.useState<Decoded | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!token.trim()) {
      setDecoded(null)
      setError(null)
      return
    }
    try {
      const d = decodeJwt(token)
      setDecoded(d)
      setError(null)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      setDecoded(null)
      toast.error('Malformed JWT')
    }
  }, [token])

  return (
    <div className="space-y-5">
      <Field
        label="JWT token"
        htmlFor="jwt-input"
        hint="Decode only — no signature verification"
      >
        <Textarea
          id="jwt-input"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={5}
          className="font-mono text-xs"
          spellCheck={false}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature"
        />
      </Field>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setToken('')}>
          <Eraser className="size-4" />
          Clear
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="font-mono text-xs">
            {error}
          </AlertDescription>
        </Alert>
      ) : null}

      {decoded ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Header bytes" value={decoded.header.bytes} />
            <Stat label="Payload bytes" value={decoded.payload.bytes} />
            <Stat label="Signature bytes" value={decoded.signatureBytes} />
            <Stat
              label="Algorithm"
              value={
                (() => {
                  try {
                    const h = JSON.parse(decoded.header.raw) as {
                      alg?: string
                    }
                    return h.alg ?? '—'
                  } catch {
                    return '—'
                  }
                })()
              }
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-500/15 text-blue-700 dark:text-blue-300"
              >
                Header
              </Badge>
              <span className="text-xs text-muted-foreground">
                Algorithm & token type
              </span>
            </div>
            <ResultBox
              value={decoded.header.pretty}
              label="Header"
              rows={6}
              downloadName="jwt-header.json"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              >
                Payload
              </Badge>
              <span className="text-xs text-muted-foreground">
                Claims (not verified)
              </span>
            </div>
            <ResultBox
              value={decoded.payload.pretty}
              label="Payload"
              rows={10}
              downloadName="jwt-payload.json"
            />
          </div>

          <ResultBox
            value={decoded.signatureHex}
            label="Signature (hex)"
            rows={3}
            downloadName="jwt-signature.txt"
          />
        </>
      ) : (
        <ResultBox
          value=""
          label="Decoded JWT"
          rows={6}
          empty={error ? 'Fix the error above.' : 'Paste a JWT to decode it.'}
        />
      )}
    </div>
  )
}
