'use client'
import * as React from 'react'
import {
  Upload,
  FileText,
  Hash,
  AlertTriangle,
  Loader2,
  Download,
} from 'lucide-react'
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
import {
  Field,
  Stat,
  downloadBlob,
} from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
import { toast } from 'sonner'
/* ------------------------------------------------------------------ */
/*  CRC32 — table-based polynomial implementation                       */
/* ------------------------------------------------------------------ */
const CRC_TABLE: Uint32Array = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
})()
function crc32(bytes: Uint8Array): string {
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8)
  }
  // XOR-out + flip to match standard CRC-32 (IEEE 802.3)
  const final = (crc ^ 0xffffffff) >>> 0
  return final.toString(16).padStart(8, '0')
}
/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
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
type Algo = 'CRC32' | 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512'
interface HashResult {
  algo: Algo
  hex: string
  ms: number
  unsupported?: boolean
}
interface FileMeta {
  name: string
  size: number
  type: string
  lastModified: number
}
/* ------------------------------------------------------------------ */
/*  Hash row                                                           */
/* ------------------------------------------------------------------ */
function HashRow({ result }: { result: HashResult | null }) {
  const { copied, copy } = useCopy()
  const algo = result?.algo
  const hex = result?.hex ?? ''
  const empty = !result
  const unsupported = result?.unsupported === true
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Hash className="size-3.5 text-muted-foreground" />
          <span className="text-sm font-medium">{algo ?? '—'}</span>
        </div>
        <div className="flex items-center gap-2">
          {result && !unsupported ? (
            <Badge variant="outline" className="font-mono text-[10px]">
              {result.ms}ms
            </Badge>
          ) : null}
          {unsupported ? (
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-700 dark:text-amber-400"
            >
              unsupported
            </Badge>
          ) : null}
          <button
            type="button"
            onClick={() => copy(hex, `${algo} hash copied`)}
            disabled={empty || unsupported}
            className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="fl-scroll overflow-auto rounded-md border border-border bg-muted/30 p-2 font-mono text-xs break-all whitespace-pre-wrap">
        {empty ? (
          <span className="text-muted-foreground/50">—</span>
        ) : unsupported ? (
          <span className="text-amber-700 dark:text-amber-400">
            MD5 not supported in this browser
          </span>
        ) : (
          hex
        )}
      </pre>
    </div>
  )
}
/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function FileChecksum() {
  const [file, setFile] = React.useState<FileMeta | null>(null)
  const [results, setResults] = React.useState<Record<Algo, HashResult | null>>({
    CRC32: null,
    MD5: null,
    'SHA-1': null,
    'SHA-256': null,
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
      const bytes = new Uint8Array(buffer)
      const next: Record<Algo, HashResult | null> = {
        CRC32: null,
        MD5: null,
        'SHA-1': null,
        'SHA-256': null,
        'SHA-512': null,
      }
      // CRC32 (synchronous, manual)
      const t0 = performance.now()
      const crcHex = crc32(bytes)
      const t1 = performance.now()
      next.CRC32 = {
        algo: 'CRC32',
        hex: crcHex,
        ms: Math.max(1, Math.round(t1 - t0)),
      }
      // SHA-* via Web Crypto
      const shaAlgos: Algo[] = ['SHA-1', 'SHA-256', 'SHA-512']
      for (const algo of shaAlgos) {
        const a0 = performance.now()
        const digest = await crypto.subtle.digest(algo, buffer)
        const a1 = performance.now()
        next[algo] = {
          algo,
          hex: bufferToHex(digest),
          ms: Math.max(1, Math.round(a1 - a0)),
        }
      }
      // MD5 — not in Web Crypto. Attempt digest('MD5') and gracefully
      // fall back if the browser throws.
      try {
        const m0 = performance.now()
        // MD5 is not in the TS lib's AlgorithmIdentifier union but some
        // non-spec browsers historically exposed it; the try/catch handles
        // environments where it throws.
        const md5Buf = await crypto.subtle.digest('MD5', buffer)
        const m1 = performance.now()
        next.MD5 = {
          algo: 'MD5',
          hex: bufferToHex(md5Buf),
          ms: Math.max(1, Math.round(m1 - m0)),
        }
      } catch {
        next.MD5 = {
          algo: 'MD5',
          hex: '',
          ms: 0,
          unsupported: true,
        }
      }
      setResults(next)
    } catch {
      toast.error('Failed to compute checksums.')
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
      `# File checksum report`,
      ``,
      `File name: ${file.name}`,
      `File size: ${file.size} bytes (${formatBytes(file.size)})`,
      `File type: ${file.type || '(browser unknown)'}`,
      `Last modified: ${new Date(file.lastModified).toISOString()}`,
      `Generated: ${new Date().toISOString()}`,
      ``,
    ]
    const algos: Algo[] = ['CRC32', 'MD5', 'SHA-1', 'SHA-256', 'SHA-512']
    for (const algo of algos) {
      const r = results[algo]
      lines.push(`## ${algo}`)
      if (r) {
        if (r.unsupported) {
          lines.push(`hash: (not supported in this browser)`)
        } else {
          lines.push(`hash: ${r.hex}`)
          lines.push(`compute time: ${r.ms}ms`)
        }
      } else {
        lines.push(`hash: (not computed)`)
      }
      lines.push(``)
    }
    downloadBlob(
      new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }),
      `${file.name || 'file'}-checksums.txt`
    )
  }
  const largeFile = file && file.size > 50 * 1024 * 1024
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>File Checksum</CardTitle>
          <CardDescription>
            Compute CRC32 and a family of cryptographic hashes (MD5, SHA-1,
            SHA-256, SHA-512) for any file. CRC32 is implemented manually
            with a lookup table; the SHA family uses the Web Crypto API.
            Files never leave your browser.
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
              {computing ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <FileText className="size-3.5" />
              )}
              {computing ? 'Computing…' : 'Choose a file'}
            </Button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={onInputChange}
              aria-label="Upload a file to checksum"
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
                <div className="font-medium">
                  Large file ({formatBytes(file.size)})
                </div>
                <div className="text-xs">
                  Hashing runs in a single pass over the file&apos;s
                  arrayBuffer. The UI may pause briefly while the digest is
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
                <Download className="size-3.5" />
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
              <Stat label="Type" value={file.type || '— (unknown)'} />
            </div>
          </CardContent>
        </Card>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Checksums</CardTitle>
          <CardDescription>
            {computing
              ? 'Computing…'
              : file
                ? 'CRC32 is computed manually; SHA hashes use crypto.subtle.digest. MD5 may be unsupported in your browser.'
                : 'Upload a file to compute checksums.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              No file loaded yet.
            </div>
          ) : (
            <div className="space-y-3">
              <Field label="CRC32 (hex)" htmlFor="fc-crc32">
                <HashRow result={results.CRC32} />
              </Field>
              <Field label="MD5 (hex)" htmlFor="fc-md5">
                <HashRow result={results.MD5} />
              </Field>
              <Field label="SHA-1 (hex)" htmlFor="fc-sha1">
                <HashRow result={results['SHA-1']} />
              </Field>
              <Field label="SHA-256 (hex)" htmlFor="fc-sha256">
                <HashRow result={results['SHA-256']} />
              </Field>
              <Field label="SHA-512 (hex)" htmlFor="fc-sha512">
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
              • <strong className="text-foreground">CRC32</strong> is a fast
              non-cryptographic checksum — useful for detecting accidental
              corruption, not for security. Implemented here with a
              256-entry lookup table.
            </li>
            <li>
              • <strong className="text-foreground">MD5</strong> is not part
              of the Web Crypto specification. Most browsers will throw, in
              which case the row shows{' '}
              <em>MD5 not supported in this browser</em> — the SHA hashes
              are still computed.
            </li>
            <li>
              • <strong className="text-foreground">SHA-1</strong> is
              cryptographically broken; prefer SHA-256 or SHA-512 for
              integrity verification.
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