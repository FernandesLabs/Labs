'use client'
import * as React from 'react'
import { Eraser, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
interface Options {
  removeEmpty: boolean
  removeWhitespaceOnly: boolean
  trimEach: boolean
  collapseBlanks: boolean
}
const DEFAULTS: Options = {
  removeEmpty: true,
  removeWhitespaceOnly: true,
  trimEach: false,
  collapseBlanks: false,
}
function process(input: string, opts: Options): string {
  if (!input) return ''
  let lines = input.split('\n')
  if (opts.trimEach) {
    lines = lines.map((l) => l.trim())
  }
  if (opts.removeWhitespaceOnly) {
    lines = lines.filter((l) => l.trim().length > 0)
  } else if (opts.removeEmpty) {
    lines = lines.filter((l) => l.length > 0)
  }
  if (opts.collapseBlanks) {
    const out: string[] = []
    let prevBlank = false
    for (const l of lines) {
      const isBlank = l.trim().length === 0
      if (isBlank && prevBlank) continue
      out.push(l)
      prevBlank = isBlank
    }
    // Strip leading and trailing blank lines as well.
    while (out.length > 0 && out[0]!.trim() === '') out.shift()
    while (out.length > 0 && out[out.length - 1]!.trim() === '')
      out.pop()
    lines = out
  }
  return lines.join('\n')
}
export default function RemoveBlankLines() {
  const [text, setText] = React.useState('')
  const [opts, setOpts] = React.useState<Options>(DEFAULTS)
  const [output, setOutput] = React.useState('')
  const inputLines = text ? text.split('\n').length : 0
  const outputLines = output ? output.split('\n').length : 0
  const removed = Math.max(0, inputLines - outputLines)
  const handleProcess = () => {
    if (!text) return
    setOutput(process(text, opts))
  }
  // Live update whenever text or options change.
  React.useEffect(() => {
    if (!text) {
      setOutput('')
      return
    }
    setOutput(process(text, opts))
  }, [text, opts])
  const toggle = (key: keyof Options) => (checked: boolean) =>
    setOpts((prev) => ({ ...prev, [key]: checked }))
  return (
    <div className="space-y-5">
      <Field
        label="Text"
        htmlFor="rb-input"
        hint={`${inputLines.toLocaleString()} lines`}
      >
        <Textarea
          id="rb-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={'Paste text with blank lines:\n\nfoo\n\n\nbar'}
          className="min-h-32 font-mono text-sm"
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <Label
            htmlFor="rb-empty"
            className="pr-3 text-sm font-medium text-foreground"
          >
            Remove empty lines
            <span className="block text-xs font-normal text-muted-foreground">
              Lines with zero characters.
            </span>
          </Label>
          <Switch
            id="rb-empty"
            checked={opts.removeEmpty}
            onCheckedChange={toggle('removeEmpty')}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <Label
            htmlFor="rb-ws"
            className="pr-3 text-sm font-medium text-foreground"
          >
            Remove whitespace-only
            <span className="block text-xs font-normal text-muted-foreground">
              Lines that contain only spaces or tabs.
            </span>
          </Label>
          <Switch
            id="rb-ws"
            checked={opts.removeWhitespaceOnly}
            onCheckedChange={toggle('removeWhitespaceOnly')}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <Label
            htmlFor="rb-trim"
            className="pr-3 text-sm font-medium text-foreground"
          >
            Trim each line
            <span className="block text-xs font-normal text-muted-foreground">
              Strip leading and trailing whitespace.
            </span>
          </Label>
          <Switch
            id="rb-trim"
            checked={opts.trimEach}
            onCheckedChange={toggle('trimEach')}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <Label
            htmlFor="rb-collapse"
            className="pr-3 text-sm font-medium text-foreground"
          >
            Collapse blank runs
            <span className="block text-xs font-normal text-muted-foreground">
              Reduce consecutive blank lines to one.
            </span>
          </Label>
          <Switch
            id="rb-collapse"
            checked={opts.collapseBlanks}
            onCheckedChange={toggle('collapseBlanks')}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Before" value={inputLines.toLocaleString()} />
        <Stat label="After" value={outputLines.toLocaleString()} />
        <Stat
          label="Removed"
          value={removed.toLocaleString()}
          accent={removed > 0 ? 'oklch(0.6 0.2 20)' : undefined}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setText('')
            setOutput('')
          }}
          disabled={!text}
          className="text-muted-foreground"
        >
          <Eraser className="size-4" />
          Clear
        </Button>
        <Button
          type="button"
          onClick={handleProcess}
          className="bg-primary text-primary-foreground"
        >
          <Wand2 className="size-4" />
          Process now
        </Button>
      </div>
      {output ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">{inputLines.toLocaleString()} in</Badge>
          <span>→</span>
          <Badge variant="secondary">
            {outputLines.toLocaleString()} out
          </Badge>
          <span className="ml-1">
            ({removed.toLocaleString()} blank lines removed)
          </span>
        </div>
      ) : null}
      <ResultBox
        value={output}
        label="Cleaned text"
        rows={8}
        downloadName="cleaned.txt"
        empty="Enter text above. The output updates live as you type or change options."
      />
    </div>
  )
}