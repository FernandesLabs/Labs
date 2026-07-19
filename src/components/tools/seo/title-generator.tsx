'use client'
import * as React from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Field, randomInt } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
type Tone = 'Professional' | 'Catchy' | 'How-to' | 'Number' | 'Listicle'
const TONES: Tone[] = ['Professional', 'Catchy', 'How-to', 'Number', 'Listicle']
const POWER_WORDS = [
  'Proven',
  'Ultimate',
  'Essential',
  'Complete',
  'Effective',
  'Simple',
  'Smart',
  'Powerful',
  'Actionable',
  'Surprising',
]
const CURRENT_YEAR = new Date().getFullYear()
/** Rough pixel-width estimate for the Google SERP (~10px per char average). */
function pixelWidth(text: string): number {
  let width = 0
  for (const ch of text) {
    // Wide chars (capital letters, digits, MW) count more
    if (/[MWmw@%]/.test(ch)) width += 14
    else if (/[A-Z0-9]/.test(ch)) width += 11
    else if (ch === 'i' || ch === 'l' || ch === 'I') width += 5
    else if (ch === ' ') width += 5
    else width += 8
  }
  return width
}
interface TitleVariant {
  text: string
}
function buildTemplates(keyword: string, brand: string, tone: Tone): string[] {
  const k = keyword.trim() || 'Your Topic'
  const b = brand.trim() || 'Your Brand'
  const year = String(CURRENT_YEAR)
  const templates: string[] = []
  switch (tone) {
    case 'Professional':
      templates.push(
        `${k}: A Complete Guide for ${year}`,
        `The Essential ${k} Strategy for ${year}`,
        `${k} Best Practices Every Professional Should Know`,
        `${k} Explained: What It Is and Why It Matters`,
        `Mastering ${k} in ${year} | ${b}`
      )
      break
    case 'Catchy':
      templates.push(
        `${k}: The Secret Nobody Told You`,
        `Stop Wasting Time on ${k} — Do This Instead`,
        `The Surprising Truth About ${k}`,
        `${k}, Demystified`,
        `Why ${k} Just Got Easier`
      )
      break
    case 'How-to':
      templates.push(
        `How to ${k} in ${year} (Step-by-Step)`,
        `How to Master ${k} — Even as a Beginner`,
        `How to Get Started With ${k} Today`,
        `How to Improve Your ${k} in 30 Days`,
        `How ${b} Approaches ${k}`
      )
      break
    case 'Number':
      templates.push(
        `7 ${k} Tips You Need to Know in ${year}`,
        `5 Proven Ways to Boost Your ${k}`,
        `10 Common ${k} Mistakes (And How to Fix Them)`,
        `3 ${k} Strategies That Actually Work`,
        `${k}: 9 Quick Wins for ${year}`
      )
      break
    case 'Listicle':
      templates.push(
        `${k}: 12 Tools, Tips, and Resources`,
        `Top 8 ${k} Resources for ${year}`,
        `${k} Checklist: 15 Items to Review`,
        `15 ${k} Ideas Worth Trying`,
        `${k} Roundup: 10 Picks from ${b}`
      )
      break
  }
  return templates
}
function pickNumbers(templates: string[]): TitleVariant[] {
  // Replace numeric placeholders with randomInt-derived numbers, keep variety
  return templates.map((t) => {
    let out = t
    out = out.replace(/\b7\b/g, String(5 + randomInt(11)))
    out = out.replace(/\b5\b/g, String(3 + randomInt(5)))
    out = out.replace(/\b10\b/g, String(7 + randomInt(8)))
    out = out.replace(/\b3\b/g, String(2 + randomInt(4)))
    out = out.replace(/\b9\b/g, String(4 + randomInt(8)))
    out = out.replace(/\b12\b/g, String(8 + randomInt(10)))
    out = out.replace(/\b8\b/g, String(5 + randomInt(8)))
    out = out.replace(/\b15\b/g, String(10 + randomInt(10)))
    return { text: out }
  })
}
function TitleRow({
  variant,
  index,
}: {
  variant: TitleVariant
  index: number
}): React.JSX.Element {
  const { copy, copied } = useCopy()
  const len = variant.text.length
  const px = pixelWidth(variant.text)
  const over = px > 600
  return (
    <li className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="truncate font-medium text-foreground">
            {variant.text}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-6">
          <Badge variant="secondary">{len} chars</Badge>
          <Badge variant={over ? 'destructive' : 'secondary'}>
            ~{px}px{over ? ' · too long' : ''}
          </Badge>
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="shrink-0"
        onClick={() => copy(variant.text, 'Title copied')}
      >
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </li>
  )
}
export default function TitleGenerator(): React.JSX.Element {
  const [keyword, setKeyword] = React.useState('')
  const [brand, setBrand] = React.useState('')
  const [tone, setTone] = React.useState<Tone>('Professional')
  const [seed, setSeed] = React.useState(0)
  const variants = React.useMemo<TitleVariant[]>(() => {
    void seed // re-roll when regenerate clicked
    const templates = buildTemplates(keyword, brand, tone)
    return pickNumbers(templates)
  }, [keyword, brand, tone, seed])
  const regenerate = (): void => {
    if (!keyword.trim()) {
      toast.error('Enter a primary keyword first')
      return
    }
    setSeed((s) => s + 1)
    toast.success('New variations generated')
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Title Generator</CardTitle>
          <CardDescription>
            Generate SEO-optimized page titles from templates. Each variation
            shows character count and an approximate pixel width (Google
            truncates around 600px on desktop).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary keyword" htmlFor="tg-keyword">
              <Input
                id="tg-keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="sustainable coffee"
              />
            </Field>
            <Field label="Brand / secondary" htmlFor="tg-brand">
              <Input
                id="tg-brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Fernandes Labs"
              />
            </Field>
          </div>
          <Field label="Tone" htmlFor="tg-tone">
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger id="tg-tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={regenerate}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <RefreshCw className="size-4" />
              Regenerate
            </Button>
            <Label className="text-xs text-muted-foreground">
              Numbers and order shuffle on each regenerate.
            </Label>
          </div>
        </CardContent>
      </Card>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            Title variations
          </h3>
          <span className="text-xs text-muted-foreground">
            {variants.length} suggestions
          </span>
        </div>
        <Separator className="mb-3" />
        {variants.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Enter a keyword to generate title variations.
          </p>
        ) : (
          <ul className="space-y-2">
            {variants.map((v, i) => (
              <TitleRow key={`${v.text}-${i}`} variant={v} index={i} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}