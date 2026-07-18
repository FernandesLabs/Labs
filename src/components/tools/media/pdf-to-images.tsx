'use client'

import * as React from 'react'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'sonner'
import { Download, FileJson, Loader2, Upload, ImageIcon, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'

interface PageSize {
  index: number
  widthPt: number
  heightPt: number
  rotation: number
}

interface ReportData {
  fileName: string
  fileSize: number
  pageCount: number
  pages: PageSize[]
  metadata: {
    title: string
    author: string
    subject: string
    keywords: string
    creator: string
    producer: string
    creationDate: string | null
    modificationDate: string | null
  }
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

function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, '') || 'document'
}

export default function PdfToImages() {
  const [file, setFile] = React.useState<File | null>(null)
  const [report, setReport] = React.useState<ReportData | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [rendering, setRendering] = React.useState(false)
  const [images, setImages] = React.useState<string[]>([])
  const [scale, setScale] = React.useState(1.5)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const pdfBytesRef = React.useRef<ArrayBuffer | null>(null)

  const loadFile = async (f: File): Promise<void> => {
    setLoading(true)
    setReport(null)
    setImages([])
    try {
      const bytes = await f.arrayBuffer()
      pdfBytesRef.current = bytes
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
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
      const data: ReportData = {
        fileName: f.name,
        fileSize: f.size,
        pageCount: pages.length,
        pages: pageSizeList,
        metadata: {
          title: pdf.getTitle() ?? '',
          author: pdf.getAuthor() ?? '',
          subject: pdf.getSubject() ?? '',
          keywords: pdf.getKeywords() ?? '',
          creator: pdf.getCreator() ?? '',
          producer: pdf.getProducer() ?? '',
          creationDate: pdf.getCreationDate()
            ? pdf.getCreationDate()!.toISOString()
            : null,
          modificationDate: pdf.getModificationDate()
            ? pdf.getModificationDate()!.toISOString()
            : null,
        },
      }
      setFile(f)
      setReport(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (/encrypt|password/i.test(message)) {
        toast.error('This PDF is password-protected and cannot be inspected.')
      } else {
        toast.error(`Could not read PDF: ${message}`)
      }
      setFile(null)
      setReport(null)
    } finally {
      setLoading(false)
    }
  }

  const renderImages = async (): Promise<void> => {
    if (!pdfBytesRef.current || !report) return
    if (report.pageCount > 50) {
      toast.error('Too many pages to render (max 50). Try a smaller PDF.')
      return
    }
    setRendering(true)
    setImages([])
    try {
      // Dynamically import pdfjs-dist (keeps it out of the initial bundle)
      const pdfjs = await import('pdfjs-dist')
      // Set the worker source — use a CDN-less approach via the bundled worker
      // pdfjs-dist v6 ships a worker entry; we reference it via the version.
      // Use the locally-bundled worker (copied to /public) for offline reliability.
      // The worker version must match the pdfjs-dist package version.
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

      const loadingTask = pdfjs.getDocument({
        data: pdfBytesRef.current.slice(0),
      })
      const pdf = await loadingTask
      const rendered: string[] = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        const ctx = canvas.getContext('2d')
        if (!ctx) continue
        await page.render({
          canvasContext: ctx,
          viewport,
          canvas,
        } as Parameters<typeof page.render>[0]).promise
        rendered.push(canvas.toDataURL('image/png'))
      }
      setImages(rendered)
      toast.success(`Rendered ${rendered.length} page${rendered.length === 1 ? '' : 's'}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (/encrypt|password/i.test(message)) {
        toast.error('This PDF is password-protected and cannot be rendered.')
      } else {
        toast.error(`Rendering failed: ${message}`)
      }
    } finally {
      setRendering(false)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const f = e.target.files?.[0]
    if (f) void loadFile(f)
    e.target.value = ''
  }

  const downloadReport = (): void => {
    if (!report) {
      toast.error('Load a PDF first')
      return
    }
    const text = JSON.stringify(report, null, 2)
    downloadBlob(
      new Blob([text], { type: 'application/json' }),
      `${baseName(report.fileName)}-structure.json`
    )
    toast.success('Structure report downloaded')
  }

  const downloadImage = (dataUrl: string, index: number): void => {
    const base = report ? baseName(report.fileName) : 'page'
    fetch(dataUrl)
      .then((r) => r.blob())
      .then((blob) => {
        downloadBlob(blob, `${base}-page-${index + 1}.png`)
        toast.success(`Downloaded page ${index + 1}`)
      })
  }

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
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {loading ? 'Reading…' : 'Choose PDF'}
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

      {report ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Pages" value={report.pageCount} />
            <Stat label="File size" value={formatBytes(report.fileSize)} />
            <Stat
              label="First page"
              value={`${report.pages[0]?.widthPt ?? 0}×${report.pages[0]?.heightPt ?? 0}pt`}
            />
            <Stat
              label="Has metadata"
              value={
                report.metadata.title ||
                report.metadata.author ||
                report.metadata.creator
                  ? 'yes'
                  : 'no'
              }
            />
          </div>

          <Tabs defaultValue="render">
            <TabsList>
              <TabsTrigger value="render">
                <ImageIcon className="size-3.5" />
                Render to images
              </TabsTrigger>
              <TabsTrigger value="inspect">
                <Settings2 className="size-3.5" />
                Inspect structure
              </TabsTrigger>
            </TabsList>

            <TabsContent value="render" className="space-y-4">
              <Alert>
                <ImageIcon className="size-4" />
                <AlertTitle>PDF rendering</AlertTitle>
                <AlertDescription>
                  Render each PDF page to a PNG image using pdf.js. Pages render
                  at the selected scale — higher scale = sharper but slower and
                  larger files. Max 50 pages.
                </AlertDescription>
              </Alert>

              <Field
                label="Render scale"
                hint={`${scale.toFixed(1)}× (${Math.round(
                  scale * 100
                )}% of original)`}
              >
                <div className="flex items-center gap-4">
                  <Slider
                    value={[scale]}
                    onValueChange={(v) => setScale(v[0])}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={renderImages}
                    disabled={rendering || !report}
                  >
                    {rendering ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ImageIcon className="size-4" />
                    )}
                    {rendering
                      ? `Rendering… (${images.length}/${report.pageCount})`
                      : 'Render pages'}
                  </Button>
                </div>
              </Field>

              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {images.map((dataUrl, i) => (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-lg border border-border bg-muted/30"
                    >
                      <img
                        src={dataUrl}
                        alt={`Page ${i + 1}`}
                        className="w-full"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 opacity-0 transition group-hover:opacity-100">
                        <span className="text-xs font-medium text-white">
                          Page {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => downloadImage(dataUrl, i)}
                          className="rounded p-1 text-white transition hover:bg-white/20"
                          aria-label={`Download page ${i + 1}`}
                        >
                          <Download className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value="inspect" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Page sizes</CardTitle>
                  <CardDescription>
                    Each page&apos;s width × height in points, millimetres, and
                    inches.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="fl-scroll max-h-80 rounded-lg border border-border">
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
                        {report.pages.map((p) => (
                          <TableRow key={p.index}>
                            <TableCell className="font-mono">
                              {p.index + 1}
                            </TableCell>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Metadata</CardTitle>
                  <CardDescription>
                    Embedded document metadata, if any.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-2 sm:grid-cols-2">
                    {(
                      [
                        ['Title', report.metadata.title],
                        ['Author', report.metadata.author],
                        ['Subject', report.metadata.subject],
                        ['Keywords', report.metadata.keywords],
                        ['Creator', report.metadata.creator],
                        ['Producer', report.metadata.producer],
                        [
                          'Created',
                          report.metadata.creationDate
                            ? new Date(
                                report.metadata.creationDate
                              ).toLocaleString()
                            : '—',
                        ],
                        [
                          'Modified',
                          report.metadata.modificationDate
                            ? new Date(
                                report.metadata.modificationDate
                              ).toLocaleString()
                            : '—',
                        ],
                      ] as const
                    ).map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-md border border-border bg-muted/30 p-2"
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

              <Button
                type="button"
                variant="outline"
                onClick={downloadReport}
              >
                <FileJson className="size-4" />
                Download JSON report
              </Button>
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </div>
  )
}
