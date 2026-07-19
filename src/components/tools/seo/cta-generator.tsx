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
type Tone = 'Urgent' | 'Friendly' | 'Premium' | 'Playful' | 'Direct'
const TONES: Tone[] = ['Urgent', 'Friendly', 'Premium', 'Playful', 'Direct']
function buildCtas(
  verb: string,
  product: string,
  tone: Tone
): string[] {
  const v = verb.trim() || 'Get'
  const p = product.trim() || 'Your Product'
  const variants: string[] = []
  switch (tone) {
    case 'Urgent':
      variants.push(
        `Get ${p} Now`,
        `Limited Time: ${v} ${p} Today`,
        `Don't Miss Out — ${v} ${p}`,
        `Act Now: ${v} ${p} Free`,
        `Hurry! ${v} ${p} Before It's Gone`
      )
      break
    case 'Friendly':
      variants.push(
        `Start ${v}ing ${p} Today`,
        `Let's ${v} ${p} Together`,
        `Try ${p} — It's on Us`,
        `Join ${p} in Seconds`,
        `We'd Love to Show You ${p}`
      )
      break
    case 'Premium':
      variants.push(
        `Experience ${p} Today`,
        `Unlock ${p} Premium`,
        `Elevate Your Work With ${p}`,
        `Claim Your ${p} Access`,
        `Discover the ${p} Difference`
      )
      break
    case 'Playful':
      variants.push(
        `Tap to ${v} ${p}`,
        `Ready, Set, ${v} ${p}!`,
        `Say Hello to ${p}`,
        `Yay! ${v} ${p} Now`,
        `Make ${p} Yours Today`
      )
      break
    case 'Direct':
      variants.push(
        `${v} ${p}`,
        `Start ${v}ing`,
        `Try ${p} Free`,
        `Sign Up for ${p}`,
        `Buy ${p} Now`
      )
      break
  }
  return variants
}
function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}
interface CtaVariant {
  text: string
  tone: Tone
}
function pickVariants(
  verb: string,
  product: string,
  tone: Tone
): CtaVariant[] {
  const list = buildCtas(verb, product, tone)
  const shuffled = shuffle(list)
  return shuffled.slice(0, 6).map((text) => ({ text, tone }))
}
function CtaRow({
  variant,
  index,
}: {
  variant: CtaVariant
  index: number
}): React.JSX.Element {
  const { copy, copied } = useCopy()
  const len = variant.text.length
  return (
    <li className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">
            {String(index + 1).padStart(2, '0')}
          </span>
          <Button
            type="button"
            variant="default"
            className="pointer-events-none bg-primary text-primary-foreground hover:bg-primary"
            tabIndex={-1}
            aria-hidden="true"
          >
            {variant.text}
          </Button>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-6">
          <Badge variant="secondary">{len} chars</Badge>
          <Badge variant="outline">{variant.tone}</Badge>
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="shrink-0"
        onClick={() => copy(variant.text, 'CTA copied')}
      >
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </li>
  )
}
export default function CtaGenerator(): React.JSX.Element {
  const [verb, setVerb] = React.useState('')
  const [product, setProduct] = React.useState('')
  const [tone, setTone] = React.useState<Tone>('Direct')
  const [seed, setSeed] = React.useState(0)
  const variants = React.useMemo<CtaVariant[]>(() => {
    void seed
    return pickVariants(verb, product, tone)
  }, [verb, product, tone, seed])
  const regenerate = (): void => {
    if (!product.trim() && !verb.trim()) {
      toast.error('Enter an action verb or product/topic first')
      return
    }
    setSeed((s) => s + 1)
    toast.success('New CTAs generated')
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>CTA Generator</CardTitle>
          <CardDescription>
            Generate call-to-action button copy variations from an action verb,
            product/topic, and tone. Each variation previews as a primary
            button so you can see how it reads in context.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Action verb" htmlFor="cta-verb" hint="e.g. Start, Get, Try">
              <Input
                id="cta-verb"
                value={verb}
                onChange={(e) => setVerb(e.target.value)}
                placeholder="Start"
              />
            </Field>
            <Field label="Product / topic" htmlFor="cta-product">
              <Input
                id="cta-product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Fernandes Pro"
              />
            </Field>
          </div>
          <Field label="Tone" htmlFor="cta-tone">
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger id="cta-tone">
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
              Order shuffles on each regenerate.
            </Label>
          </div>
        </CardContent>
      </Card>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            CTA variations
          </h3>
          <span className="text-xs text-muted-foreground">
            {variants.length} suggestions
          </span>
        </div>
        <Separator className="mb-3" />
        {variants.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Enter an action verb and product to generate CTA variations.
          </p>
        ) : (
          <ul className="space-y-2">
            {variants.map((v, i) => (
              <CtaRow key={`${v.text}-${i}`} variant={v} index={i} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}