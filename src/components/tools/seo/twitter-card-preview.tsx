'use client'
import * as React from 'react'
import { ImageOff, Globe } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Separator } from '@/components/ui/separator'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
type CardType = 'summary' | 'summary_large_image'
interface CardState {
  cardType: CardType
  title: string
  description: string
  image: string
  site: string
  creator: string
}
const DEFAULT: CardState = {
  cardType: 'summary_large_image',
  title: 'The Ultimate Guide to Sustainable Coffee',
  description:
    'A practical guide to choosing and brewing sustainable coffee at home.',
  image: '',
  site: '@fernandeslabs',
  creator: '@fernandeslabs',
}
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
function metaTags(state: CardState): string {
  const lines: string[] = ['<!-- Twitter Card meta tags -->']
  lines.push(`<meta name="twitter:card" content="${state.cardType}" />`)
  if (state.title) lines.push(`<meta name="twitter:title" content="${esc(state.title)}" />`)
  if (state.description) {
    lines.push(`<meta name="twitter:description" content="${esc(state.description)}" />`)
  }
  if (state.image) lines.push(`<meta name="twitter:image" content="${esc(state.image)}" />`)
  if (state.site) lines.push(`<meta name="twitter:site" content="${esc(state.site)}" />`)
  if (state.creator) {
    lines.push(`<meta name="twitter:creator" content="${esc(state.creator)}" />`)
  }
  return lines.join('\n')
}
function hostOf(url: string): string {
  if (!url) return 'example.com'
  try {
    return new URL(url.trim()).hostname.replace(/^www\./, '')
  } catch {
    return url.trim() || 'example.com'
  }
}
function TwitterCard({
  state,
}: {
  state: CardState
}): React.JSX.Element {
  const [imgError, setImgError] = React.useState(false)
  React.useEffect(() => {
    setImgError(false)
  }, [state.image])
  const isLarge = state.cardType === 'summary_large_image'
  const hostname = hostOf(state.image || '')
  if (isLarge) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="aspect-[2/1] w-full bg-muted">
          {state.image && !imgError ? (
            <img
              src={state.image}
              alt={state.title || 'Twitter card image'}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageOff className="size-8" />
              <span className="text-xs">
                {state.image ? 'Image failed to load' : 'No image provided'}
              </span>
            </div>
          )}
        </div>
        <div className="space-y-1 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Globe className="size-3" />
            <span className="truncate">{hostname}</span>
          </div>
          <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-foreground">
            {state.title || 'Your title appears here'}
          </h3>
          {state.description ? (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {state.description}
            </p>
          ) : null}
        </div>
      </div>
    )
  }
  // summary: square thumbnail on the left, text on the right
  return (
    <div className="flex overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <div className="aspect-square w-28 shrink-0 bg-muted sm:w-36">
        {state.image && !imgError ? (
          <img
            src={state.image}
            alt={state.title || 'Twitter card image'}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <ImageOff className="size-6" />
            <span className="px-1 text-center text-[10px]">No image</span>
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Globe className="size-3" />
          <span className="truncate">{hostname}</span>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {state.title || 'Your title appears here'}
        </h3>
        {state.description ? (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {state.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}
export default function TwitterCardPreview(): React.JSX.Element {
  const [state, setState] = React.useState<CardState>(DEFAULT)
  const update = <K extends keyof CardState>(key: K, value: string): void => {
    setState((prev) => ({ ...prev, [key]: value }))
  }
  const tags = React.useMemo(() => metaTags(state), [state])
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Twitter Card Preview</CardTitle>
          <CardDescription>
            Configure how your page appears when shared on X (Twitter). Pick a
            card type, set the title/description/image, and copy the matching
            meta tags. The preview updates live.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Card type" htmlFor="tc-type">
            <Select
              value={state.cardType}
              onValueChange={(v) => update('cardType', v)}
            >
              <SelectTrigger id="tc-type">
                <SelectValue placeholder="Select a card type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">summary (square thumbnail)</SelectItem>
                <SelectItem value="summary_large_image">
                  summary_large_image (featured image)
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Title" htmlFor="tc-title" hint={`${state.title.length} chars`}>
            <Input
              id="tc-title"
              value={state.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="The Ultimate Guide to Sustainable Coffee"
            />
          </Field>
          <Field
            label="Description"
            htmlFor="tc-desc"
            hint={`${state.description.length}/200`}
          >
            <Textarea
              id="tc-desc"
              value={state.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="A practical guide to choosing and brewing sustainable coffee at home."
              rows={3}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Image URL" htmlFor="tc-image">
              <Input
                id="tc-image"
                value={state.image}
                onChange={(e) => update('image', e.target.value)}
                placeholder="https://example.com/card.png"
                type="url"
              />
            </Field>
            <Field label="Site (@handle)" htmlFor="tc-site">
              <Input
                id="tc-site"
                value={state.site}
                onChange={(e) => update('site', e.target.value)}
                placeholder="@fernandeslabs"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
          </div>
          <Field label="Creator (@handle)" htmlFor="tc-creator">
            <Input
              id="tc-creator"
              value={state.creator}
              onChange={(e) => update('creator', e.target.value)}
              placeholder="@author"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </Field>
        </CardContent>
      </Card>
      <div>
        <h3 className="mb-2 text-sm font-medium text-foreground">
          Card preview
        </h3>
        <Separator className="mb-3" />
        <div className="mx-auto max-w-xl">
          <TwitterCard state={state} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Card type" value={state.cardType === 'summary' ? 'summary' : 'large'} />
        <Stat label="Title length" value={state.title.length} />
        <Stat label="Description" value={state.description.length} />
        <Stat
          label="Has image"
          value={state.image ? 'Yes' : 'No'}
          accent={state.image ? 'oklch(0.6 0.17 150)' : 'oklch(0.6 0.2 25)'}
        />
      </div>
      <ResultBox
        value={tags}
        label="Twitter meta tags"
        downloadName="twitter-card-tags.html"
        rows={8}
        empty="Fill in the fields above to generate the meta tags."
      />
    </div>
  )
}