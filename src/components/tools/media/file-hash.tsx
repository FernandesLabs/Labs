'use client'

import * as React from 'react'
import { Upload, FileText, Hash, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
import { toast } from 'sonner'

type Algo = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

const ALGOS: Algo[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

interface HashResult {
  algo: Algo
  hex: string
  ms: number
}

interface FileMeta {
  name: string
  size: number
  type: string
  lastModified: number
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—'
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const safe = Math.min(i, units.length - 1)
  const v = bytes / Math.pow(1024, safe)
  return `${v.toFixed(safe === 0 ? 0 : 2)} ${units[safe]}`
}

function bufferToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let out = ''
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0')
  }
  return out
}

function HashRow({ result }: { result: HashResult | null }) {
  const { copied, copy } = useCopy()
  const algo = result?.algo
  const hex = result?.hex ?? ''
  const empty = !result
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Hash className="size-3.5 text-muted-foreground" />
          <span className="text-sm font-medium">{algo ?? '—'}</span>
        </div>
        <div className="flex items-center gap-2">
          {result ? (
            <Badge variant="outline" className="font-mono text-[10px]">
              {result.ms}ms
            </Badge>
          ) : null}
          <button
            type="button"
            onClick={() => copy(hex, `${algo} hash copied`)}
            disabled={empty}
            className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="fl-scroll overflow-auto rounded-md border border-border bg-muted/30 p-2 font-mono text-xs break-all whitespace-pre-wrap">
        {empty ? (
          <span className="text-muted-foreground/50">—</span>
        ) : (
          hex
        )}
      </pre>
    </div>
  )
}

export default function FileHash() {
  const [file, setFile] = React.useState<FileMeta | null>(null)
  const [results, setResults] = React.useState<Record<Algo, HashResult | null>>({
    'SHA-1': null,
    'SHA-256': null,
    'SHA-384': null,
    'SHA-512': null,
  })
  const [computing, setComputing] = React.useState(false)
  const [dragOver, setDragOver] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const lastFileRef = React.useRef<File | null>(null)

  const compute = React.useCallback(async (f: File): Promise<void> => {
    setComputing(true)
    try {
      const buffer = await f.arrayBuffer()
      const next: Record<Algo, HashResult | null> = {
        'SHA-1': null,
        'SHA-256': null,
        'SHA-384': null,
        'SHA-512': null,
      }
      for (const algo of ALGOS) {
        const t0 = performance.now()
        const digest = await crypto.subtle.digest(algo, buffer)
        const t1 = performance.now()
        next[algo] = {
          algo,
          hex: bufferToHex(digest),
          ms: Math.max(1, Math.round(t1 - t0)),
        }
      }
      setResults(next)
    } catch {
      toast.error('Failed to compute file hash.')
    } finally {
      setComputing(false)
    }
  }, [])

  const handleFile = (f: File | null | undefined): void => {
    if (!f) return
    if (f.size > 500 * 1024 * 1024) {
      toast.error('File is over 500 MB — please pick a smaller file.')
      return
    }
    lastFileRef.current = f
    setFile({
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
    })
    void compute(f)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    handleFile(e.target.files?.[0])
  }

  const onDrop = (e: React.DragEvent): void => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const recompute = (): void => {
    if (lastFileRef.current) void compute(lastFileRef.current)
  }

  const downloadReport = (): void => {
    if (!file) return
    const lines: string[] = [
      `# File hash report`,
      ``,
      `File name: ${file.name}`,
      `File size: ${file.size} bytes (${formatBytes(file.size)})`,
      `File type: ${file.type || '(browser unknown)'}`,
      `Last modified: ${new Date(file.lastModified).toISOString()}`,
      `Generated: ${new Date().toISOString()}`,
      ``,
    ]
    for (const algo of ALGOS) {
      const r = results[algo]
      lines.push(`## ${algo}`)
      if (r) {
        lines.push(`hash: ${r.hex}`)
        lines.push(`compute time: ${r.ms}ms`)
      } else {
        lines.push(`hash: (not computed)`)
      }
      lines.push(``)
    }
    downloadBlob(
      new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }),
      `${file.name || 'file'}-hashes.txt`
    )
  }

  const largeFile = file && file.size > 10 * 1024 * 1024

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>File Hash Calculator</CardTitle>
          <CardDescription>
            Compute SHA-1, SHA-256, SHA-384, and SHA-512 hashes for any file
            using the Web Crypto API. Files never leave your browser — all
            hashing happens locally.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-border bg-muted/20'
            }`}
          >
            <Upload className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag &amp; drop a file here, or
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={computing}
            >
              <FileText className="size-3.5" />
              {computing ? 'Hashing…' : 'Choose a file'}
            </Button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={onInputChange}
              aria-label="Upload a file to hash"
            />
            {file ? (
              <p className="mt-1 text-xs text-foreground">
                Loaded: <strong>{file.name}</strong>
              </p>
            ) : null}
          </div>

          {largeFile ? (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>
                <div className="font-medium">Large file ({formatBytes(file.size)})</div>
                <div className="text-xs">
                  Hashing runs in a single pass over the file&apos;s
                  arrayBuffer. UI may pause briefly while the digest is
                  computed.
                </div>
              </div>
            </div>
          ) : null}

          {file ? (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={recompute}
                disabled={computing}
              >
                <Hash className="size-3.5" />
                Recompute
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={downloadReport}
                disabled={computing}
              >
                Download report
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {file ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">File info</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              role="status"
              aria-live="polite"
            >
              <Stat label="File name" value={file.name} />
              <Stat label="Size" value={`${file.size.toLocaleString()} B`} />
              <Stat label="Readable" value={formatBytes(file.size)} />
              <Stat
                label="Type"
                value={file.type || '— (unknown)'}
              />
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hashes</CardTitle>
          <CardDescription>
            {computing
              ? 'Computing…'
              : file
                ? 'All four algorithms computed locally via crypto.subtle.digest.'
                : 'Upload a file to compute hashes.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              No file loaded yet.
            </div>
          ) : (
            <div className="space-y-3">
              <Field label="SHA-1" htmlFor="fh-sha1">
                <HashRow result={results['SHA-1']} />
              </Field>
              <Field label="SHA-256" htmlFor="fh-sha256">
                <HashRow result={results['SHA-256']} />
              </Field>
              <Field label="SHA-384" htmlFor="fh-sha384">
                <HashRow result={results['SHA-384']} />
              </Field>
              <Field label="SHA-512" htmlFor="fh-sha512">
                <HashRow result={results['SHA-512']} />
              </Field>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • <strong className="text-foreground">SHA-1</strong> is
              cryptographically broken and should not be used for security
              purposes. Use SHA-256 or stronger for integrity verification.
            </li>
            <li>
              • The hash is computed over the file&apos;s raw bytes — file
              metadata (name, dates) is not included.
            </li>
            <li>
              • Files larger than 500 MB are blocked to protect browser
              memory.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
