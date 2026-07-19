'use client'
import * as React from 'react'
import {
  Save,
  History,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  GitCompare,
  Plus,
  Copy,
  X,
  Clock,
  FileJson,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, Stat, downloadBlob, randomInt } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
import { toast } from 'sonner'
/* ------------------------------------------------------------------ */
/*  Types & storage                                                    */
/* ------------------------------------------------------------------ */
interface Version {
  id: string
  name: string
  text: string
  message: string
  createdAt: number
}
interface Library {
  /** All versions across all prompt names. */
  versions: Version[]
}
const STORAGE_KEY = 'fl-prompt-versions'
function makeId(): string {
  return `v-${Date.now().toString(36)}-${randomInt(1_000_000).toString(36)}`
}
function loadLibrary(): Library {
  if (typeof window === 'undefined') return { versions: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { versions: [] }
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && Array.isArray((parsed as Library).versions)) {
      return parsed as Library
    }
    // Tolerate legacy shape: bare array.
    if (Array.isArray(parsed)) {
      return { versions: parsed as Version[] }
    }
    return { versions: [] }
  } catch {
    return { versions: [] }
  }
}
function saveLibrary(lib: Library): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lib))
  } catch {
    toast.error('Could not save — localStorage quota exceeded?')
  }
}
/* ------------------------------------------------------------------ */
/*  Simple line-based LCS diff                                         */
/* ------------------------------------------------------------------ */
interface DiffLine {
  type: 'equal' | 'add' | 'remove'
  text: string
}
function diffLines(oldText: string, newText: string): DiffLine[] {
  const a = oldText.split('\n')
  const b = newText.split('\n')
  const m = a.length
  const n = b.length
  // Build LCS table.
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0)
  )
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) dp[i][j] = dp[i + 1][j + 1] + 1
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }
  const out: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      out.push({ type: 'equal', text: a[i] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: 'remove', text: a[i] })
      i++
    } else {
      out.push({ type: 'add', text: b[j] })
      j++
    }
  }
  while (i < m) {
    out.push({ type: 'remove', text: a[i++] })
  }
  while (j < n) {
    out.push({ type: 'add', text: b[j++] })
  }
  return out
}
/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatDate(ts: number): string {
  if (!Number.isFinite(ts)) return '—'
  return new Date(ts).toLocaleString()
}
function relativeTime(ts: number): string {
  if (!Number.isFinite(ts)) return ''
  const diff = Date.now() - ts
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return 'just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day}d ago`
  return formatDate(ts)
}
/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function PromptVersionManager() {
  const [library, setLibrary] = React.useState<Library>({ versions: [] })
  const [hydrated, setHydrated] = React.useState(false)
  const [name, setName] = React.useState('')
  const [text, setText] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [diffLeft, setDiffLeft] = React.useState<string | null>(null)
  const [diffRight, setDiffRight] = React.useState<string | null>(null)
  const [showDiff, setShowDiff] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const { copy } = useCopy()
  // Hydrate from localStorage on mount (client-only).
  React.useEffect(() => {
    setLibrary(loadLibrary())
    setHydrated(true)
  }, [])
  // Persist on change (after hydration).
  React.useEffect(() => {
    if (!hydrated) return
    saveLibrary(library)
  }, [library, hydrated])
  // Versions sorted newest-first.
  const versions = React.useMemo(
    () =>
      [...library.versions].sort((a, b) => b.createdAt - a.createdAt),
    [library.versions]
  )
  // Group versions by prompt name for the timeline.
  const grouped = React.useMemo(() => {
    const map = new Map<string, Version[]>()
    for (const v of versions) {
      const key = v.name || '(untitled)'
      const arr = map.get(key) ?? []
      arr.push(v)
      map.set(key, arr)
    }
    return Array.from(map.entries())
  }, [versions])
  const handleSave = (): void => {
    const trimmedName = name.trim()
    const trimmedText = text
    if (!trimmedName) {
      toast.error('Prompt name is required')
      return
    }
    if (!trimmedText.trim()) {
      toast.error('Prompt text is required')
      return
    }
    const v: Version = {
      id: makeId(),
      name: trimmedName,
      text: trimmedText,
      message: message.trim(),
      createdAt: Date.now(),
    }
    setLibrary((prev) => ({ versions: [...prev.versions, v] }))
    setMessage('')
    toast.success('Version saved')
  }
  const handleRestore = (v: Version): void => {
    setName(v.name)
    setText(v.text)
    toast.success(`Restored version from ${formatDate(v.createdAt)}`)
  }
  const handleDelete = (id: string): void => {
    setLibrary((prev) => ({
      versions: prev.versions.filter((v) => v.id !== id),
    }))
    if (diffLeft === id) setDiffLeft(null)
    if (diffRight === id) setDiffRight(null)
    toast.success('Version deleted')
  }
  const handleClearAll = (): void => {
    if (versions.length === 0) return
    if (
      !window.confirm(
        `Delete all ${versions.length} saved version(s)? This cannot be undone.`
      )
    )
      return
    setLibrary({ versions: [] })
    setDiffLeft(null)
    setDiffRight(null)
    toast.success('All versions cleared')
  }
  const handleExport = (): void => {
    if (versions.length === 0) {
      toast.error('No versions to export')
      return
    }
    const blob = new Blob([JSON.stringify(library, null, 2)], {
      type: 'application/json',
    })
    downloadBlob(blob, 'prompt-versions.json')
    toast.success('Versions exported')
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
        let incoming: Version[] = []
        if (Array.isArray(parsed)) {
          incoming = parsed as Version[]
        } else if (
          parsed &&
          typeof parsed === 'object' &&
          Array.isArray((parsed as Library).versions)
        ) {
          incoming = (parsed as Library).versions
        } else {
          toast.error('Invalid file — expected JSON array of versions')
          return
        }
        const valid: Version[] = []
        for (const item of incoming) {
          const v = item as Partial<Version>
          if (
            typeof v.name === 'string' &&
            typeof v.text === 'string' &&
            Number.isFinite(v.createdAt)
          ) {
            valid.push({
              id: typeof v.id === 'string' ? v.id : makeId(),
              name: v.name,
              text: v.text,
              message: typeof v.message === 'string' ? v.message : '',
              createdAt: v.createdAt ?? Date.now(),
            })
          }
        }
        if (valid.length === 0) {
          toast.error('No valid versions found in file')
          return
        }
        // Merge by id (skip duplicates).
        setLibrary((prev) => {
          const seen = new Set(prev.versions.map((v) => v.id))
          const additions = valid.filter((v) => {
            if (seen.has(v.id)) return false
            seen.add(v.id)
            return true
          })
          return { versions: [...prev.versions, ...additions] }
        })
        toast.success(`Imported ${valid.length} version(s)`)
      } catch {
        toast.error('Could not parse JSON file')
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.onerror = () => toast.error('Could not read file')
    reader.readAsText(file)
  }
  const diffResult = React.useMemo(() => {
    if (!showDiff || !diffLeft || !diffRight) return null
    const left = library.versions.find((v) => v.id === diffLeft)
    const right = library.versions.find((v) => v.id === diffRight)
    if (!left || !right) return null
    return {
      left,
      right,
      lines: diffLines(left.text, right.text),
    }
  }, [showDiff, diffLeft, diffRight, library.versions])
  const diffStats = React.useMemo(() => {
    if (!diffResult) return null
    let added = 0
    let removed = 0
    for (const l of diffResult.lines) {
      if (l.type === 'add') added++
      else if (l.type === 'remove') removed++
    }
    return { added, removed }
  }, [diffResult])
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-4" />
            Prompt Version Manager
          </CardTitle>
          <CardDescription>
            A lightweight version-control system for prompts. Save snapshots
            of a prompt over time with optional messages, restore previous
            versions, diff any two versions, and export/import the whole
            history as JSON. All data is stored locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Prompt name" htmlFor="pvm-name">
            <Input
              id="pvm-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Code review assistant"
              aria-label="Prompt name"
            />
          </Field>
          <Field
            label="Prompt text"
            htmlFor="pvm-text"
            hint="Use {{variables}} for placeholders"
          >
            <Textarea
              id="pvm-text"
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="You are a senior code reviewer. Review the following {{language}} code for {{concerns}}…"
              aria-label="Prompt text"
            />
          </Field>
          <Field
            label="Save message"
            htmlFor="pvm-msg"
            hint="optional — describes what changed"
          >
            <Input
              id="pvm-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. tightened tone, added JSON output spec"
              aria-label="Save message"
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={handleSave}
              className="bg-primary text-primary-foreground"
            >
              <Save className="size-3.5" />
              Save version
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setName('')
                setText('')
                setMessage('')
              }}
            >
              <Plus className="size-3.5" />
              New prompt
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => copy(text, 'Prompt text copied')}
              disabled={!text}
            >
              <Copy className="size-3.5" />
              Copy text
            </Button>
          </div>
        </CardContent>
      </Card>
      <div
        className="grid gap-3 sm:grid-cols-3"
        role="status"
        aria-live="polite"
      >
        <Stat label="Saved versions" value={versions.length} />
        <Stat label="Distinct prompts" value={grouped.length} />
        <Stat
          label="Latest save"
          value={
            versions.length > 0
              ? relativeTime(versions[0].createdAt)
              : '—'
          }
        />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
          <div>
            <CardTitle className="text-base">Version history</CardTitle>
            <CardDescription>
              Timeline of saved versions grouped by prompt name. Click
              &ldquo;Diff&rdquo; on two versions to compare them.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleExport}
              disabled={versions.length === 0}
            >
              <Download className="size-3.5" />
              Export
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleImportClick}
            >
              <Upload className="size-3.5" />
              Import
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleClearAll}
              disabled={versions.length === 0}
              className="text-rose-600 hover:bg-rose-500/10 hover:text-rose-700"
            >
              <Trash2 className="size-3.5" />
              Clear all
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="sr-only"
              aria-label="Import versions from JSON file"
            />
          </div>
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
              <FileJson className="mx-auto mb-2 size-6 text-muted-foreground/60" />
              No versions saved yet. Enter a prompt name and text above,
              then click <strong>Save version</strong> to create the first
              snapshot.
            </div>
          ) : (
            <ScrollArea className="max-h-[28rem]">
              <div className="space-y-6 pr-3">
                {grouped.map(([promptName, vs]) => (
                  <div key={promptName}>
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{promptName}</h3>
                      <Badge variant="secondary">{vs.length}</Badge>
                    </div>
                    <ol className="relative space-y-3 border-l border-border pl-4">
                      {vs.map((v, idx) => {
                        const isLatest = idx === 0
                        const leftSelected = diffLeft === v.id
                        const rightSelected = diffRight === v.id
                        return (
                          <li
                            key={v.id}
                            className="relative"
                          >
                            <span
                              className={`absolute -left-[1.40rem] top-1 size-2.5 rounded-full ring-2 ring-background ${
                                isLatest ? 'bg-primary' : 'bg-muted-foreground/50'
                              }`}
                              aria-hidden="true"
                            />
                            <div
                              className={`rounded-lg border p-3 transition ${
                                leftSelected || rightSelected
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border bg-card hover:bg-muted/30'
                              }`}
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <Clock className="size-3 text-muted-foreground" />
                                    <span className="text-xs font-mono text-muted-foreground">
                                      {formatDate(v.createdAt)}
                                    </span>
                                    {isLatest ? (
                                      <Badge
                                        variant="outline"
                                        className="border-primary/40 text-primary"
                                      >
                                        latest
                                      </Badge>
                                    ) : null}
                                  </div>
                                  {v.message ? (
                                    <p className="mt-1 text-sm">
                                      {v.message}
                                    </p>
                                  ) : (
                                    <p className="mt-1 text-xs italic text-muted-foreground">
                                      No save message
                                    </p>
                                  )}
                                  <pre className="fl-scroll mt-2 max-h-24 overflow-auto rounded-md border border-border bg-muted/30 p-2 font-mono text-[11px] whitespace-pre-wrap">
                                    {v.text.slice(0, 280) +
                                      (v.text.length > 280 ? '…' : '')}
                                  </pre>
                                </div>
                                <div className="flex shrink-0 flex-col gap-1">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 justify-start px-2 text-xs"
                                    onClick={() => handleRestore(v)}
                                  >
                                    <RotateCcw className="size-3" />
                                    Restore
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className={`h-7 justify-start px-2 text-xs ${
                                      leftSelected
                                        ? 'bg-primary/10 text-primary'
                                        : ''
                                    }`}
                                    onClick={() => {
                                      setDiffLeft(leftSelected ? null : v.id)
                                      if (!leftSelected) setShowDiff(true)
                                    }}
                                  >
                                    <GitCompare className="size-3" />
                                    {leftSelected ? '✓ Left' : 'Diff (left)'}
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className={`h-7 justify-start px-2 text-xs ${
                                      rightSelected
                                        ? 'bg-primary/10 text-primary'
                                        : ''
                                    }`}
                                    onClick={() => {
                                      setDiffRight(rightSelected ? null : v.id)
                                      if (!rightSelected) setShowDiff(true)
                                    }}
                                  >
                                    <GitCompare className="size-3" />
                                    {rightSelected ? '✓ Right' : 'Diff (right)'}
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 justify-start px-2 text-xs text-rose-600 hover:bg-rose-500/10 hover:text-rose-700"
                                    onClick={() => handleDelete(v.id)}
                                    aria-label="Delete version"
                                  >
                                    <Trash2 className="size-3" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      {showDiff ? (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
            <div>
              <CardTitle className="text-base">Diff</CardTitle>
              <CardDescription>
                Line-by-line comparison of two selected versions.
              </CardDescription>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7"
              onClick={() => {
                setShowDiff(false)
                setDiffLeft(null)
                setDiffRight(null)
              }}
              aria-label="Close diff"
            >
              <X className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {!diffLeft || !diffRight ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                Select a left and a right version from the timeline to
                compare them.
              </div>
            ) : diffLeft === diffRight ? (
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400">
                Pick two different versions to diff.
              </div>
            ) : !diffResult ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                One or both selected versions could not be found.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Left
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {diffResult.left.name}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {formatDate(diffResult.left.createdAt)}
                    </div>
                    {diffResult.left.message ? (
                      <p className="mt-1 text-xs italic text-muted-foreground">
                        {diffResult.left.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Right
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {diffResult.right.name}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {formatDate(diffResult.right.createdAt)}
                    </div>
                    {diffResult.right.message ? (
                      <p className="mt-1 text-xs italic text-muted-foreground">
                        {diffResult.right.message}
                      </p>
                    ) : null}
                  </div>
                </div>
                {diffStats ? (
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 text-emerald-700 dark:text-emerald-400"
                    >
                      +{diffStats.added} added
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-rose-500/40 text-rose-700 dark:text-rose-400"
                    >
                      −{diffStats.removed} removed
                    </Badge>
                  </div>
                ) : null}
                <ScrollArea className="max-h-96 rounded-lg border border-border bg-muted/30">
                  <pre className="p-3 font-mono text-xs">
                    {diffResult.lines.map((l, i) => (
                      <div
                        key={i}
                        className={`whitespace-pre-wrap break-words px-1 ${
                          l.type === 'add'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                            : l.type === 'remove'
                              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                              : 'text-foreground'
                        }`}
                      >
                        <span className="select-none pr-2 text-muted-foreground/50">
                          {l.type === 'add' ? '+' : l.type === 'remove' ? '−' : ' '}
                        </span>
                        {l.text || '\u00A0'}
                      </div>
                    ))}
                  </pre>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • Each click on <strong>Save version</strong> snapshots the
              current prompt name, text, and message with a timestamp.
              Versions are stored locally in{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                localStorage
              </code>{' '}
              under the key{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                fl-prompt-versions
              </code>
              .
            </li>
            <li>
              • <strong>Restore</strong> copies a previous version&apos;s
              name and text back into the editor — it does not delete the
              current version. Save again to capture a new snapshot.
            </li>
            <li>
              • <strong>Diff</strong> selects two versions (left + right)
              and renders a line-by-line LCS comparison with additions in
              green and removals in red.
            </li>
            <li>
              • <strong>Export</strong> writes the whole library as a JSON
              file; <strong>Import</strong> merges a JSON file by id
              (duplicates are skipped). Version IDs use{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                randomInt
              </code>{' '}
              — never <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Math.random</code>.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}