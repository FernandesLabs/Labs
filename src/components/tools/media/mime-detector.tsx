'use client'

import * as React from 'react'
import { Upload, FileText, Search } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
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

interface MimeEntry {
  ext: string
  mime: string
  category: 'image' | 'video' | 'audio' | 'text' | 'application'
  uses: string
}

const MIME_MAP: MimeEntry[] = [
  // Images
  { ext: 'png', mime: 'image/png', category: 'image', uses: 'Lossless web images, screenshots, transparency.' },
  { ext: 'jpg', mime: 'image/jpeg', category: 'image', uses: 'Photographs, web images.' },
  { ext: 'jpeg', mime: 'image/jpeg', category: 'image', uses: 'Photographs, web images.' },
  { ext: 'gif', mime: 'image/gif', category: 'image', uses: 'Animations, simple graphics.' },
  { ext: 'webp', mime: 'image/webp', category: 'image', uses: 'Modern web image format.' },
  { ext: 'svg', mime: 'image/svg+xml', category: 'image', uses: 'Scalable vector graphics, icons.' },
  { ext: 'bmp', mime: 'image/bmp', category: 'image', uses: 'Uncompressed bitmaps.' },
  { ext: 'ico', mime: 'image/x-icon', category: 'image', uses: 'Favicons.' },
  { ext: 'tiff', mime: 'image/tiff', category: 'image', uses: 'Print, archival images.' },
  { ext: 'avif', mime: 'image/avif', category: 'image', uses: 'Next-gen compressed images.' },
  { ext: 'heic', mime: 'image/heic', category: 'image', uses: 'Apple photos.' },

  // Video
  { ext: 'mp4', mime: 'video/mp4', category: 'video', uses: 'Web video, streaming.' },
  { ext: 'webm', mime: 'video/webm', category: 'video', uses: 'Open web video format.' },
  { ext: 'mov', mime: 'video/quicktime', category: 'video', uses: 'Apple QuickTime video.' },
  { ext: 'avi', mime: 'video/x-msvideo', category: 'video', uses: 'Legacy Windows video.' },
  { ext: 'mkv', mime: 'video/x-matroska', category: 'video', uses: 'Open container, multiple tracks.' },
  { ext: 'wmv', mime: 'video/x-ms-wmv', category: 'video', uses: 'Windows Media video.' },
  { ext: 'flv', mime: 'video/x-flv', category: 'video', uses: 'Legacy Flash video.' },
  { ext: 'm4v', mime: 'video/x-m4v', category: 'video', uses: 'iTunes video.' },
  { ext: 'ogv', mime: 'video/ogg', category: 'video', uses: 'Open-source video.' },
  { ext: '3gp', mime: 'video/3gpp', category: 'video', uses: 'Mobile video.' },

  // Audio
  { ext: 'mp3', mime: 'audio/mpeg', category: 'audio', uses: 'Music, podcasts.' },
  { ext: 'wav', mime: 'audio/wav', category: 'audio', uses: 'Uncompressed audio.' },
  { ext: 'ogg', mime: 'audio/ogg', category: 'audio', uses: 'Open-source audio.' },
  { ext: 'flac', mime: 'audio/flac', category: 'audio', uses: 'Lossless audio.' },
  { ext: 'aac', mime: 'audio/aac', category: 'audio', uses: 'Compressed audio, iTunes.' },
  { ext: 'm4a', mime: 'audio/mp4', category: 'audio', uses: 'Apple audio.' },
  { ext: 'opus', mime: 'audio/opus', category: 'audio', uses: 'Voice, low-bitrate streaming.' },
  { ext: 'wma', mime: 'audio/x-ms-wma', category: 'audio', uses: 'Windows Media audio.' },
  { ext: 'aiff', mime: 'audio/aiff', category: 'audio', uses: 'Apple uncompressed audio.' },

  // Text
  { ext: 'txt', mime: 'text/plain', category: 'text', uses: 'Plain text documents.' },
  { ext: 'html', mime: 'text/html', category: 'text', uses: 'Web pages.' },
  { ext: 'htm', mime: 'text/html', category: 'text', uses: 'Web pages.' },
  { ext: 'css', mime: 'text/css', category: 'text', uses: 'Stylesheets.' },
  { ext: 'csv', mime: 'text/csv', category: 'text', uses: 'Tabular data.' },
  { ext: 'xml', mime: 'application/xml', category: 'text', uses: 'Structured documents.' },
  { ext: 'md', mime: 'text/markdown', category: 'text', uses: 'Markdown documents.' },
  { ext: 'js', mime: 'text/javascript', category: 'text', uses: 'JavaScript source.' },
  { ext: 'ts', mime: 'text/typescript', category: 'text', uses: 'TypeScript source.' },
  { ext: 'tsx', mime: 'text/typescript', category: 'text', uses: 'React TSX source.' },
  { ext: 'jsx', mime: 'text/jsx', category: 'text', uses: 'React JSX source.' },
  { ext: 'json', mime: 'application/json', category: 'text', uses: 'JSON data.' },
  { ext: 'yaml', mime: 'application/yaml', category: 'text', uses: 'YAML config.' },
  { ext: 'yml', mime: 'application/yaml', category: 'text', uses: 'YAML config.' },
  { ext: 'py', mime: 'text/x-python', category: 'text', uses: 'Python source.' },
  { ext: 'java', mime: 'text/x-java-source', category: 'text', uses: 'Java source.' },
  { ext: 'c', mime: 'text/x-c', category: 'text', uses: 'C source.' },
  { ext: 'cpp', mime: 'text/x-c++', category: 'text', uses: 'C++ source.' },
  { ext: 'go', mime: 'text/x-go', category: 'text', uses: 'Go source.' },
  { ext: 'rs', mime: 'text/rust', category: 'text', uses: 'Rust source.' },
  { ext: 'rb', mime: 'text/x-ruby', category: 'text', uses: 'Ruby source.' },
  { ext: 'php', mime: 'application/x-httpd-php', category: 'text', uses: 'PHP source.' },
  { ext: 'sh', mime: 'application/x-sh', category: 'text', uses: 'Shell scripts.' },
  { ext: 'sql', mime: 'application/sql', category: 'text', uses: 'SQL scripts.' },

  // Application
  { ext: 'pdf', mime: 'application/pdf', category: 'application', uses: 'Portable documents.' },
  { ext: 'zip', mime: 'application/zip', category: 'application', uses: 'Compressed archives.' },
  { ext: 'rar', mime: 'application/vnd.rar', category: 'application', uses: 'Rar archives.' },
  { ext: '7z', mime: 'application/x-7z-compressed', category: 'application', uses: '7-Zip archives.' },
  { ext: 'tar', mime: 'application/x-tar', category: 'application', uses: 'Tar archives.' },
  { ext: 'gz', mime: 'application/gzip', category: 'application', uses: 'Gzip compression.' },
  { ext: 'doc', mime: 'application/msword', category: 'application', uses: 'Legacy Word docs.' },
  { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', category: 'application', uses: 'Word documents.' },
  { ext: 'xls', mime: 'application/vnd.ms-excel', category: 'application', uses: 'Legacy Excel.' },
  { ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', category: 'application', uses: 'Excel spreadsheets.' },
  { ext: 'ppt', mime: 'application/vnd.ms-powerpoint', category: 'application', uses: 'Legacy PowerPoint.' },
  { ext: 'pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', category: 'application', uses: 'PowerPoint decks.' },
  { ext: 'exe', mime: 'application/x-msdownload', category: 'application', uses: 'Windows executables.' },
  { ext: 'msi', mime: 'application/x-msi', category: 'application', uses: 'Windows installers.' },
  { ext: 'dmg', mime: 'application/x-apple-diskimage', category: 'application', uses: 'macOS disk images.' },
  { ext: 'deb', mime: 'application/vnd.debian.binary-package', category: 'application', uses: 'Debian packages.' },
  { ext: 'rpm', mime: 'application/x-rpm', category: 'application', uses: 'RPM packages.' },
  { ext: 'apk', mime: 'application/vnd.android.package-archive', category: 'application', uses: 'Android packages.' },
  { ext: 'jar', mime: 'application/java-archive', category: 'application', uses: 'Java archives.' },
  { ext: 'wasm', mime: 'application/wasm', category: 'application', uses: 'WebAssembly modules.' },
  { ext: 'ttf', mime: 'font/ttf', category: 'application', uses: 'TrueType fonts.' },
  { ext: 'otf', mime: 'font/otf', category: 'application', uses: 'OpenType fonts.' },
  { ext: 'woff', mime: 'font/woff', category: 'application', uses: 'Web fonts.' },
  { ext: 'woff2', mime: 'font/woff2', category: 'application', uses: 'Web fonts (compressed).' },
  { ext: 'epub', mime: 'application/epub+zip', category: 'application', uses: 'E-books.' },
  { ext: 'swf', mime: 'application/x-shockwave-flash', category: 'application', uses: 'Legacy Flash.' },
]

const CATEGORY_COLORS: Record<MimeEntry['category'], string> = {
  image: '#16a34a',
  video: '#dc2626',
  audio: '#9333ea',
  text: '#0891b2',
  application: '#f59e0b',
}

function extractExt(name: string): string {
  const clean = name.trim().toLowerCase()
  const dot = clean.lastIndexOf('.')
  if (dot < 0 || dot === clean.length - 1) return ''
  return clean.slice(dot + 1)
}

function lookup(ext: string): MimeEntry | null {
  if (!ext) return null
  return MIME_MAP.find((m) => m.ext === ext) ?? null
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—'
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const safe = Math.min(i, units.length - 1)
  const v = bytes / Math.pow(1024, safe)
  return `${v.toFixed(safe === 0 ? 0 : 1)} ${units[safe]}`
}

interface FileMeta {
  name: string
  size: number
  lastModified: number
  type: string
}

export default function MimeDetector() {
  const [extension, setExtension] = React.useState('')
  const [file, setFile] = React.useState<FileMeta | null>(null)
  const [dragOver, setDragOver] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFile = (f: File | null | undefined): void => {
    if (!f) return
    if (f.size > 200 * 1024 * 1024) {
      toast.error('File is over 200 MB — please pick a smaller file.')
      return
    }
    setFile({
      name: f.name,
      size: f.size,
      lastModified: f.lastModified,
      type: f.type,
    })
    const ext = extractExt(f.name)
    if (ext) setExtension(ext)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    handleFile(e.target.files?.[0])
  }

  const onDrop = (e: React.DragEvent): void => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const detectedExt = extension.trim().toLowerCase().replace(/^\./, '')
  const entry = lookup(detectedExt)

  const filteredTable = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return MIME_MAP
    return MIME_MAP.filter(
      (m) =>
        m.ext.includes(q) ||
        m.mime.toLowerCase().includes(q) ||
        m.category.includes(q)
    )
  }, [search])

  const matchesFileType =
    file && entry ? file.type === entry.mime || file.type === '' : true

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>MIME Type Detector</CardTitle>
          <CardDescription>
            Detect MIME types from a file extension or an uploaded file. The
            reference table covers {MIME_MAP.length} common extensions across
            image, video, audio, text, and application categories.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="File extension"
            htmlFor="md-ext"
            hint="with or without the leading dot"
          >
            <Input
              id="md-ext"
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              placeholder="pdf, .png, mp4…"
              aria-label="File extension"
            />
          </Field>

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
            >
              <FileText className="size-3.5" />
              Choose a file
            </Button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={onInputChange}
              aria-label="Upload a file"
            />
            {file ? (
              <p className="mt-1 text-xs text-foreground">
                Loaded: <strong>{file.name}</strong>
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detection result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!detectedExt ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              Enter an extension or upload a file to detect its MIME type.
            </div>
          ) : !entry ? (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400">
              No MIME entry found for{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                .{detectedExt}
              </code>
              . It may be an uncommon or proprietary format.
            </div>
          ) : (
            <div className="space-y-4" role="status" aria-live="polite">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Stat
                  label="Extension"
                  value={`.${entry.ext}`}
                  accent={CATEGORY_COLORS[entry.category]}
                />
                <Stat label="MIME type" value={entry.mime} />
                <Stat
                  label="Category"
                  value={entry.category}
                  accent={CATEGORY_COLORS[entry.category]}
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Common uses
                </div>
                <p className="mt-1 text-sm">{entry.uses}</p>
              </div>
            </div>
          )}

          {file ? (
            <>
              <Separator />
              <div>
                <div className="mb-2 text-sm font-medium text-foreground">
                  Uploaded file metadata
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Stat label="File name" value={file.name} />
                  <Stat label="Size" value={formatBytes(file.size)} />
                  <Stat
                    label="Actual type (file.type)"
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
                {entry && file.type && !matchesFileType ? (
                  <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
                    <strong>Mismatch:</strong> the browser reports{' '}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                      {file.type}
                    </code>{' '}
                    but the extension <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.{entry.ext}</code> usually maps to{' '}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                      {entry.mime}
                    </code>
                    . The file may have been renamed.
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Extension reference</CardTitle>
          <CardDescription>
            Searchable list of all {MIME_MAP.length} extensions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search extension, MIME, or category…"
              className="pl-9"
              aria-label="Search extensions"
            />
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            <ScrollArea className="max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Ext</TableHead>
                    <TableHead>MIME type</TableHead>
                    <TableHead className="w-28">Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTable.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground"
                      >
                        No matches.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTable.map((m) => (
                      <TableRow key={`${m.ext}-${m.mime}`}>
                        <TableCell className="font-mono text-xs">
                          .{m.ext}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {m.mime}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            style={{ color: CATEGORY_COLORS[m.category] }}
                          >
                            {m.category}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: click a row&apos;s extension in the reference table is not
            wired here — type the extension in the field above for full
            detection.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
