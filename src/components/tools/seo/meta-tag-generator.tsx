'use client'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Field, ResultBox } from '@/lib/tools/tool-ui'
type OgType = 'website' | 'article' | 'product' | 'profile'
const OG_TYPES: { value: OgType; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'article', label: 'Article' },
  { value: 'product', label: 'Product' },
  { value: 'profile', label: 'Profile' },
]
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
function buildMetaTags(input: {
  title: string
  description: string
  keywords: string
  canonical: string
  ogImage: string
  twitterHandle: string
  ogType: OgType
}): string {
  const { title, description, keywords, canonical, ogImage, twitterHandle, ogType } =
    input
  const lines: string[] = []
  if (title) lines.push(`<title>${esc(title)}</title>`)
  if (description) {
    lines.push(`<meta name="description" content="${esc(description)}" />`)
  }
  if (keywords) {
    lines.push(`<meta name="keywords" content="${esc(keywords)}" />`)
  }
  if (canonical) {
    lines.push(`<link rel="canonical" href="${esc(canonical)}" />`)
  }
  lines.push('')
  lines.push('<!-- Open Graph -->')
  if (title) lines.push(`<meta property="og:title" content="${esc(title)}" />`)
  if (description) {
    lines.push(
      `<meta property="og:description" content="${esc(description)}" />`
    )
  }
  if (ogImage) {
    lines.push(`<meta property="og:image" content="${esc(ogImage)}" />`)
  }
  if (canonical) {
    lines.push(`<meta property="og:url" content="${esc(canonical)}" />`)
  }
  lines.push(`<meta property="og:type" content="${ogType}" />`)
  lines.push('')
  lines.push('<!-- Twitter Card -->')
  lines.push('<meta name="twitter:card" content="summary_large_image" />')
  if (title) {
    lines.push(`<meta name="twitter:title" content="${esc(title)}" />`)
  }
  if (description) {
    lines.push(
      `<meta name="twitter:description" content="${esc(description)}" />`
    )
  }
  if (ogImage) {
    lines.push(`<meta name="twitter:image" content="${esc(ogImage)}" />`)
  }
  if (twitterHandle) {
    const handle = twitterHandle.startsWith('@')
      ? twitterHandle
      : `@${twitterHandle}`
    lines.push(`<meta name="twitter:site" content="${esc(handle)}" />`)
    lines.push(`<meta name="twitter:creator" content="${esc(handle)}" />`)
  }
  return lines.join('\n')
}
export default function MetaTagGenerator(): React.JSX.Element {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [keywords, setKeywords] = React.useState('')
  const [canonical, setCanonical] = React.useState('')
  const [ogImage, setOgImage] = React.useState('')
  const [twitterHandle, setTwitterHandle] = React.useState('')
  const [ogType, setOgType] = React.useState<OgType>('website')
  const output = React.useMemo(
    () =>
      buildMetaTags({
        title,
        description,
        keywords,
        canonical,
        ogImage,
        twitterHandle,
        ogType,
      }),
    [title, description, keywords, canonical, ogImage, twitterHandle, ogType]
  )
  const charCount = description.length
  const descWarn = charCount > 160
  const handleReset = (): void => {
    setTitle('')
    setDescription('')
    setKeywords('')
    setCanonical('')
    setOgImage('')
    setTwitterHandle('')
    setOgType('website')
    toast.success('Form reset')
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Meta Tag Generator</CardTitle>
          <CardDescription>
            Build SEO, Open Graph, and Twitter Card meta tags from your page
            details. Output is valid HTML ready to paste into the{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              &lt;head&gt;
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Page title" htmlFor="mtg-title" hint={`${title.length}/60`}>
            <Input
              id="mtg-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Ultimate Guide to Sustainable Coffee"
              maxLength={120}
            />
          </Field>
          <Field
            label="Meta description"
            htmlFor="mtg-desc"
            hint={`${charCount}/160${descWarn ? ' · too long' : ''}`}
          >
            <Textarea
              id="mtg-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A practical guide to choosing and brewing sustainable coffee at home."
              rows={3}
            />
          </Field>
          <Field
            label="Keywords"
            htmlFor="mtg-keywords"
            hint="comma-separated"
          >
            <Input
              id="mtg-keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="coffee, sustainable, brewing, fair trade"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Canonical URL" htmlFor="mtg-canonical">
              <Input
                id="mtg-canonical"
                value={canonical}
                onChange={(e) => setCanonical(e.target.value)}
                placeholder="https://example.com/coffee-guide"
                type="url"
              />
            </Field>
            <Field label="Open Graph type" htmlFor="mtg-ogtype">
              <Select value={ogType} onValueChange={(v) => setOgType(v as OgType)}>
                <SelectTrigger id="mtg-ogtype">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OG_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="OG image URL" htmlFor="mtg-ogimage">
              <Input
                id="mtg-ogimage"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="https://example.com/og-image.png"
                type="url"
              />
            </Field>
            <Field label="Twitter handle" htmlFor="mtg-twitter">
              <Input
                id="mtg-twitter"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="@yourbrand"
              />
            </Field>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              size="sm"
            >
              Reset
            </Button>
            <Label className="text-xs text-muted-foreground">
              Output updates as you type.
            </Label>
          </div>
        </CardContent>
      </Card>
      <ResultBox
        value={output}
        label="Generated meta tags"
        downloadName="meta-tags.html"
        rows={14}
        empty="Fill in the fields above to generate meta tags."
      />
    </div>
  )
}