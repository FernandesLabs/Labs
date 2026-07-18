'use client'

import * as React from 'react'
import {
  Plus,
  Trash2,
  ArrowDown,
  ArrowUp,
  Download,
  Upload,
  Workflow,
  Info,
  Cpu,
  Copy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Field, Stat, downloadBlob, randomInt } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types & storage                                                    */
/* ------------------------------------------------------------------ */

interface Step {
  id: string
  name: string
  prompt: string
  model: string
  temperature: number
}

const STORAGE_KEY = 'fl-ai-workflow'

const MODELS: { id: string; label: string; provider: string }[] = [
  { id: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gpt-4o-mini', label: 'GPT-4o mini', provider: 'OpenAI' },
  { id: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'o1', label: 'o1', provider: 'OpenAI' },
  { id: 'o3-mini', label: 'o3-mini', provider: 'OpenAI' },
  { id: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'claude-3.5-haiku', label: 'Claude 3.5 Haiku', provider: 'Anthropic' },
  { id: 'claude-3-opus', label: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', provider: 'Google' },
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', provider: 'Google' },
  { id: 'llama-3.1-70b', label: 'Llama 3.1 70B', provider: 'Meta' },
  { id: 'llama-3.1-405b', label: 'Llama 3.1 405B', provider: 'Meta' },
  { id: 'mistral-large', label: 'Mistral Large', provider: 'Mistral' },
  { id: 'mixtral-8x7b', label: 'Mixtral 8x7B', provider: 'Mistral' },
  { id: 'command-r-plus', label: 'Command R+', provider: 'Cohere' },
  { id: 'deepseek-v3', label: 'DeepSeek V3', provider: 'DeepSeek' },
]

function makeId(): string {
  return `s-${Date.now().toString(36)}-${randomInt(1_000_000).toString(36)}`
}

function newStep(name = ''): Step {
  return {
    id: makeId(),
    name,
    prompt: '',
    model: MODELS[0].id,
    temperature: 0.7,
  }
}

function loadSteps(): Step[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const out: Step[] = []
    for (const item of parsed) {
      const s = item as Partial<Step>
      if (typeof s.prompt === 'string' && typeof s.model === 'string') {
        out.push({
          id: typeof s.id === 'string' ? s.id : makeId(),
          name: typeof s.name === 'string' ? s.name : '',
          prompt: s.prompt,
          model: s.model,
          temperature:
            typeof s.temperature === 'number' && Number.isFinite(s.temperature)
              ? s.temperature
              : 0.7,
        })
      }
    }
    return out
  } catch {
    return []
  }
}

function saveSteps(steps: Step[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(steps))
  } catch {
    toast.error('Could not save — localStorage quota exceeded?')
  }
}

function modelLabel(id: string): string {
  return MODELS.find((m) => m.id === id)?.label ?? id
}

function modelProvider(id: string): string {
  return MODELS.find((m) => m.id === id)?.provider ?? 'Unknown'
}

/** Extract {{variable}} placeholders from a prompt template. */
function extractVariables(prompt: string): string[] {
  const out: string[] = []
  const re = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(prompt)) !== null) {
    if (!out.includes(m[1])) out.push(m[1])
  }
  return out
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AiWorkflowBuilder() {
  const [steps, setSteps] = React.useState<Step[]>([])
  const [hydrated, setHydrated] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const { copy } = useCopy()

  // Hydrate from localStorage on mount (client-only).
  React.useEffect(() => {
    setSteps(loadSteps())
    setHydrated(true)
  }, [])

  // Persist on change (after hydration).
  React.useEffect(() => {
    if (!hydrated) return
    saveSteps(steps)
  }, [steps, hydrated])

  const addStep = (): void => {
    setSteps((prev) => [
      ...prev,
      newStep(`Step ${prev.length + 1}`),
    ])
  }

  const updateStep = (id: string, patch: Partial<Step>): void => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    )
  }

  const removeStep = (id: string): void => {
    setSteps((prev) => prev.filter((s) => s.id !== id))
    toast.success('Step removed')
  }

  const moveStep = (id: string, dir: -1 | 1): void => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copyArr = [...prev]
      const tmp = copyArr[idx]
      copyArr[idx] = copyArr[next]
      copyArr[next] = tmp
      return copyArr
    })
  }

  const handleExport = (): void => {
    if (steps.length === 0) {
      toast.error('Workflow is empty')
      return
    }
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      steps,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    downloadBlob(blob, 'ai-workflow.json')
    toast.success('Workflow exported')
  }

  const handleImportClick = (): void => {
    fileInputRef.current?.click()
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(String(reader.result))
        let incoming: Step[] = []
        if (Array.isArray(parsed)) {
          incoming = parsed as Step[]
        } else if (
          parsed &&
          typeof parsed === 'object' &&
          Array.isArray((parsed as { steps: Step[] }).steps)
        ) {
          incoming = (parsed as { steps: Step[] }).steps
        } else {
          toast.error('Invalid file — expected JSON with a steps array')
          return
        }
        const valid: Step[] = []
        for (const item of incoming) {
          const s = item as Partial<Step>
          if (typeof s.prompt === 'string' && typeof s.model === 'string') {
            valid.push({
              id: typeof s.id === 'string' ? s.id : makeId(),
              name: typeof s.name === 'string' ? s.name : `Step ${valid.length + 1}`,
              prompt: s.prompt,
              model: s.model,
              temperature:
                typeof s.temperature === 'number' &&
                Number.isFinite(s.temperature)
                  ? s.temperature
                  : 0.7,
            })
          }
        }
        if (valid.length === 0) {
          toast.error('No valid steps found in file')
          return
        }
        setSteps(valid)
        toast.success(`Imported ${valid.length} step(s)`)
      } catch {
        toast.error('Could not parse JSON file')
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.onerror = () => toast.error('Could not read file')
    reader.readAsText(file)
  }

  const copyJson = (): void => {
    if (steps.length === 0) {
      toast.error('Workflow is empty')
      return
    }
    copy(
      JSON.stringify({ version: 1, steps }, null, 2),
      'Workflow JSON copied'
    )
  }

  const allVariables = React.useMemo(() => {
    const set = new Set<string>()
    for (const s of steps) {
      for (const v of extractVariables(s.prompt)) set.add(v)
    }
    return Array.from(set)
  }, [steps])

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="size-4" />
            AI Workflow Builder
          </CardTitle>
          <CardDescription>
            Design a multi-step AI workflow visually. Each step has a name,
            a prompt template with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'{{variable}}'}</code> placeholders, a
            target model, and a temperature. Reorder steps, export the
            workflow as JSON, and import it back. This is a planner/designer
            — it does not execute the workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="size-4" />
            <AlertTitle>Designer only — no execution</AlertTitle>
            <AlertDescription>
              This tool designs and exports the workflow structure. It does
              not call any LLM API or execute the steps. Export the JSON
              and run it in your own pipeline.
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={addStep}
              className="bg-primary text-primary-foreground"
            >
              <Plus className="size-3.5" />
              Add step
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleExport}
              disabled={steps.length === 0}
            >
              <Download className="size-3.5" />
              Export JSON
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleImportClick}
            >
              <Upload className="size-3.5" />
              Import JSON
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={copyJson}
              disabled={steps.length === 0}
            >
              <Copy className="size-3.5" />
              Copy JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="sr-only"
              aria-label="Import workflow from JSON file"
            />
          </div>
        </CardContent>
      </Card>

      <div
        className="grid gap-3 sm:grid-cols-3"
        role="status"
        aria-live="polite"
      >
        <Stat label="Steps" value={steps.length} />
        <Stat label="Distinct models" value={
          new Set(steps.map((s) => s.model)).size
        } />
        <Stat label="Variables" value={allVariables.length} />
      </div>

      {steps.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-10 text-center text-sm text-muted-foreground">
              <Workflow className="mx-auto mb-3 size-6 text-muted-foreground/60" />
              <div className="font-medium text-foreground">
                No steps yet
              </div>
              <p className="mt-1">
                Click <strong>Add step</strong> to design your first AI
                workflow. Each step is a prompt template, a model, and a
                temperature.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workflow steps</CardTitle>
            <CardDescription>
              Edit each step below. Reorder with the arrows; remove with the
              trash icon. Changes save automatically to localStorage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[40rem]">
              <div className="space-y-4 pr-3">
                {steps.map((step, idx) => {
                  const vars = extractVariables(step.prompt)
                  return (
                    <div
                      key={step.id}
                      className="rounded-lg border border-border bg-card p-4"
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                            aria-label={`Step ${idx + 1}`}
                          >
                            {idx + 1}
                          </span>
                          <Input
                            value={step.name}
                            onChange={(e) =>
                              updateStep(step.id, { name: e.target.value })
                            }
                            placeholder="Step name"
                            aria-label="Step name"
                            className="h-8 w-56"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            onClick={() => moveStep(step.id, -1)}
                            disabled={idx === 0}
                            aria-label="Move step up"
                          >
                            <ArrowUp className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            onClick={() => moveStep(step.id, 1)}
                            disabled={idx === steps.length - 1}
                            aria-label="Move step down"
                          >
                            <ArrowDown className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-7 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700"
                            onClick={() => removeStep(step.id)}
                            aria-label="Remove step"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Field
                          label="Prompt template"
                          htmlFor={`aw-prompt-${step.id}`}
                          hint="use {{variables}} for runtime inputs"
                        >
                          <Textarea
                            id={`aw-prompt-${step.id}`}
                            rows={4}
                            value={step.prompt}
                            onChange={(e) =>
                              updateStep(step.id, { prompt: e.target.value })
                            }
                            placeholder="Summarize the following {{input}} in {{tone}} tone…"
                            className="font-mono text-xs"
                            aria-label="Prompt template"
                          />
                        </Field>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field
                            label="Model"
                            htmlFor={`aw-model-${step.id}`}
                          >
                            <Select
                              value={step.model}
                              onValueChange={(v) =>
                                updateStep(step.id, { model: v })
                              }
                            >
                              <SelectTrigger
                                id={`aw-model-${step.id}`}
                                className="w-full"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MODELS.map((m) => (
                                  <SelectItem key={m.id} value={m.id}>
                                    <span className="flex items-center gap-2">
                                      <Cpu className="size-3 text-muted-foreground" />
                                      {m.label}
                                      <span className="text-xs text-muted-foreground">
                                        ({m.provider})
                                      </span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                          <Field
                            label="Temperature"
                            htmlFor={`aw-temp-${step.id}`}
                            hint={`${step.temperature.toFixed(2)} — 0=focused, 2=creative`}
                          >
                            <Slider
                              id={`aw-temp-${step.id}`}
                              min={0}
                              max={2}
                              step={0.05}
                              value={[step.temperature]}
                              onValueChange={(arr) =>
                                updateStep(step.id, {
                                  temperature: arr[0] ?? 0.7,
                                })
                              }
                              aria-label="Temperature"
                            />
                          </Field>
                        </div>

                        {vars.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">
                              Variables:
                            </span>
                            {vars.map((v) => (
                              <Badge
                                key={v}
                                variant="outline"
                                className="font-mono text-[10px]"
                              >
                                {`{{${v}}}`}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs italic text-muted-foreground">
                            No variables detected — add{' '}
                            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
                              {'{{variable}}'}
                            </code>{' '}
                            placeholders to parameterize this step.
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Visual flow diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Flow diagram</CardTitle>
          <CardDescription>
            Visual representation of the workflow order. Steps run
            top-to-bottom; the output of each step feeds the next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {steps.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              Add steps above to see the flow diagram.
            </div>
          ) : (
            <div className="space-y-0">
              {steps.map((step, idx) => {
                const vars = extractVariables(step.prompt)
                return (
                  <div key={step.id}>
                    <div className="rounded-lg border border-border bg-card p-3">
                      <div className="flex items-start gap-3">
                        <span
                          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                          aria-hidden="true"
                        >
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold">
                              {step.name || '(unnamed step)'}
                            </span>
                            <Badge variant="secondary" className="text-[10px]">
                              <Cpu className="mr-1 size-3" />
                              {modelLabel(step.model)}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              T={step.temperature.toFixed(2)}
                            </Badge>
                          </div>
                          {step.prompt ? (
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                              {step.prompt}
                            </p>
                          ) : (
                            <p className="mt-1 text-xs italic text-muted-foreground">
                              No prompt yet
                            </p>
                          )}
                          {vars.length > 0 ? (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {vars.map((v) => (
                                <Badge
                                  key={v}
                                  variant="outline"
                                  className="font-mono text-[10px] text-muted-foreground"
                                >
                                  {`{{${v}}}`}
                                </Badge>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {idx < steps.length - 1 ? (
                      <div
                        className="flex justify-center py-1"
                        aria-hidden="true"
                      >
                        <ArrowDown className="size-4 text-muted-foreground" />
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variables overview */}
      {allVariables.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Variables across workflow</CardTitle>
            <CardDescription>
              Every <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'{{variable}}'}</code> placeholder detected across all
              steps. Provide values for these when executing the workflow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allVariables.map((v) => (
                <Badge
                  key={v}
                  variant="outline"
                  className="font-mono text-xs"
                >
                  {`{{${v}}}`}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • The workflow is saved to localStorage automatically under{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                fl-ai-workflow
              </code>
              . Reload the page and your design is restored.
            </li>
            <li>
              • <strong>Export JSON</strong> downloads a versioned payload
              ({`{ version, exportedAt, steps }`});{' '}
              <strong>Import JSON</strong> accepts either a bare array of
              steps or the wrapped object shape.
            </li>
            <li>
              • Temperature ranges from 0 (deterministic, focused) to 2
              (highly creative). Most production workflows use 0.0–0.7 for
              classification and 0.7–1.0 for generation.
            </li>
            <li>
              • <strong>Variables</strong> are detected with the regex{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                {'{{name}}'}
              </code>{' '}
              and listed per step. They are placeholders only — no values
              are substituted here.
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">No API calls</Badge>
        <Badge variant="secondary">JSON export/import</Badge>
        <Badge variant="secondary">localStorage persistence</Badge>
        <Badge variant="secondary">{MODELS.length} models</Badge>
      </div>
    </div>
  )
}
