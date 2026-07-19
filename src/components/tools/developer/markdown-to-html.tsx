'use client'
import * as React from 'react'
import { FileText, Eraser, Code2, Github } from 'lucide-react'
import { marked } from 'marked'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'
const SAMPLE_MARKDOWN = `# Hello Fernandes Labs
A **markdown** document with [a link](https://fernandeslabs.com) and \`inline code\`.
## Features
- GFM tables
- ~~strikethrough~~
- Task lists
  - [x] Render markdown
  - [ ] Ship it
\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`
| Tool             | Mode  | Status |
| ---------------- | ----- | ------ |
| Markdown→HTML    | GFM   | Ready  |
| Diff Checker     | LCS   | Ready  |
> Markdown is a lightweight markup language.
`
export default function MarkdownToHtml(): React.JSX.Element {
  const [input, setInput] = React.useState<string>(SAMPLE_MARKDOWN)
  const [gfm, setGfm] = React.useState<boolean>(true)
  const [breaks, setBreaks] = React.useState<boolean>(false)
  const html = React.useMemo<string>(() => {
    if (input.trim() === '') return ''
    try {
      // marked v18 accepts options as the second argument; synchronous parse.
      marked.setOptions({ gfm, breaks })
      const result = marked.parse(input, { async: false, gfm, breaks })
      return typeof result === 'string' ? result : ''
    } catch {
      toast.error('Could not parse markdown — check for unclosed syntax.')
      return ''
    }
  }, [input, gfm, breaks])
  const stats = React.useMemo(() => {
    const inBytes = new Blob([input]).size
    const outBytes = new Blob([html]).size
    const words = (input.match(/\S+/g) || []).length
    const lines = input ? input.split('\n').length : 0
    return { inBytes, outBytes, words, lines }
  }, [input, html])
  const handleClear = (): void => {
    setInput('')
    toast.success('Cleared')
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Code2 className="size-4" />
            Markdown to HTML
          </CardTitle>
          <CardDescription>
            Convert markdown to clean HTML source (for pasting into emails,
            static sites, or CMS rich-text fields). Powered by the{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
              marked
            </code>{' '}
            library, fully client-side. Toggle GFM tables/task-lists and
            line-break handling.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="mdh-gfm"
                checked={gfm}
                onCheckedChange={setGfm}
                aria-label="GitHub-flavored markdown"
              />
              <Label htmlFor="mdh-gfm" className="text-xs">
                GFM (tables, task lists, strikethrough)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="mdh-breaks"
                checked={breaks}
                onCheckedChange={setBreaks}
                aria-label="Convert single line breaks to <br>"
              />
              <Label htmlFor="mdh-breaks" className="text-xs">
                Convert line breaks to &lt;br&gt;
              </Label>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput(SAMPLE_MARKDOWN)}
              >
                <FileText className="size-4" />
                Sample
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={input.length === 0}
                className="text-muted-foreground"
              >
                <Eraser className="size-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Field
        label="Markdown input"
        htmlFor="mdh-input"
        hint={`${stats.words} words · ${stats.lines} lines`}
      >
        <Textarea
          id="mdh-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={14}
          className="font-mono text-sm"
          spellCheck={false}
          placeholder="# Hello world…"
          autoCapitalize="off"
          autoCorrect="off"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Input chars" value={input.length} />
        <Stat label="Output chars" value={html.length} />
        <Stat label="Input size" value={`${stats.inBytes} B`} />
        <Stat
          label="Output size"
          value={`${stats.outBytes} B`}
          accent="oklch(0.6 0.17 150)"
        />
      </div>
      <ResultBox
        value={html}
        label="HTML output"
        mono
        rows={12}
        downloadName="markdown.html"
        empty="Type markdown above to see the generated HTML source here."
      />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Github className="size-3.5" />
        <span>
          This tool outputs raw HTML source. For a rendered preview, use the{' '}
          <span className="font-medium">Markdown Preview</span> tool.
        </span>
      </div>
    </div>
  )
}