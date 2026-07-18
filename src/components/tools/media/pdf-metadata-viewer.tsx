'use client'

import * as React from 'react'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'sonner'
import { Info, Loader2, Lock, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Field, Stat } from '@/lib/tools/tool-ui'

interface PageSize {
  index: number
  widthPt: number
  heightPt: number
  rotation: number
}

interface Meta {
  title: string
  author: string
  subject: string
  keywords: string
  creator: string
  producer: string
  creationDate: string | null
  modificationDate: string | null
}

interface InspectResult {
  fileName: string
  fileSize: number
  pageCount: number
  pages: PageSize[]
  metadata: Meta
  isEncrypted: boolean
}

function formatBytes(b: number): string {
  if (!Number.isFinite(b) || b < 0) return '—'
  if (b === 0) return '0 B'
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}

function ptToMm(pt: number): number {
  return (pt * 25.4) / 72
}

function ptToIn(pt: number): number {
  return pt / 72
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export default function PdfMetadataViewer() {
  const [file, setFile] = React.useState<File | null>(null)
  const [result, setResult] = React.useState<InspectResult | null>(null)
  const [encrypted, setEncrypted] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const loadFile = async (f: File): Promise<void> => {
    setLoading(true)
    setResult(null)
    setEncrypted(false)
    try {
      const bytes = await f.arrayBuffer()
      // First try strict load (catches encrypted PDFs).
      let pdf: PDFDocument
      try {
        pdf = await PDFDocument.load(bytes, { ignoreEncryption: false })
      } catch (innerErr) {
        const innerMsg = innerErr instanceof Error ? innerErr.message : ''
        if (/encrypt|password/i.test(innerMsg)) {
          setFile(f)
          setEncrypted(true)
          return
        }
        throw innerErr
      }
      const pages = pdf.getPages()
      const pageSizeList: PageSize[] = pages.map((page, idx) => {
        const { width, height } = page.getSize()
        return {
          index: idx,
          widthPt: Math.round(width * 1000) / 1000,
          heightPt: Math.round(height * 1000) / 1000,
          rotation: page.getRotation().angle,
        }
      })
      const meta: Meta = {
        title: pdf.getTitle() ?? '',
        author: pdf.getAuthor() ?? '',
        subject: pdf.getSubject() ?? '',
        keywords: pdf.getKeywords() ?? '',
        creator: pdf.getCreator() ?? '',
        producer: pdf.getProducer() ?? '',
        creationDate: pdf.getCreationDate()?.toISOString() ?? null,
        modificationDate: pdf.getModificationDate()?.toISOString() ?? null,
      }
      setFile(f)
      setResult({
        fileName: f.name,
        fileSize: f.size,
        pageCount: pages.length,
        pages: pageSizeList,
        metadata: meta,
        isEncrypted: false,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (/encrypt|password/i.test(message)) {
        setFile(f)
        setEncrypted(true)
      } else {
        toast.error(`Could not read PDF: ${message}`)
        setFile(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const f = e.target.files?.[0]
    if (f) void loadFile(f)
    e.target.value = ''
  }

  const metaRows: ReadonlyArray<readonly [string, string]> = result
    ? [
        ['Title', result.metadata.title],
        ['Author', result.metadata.author],
        ['Subject', result.metadata.subject],
        ['Keywords', result.metadata.keywords],
        ['Creator', result.metadata.creator],
        ['Producer', result.metadata.producer],
        ['Created', fmtDate(result.metadata.creationDate)],
        ['Modified', fmtDate(result.metadata.modificationDate)],
      ]
    : []

  return (
    <div className="space-y-5">
      <Field label="Source PDF">
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const f = e.dataTransfer.files?.[0]
            if (f) void loadFile(f)
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={onInputChange}
          />
          <Button
            type="button"
            className="bg-primary text-primary-foreground"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {loading ? 'Inspecting…' : 'Choose PDF'}
          </Button>
          <p className="text-xs text-muted-foreground">
            {file ? (
              <>
                <strong>{file.name}</strong> · {formatBytes(file.size)}
              </>
            ) : (
              'Drop a PDF here or click to choose.'
            )}
          </p>
        </div>
      </Field>

      {encrypted ? (
        <Alert>
          <Lock className="size-4" />
          <AlertTitle>Password-protected</AlertTitle>
          <AlertDescription>
            This PDF is encrypted and <code className="font-mono">pdf-lib</code>
            cannot inspect it without the password. Remove the password (e.g.
            with <code className="font-mono">qpdf --decrypt</code>) and try
            again.
          </AlertDescription>
        </Alert>
      ) : null}

      {result ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Pages" value={result.pageCount} />
            <Stat label="File size" value={formatBytes(result.fileSize)} />
            <Stat
              label="Encrypted"
              value={result.isEncrypted ? 'yes' : 'no'}
              accent={result.isEncrypted ? 'oklch(0.62 0.17 25)' : 'oklch(0.62 0.17 150)'}
            />
            <Stat
              label="Has metadata"
              value={
                result.metadata.title ||
                result.metadata.author ||
                result.metadata.creator ||
                result.metadata.producer
                  ? 'yes'
                  : 'no'
              }
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Document info</CardTitle>
              <CardDescription>
                Standard PDF dictionary entries from the document catalogue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-2 sm:grid-cols-2">
                {metaRows.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-md border border-border bg-muted/30 p-3"
                  >
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-0.5 break-words font-mono text-sm">
                      {value || (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Page sizes</CardTitle>
              <CardDescription>
                Dimensions per page in points, millimetres, and inches.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="fl-scroll max-h-96 rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>Width (pt)</TableHead>
                      <TableHead>Height (pt)</TableHead>
                      <TableHead>mm</TableHead>
                      <TableHead>in</TableHead>
                      <TableHead className="text-right">Rotation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.pages.map((p) => (
                      <TableRow key={p.index}>
                        <TableCell className="font-mono">{p.index + 1}</TableCell>
                        <TableCell className="font-mono tabular-nums">
                          {p.widthPt}
                        </TableCell>
                        <TableCell className="font-mono tabular-nums">
                          {p.heightPt}
                        </TableCell>
                        <TableCell className="font-mono tabular-nums text-muted-foreground">
                          {ptToMm(p.widthPt).toFixed(1)} ×{' '}
                          {ptToMm(p.heightPt).toFixed(1)}
                        </TableCell>
                        <TableCell className="font-mono tabular-nums text-muted-foreground">
                          {ptToIn(p.widthPt).toFixed(2)} ×{' '}
                          {ptToIn(p.heightPt).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {p.rotation}°
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          <Alert>
            <Info className="size-4" />
            <AlertTitle>About PDF units</AlertTitle>
            <AlertDescription>
              <p className="text-sm">
                PDFs use <strong>points</strong> (1 pt = 1/72 inch).{' '}
                <code className="font-mono">25.4 mm = 72 pt</code>. The
                dimensions shown are the page&apos;s <em>media box</em> before
                rotation; the rotation column shows how the page is
                pre-rotated in the source file.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline">pdf-lib v1.17</Badge>
                <Badge variant="outline">client-side</Badge>
              </div>
            </AlertDescription>
          </Alert>
        </>
      ) : null}
    </div>
  )
}
