'use client'

import * as React from 'react'
import {
  Upload,
  Image as ImageIcon,
  MapPin,
  AlertTriangle,
  Loader2,
  Camera,
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
/*  EXIF parser (manual, JPEG/TIFF)                                    */
/* ------------------------------------------------------------------ */

const TYPE_SIZES: Record<number, number> = {
  1: 1, // BYTE
  2: 1, // ASCII
  3: 2, // SHORT
  4: 4, // LONG
  5: 8, // RATIONAL (2x LONG)
  7: 1, // UNDEFINED
  9: 4, // SLONG
  10: 8, // SRATIONAL (2x SLONG)
}

interface Reader {
  data: DataView
  little: boolean
  tiffStart: number
}

interface IfdEntry {
  tag: number
  type: number
  count: number
  valueOffset: number
  /** Absolute byte offset of this entry inside the underlying ArrayBuffer. */
  entryAbs: number
}

function readUint(r: Reader, offset: number, bytes: number): number {
  if (bytes === 2) return r.data.getUint16(offset, r.little)
  if (bytes === 4) return r.data.getUint32(offset, r.little)
  if (bytes === 1) return r.data.getUint8(offset)
  return 0
}

// Tag-name maps for IFD0, Exif sub-IFD, and GPS IFD.
const IFD0_TAGS: Record<number, string> = {
  0x010e: 'ImageDescription',
  0x010f: 'Make',
  0x0110: 'Model',
  0x0112: 'Orientation',
  0x011a: 'XResolution',
  0x011b: 'YResolution',
  0x0128: 'ResolutionUnit',
  0x0131: 'Software',
  0x0132: 'DateTime',
  0x013b: 'Artist',
  0x013e: 'WhitePoint',
  0x8298: 'Copyright',
  0x8769: 'ExifOffset',
  0x8825: 'GPSInfo',
}

const EXIF_TAGS: Record<number, string> = {
  0x829a: 'ExposureTime',
  0x829d: 'FNumber',
  0x8822: 'ExposureProgram',
  0x8827: 'ISOSpeedRatings',
  0x8830: 'SensitivityType',
  0x9000: 'ExifVersion',
  0x9003: 'DateTimeOriginal',
  0x9004: 'DateTimeDigitized',
  0x9101: 'ComponentsConfiguration',
  0x9102: 'CompressedBitsPerPixel',
  0x9201: 'ShutterSpeedValue',
  0x9202: 'ApertureValue',
  0x9203: 'BrightnessValue',
  0x9204: 'ExposureBiasValue',
  0x9205: 'MaxApertureValue',
  0x9206: 'SubjectDistance',
  0x9207: 'MeteringMode',
  0x9208: 'LightSource',
  0x9209: 'Flash',
  0x920a: 'FocalLength',
  0x9214: 'SubjectArea',
  0x9290: 'SubSecTime',
  0x9291: 'SubSecTimeOriginal',
  0x9292: 'SubSecTimeDigitized',
  0xa000: 'FlashpixVersion',
  0xa001: 'ColorSpace',
  0xa002: 'ExifImageWidth',
  0xa003: 'ExifImageHeight',
  0xa004: 'RelatedSoundFile',
  0xa005: 'InteroperabilityOffset',
  0xa20b: 'FlashEnergy',
  0xa20c: 'SpatialFrequencyResponse',
  0xa20e: 'FocalPlaneXResolution',
  0xa20f: 'FocalPlaneYResolution',
  0xa210: 'FocalPlaneResolutionUnit',
  0xa214: 'SubjectLocation',
  0xa215: 'ExposureIndex',
  0xa217: 'SensingMethod',
  0xa300: 'FileSource',
  0xa301: 'SceneType',
  0xa302: 'CFAPattern',
  0xa401: 'CustomRendered',
  0xa402: 'ExposureMode',
  0xa403: 'WhiteBalance',
  0xa404: 'DigitalZoomRatio',
  0xa405: 'FocalLengthIn35mmFilm',
  0xa406: 'SceneCaptureType',
  0xa407: 'GainControl',
  0xa408: 'Contrast',
  0xa409: 'Saturation',
  0xa40a: 'Sharpness',
  0xa40b: 'DeviceSettingDescription',
  0xa40c: 'SubjectDistanceRange',
  0xa420: 'ImageUniqueID',
  0xa430: 'CameraOwnerName',
  0xa431: 'BodySerialNumber',
  0xa432: 'LensSpecification',
  0xa433: 'LensMake',
  0xa434: 'LensModel',
  0xa435: 'LensSerialNumber',
}

const GPS_TAGS: Record<number, string> = {
  0x0001: 'GPSLatitudeRef',
  0x0002: 'GPSLatitude',
  0x0003: 'GPSLongitudeRef',
  0x0004: 'GPSLongitude',
  0x0005: 'GPSAltitudeRef',
  0x0006: 'GPSAltitude',
  0x0007: 'GPSTimeStamp',
  0x0008: 'GPSSatellites',
  0x0009: 'GPSStatus',
  0x000a: 'GPSMeasureMode',
  0x000b: 'GPSDOP',
  0x000c: 'GPSSpeedRef',
  0x000d: 'GPSSpeed',
  0x000e: 'GPSTrackRef',
  0x000f: 'GPSTrack',
  0x0010: 'GPSImgDirectionRef',
  0x0011: 'GPSImgDirection',
  0x0012: 'GPSMapDatum',
  0x0013: 'GPSDestLatitudeRef',
  0x0014: 'GPSDestLatitude',
  0x0015: 'GPSDestLongitudeRef',
  0x0016: 'GPSDestLongitude',
  0x0017: 'GPSDestBearingRef',
  0x0018: 'GPSDestBearing',
  0x0019: 'GPSDestDistanceRef',
  0x001a: 'GPSDestDistance',
  0x001b: 'GPSProcessingMethod',
  0x001c: 'GPSAreaInformation',
  0x001d: 'GPSDateStamp',
  0x001e: 'GPSDifferential',
}

const NAME_MAP: Record<number, string> = {
  ...IFD0_TAGS,
  ...EXIF_TAGS,
  ...GPS_TAGS,
}

interface ExifTag {
  tag: number
  name: string
  value: string
}

interface ParsedExif {
  tags: ExifTag[]
  gps: { lat: number; lon: number } | null
}

function parseExif(buffer: ArrayBuffer): ParsedExif | null {
  const data = new DataView(buffer)
  if (data.byteLength < 4) return null
  // Expect JPEG SOI (FF D8).
  if (!(data.getUint8(0) === 0xff && data.getUint8(1) === 0xd8)) return null
  let pos = 2
  while (pos + 4 <= data.byteLength) {
    if (data.getUint8(pos) !== 0xff) break
    const marker = data.getUint8(pos + 1)
    if (
      (marker >= 0xd0 && marker <= 0xd9) ||
      marker === 0x01 ||
      marker === 0x00
    ) {
      pos += 2
      continue
    }
    const length = data.getUint16(pos + 2, false)
    if (marker === 0xe1) {
      // APP1 — check for "Exif\0\0"
      const exifId = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00] // E x i f \0 \0
      let ok = true
      for (let i = 0; i < exifId.length; i++) {
        if (data.getUint8(pos + 4 + i) !== exifId[i]) {
          ok = false
          break
        }
      }
      if (ok) {
        const tiffStart = pos + 4 + 6
        return parseTiff(data, tiffStart)
      }
    }
    pos += 2 + length
  }
  return null
}

function parseTiff(data: DataView, tiffStart: number): ParsedExif | null {
  if (tiffStart + 8 > data.byteLength) return null
  const bo = data.getUint16(tiffStart, false)
  let little = true
  if (bo === 0x4949) little = true
  else if (bo === 0x4d4d) little = false
  else return null
  const magic = data.getUint16(tiffStart + 2, little)
  if (magic !== 0x002a) return null
  const ifd0Offset = data.getUint32(tiffStart + 4, little)
  const r: Reader = { data, little, tiffStart }
  const tags: ExifTag[] = []
  let gpsInfoOffset = 0
  let exifOffset = 0

  const ifd0 = parseIfdAt(r, ifd0Offset)
  for (const entry of ifd0) {
    if (entry.tag === 0x8769) {
      exifOffset = data.getUint32(entry.entryAbs + 8, little)
      continue
    }
    if (entry.tag === 0x8825) {
      gpsInfoOffset = data.getUint32(entry.entryAbs + 8, little)
      continue
    }
    pushTag(r, entry, tags)
  }

  if (exifOffset > 0) {
    const exifIfd = parseIfdAt(r, exifOffset)
    for (const entry of exifIfd) pushTag(r, entry, tags)
  }

  let gps: { lat: number; lon: number } | null = null
  if (gpsInfoOffset > 0) {
    const gpsIfd = parseIfdAt(r, gpsInfoOffset)
    let latRef = ''
    let lat: number[] = []
    let lonRef = ''
    let lon: number[] = []
    for (const entry of gpsIfd) {
      const name = NAME_MAP[entry.tag] ?? `Tag_0x${entry.tag.toString(16).padStart(4, '0')}`
      const value = readEntryValue(r, entry)
      tags.push({ tag: entry.tag, name, value })
      if (entry.tag === 0x0001) latRef = value.trim()
      if (entry.tag === 0x0002) lat = readRationals(r, entry)
      if (entry.tag === 0x0003) lonRef = value.trim()
      if (entry.tag === 0x0004) lon = readRationals(r, entry)
    }
    if (lat.length === 3 && lon.length === 3) {
      const latDec = dmsToDecimal(lat, latRef === 'S')
      const lonDec = dmsToDecimal(lon, lonRef === 'W')
      if (Number.isFinite(latDec) && Number.isFinite(lonDec)) {
        gps = { lat: latDec, lon: lonDec }
      }
    }
  }
  return { tags, gps }
}

function parseIfdAt(r: Reader, ifdOffset: number): IfdEntry[] {
  const abs = r.tiffStart + ifdOffset
  if (abs + 2 > r.data.byteLength) return []
  const count = r.data.getUint16(abs, r.little)
  const out: IfdEntry[] = []
  for (let i = 0; i < count; i++) {
    const entryAbs = abs + 2 + i * 12
    if (entryAbs + 12 > r.data.byteLength) break
    const tag = r.data.getUint16(entryAbs, r.little)
    const type = r.data.getUint16(entryAbs + 2, r.little)
    const cnt = r.data.getUint32(entryAbs + 4, r.little)
    const valueOffset = r.data.getUint32(entryAbs + 8, r.little)
    out.push({ tag, type, count: cnt, valueOffset, entryAbs })
  }
  return out
}

function pushTag(r: Reader, entry: IfdEntry, tags: ExifTag[]): void {
  const name = NAME_MAP[entry.tag] ?? `Tag_0x${entry.tag.toString(16).padStart(4, '0')}`
  const value = readEntryValue(r, entry)
  tags.push({ tag: entry.tag, name, value })
}

function readEntryValue(r: Reader, entry: IfdEntry): string {
  const typeSize = TYPE_SIZES[entry.type] ?? 1
  const totalBytes = entry.count * typeSize

  // Determine where the value bytes live.
  let valueAbs: number
  if (totalBytes <= 4) {
    valueAbs = entry.entryAbs + 8
  } else {
    valueAbs = r.tiffStart + entry.valueOffset
  }

  // ASCII
  if (entry.type === 2) {
    let s = ''
    for (let i = 0; i < entry.count; i++) {
      if (valueAbs + i >= r.data.byteLength) break
      const b = r.data.getUint8(valueAbs + i)
      if (b === 0) break
      s += b >= 32 && b < 127 ? String.fromCharCode(b) : '·'
    }
    return s
  }

  // BYTE / UNDEFINED
  if (entry.type === 1 || entry.type === 7) {
    const parts: string[] = []
    for (let i = 0; i < entry.count; i++) {
      parts.push(String(r.data.getUint8(valueAbs + i)))
    }
    return parts.join(', ')
  }

  // SHORT
  if (entry.type === 3) {
    const parts: string[] = []
    for (let i = 0; i < entry.count; i++) {
      parts.push(String(r.data.getUint16(valueAbs + i * 2, r.little)))
    }
    return parts.join(', ')
  }

  // LONG
  if (entry.type === 4) {
    const parts: string[] = []
    for (let i = 0; i < entry.count; i++) {
      parts.push(String(r.data.getUint32(valueAbs + i * 4, r.little)))
    }
    return parts.join(', ')
  }

  // RATIONAL / SRATIONAL
  if (entry.type === 5 || entry.type === 10) {
    const isSigned = entry.type === 10
    const parts: string[] = []
    for (let i = 0; i < entry.count; i++) {
      const num = isSigned
        ? r.data.getInt32(valueAbs + i * 8, r.little)
        : r.data.getUint32(valueAbs + i * 8, r.little)
      const den = isSigned
        ? r.data.getInt32(valueAbs + i * 8 + 4, r.little)
        : r.data.getUint32(valueAbs + i * 8 + 4, r.little)
      if (den === 0 || den === 1) parts.push(`${num}`)
      else {
        const v = num / den
        parts.push(`${num}/${den} (${v.toFixed(v < 10 ? 3 : 1)})`)
      }
    }
    return parts.join(', ')
  }

  // SLONG
  if (entry.type === 9) {
    const parts: string[] = []
    for (let i = 0; i < entry.count; i++) {
      parts.push(String(r.data.getInt32(valueAbs + i * 4, r.little)))
    }
    return parts.join(', ')
  }

  return ''
}

function readRationals(r: Reader, entry: IfdEntry): number[] {
  const typeSize = TYPE_SIZES[entry.type] ?? 1
  const totalBytes = entry.count * typeSize
  let abs: number
  if (totalBytes <= 4) {
    abs = entry.entryAbs + 8
  } else {
    abs = r.tiffStart + entry.valueOffset
  }
  const out: number[] = []
  for (let i = 0; i < entry.count; i++) {
    if (abs + i * 8 + 8 > r.data.byteLength) break
    const num = r.data.getUint32(abs + i * 8, r.little)
    const den = r.data.getUint32(abs + i * 8 + 4, r.little)
    out.push(den === 0 ? num : num / den)
  }
  return out
}

function dmsToDecimal(dms: number[], negative: boolean): number {
  if (dms.length < 3) return NaN
  const dec = dms[0] + dms[1] / 60 + dms[2] / 3600
  return negative ? -dec : dec
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

interface FileMeta {
  name: string
  size: number
  type: string
  lastModified: number
}

interface Dimensions {
  width: number
  height: number
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ImageMetadataViewer() {
  const [file, setFile] = React.useState<FileMeta | null>(null)
  const [exif, setExif] = React.useState<ParsedExif | null>(null)
  const [exifError, setExifError] = React.useState<string | null>(null)
  const [dimensions, setDimensions] = React.useState<Dimensions | null>(null)
  const [reading, setReading] = React.useState(false)
  const [dragOver, setDragOver] = React.useState(false)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const objectUrlRef = React.useRef<string | null>(null)

  // Revoke any object URL on unmount.
  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  const handleFile = async (f: File | null | undefined): Promise<void> => {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      toast.error('Please pick an image file.')
      return
    }
    if (f.size > 100 * 1024 * 1024) {
      toast.error('Image is over 100 MB — please pick a smaller image.')
      return
    }
    setFile({
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
    })
    setReading(true)
    setExif(null)
    setExifError(null)
    setDimensions(null)

    // Revoke previous preview URL.
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    const url = URL.createObjectURL(f)
    objectUrlRef.current = url
    setPreviewUrl(url)

    // Load natural dimensions via an Image element.
    const img = new Image()
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      setExifError('Could not load image dimensions.')
    }
    img.src = url

    try {
      const buf = await f.arrayBuffer()
      const parsed = parseExif(buf)
      if (parsed) {
        setExif(parsed)
      } else if (f.type === 'image/jpeg') {
        setExifError('No EXIF data found in this JPEG.')
      } else {
        setExifError('No EXIF data found in this image.')
      }
    } catch {
      setExifError('Could not read the image file.')
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

  const gpsLink = React.useMemo(() => {
    if (!exif?.gps) return null
    const { lat, lon } = exif.gps
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`
  }, [exif])

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Image Metadata Viewer</CardTitle>
          <CardDescription>
            Parse EXIF metadata from JPEG images manually — reads the APP1
            segment and walks the IFD0, Exif sub-IFD, and GPS IFD entries
            to extract camera make/model, exposure settings, dates, and GPS
            coordinates. Image dimensions are read via the browser&apos;s
            Image loader. All processing is client-side.
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
              Drag &amp; drop an image here, or
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
                <ImageIcon className="size-3.5" />
              )}
              {reading ? 'Reading…' : 'Choose an image'}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onInputChange}
              aria-label="Upload an image to inspect"
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
            <CardTitle className="text-base">Image info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              role="status"
              aria-live="polite"
            >
              <Stat label="File name" value={file.name} />
              <Stat label="Size" value={formatBytes(file.size)} />
              <Stat label="Type" value={file.type || '— (unknown)'} />
              <Stat
                label="Dimensions"
                value={
                  dimensions
                    ? `${dimensions.width} × ${dimensions.height}`
                    : reading ? '…' : '—'
                }
              />
            </div>

            {previewUrl ? (
              <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
                <img
                  src={previewUrl}
                  alt={`Preview of ${file.name}`}
                  className="mx-auto max-h-64 object-contain"
                />
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">EXIF metadata</CardTitle>
          <CardDescription>
            {reading
              ? 'Reading EXIF…'
              : exif && exif.tags.length > 0
                ? `${exif.tags.length} tag(s) found.`
                : 'Upload a JPEG image to extract EXIF data.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              No image loaded yet.
            </div>
          ) : exifError ? (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>
                <div className="font-medium">{exifError}</div>
                <div className="mt-1 text-xs">
                  PNG, WebP, GIF, and BMP images typically do not carry EXIF
                  data. Only JPEG files (with an APP1/Exif segment) are
                  supported by this parser.
                </div>
              </div>
            </div>
          ) : exif && exif.tags.length > 0 ? (
            <div className="space-y-3">
              <Field label="EXIF tags" htmlFor="im-table">
                <div className="overflow-hidden rounded-lg border border-border">
                  <ScrollArea className="max-h-96">
                    <Table id="im-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-52">Tag</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exif.tags.map((t) => (
                          <TableRow key={t.tag}>
                            <TableCell className="font-mono text-[11px]">
                              {t.name}
                            </TableCell>
                            <TableCell className="font-mono text-[11px] break-all">
                              {t.value || '(empty)'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </Field>

              {gpsLink ? (
                <>
                  <Separator />
                  <div className="flex items-start gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
                    <MapPin className="mt-0.5 size-4 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium">GPS location found</div>
                      <div className="text-xs">
                        Latitude {exif.gps?.lat.toFixed(6)}, longitude{' '}
                        {exif.gps?.lon.toFixed(6)}
                      </div>
                      <a
                        href={gpsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium underline underline-offset-2"
                      >
                        <MapPin className="size-3" />
                        Open in OpenStreetMap
                      </a>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              No EXIF data found in this image.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Camera className="size-4" />
            About EXIF
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • EXIF (Exchangeable Image File Format) stores camera and
              shot metadata inside JPEG/TIFF files — make, model, lens,
              exposure time, f-number, ISO, focal length, GPS coordinates,
              orientation, and more.
            </li>
            <li>
              • This parser walks the IFD0, Exif sub-IFD, and GPS IFD
              entries. Each tag is rendered with its friendly name (when
              known) and its value. RATIONAL tags show both the fraction
              and its decimal approximation.
            </li>
            <li>
              • GPS coordinates are converted from degrees/minutes/seconds
              to decimal and linked to OpenStreetMap.
            </li>
            <li>
              • Images that have been re-saved through tools that strip
              metadata (e.g. most social media platforms) will show
              &ldquo;No EXIF data found.&rdquo;
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">JPEG</Badge>
        <Badge variant="secondary">EXIF / IFD0 / Exif IFD / GPS IFD</Badge>
        <Badge variant="secondary">Client-side parsing</Badge>
      </div>
    </div>
  )
}
