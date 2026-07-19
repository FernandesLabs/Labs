'use client'
import * as React from 'react'
import { Eraser, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
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
const SAMPLE = `{"name":"Fernandes Labs","tools":["json","yaml","xml"],"version":1,"open":true,"nested":{"a":1,"b":2,"list":[1,2,3]}}`
export default function JsonFormatter() {
  const [input, setInput] = React.useState(SAMPLE)
  const [indent, setIndent] = React.useState<string>('2')
  const [tab, setTab] = React.useState<'format' | 'minify'>('format')
  const [output, setOutput] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [inBytes, setInBytes] = React.useState(0)
  const [outBytes, setOutBytes] = React.useState(0)
  const indentArg = React.useMemo<string | number>(() => {
    if (indent === 'tab') return '\t'
    return Number(indent)
  }, [indent])
  React.useEffect(() => {
    if (!input.trim()) {
      setError(null)
      setOutput('')
      setInBytes(0)
      setOutBytes(0)
      return
    }
    try {
      const obj = JSON.parse(input)
      const result =
        tab === 'minify'
          ? JSON.stringify(obj)
          : JSON.stringify(obj, null, indentArg)
      setOutput(result)
      setError(null)
      setInBytes(new Blob([input]).size)
      setOutBytes(new Blob([result]).size)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      setOutput('')
      setInBytes(new Blob([input]).size)
      setOutBytes(0)
    }
  }, [input, indentArg, tab])
  const onCopy = () => {
    if (output) toast.success('Formatted JSON copied')
  }
  return (
    <div className="space-y-5">
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'format' | 'minify')}>
        <TabsList>
          <TabsTrigger value="format">
            <Maximize2 className="size-3.5" />
            Format
          </TabsTrigger>
          <TabsTrigger value="minify">
            <Minimize2 className="size-3.5" />
            Minify
          </TabsTrigger>
        </TabsList>
        <TabsContent value="format" className="space-y-5">
          <Field
            label="Indentation"
            htmlFor="indent"
            hint="Spaces per level"
          >
            <Select value={indent} onValueChange={(v) => setIndent(v)}>
              <SelectTrigger id="indent" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="tab">Tab</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </TabsContent>
        <TabsContent value="minify" className="space-y-5">
          <p className="text-xs text-muted-foreground">
            All whitespace will be collapsed and the JSON packed into a single line.
          </p>
        </TabsContent>
      </Tabs>
      <Field label="Input JSON" htmlFor="json-input" hint={`${inBytes} bytes`}>
        <Textarea
          id="json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="font-mono text-sm"
          spellCheck={false}
          placeholder='{"key": "value"}'
        />
      </Field>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInput('')
            setOutput('')
            setError(null)
          }}
        >
          <Eraser className="size-4" />
          Clear
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput(SAMPLE)}
        >
          Load sample
        </Button>
        <Button
          size="sm"
          className="bg-primary text-primary-foreground"
          onClick={onCopy}
          disabled={!output}
        >
          Copy result
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
        <Stat label="Input size" value={`${inBytes} B`} />
        <Stat label="Output size" value={`${outBytes} B`} />
        <Stat
          label="Saved"
          value={inBytes - outBytes >= 0 ? `${inBytes - outBytes} B` : `+${outBytes - inBytes} B`}
        />
        <Stat
          label="Compression"
          value={inBytes > 0 ? `${Math.round((1 - outBytes / inBytes) * 100)}%` : '—'}
        />
      </div>
      <ResultBox
        value={output}
        label={tab === 'format' ? 'Formatted JSON' : 'Minified JSON'}
        rows={10}
        downloadName={tab === 'format' ? 'formatted.json' : 'minified.json'}
        empty={error ? 'Fix the error above to see output.' : 'Formatted output will appear here.'}
      />
    </div>
  )
}