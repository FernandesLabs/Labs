'use client'
import * as React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Field, ResultBox } from '@/lib/tools/tool-ui'
type EncodeMode = 'component' | 'uri'
export default function UrlEncoderDecoder() {
  const [mode, setMode] = React.useState<EncodeMode>('component')
  const [encodeInput, setEncodeInput] = React.useState('')
  const [decodeInput, setDecodeInput] = React.useState('')
  const [decodeOutput, setDecodeOutput] = React.useState('')
  const encodeOutput = React.useMemo(() => {
    if (!encodeInput) return ''
    try {
      return mode === 'component'
        ? encodeURIComponent(encodeInput)
        : encodeURI(encodeInput)
    } catch {
      return ''
    }
  }, [encodeInput, mode])
  React.useEffect(() => {
    if (!decodeInput) {
      setDecodeOutput('')
      return
    }
    try {
      setDecodeOutput(decodeURIComponent(decodeInput))
    } catch {
      setDecodeOutput('')
      toast.error('Malformed URI sequence', {
        description:
          'The input contains an invalid percent-encoded sequence and could not be decoded.',
      })
    }
  }, [decodeInput])
  const loadSample = () => {
    setEncodeInput('https://example.com/search?q=hello world&lang=en-US&safe=true')
  }
  const clearAll = () => {
    setEncodeInput('')
    setDecodeInput('')
    setDecodeOutput('')
  }
  return (
    <div className="space-y-5">
      <Tabs defaultValue="encode">
        <TabsList>
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>
        <TabsContent value="encode" className="space-y-4">
          <Field
            label="Input text"
            htmlFor="url-enc-input"
            hint={`${encodeInput.length} chars`}
          >
            <Textarea
              id="url-enc-input"
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              placeholder="Enter text to URL-encode…"
              rows={5}
              className="font-mono"
            />
          </Field>
          <Field label="Encoding mode" hint="choose the encoder">
            <RadioGroup
              value={mode}
              onValueChange={(v) => setMode(v as EncodeMode)}
              className="flex flex-col gap-2 sm:flex-row sm:gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="url-mode-component" value="component" />
                <Label htmlFor="url-mode-component">
                  <span className="font-mono text-xs">encodeURIComponent</span>
                  <span className="ml-2 text-xs text-muted-foreground">strict (encodes / : ? & =)</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="url-mode-uri" value="uri" />
                <Label htmlFor="url-mode-uri">
                  <span className="font-mono text-xs">encodeURI</span>
                  <span className="ml-2 text-xs text-muted-foreground">full URI (keeps reserved chars)</span>
                </Label>
              </div>
            </RadioGroup>
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadSample}
            >
              Load sample
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={!encodeInput && !decodeInput}
            >
              Clear
            </Button>
          </div>
          <ResultBox
            label="Encoded output"
            value={encodeOutput}
            downloadName="encoded-url.txt"
            empty="Encoded text will appear here."
          />
        </TabsContent>
        <TabsContent value="decode" className="space-y-4">
          <Field
            label="Input text"
            htmlFor="url-dec-input"
            hint={`${decodeInput.length} chars`}
          >
            <Textarea
              id="url-dec-input"
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              placeholder="Enter percent-encoded text…"
              rows={5}
              className="font-mono"
            />
          </Field>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setDecodeInput('')
              setDecodeOutput('')
            }}
            disabled={!decodeInput}
          >
            Clear
          </Button>
          <ResultBox
            label="Decoded output"
            value={decodeOutput}
            downloadName="decoded-url.txt"
            empty="Decoded text will appear here."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}