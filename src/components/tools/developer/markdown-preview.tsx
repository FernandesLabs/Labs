'use client'
import * as React from 'react'
import { Eye, FileText, Eraser, Download } from 'lucide-react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Stat, downloadBlob } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
const SAMPLE_MARKDOWN = `# Markdown Preview
A live, **client-side** Markdown previewer using [marked](https://marked.js.org/)
with GitHub-flavored markdown and line-break support.
## Features
- Headings (H1–H6)
- **Bold**, *italic*, ~~strikethrough~~
- Lists, links, \`inline code\`
- Code blocks with syntax styling
- Tables, blockquotes, and task lists
## Code block
\`\`\`js
function hello(name) {
  return \`Hello, \${name}!\`
}
\`\`\`
## Table
| Tool           | Category   | Status |
| -------------- | ---------- | ------ |
| Cron Generator | Developer  | Ready  |
| Diff Checker   | Developer  | Ready  |
## Blockquote
> "Simplicity is the soul of efficiency." — Austin Freeman
## Task list
- [x] Build markdown preview
- [ ] Ship it
`
// Configure marked once (GFM + line breaks)
marked.setOptions({ breaks: true, gfm: true })
const PREVIEW_STYLE = `
.fl-markdown {
  color: var(--foreground);
  font-size: 0.95rem;
  line-height: 1.65;
  word-wrap: break-word;
}
.fl-markdown h1,
.fl-markdown h2,
.fl-markdown h3,
.fl-markdown h4,
.fl-markdown h5,
.fl-markdown h6 {
  margin: 1.25em 0 0.5em;
  font-weight: 700;
  line-height: 1.25;
}
.fl-markdown h1 { font-size: 1.6em; border-bottom: 1px solid var(--border); padding-bottom: 0.3em; }
.fl-markdown h2 { font-size: 1.4em; border-bottom: 1px solid var(--border); padding-bottom: 0.3em; }
.fl-markdown h3 { font-size: 1.2em; }
.fl-markdown h4 { font-size: 1.05em; }
.fl-markdown h5 { font-size: 0.95em; }
.fl-markdown h6 { font-size: 0.9em; color: var(--muted-foreground); }
.fl-markdown p { margin: 0.6em 0; }
.fl-markdown a { color: #0ea5e9; text-decoration: underline; text-underline-offset: 2px; }
.fl-markdown a:hover { opacity: 0.8; }
.fl-markdown ul,
.fl-markdown ol { margin: 0.6em 0; padding-left: 1.6em; }
.fl-markdown ul { list-style: disc; }
.fl-markdown ol { list-style: decimal; }
.fl-markdown li { margin: 0.2em 0; }
.fl-markdown li input[type="checkbox"] { margin-right: 0.4em; }
.fl-markdown code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.875em;
  background: var(--muted);
  padding: 0.15em 0.35em;
  border-radius: 4px;
}
.fl-markdown pre {
  margin: 0.8em 0;
  padding: 0.9em 1em;
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow-x: auto;
}
.fl-markdown pre code {
  background: transparent;
  padding: 0;
  font-size: 0.85em;
  line-height: 1.5;
}
.fl-markdown blockquote {
  margin: 0.8em 0;
  padding: 0.2em 1em;
  border-left: 3px solid var(--border);
  color: var(--muted-foreground);
}
.fl-markdown blockquote p { margin: 0.3em 0; }
.fl-markdown table {
  margin: 0.8em 0;
  border-collapse: collapse;
  width: 100%;
  display: block;
  overflow-x: auto;
}
.fl-markdown th,
.fl-markdown td {
  border: 1px solid var(--border);
  padding: 0.4em 0.7em;
  text-align: left;
}
.fl-markdown th { background: var(--muted); font-weight: 600; }
.fl-markdown hr { border: 0; border-top: 1px solid var(--border); margin: 1.4em 0; }
.fl-markdown img { max-width: 100%; border-radius: 8px; }
.fl-markdown del { color: var(--muted-foreground); }
.fl-markdown strong { font-weight: 700; }
`
export default function MarkdownPreview() {
  const [input, setInput] = React.useState(SAMPLE_MARKDOWN)
  const [livePreview, setLivePreview] = React.useState(true)
  const [stagedHtml, setStagedHtml] = React.useState('')
  const liveHtml = React.useMemo<string>(() => {
    if (input.trim() === '') return ''
    try {
      const result = marked.parse(input, { async: false })
      return typeof result === 'string' ? result : ''
    } catch {
      return ''
    }
  }, [input])
  const html = livePreview ? liveHtml : stagedHtml
  const { copied, copy } = useCopy()
  const editorRef = React.useRef<HTMLTextAreaElement | null>(null)
  const previewRef = React.useRef<HTMLDivElement | null>(null)
  const [syncScroll, setSyncScroll] = React.useState(true)
  const onEditorScroll = () => {
    if (!syncScroll || !livePreview) return
    const ed = editorRef.current
    const pv = previewRef.current
    if (!ed || !pv) return
    const ratio =
      ed.scrollHeight > ed.clientHeight
        ? ed.scrollTop / (ed.scrollHeight - ed.clientHeight)
        : 0
    if (pv.scrollHeight > pv.clientHeight) {
      pv.scrollTop = ratio * (pv.scrollHeight - pv.clientHeight)
    }
  }
  const wordCount = React.useMemo(
    () => (input.match(/\S+/g) || []).length,
    [input]
  )
  const handleDownloadHtml = () => {
    const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Markdown Export</title>
<style>
body { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; max-width: 760px; margin: 2rem auto; padding: 0 1rem; color: #1a1a1a; line-height: 1.6; }
${PREVIEW_STYLE}
</style>
</head>
<body>
<div class="fl-markdown">
${html}
</div>
</body>
</html>`
    downloadBlob(
      new Blob([doc], { type: 'text/html;charset=utf-8' }),
      'markdown.html'
    )
  }
  return (
    <div className="space-y-5">
      <style dangerouslySetInnerHTML={{ __html: PREVIEW_STYLE }} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="size-4" />
            Markdown Preview
          </CardTitle>
          <CardDescription>
            Split-view editor with live HTML preview. GitHub-flavored markdown
            with line-break support. All parsing happens in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="md-live"
                checked={livePreview}
                onCheckedChange={setLivePreview}
                aria-label="Live preview"
              />
              <Label htmlFor="md-live" className="text-xs">
                Live preview
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="md-sync"
                checked={syncScroll}
                onCheckedChange={setSyncScroll}
                aria-label="Sync scroll"
              />
              <Label htmlFor="md-sync" className="text-xs">
                Sync scroll
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
                onClick={() => {
                  setInput('')
                  setStagedHtml('')
                }}
                disabled={input.length === 0}
                className="text-muted-foreground"
              >
                <Eraser className="size-4" />
                Clear
              </Button>
              {!livePreview ? (
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground"
                  onClick={() => setStagedHtml(liveHtml)}
                  disabled={input.trim() === ''}
                >
                  Render
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="md-input" className="text-sm font-medium">
              Markdown
            </Label>
            <span className="text-xs text-muted-foreground">
              {input.length} chars · {wordCount} words
            </span>
          </div>
          <Textarea
            id="md-input"
            ref={editorRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onScroll={onEditorScroll}
            rows={18}
            className="font-mono text-sm"
            spellCheck={false}
            placeholder="# Hello world…"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <Label className="text-sm font-medium">Preview</Label>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copy(html, 'HTML copied')}
                disabled={!html}
                className="h-7 text-xs"
              >
                {copied ? 'Copied' : 'Copy HTML'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadHtml}
                disabled={!html}
                className="h-7 text-xs"
              >
                <Download className="size-3.5" />
                Download HTML
              </Button>
            </div>
          </div>
          <div
            ref={previewRef}
            className="fl-scroll h-[18rem] overflow-auto rounded-lg border border-border bg-background p-4 lg:h-[26rem]"
          >
            {html ? (
              <div
                className="fl-markdown"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                {input.trim() === ''
                  ? 'Nothing to preview yet — start typing markdown on the left.'
                  : 'Click "Render" to generate the preview.'}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Characters" value={input.length} />
        <Stat label="Words" value={wordCount} />
        <Stat label="Lines" value={input ? input.split('\n').length : 0} />
        <Stat
          label="HTML size"
          value={`${new Blob([html]).size} B`}
        />
      </div>
    </div>
  )
}