'use client'
import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Field, ResultBox } from '@/lib/tools/tool-ui'
type EncodeStyle = 'named' | 'numeric'
const NAMED_ENTITIES: Array<[string, string]> = [
  ['&', '&amp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['"', '&quot;'],
  ["'", '&apos;'],
]
const NUMERIC_ENTITIES: Array<[string, string]> = [
  ['&', '&#38;'],
  ['<', '&#60;'],
  ['>', '&#62;'],
  ['"', '&#34;'],
  ["'", '&#39;'],
]
function encodeEntities(input: string, style: EncodeStyle): string {
  const table = style === 'named' ? NAMED_ENTITIES : NUMERIC_ENTITIES
  let out = ''
  for (const ch of input) {
    let replaced = false
    for (const [char, entity] of table) {
      if (ch === char) {
        out += entity
        replaced = true
        break
      }
    }
    if (!replaced) out += ch
  }
  return out
}
const NAMED_DECODE: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00a0',
  copy: '\u00a9',
  reg: '\u00ae',
  trade: '\u2122',
  hellip: '\u2026',
  mdash: '\u2014',
  ndash: '\u2013',
  lsquo: '\u2018',
  rsquo: '\u2019',
  ldquo: '\u201c',
  rdquo: '\u201d',
  laquo: '\u00ab',
  raquo: '\u00bb',
  deg: '\u00b0',
  plusmn: '\u00b1',
  times: '\u00d7',
  divide: '\u00f7',
  euro: '\u20ac',
  pound: '\u00a3',
  cent: '\u00a2',
  yen: '\u00a5',
  sect: '\u00a7',
  para: '\u00b6',
  middot: '\u00b7',
  bull: '\u2022',
  dagger: '\u2020',
  Dagger: '\u2021',
  permil: '\u2030',
  prime: '\u2032',
  Prime: '\u2033',
  infin: '\u221e',
  ne: '\u2260',
  le: '\u2264',
  ge: '\u2265',
  alpha: '\u03b1',
  beta: '\u03b2',
  gamma: '\u03b3',
  delta: '\u03b4',
  pi: '\u03c0',
  sigma: '\u03c3',
  omega: '\u03c9',
  Alpha: '\u0391',
  Beta: '\u0392',
  Gamma: '\u0393',
  Delta: '\u0394',
  Pi: '\u03a0',
  Sigma: '\u03a3',
  Omega: '\u03a9',
}
const ENTITY_RE = /&#x([0-9a-fA-F]+);|&#([0-9]+);|&([a-zA-Z][a-zA-Z0-9]*);/g
function decodeEntities(input: string): string {
  return input.replace(ENTITY_RE, (full, hex?: string, dec?: string, name?: string) => {
    if (typeof hex === 'string' && hex.length > 0) {
      const cp = parseInt(hex, 16)
      if (!Number.isFinite(cp) || cp < 0 || cp > 0x10ffff) return full
      try {
        return String.fromCodePoint(cp)
      } catch {
        return full
      }
    }
    if (typeof dec === 'string' && dec.length > 0) {
      const cp = parseInt(dec, 10)
      if (!Number.isFinite(cp) || cp < 0 || cp > 0x10ffff) return full
      try {
        return String.fromCodePoint(cp)
      } catch {
        return full
      }
    }
    if (typeof name === 'string' && name.length > 0) {
      const mapped = NAMED_DECODE[name]
      if (mapped !== undefined) return mapped
    }
    return full
  })
}
export default function HtmlEntityEncoder() {
  const [style, setStyle] = React.useState<EncodeStyle>('named')
  const [encodeInput, setEncodeInput] = React.useState('')
  const [decodeInput, setDecodeInput] = React.useState('')
  const encodeOutput = React.useMemo(
    () => (encodeInput ? encodeEntities(encodeInput, style) : ''),
    [encodeInput, style]
  )
  const decodeOutput = React.useMemo(
    () => (decodeInput ? decodeEntities(decodeInput) : ''),
    [decodeInput]
  )
  const loadEncodeSample = () => {
    setEncodeInput(`<a href="/search?q=core&sons">Tom & Jerry "The Cat's" <b>Meow</b></a>`)
  }
  const loadDecodeSample = () => {
    setDecodeInput(
      `Tom &amp; Jerry &lt;the cat&apos;s&gt; &quot;meow&quot; &#8212; caf&#xe9; &#8364;5`
    )
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
            htmlFor="html-enc-input"
            hint={`${encodeInput.length} chars`}
          >
            <Textarea
              id="html-enc-input"
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              placeholder="Enter text to escape…"
              rows={5}
              className="font-mono"
            />
          </Field>
          <Field label="Encoding style" hint="named or numeric">
            <RadioGroup
              value={style}
              onValueChange={(v) => setStyle(v as EncodeStyle)}
              className="flex flex-col gap-2 sm:flex-row sm:gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="html-named" value="named" />
                <Label htmlFor="html-named" className="cursor-pointer">
                  <span className="font-mono text-xs">Named</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    &amp;amp; &amp;lt; &amp;quot;
                  </span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="html-numeric" value="numeric" />
                <Label htmlFor="html-numeric" className="cursor-pointer">
                  <span className="font-mono text-xs">Numeric</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    &amp;#38; &amp;#60; &amp;#34;
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </Field>
          <button
            type="button"
            onClick={loadEncodeSample}
            className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Load sample
          </button>
          <ResultBox
            label="Encoded output"
            value={encodeOutput}
            downloadName="encoded-html.txt"
            empty="Encoded text will appear here."
          />
        </TabsContent>
        <TabsContent value="decode" className="space-y-4">
          <Field
            label="Input text"
            htmlFor="html-dec-input"
            hint={`${decodeInput.length} chars`}
          >
            <Textarea
              id="html-dec-input"
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              placeholder="Enter HTML entities…"
              rows={5}
              className="font-mono"
            />
          </Field>
          <button
            type="button"
            onClick={loadDecodeSample}
            className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Load sample
          </button>
          <ResultBox
            label="Decoded output"
            value={decodeOutput}
            downloadName="decoded-html.txt"
            empty="Decoded text will appear here."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}