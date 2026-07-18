'use client'

import * as React from 'react'
import { ImageOff, Globe, ExternalLink } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function hostOf(url: string): string {
  if (!url) return ''
  try {
    return new URL(url.trim()).hostname.replace(/^www\./, '')
  } catch {
    return url.trim()
  }
}

function SocialCard({
  title,
  description,
  image,
  siteName,
  url,
}: {
  title: string
  description: string
  image: string
  siteName: string
  url: string
}): React.JSX.Element {
  const [imgError, setImgError] = React.useState(false)
  React.useEffect(() => {
    setImgError(false)
  }, [image])

  const hostname = hostOf(url) || siteName || 'example.com'
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <div className="aspect-[1.91/1] w-full bg-muted">
        {image && !imgError ? (
          <img
            src={image}
            alt={title || 'Open Graph preview image'}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-8" />
            <span className="text-xs">
              {image ? 'Image failed to load' : 'No image URL provided'}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-1 p-3">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
          <Globe className="size-3" />
          <span className="truncate">{hostname}</span>
        </div>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
          {title || 'Your title appears here'}
        </h3>
        {description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default function OpenGraphPreview(): React.JSX.Element {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [image, setImage] = React.useState('')
  const [siteName, setSiteName] = React.useState('')
  const [url, setUrl] = React.useState('')

  const ogTags = React.useMemo(() => {
    const lines: string[] = ['<!-- Open Graph meta tags -->']
    if (title) lines.push(`<meta property="og:title" content="${esc(title)}" />`)
    if (description) {
      lines.push(
        `<meta property="og:description" content="${esc(description)}" />`
      )
    }
    if (image) lines.push(`<meta property="og:image" content="${esc(image)}" />`)
    if (url) lines.push(`<meta property="og:url" content="${esc(url)}" />`)
    if (siteName) {
      lines.push(`<meta property="og:site_name" content="${esc(siteName)}" />`)
    }
    lines.push('<meta property="og:type" content="website" />')
    return lines.join('\n')
  }, [title, description, image, url, siteName])

  const titlePx = title.length * 11
  const descLen = description.length

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Open Graph Preview</CardTitle>
          <CardDescription>
            See how your page will appear when shared on Facebook, LinkedIn,
            Slack, and other platforms that read Open Graph tags. Paste your
            details to preview and copy the matching meta tags.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="og:title" htmlFor="og-title" hint={`${title.length} chars`}>
              <Input
                id="og-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Ultimate Guide to Sustainable Coffee"
              />
            </Field>
            <Field label="og:site_name" htmlFor="og-site">
              <Input
                id="og-site"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Fernandes Labs"
              />
            </Field>
          </div>
          <Field
            label="og:description"
            htmlFor="og-desc"
            hint={`${descLen}/200`}
          >
            <Textarea
              id="og-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A practical guide to choosing and brewing sustainable coffee at home."
              rows={3}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="og:image URL" htmlFor="og-image">
              <Input
                id="og-image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/og-image.png"
                type="url"
              />
            </Field>
            <Field label="og:url" htmlFor="og-url">
              <Input
                id="og-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/coffee-guide"
                type="url"
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-2 text-sm font-medium text-foreground">
          Social card preview
        </h3>
        <Separator className="mb-3" />
        <div className="mx-auto max-w-xl">
          <SocialCard
            title={title}
            description={description}
            image={image}
            siteName={siteName}
            url={url}
          />
        </div>
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <ExternalLink className="size-3" />
          Renders at 1.91:1 (1200×630 recommended) for most platforms.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Title length" value={title.length} />
        <Stat label="Title ~px" value={titlePx} />
        <Stat label="Desc length" value={descLen} />
        <Stat
          label="Has image"
          value={image ? 'Yes' : 'No'}
          accent={image ? 'oklch(0.6 0.17 150)' : 'oklch(0.6 0.2 25)'}
        />
      </div>

      <ResultBox
        value={ogTags}
        label="OG meta tags"
        downloadName="og-tags.html"
        rows={8}
        empty="Fill in the fields above to generate OG tags."
      />
    </div>
  )
}
