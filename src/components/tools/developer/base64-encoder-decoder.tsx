'use client'
import * as React from 'react'
import { Eraser, ArrowDownUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'
/** UTF-8 safe base64 encode. */
function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}
/** UTF-8 safe base64 decode. Validates alphabet + padding. */
function decodeBase64(b64: string): string {
  const cleaned = b64.replace(/\s+/g, '')
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
    throw new Error('Invalid Base64 — non-alphabet character detected.')
  }
  if (cleaned.length % 4 !== 0) {
    throw new Error('Invalid Base64 — length is not a multiple of 4.')
  }
  const binary = atob(cleaned)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
}
export default function Base64EncoderDecoder() {
  const [mode, setMode] = React.useState<'encode' | 'decode'>('encode')
  const [encodeIn, setEncodeIn] = React.useState('Hello, Fernandes Labs! 🚀')
  const [decodeIn, setDecodeIn] = React.useState('SGVsbG8sIEZlcm5hbmRlcyBMYWJzISDwn4yN')
  const [output, setOutput] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [urlSafe, setUrlSafe] = React.useState(false)
  React.useEffect(() => {
    setError(null)
    setOutput('')
    try {
      if (mode === 'encode') {
        if (!encodeIn) return
        let result = encodeBase64(encodeIn)
        if (urlSafe) {
          result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        }
        setOutput(result)
      } else {
        if (!decodeIn) return
        let cleaned = decodeIn.replace(/\s+/g, '')
        if (urlSafe) {
          cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/')
          while (cleaned.length % 4 !== 0) cleaned += '='
        }
        setOutput(decodeBase64(cleaned))
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      if (mode === 'decode') toast.error('Invalid Base64 input')
    }
  }, [mode, encodeIn, decodeIn, urlSafe])
  const swap = () => {
    if (mode === 'encode') {
      if (output) {
        setDecodeIn(output)
        setMode('decode')
      }
    } else {
      if (output) {
        setEncodeIn(output)
        setMode('encode')
      }
    }
  }
  return (
    <div className="space-y-5">
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'encode' | 'decode')}>
        <TabsList>
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>
        <TabsContent value="encode" className="space-y-5">
          <Field label="Plain text input" htmlFor="enc-input" hint="UTF-8 supported">
            <Textarea
              id="enc-input"
              value={encodeIn}
              onChange={(e) => setEncodeIn(e.target.value)}
              rows={6}
              className="font-mono text-sm"
              spellCheck={false}
              placeholder="Type text to encode…"
            />
          </Field>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEncodeIn('')}>
              <Eraser className="size-4" />
              Clear
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="decode" className="space-y-5">
          <Field label="Base64 input" htmlFor="dec-input" hint="Standard or URL-safe">
            <Textarea
              id="dec-input"
              value={decodeIn}
              onChange={(e) => setDecodeIn(e.target.value)}
              rows={6}
              className="font-mono text-sm"
              spellCheck={false}
              placeholder="Paste Base64 string…"
            />
          </Field>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setDecodeIn('')}>
              <Eraser className="size-4" />
              Clear
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3">
        <div className="flex items-center gap-2">
          <Switch
            id="urlsafe"
            checked={urlSafe}
            onCheckedChange={setUrlSafe}
          />
          <Label htmlFor="urlsafe" className="text-sm">
            URL-safe variant
            <span className="ml-1 text-xs text-muted-foreground">
              (- and _ instead of + and /)
            </span>
          </Label>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={swap}
          disabled={!output}
        >
          <ArrowDownUp className="size-4" />
          Use output as input
        </Button>
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="font-mono text-xs">
            {error}
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat
          label="Mode"
          value={mode === 'encode' ? 'Encode' : 'Decode'}
        />
        <Stat
          label="Input bytes"
          value={
            new Blob([mode === 'encode' ? encodeIn : decodeIn]).size
          }
        />
        <Stat label="Output bytes" value={new Blob([output]).size} />
      </div>
      <ResultBox
        value={output}
        label={mode === 'encode' ? 'Base64 output' : 'Decoded text'}
        rows={6}
        downloadName={mode === 'encode' ? 'encoded.b64' : 'decoded.txt'}
        empty={error ? 'Fix the error above to see output.' : 'Output will appear here.'}
      />
    </div>
  )
}