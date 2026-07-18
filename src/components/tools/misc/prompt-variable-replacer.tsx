'use client'

import * as React from 'react'
import { Variable, Sparkles, FileText } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Field, ResultBox } from '@/lib/tools/tool-ui'

const SAMPLE_TEMPLATE = `You are a {{role}} with {{years}} years of experience.

Write a {{tone}} {{content_type}} about {{topic}} for {{audience}}.

Constraints:
- Length: {{length}} words
- Include {{num_examples}} examples
- Reading level: {{reading_level}}`

function detectVariables(template: string): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  const re = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(template)) !== null) {
    const name = m[1]
    if (!seen.has(name)) {
      seen.add(name)
      out.push(name)
    }
  }
  return out
}

function fillTemplate(
  template: string,
  values: Record<string, string>
): string {
  return template.replace(
    /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g,
    (_, name: string) => {
      const v = values[name]
      return v && v.length > 0 ? v : `{{${name}}}`
    }
  )
}

export default function PromptVariableReplacer() {
  const [template, setTemplate] = React.useState(SAMPLE_TEMPLATE)
  const [values, setValues] = React.useState<Record<string, string>>({})

  const variables = React.useMemo(() => detectVariables(template), [template])

  // Prune stored values that are no longer in the template.
  React.useEffect(() => {
    setValues((prev) => {
      const next: Record<string, string> = {}
      let changed = false
      for (const v of variables) {
        next[v] = prev[v] ?? ''
        if (prev[v] !== next[v] && prev[v] !== undefined) changed = true
      }
      // Detect removed keys
      for (const k of Object.keys(prev)) {
        if (!variables.includes(k)) changed = true
      }
      return changed ? next : prev
    })
  }, [variables])

  const output = React.useMemo(
    () => fillTemplate(template, values),
    [template, values]
  )

  const filledCount = variables.filter((v) => (values[v] ?? '').length > 0).length

  const loadSample = (): void => {
    setTemplate(SAMPLE_TEMPLATE)
    setValues({})
  }

  const setOne = (name: string, value: string): void => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const fillAllPlaceholder = (): void => {
    const filled: Record<string, string> = { ...values }
    for (const v of variables) {
      if (!filled[v]) filled[v] = `<${v.replace(/_/g, ' ')}>`
    }
    setValues(filled)
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Prompt Variable Replacer</CardTitle>
          <CardDescription>
            Detects <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">{'{{variable}}'}</code>{' '}
            placeholders in a prompt template and renders one input field per
            variable. Output updates live as you fill in values.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Prompt template"
            htmlFor="pvr-template"
            hint={`${variables.length} variable${variables.length === 1 ? '' : 's'} detected`}
          >
            <Textarea
              id="pvr-template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="Write a {{tone}} email to {{name}} about {{topic}}…"
              rows={6}
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={loadSample}>
              <FileText className="size-3.5" />
              Load sample
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={fillAllPlaceholder}
              disabled={variables.length === 0}
            >
              <Sparkles className="size-3.5" />
              Fill placeholders
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setValues({})}
              disabled={Object.keys(values).length === 0}
            >
              Clear values
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Variables</CardTitle>
          <CardDescription>
            {variables.length === 0
              ? 'No variables detected. Add {{name}} placeholders to your template.'
              : `${filledCount} of ${variables.length} filled.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {variables.length === 0 ? (
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
              <Variable className="size-5 shrink-0" />
              <span>
                Write a placeholder like{' '}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                  {'{{customer_name}}'}
                </code>{' '}
                in your template to generate an input field here.
              </span>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {variables.map((name) => {
                const id = `pvr-var-${name}`
                return (
                  <Field key={name} label={name} htmlFor={id}>
                    <Input
                      id={id}
                      value={values[name] ?? ''}
                      onChange={(e) => setOne(name, e.target.value)}
                      placeholder={`value for ${name}`}
                      aria-label={`Value for ${name}`}
                    />
                  </Field>
                )
              })}
            </div>
          )}

          {variables.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {variables.map((v) => (
                <Badge
                  key={v}
                  variant={(values[v] ?? '').length > 0 ? 'default' : 'outline'}
                  className="font-mono text-[11px]"
                >
                  {v}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <ResultBox
        value={output}
        label="Final prompt"
        rows={8}
        mono={false}
        downloadName="prompt.txt"
        empty="Fill in variables to see the final prompt."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-40">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • Variables are detected via the regex{' '}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                  {'{{[a-zA-Z_][a-zA-Z0-9_]*}}'}
                </code>{' '}
                — names must start with a letter or underscore.
              </li>
              <li>
                • Duplicate variables share a single input field.
              </li>
              <li>
                • Empty values keep the placeholder visible in the output so
                you can spot what still needs filling.
              </li>
              <li>
                • Everything is computed locally — no prompt data leaves the
                browser.
              </li>
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
