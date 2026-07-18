'use client'

import * as React from 'react'
import {
  Upload,
  FileText,
  Search,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Field, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Magic-number database (~40 common file types)                      */
/* ------------------------------------------------------------------ */

type Category =
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'document'
  | 'executable'
  | 'font'
  | 'other'

interface Signature {
  /** Display name. */
  name: string
  /** Expected MIME type. */
  mime: string
  category: Category
  /** Hex string of the leading magic bytes (uppercase, space-separated). */
  hex: string
  /** Number of leading bytes used by this signature (1..16). */
  length: number
  /** Optional offset where the magic bytes start (default 0). */
  offset?: number
  /** Optional secondary signature for extra confidence (e.g. ZIP-based formats). */
  secondary?: string
  /** Notes / clarifications. */
  notes?: string
}

const SIGNATURES: Signature[] = [
  // ---- Images ----
  { name: 'PDF document', mime: 'application/pdf', category: 'document', hex: '25 50 44 46', length: 4, notes: '%PDF' },
  { name: 'PNG image', mime: 'image/png', category: 'image', hex: '89 50 4E 47 0D 0A 1A 0A', length: 8 },
  { name: 'JPEG image (JFIF)', mime: 'image/jpeg', category: 'image', hex: 'FF D8 FF E0', length: 4, notes: 'JFIF variant' },
  { name: 'JPEG image (Exif)', mime: 'image/jpeg', category: 'image', hex: 'FF D8 FF E1', length: 4, notes: 'Exif variant' },
  { name: 'JPEG image (generic)', mime: 'image/jpeg', category: 'image', hex: 'FF D8 FF', length: 3, notes: 'Any JPEG' },
  { name: 'GIF image (87a)', mime: 'image/gif', category: 'image', hex: '47 49 46 38 37 61', length: 6, notes: 'GIF87a' },
  { name: 'GIF image (89a)', mime: 'image/gif', category: 'image', hex: '47 49 46 38 39 61', length: 6, notes: 'GIF89a' },
  { name: 'BMP image', mime: 'image/bmp', category: 'image', hex: '42 4D', length: 2, notes: 'BM' },
  { name: 'WebP image', mime: 'image/webp', category: 'image', hex: '52 49 46 46', length: 4, secondary: '57 45 42 50', notes: 'RIFF....WEBP' },
  { name: 'TIFF image (little-endian)', mime: 'image/tiff', category: 'image', hex: '49 49 2A 00', length: 4, notes: 'II' },
  { name: 'TIFF image (big-endian)', mime: 'image/tiff', category: 'image', hex: '4D 4D 00 2A', length: 4, notes: 'MM' },
  { name: 'ICO icon', mime: 'image/x-icon', category: 'image', hex: '00 00 01 00', length: 4 },
  { name: 'CUR cursor', mime: 'application/x-win.cursor', category: 'image', hex: '00 00 02 00', length: 4 },
  { name: 'HEIC image', mime: 'image/heic', category: 'image', hex: '00 00 00 18 66 74 79 70 68 65 69 63', length: 12 },
  { name: 'AVIF image', mime: 'image/avif', category: 'image', hex: '00 00 00 18 66 74 79 70 61 76 69 66', length: 12 },
  { name: 'PSD (Photoshop)', mime: 'image/vnd.adobe.photoshop', category: 'image', hex: '38 42 50 53', length: 4, notes: '8BPS' },
  { name: 'SVG image', mime: 'image/svg+xml', category: 'image', hex: '3C 3F 78 6D 6C', length: 5, notes: 'XML declaration' },

  // ---- Video ----
  { name: 'MP4 video', mime: 'video/mp4', category: 'video', hex: '00 00 00 18 66 74 79 70 6D 70 34 32', length: 12, notes: 'ftypmp42' },
  { name: 'MP4 video (iso2)', mime: 'video/mp4', category: 'video', hex: '00 00 00 1C 66 74 79 70 69 73 6F 32', length: 12 },
  { name: 'MOV video (QuickTime)', mime: 'video/quicktime', category: 'video', hex: '00 00 00 14 66 74 79 70', length: 8, notes: 'ftypqt' },
  { name: 'AVI video', mime: 'video/x-msvideo', category: 'video', hex: '52 49 46 46', length: 4, secondary: '41 56 49 20', notes: 'RIFF....AVI ' },
  { name: 'WebM video', mime: 'video/webm', category: 'video', hex: '1A 45 DF A3', length: 4, notes: 'EBML' },
  { name: 'Matroska / MKV', mime: 'video/x-matroska', category: 'video', hex: '1A 45 DF A3', length: 4, notes: 'EBML (also WebM)' },
  { name: 'FLV video', mime: 'video/x-flv', category: 'video', hex: '46 4C 56 01', length: 4, notes: 'FLV' },
  { name: 'WMV video', mime: 'video/x-ms-wmv', category: 'video', hex: '30 26 B2 75', length: 4, notes: 'ASF GUID' },
  { name: 'MPEG video', mime: 'video/mpeg', category: 'video', hex: '00 00 01 BA', length: 4 },

  // ---- Audio ----
  { name: 'MP3 audio (ID3v2)', mime: 'audio/mpeg', category: 'audio', hex: '49 44 33', length: 3, notes: 'ID3' },
  { name: 'MP3 audio (frame sync)', mime: 'audio/mpeg', category: 'audio', hex: 'FF FB', length: 2 },
  { name: 'WAV audio', mime: 'audio/wav', category: 'audio', hex: '52 49 46 46', length: 4, secondary: '57 41 56 45', notes: 'RIFF....WAVE' },
  { name: 'FLAC audio', mime: 'audio/flac', category: 'audio', hex: '66 4C 61 43', length: 4, notes: 'fLaC' },
  { name: 'OGG audio/video', mime: 'audio/ogg', category: 'audio', hex: '4F 67 67 53', length: 4, notes: 'OggS' },
  { name: 'AIFF audio', mime: 'audio/aiff', category: 'audio', hex: '46 4F 52 4D', length: 4, notes: 'FORM' },
  { name: 'MIDI audio', mime: 'audio/midi', category: 'audio', hex: '4D 54 68 64', length: 4, notes: 'MThd' },
  { name: 'AAC audio (ADTS)', mime: 'audio/aac', category: 'audio', hex: 'FF F1', length: 2 },

  // ---- Archives ----
  { name: 'ZIP archive', mime: 'application/zip', category: 'archive', hex: '50 4B 03 04', length: 4, notes: 'PK' },
  { name: 'ZIP empty archive', mime: 'application/zip', category: 'archive', hex: '50 4B 05 06', length: 4 },
  { name: 'ZIP spanned', mime: 'application/zip', category: 'archive', hex: '50 4B 07 08', length: 4 },
  { name: 'RAR archive (v5)', mime: 'application/vnd.rar', category: 'archive', hex: '52 61 72 21 1A 07 01 00', length: 8, notes: 'Rar!' },
  { name: 'RAR archive (v4)', mime: 'application/vnd.rar', category: 'archive', hex: '52 61 72 21 1A 07 00', length: 7 },
  { name: '7-Zip archive', mime: 'application/x-7z-compressed', category: 'archive', hex: '37 7A BC AF 27 1C', length: 6, notes: '7z' },
  { name: 'gzip archive', mime: 'application/gzip', category: 'archive', hex: '1F 8B', length: 2 },
  { name: 'Bzip2 archive', mime: 'application/x-bzip2', category: 'archive', hex: '42 5A 68', length: 3, notes: 'BZh' },
  { name: 'xz archive', mime: 'application/x-xz', category: 'archive', hex: 'FD 37 7A 58 5A 00', length: 6 },
  { name: 'Tar archive', mime: 'application/x-tar', category: 'archive', hex: '75 73 74 61 72', length: 5, offset: 257, notes: 'ustar at offset 257' },

  // ---- Documents (OLE2 & OOXML) ----
  { name: 'MS Office (OLE2)', mime: 'application/x-ole-storage', category: 'document', hex: 'D0 CF 11 E0 A1 B1 1A E1', length: 8, notes: 'DOC / XLS / PPT legacy' },
  { name: 'Word document (DOCX)', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', category: 'document', hex: '50 4B 03 04', length: 4, notes: 'ZIP-based; verify [Content_Types].xml for Word' },
  { name: 'Excel workbook (XLSX)', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', category: 'document', hex: '50 4B 03 04', length: 4, notes: 'ZIP-based; verify [Content_Types].xml for Excel' },
  { name: 'PowerPoint (PPTX)', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', category: 'document', hex: '50 4B 03 04', length: 4, notes: 'ZIP-based; verify [Content_Types].xml for PowerPoint' },
  { name: 'EPUB ebook', mime: 'application/epub+zip', category: 'document', hex: '50 4B 03 04', length: 4, secondary: '6D 69 6D 65 74 79 70 65 61 70 70 6C 69 63 61 74 69 6F 6E 2F 65 70 75 62 2B 7A 69 70', notes: 'ZIP-based; mimetype entry' },
  { name: 'RTF document', mime: 'application/rtf', category: 'document', hex: '7B 5C 72 74 66', length: 5, notes: '{\\rtf' },

  // ---- Executables ----
  { name: 'Windows executable (PE)', mime: 'application/x-msdownload', category: 'executable', hex: '4D 5A', length: 2, notes: 'MZ' },
  { name: 'Linux ELF binary', mime: 'application/x-executable', category: 'executable', hex: '7F 45 4C 46', length: 4, notes: '\\x7fELF' },
  { name: 'Mach-O binary (64-bit)', mime: 'application/x-mach-binary', category: 'executable', hex: 'CF FA ED FE', length: 4 },
  { name: 'Mach-O binary (32-bit)', mime: 'application/x-mach-binary', category: 'executable', hex: 'CE FA ED FE', length: 4 },
  { name: 'Mach-O universal binary', mime: 'application/x-mach-binary', category: 'executable', hex: 'CA FE BA BE', length: 4 },
  { name: 'Java class file', mime: 'application/java-vm', category: 'executable', hex: 'CA FE BA BE', length: 4, notes: 'Also Mach-O fat binary' },
  { name: 'Java JAR archive', mime: 'application/java-archive', category: 'archive', hex: '50 4B 03 04', length: 4, notes: 'ZIP-based' },
  { name: 'WebAssembly module', mime: 'application/wasm', category: 'executable', hex: '00 61 73 6D', length: 4, notes: '\\0asm' },
  { name: 'Android APK', mime: 'application/vnd.android.package-archive', category: 'executable', hex: '50 4B 03 04', length: 4, notes: 'ZIP-based' },

  // ---- Fonts ----
  { name: 'TrueType font', mime: 'font/ttf', category: 'font', hex: '00 01 00 00', length: 4 },
  { name: 'OpenType font (CFF)', mime: 'font/otf', category: 'font', hex: '4F 54 54 4F', length: 4, notes: 'OTTO' },
  { name: 'WOFF font', mime: 'font/woff', category: 'font', hex: '77 4F 46 46', length: 4, notes: 'wOFF' },
  { name: 'WOFF2 font', mime: 'font/woff2', category: 'font', hex: '77 4F 46 32', length: 4, notes: 'wOF2' },

  // ---- Other ----
  { name: 'SQLite database', mime: 'application/vnd.sqlite3', category: 'other', hex: '53 51 4C 69 74 65 20 66 6F 72 6D 61 74 20 33 00', length: 16, notes: 'SQLite format 3' },
  { name: 'UTF-8 BOM', mime: 'text/plain', category: 'other', hex: 'EF BB BF', length: 3 },
  { name: 'JSON data', mime: 'application/json', category: 'other', hex: '7B', length: 1, notes: '{ (heuristic)' },
]

const CATEGORY_COLORS: Record<Category, string> = {
  image: '#16a34a',
  video: '#dc2626',
  audio: '#9333ea',
  archive: '#f59e0b',
  document: '#0891b2',
  executable: '#b91c1c',
  font: '#0d9488',
  other: '#64748b',
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function bytesToHex(bytes: Uint8Array, sep = ' '): string {
  let out = ''
  for (let i = 0; i < bytes.length; i++) {
    if (i > 0) out += sep
    out += bytes[i].toString(16).padStart(2, '0').toUpperCase()
  }
  return out
}

function parseHex(hex: string): number[] {
  return hex
    .trim()
    .split(/\s+/)
    .map((h) => parseInt(h, 16))
    .filter((n) => Number.isFinite(n))
}

function matchesAt(bytes: Uint8Array, expected: number[], offset: number): boolean {
  if (offset + expected.length > bytes.length) return false
  for (let i = 0; i < expected.length; i++) {
    if (bytes[offset + i] !== expected[i]) return false
  }
  return true
}

interface DetectionResult {
  signature: Signature
  /** 'exact' if all bytes match at the right offset; 'partial' if some do. */
  confidence: 'exact' | 'partial'
  /** Whether the secondary signature also matched (boosts confidence for ZIP-based formats). */
  secondaryMatched: boolean
}

function detect(bytes: Uint8Array): DetectionResult | null {
  let best: DetectionResult | null = null
  // Longest signatures first — they are the most specific.
  const ordered = [...SIGNATURES].sort((a, b) => b.length - a.length)
  for (const sig of ordered) {
    const expected = parseHex(sig.hex)
    const offset = sig.offset ?? 0
    if (matchesAt(bytes, expected, offset)) {
      let secondaryMatched = false
      if (sig.secondary) {
        const sec = parseHex(sig.secondary)
        // Look for the secondary signature anywhere in the first 256 bytes.
        for (let i = 0; i + sec.length <= Math.min(256, bytes.length); i++) {
          if (matchesAt(bytes, sec, i)) {
            secondaryMatched = true
            break
          }
        }
      }
      // Confidence: if the signature has a secondary signature and it
      // matched, it's a definitive exact match. If the signature has no
      // secondary but the magic is ≥ 4 bytes, treat as exact. Otherwise
      // partial (e.g. ZIP could be docx/xlsx/jar/apk/epub).
      const exact =
        (sig.secondary && secondaryMatched) ||
        (!sig.secondary && sig.length >= 4 && sig.hex !== '50 4B 03 04')
      return {
        signature: sig,
        confidence: exact ? 'exact' : 'partial',
        secondaryMatched,
      }
    }
  }
  return best
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

interface FileMeta {
  name: string
  size: number
  type: string
  lastModified: number
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FileSignatureInspector() {
  const [file, setFile] = React.useState<FileMeta | null>(null)
  const [head, setHead] = React.useState<Uint8Array | null>(null)
  const [detection, setDetection] = React.useState<DetectionResult | null>(null)
  const [reading, setReading] = React.useState(false)
  const [dragOver, setDragOver] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFile = async (f: File | null | undefined): Promise<void> => {
    if (!f) return
    if (f.size > 200 * 1024 * 1024) {
      toast.error('File is over 200 MB — please pick a smaller file.')
      return
    }
    setFile({
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
    })
    setReading(true)
    try {
      // Read the first 16 bytes (the standard magic-number probe window).
      const slice = f.slice(0, 16)
      const buf = await slice.arrayBuffer()
      const bytes = new Uint8Array(buf)
      setHead(bytes)
      setDetection(detect(bytes))
    } catch {
      toast.error('Could not read the file header.')
      setHead(null)
      setDetection(null)
    } finally {
      setReading(false)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    void handleFile(e.target.files?.[0])
  }

  const onDrop = (e: React.DragEvent): void => {
    e.preventDefault()
    setDragOver(false)
    void handleFile(e.dataTransfer.files?.[0])
  }

  const filteredTable = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return SIGNATURES
    return SIGNATURES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.mime.toLowerCase().includes(q) ||
        s.hex.toLowerCase().replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
        s.category.includes(q)
    )
  }, [search])

  const hexDump = React.useMemo(() => {
    if (!head) return ''
    const cells: string[] = []
    for (let i = 0; i < head.length; i++) {
      cells.push(head[i].toString(16).padStart(2, '0').toUpperCase())
    }
    return cells.join(' ')
  }, [head])

  const asciiDump = React.useMemo(() => {
    if (!head) return ''
    let out = ''
    for (let i = 0; i < head.length; i++) {
      const b = head[i]
      out += b >= 32 && b < 127 ? String.fromCharCode(b) : '.'
    }
    return out
  }, [head])

  const declaredMatches =
    file && detection
      ? file.type === detection.signature.mime ||
        (!file.type && detection.signature.mime !== '')
      : true

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>File Signature Inspector</CardTitle>
          <CardDescription>
            Read the first 16 bytes of a file and compare them against a
            database of {SIGNATURES.length} common magic-number signatures.
            Identifies the real file type independent of the extension or
            the browser-reported MIME.
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
              disabled={reading}
            >
              {reading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <FileText className="size-3.5" />
              )}
              {reading ? 'Reading…' : 'Choose a file'}
            </Button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={onInputChange}
              aria-label="Upload a file to inspect"
            />
            {file ? (
              <p className="mt-1 text-xs text-foreground">
                Loaded: <strong>{file.name}</strong>
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {file ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detection result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!detection ? (
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400">
                <div className="font-medium">Unknown file signature</div>
                <div className="mt-1 text-xs">
                  The first 16 bytes did not match any entry in the
                  database. The file may use an obscure or proprietary
                  format, or be a plain-text file without a magic number.
                </div>
              </div>
            ) : (
              <div className="space-y-4" role="status" aria-live="polite">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Stat
                    label="Detected type"
                    value={detection.signature.name}
                    accent={CATEGORY_COLORS[detection.signature.category]}
                  />
                  <Stat
                    label="Category"
                    value={detection.signature.category}
                    accent={CATEGORY_COLORS[detection.signature.category]}
                  />
                  <Stat label="MIME" value={detection.signature.mime} />
                  <Stat
                    label="Confidence"
                    value={
                      detection.confidence === 'exact'
                        ? 'Exact match'
                        : 'Partial (generic)'
                    }
                    accent={
                      detection.confidence === 'exact'
                        ? '#16a34a'
                        : '#d97706'
                    }
                  />
                </div>

                {detection.signature.notes ? (
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Notes
                    </div>
                    <p className="mt-1 text-sm">{detection.signature.notes}</p>
                  </div>
                ) : null}

                {detection.confidence === 'partial' ? (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <div>
                      <div className="font-medium">Generic signature</div>
                      <div className="text-xs">
                        This magic number is shared by several formats
                        (e.g. <code>50 4B 03 04</code> is shared by all
                        ZIP-based files). Without a secondary signature
                        match, the exact application format cannot be
                        determined from the header alone.
                      </div>
                    </div>
                  </div>
                ) : null}

                {file.type && detection.signature.mime !== file.type ? (
                  <div className="flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-400">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <div>
                      <div className="font-medium">MIME mismatch</div>
                      <div className="text-xs">
                        The browser reports{' '}
                        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                          {file.type}
                        </code>{' '}
                        but the magic bytes indicate{' '}
                        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                          {detection.signature.mime}
                        </code>
                        . The file may have been renamed or mislabelled.
                      </div>
                    </div>
                  </div>
                ) : file.type && declaredMatches ? (
                  <div className="flex items-start gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                    <div>
                      <div className="font-medium">MIME matches</div>
                      <div className="text-xs">
                        The browser-reported MIME type is consistent with
                        the magic-number detection.
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            <div>
              <div className="mb-2 text-sm font-medium text-foreground">
                Uploaded file metadata
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="File name" value={file.name} />
                <Stat label="Size" value={formatBytes(file.size)} />
                <Stat
                  label="Declared type (file.type)"
                  value={file.type || '— (browser unknown)'}
                />
                <Stat
                  label="Last modified"
                  value={
                    Number.isFinite(file.lastModified)
                      ? new Date(file.lastModified).toLocaleString()
                      : '—'
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {head ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hex dump (first 16 bytes)</CardTitle>
            <CardDescription>
              The raw leading bytes used to identify the file format.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="fl-scroll overflow-auto rounded-lg border border-border bg-muted/30 p-3 font-mono text-xs">
              <span className="text-muted-foreground">offset  </span>
              00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
              {'\n'}
              <span className="text-muted-foreground">bytes   </span>
              {hexDump || '(empty)'}
              {'\n'}
              <span className="text-muted-foreground">ascii   </span>
              {asciiDump || '(empty)'}
            </pre>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Signature reference</CardTitle>
          <CardDescription>
            Searchable list of all {SIGNATURES.length} magic-number
            signatures in the database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, MIME, hex, or category…"
              className="pl-9"
              aria-label="Search signatures"
            />
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            <ScrollArea className="max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-44">Name</TableHead>
                    <TableHead className="w-44">Magic bytes</TableHead>
                    <TableHead>MIME</TableHead>
                    <TableHead className="w-24">Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTable.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground"
                      >
                        No matches.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTable.map((s, idx) => (
                      <TableRow key={`${s.name}-${s.hex}-${idx}`}>
                        <TableCell className="text-sm">{s.name}</TableCell>
                        <TableCell className="font-mono text-[11px]">
                          {s.hex}
                        </TableCell>
                        <TableCell className="font-mono text-[11px]">
                          {s.mime}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            style={{ color: CATEGORY_COLORS[s.category] }}
                          >
                            {s.category}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
