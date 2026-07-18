'use client'

import * as React from 'react'
import { dump as yamlDump, load as yamlLoad } from '@/lib/yaml'
import { ArrowLeftRight, Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'

const SAMPLE_JSON = `{
  "name": "Fernandes Labs",
  "tools": ["json", "yaml", "xml"],
  "version": 1,
  "open": true,
  "config": {
    "timeout": 30,
    "retries": 3
  }
}`

const SAMPLE_YAML = `name: Fernandes Labs
tools:
  - json
  - yaml
  - xml
version: 1
open: true
config:
  timeout: 30
  retries: 3
`

export default function JsonYamlConverter() {
  const [mode, setMode] = React.useState<'j2y' | 'y2j'>('j2y')
  const [jsonIn, setJsonIn] = React.useState(SAMPLE_JSON)
  const [yamlIn, setYamlIn] = React.useState(SAMPLE_YAML)
  const [output, setOutput] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setError(null)
    setOutput('')
    if (mode === 'j2y') {
      if (!jsonIn.trim()) return
      try {
        const obj = JSON.parse(jsonIn)
        const result = yamlDump(obj, { indent: 2, lineWidth: 100 })
        setOutput(result)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
        toast.error('Invalid JSON input')
      }
    } else {
      if (!yamlIn.trim()) return
      try {
        const obj = yamlLoad(yamlIn)
        if (obj === null || typeof obj === 'undefined') {
          setError('YAML parsed to null/undefined')
          return
        }
        const result = JSON.stringify(obj, null, 2)
        setOutput(result)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
        toast.error('Invalid YAML input')
      }
    }
  }, [mode, jsonIn, yamlIn])

  return (
    <div className="space-y-5">
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'j2y' | 'y2j')}>
        <TabsList>
          <TabsTrigger value="j2y">
            <ArrowLeftRight className="size-3.5" />
            JSON → YAML
          </TabsTrigger>
          <TabsTrigger value="y2j">
            <ArrowLeftRight className="size-3.5" />
            YAML → JSON
          </TabsTrigger>
        </TabsList>

        <TabsContent value="j2y" className="space-y-5">
          <Field label="JSON input" htmlFor="json-in" hint="Paste any valid JSON">
            <Textarea
              id="json-in"
              value={jsonIn}
              onChange={(e) => setJsonIn(e.target.value)}
              rows={10}
              className="font-mono text-sm"
              spellCheck={false}
              placeholder="Paste JSON here…"
            />
          </Field>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setJsonIn('')}
            >
              <Eraser className="size-4" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setJsonIn(SAMPLE_JSON)}
            >
              Load sample
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="y2j" className="space-y-5">
          <Field label="YAML input" htmlFor="yaml-in" hint="Paste any valid YAML">
            <Textarea
              id="yaml-in"
              value={yamlIn}
              onChange={(e) => setYamlIn(e.target.value)}
              rows={10}
              className="font-mono text-sm"
              spellCheck={false}
              placeholder="Paste YAML here…"
            />
          </Field>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setYamlIn('')}
            >
              <Eraser className="size-4" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setYamlIn(SAMPLE_YAML)}
            >
              Load sample
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="font-mono text-xs">
            {error}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Mode" value={mode === 'j2y' ? 'JSON→YAML' : 'YAML→JSON'} />
        <Stat label="Input bytes" value={new Blob([mode === 'j2y' ? jsonIn : yamlIn]).size} />
        <Stat label="Output bytes" value={new Blob([output]).size} />
      </div>

      <ResultBox
        value={output}
        label={mode === 'j2y' ? 'YAML output' : 'JSON output'}
        rows={12}
        downloadName={mode === 'j2y' ? 'converted.yaml' : 'converted.json'}
        empty={error ? 'Fix the error above to see output.' : 'Converted output will appear here.'}
      />
    </div>
  )
}
