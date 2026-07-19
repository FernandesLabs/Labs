'use client'
import * as React from 'react'
import { Plus, Trash2 } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Field, ResultBox, randomInt } from '@/lib/tools/tool-ui'
type SchemaType = 'Article' | 'Product' | 'FAQPage' | 'Organization' | 'BreadcrumbList'
const SCHEMA_TYPES: SchemaType[] = [
  'Article',
  'Product',
  'FAQPage',
  'Organization',
  'BreadcrumbList',
]
interface FaqPair {
  id: string
  question: string
  answer: string
}
interface BreadcrumbItem {
  id: string
  name: string
  url: string
}
function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${randomInt(1_000_000).toString(36)}`
}
function buildArticle(input: {
  headline: string
  author: string
  datePublished: string
  image: string
  publisher: string
}): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
  }
  if (input.author) obj.author = { '@type': 'Person', name: input.author }
  if (input.datePublished) obj.datePublished = input.datePublished
  if (input.image) obj.image = input.image
  if (input.publisher) {
    obj.publisher = { '@type': 'Organization', name: input.publisher }
  }
  return obj
}
function buildProduct(input: {
  name: string
  description: string
  brand: string
  price: string
  currency: string
  rating: string
  image: string
}): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
  }
  if (input.description) obj.description = input.description
  if (input.brand) obj.brand = { '@type': 'Brand', name: input.brand }
  if (input.image) obj.image = input.image
  if (input.price) {
    obj.offers = {
      '@type': 'Offer',
      price: input.price,
      priceCurrency: input.currency || 'USD',
    }
  }
  if (input.rating) {
    const ratingValue = parseFloat(input.rating)
    if (!Number.isNaN(ratingValue)) {
      obj.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue,
        reviewCount: '1',
      }
    }
  }
  return obj
}
function buildFaq(pairs: FaqPair[]): Record<string, unknown> {
  const valid = pairs.filter((p) => p.question.trim() && p.answer.trim())
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: valid.map((p) => ({
      '@type': 'Question',
      name: p.question.trim(),
      acceptedAnswer: { '@type': 'Answer', text: p.answer.trim() },
    })),
  }
}
function buildOrganization(input: {
  name: string
  url: string
  logo: string
  sameAs: string
}): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.name,
  }
  if (input.url) obj.url = input.url
  if (input.logo) obj.logo = input.logo
  if (input.sameAs) {
    obj.sameAs = input.sameAs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return obj
}
function buildBreadcrumb(items: BreadcrumbItem[]): Record<string, unknown> {
  const valid = items.filter((i) => i.name.trim() && i.url.trim())
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: valid.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name.trim(),
      item: item.url.trim(),
    })),
  }
}
export default function JsonLdGenerator(): React.JSX.Element {
  const [type, setType] = React.useState<SchemaType>('Article')
  // Article
  const [artHeadline, setArtHeadline] = React.useState('')
  const [artAuthor, setArtAuthor] = React.useState('')
  const [artDate, setArtDate] = React.useState('')
  const [artImage, setArtImage] = React.useState('')
  const [artPublisher, setArtPublisher] = React.useState('')
  // Product
  const [pName, setPName] = React.useState('')
  const [pDesc, setPDesc] = React.useState('')
  const [pBrand, setPBrand] = React.useState('')
  const [pPrice, setPPrice] = React.useState('')
  const [pCurrency, setPCurrency] = React.useState('USD')
  const [pRating, setPRating] = React.useState('')
  const [pImage, setPImage] = React.useState('')
  // FAQ
  const [faqPairs, setFaqPairs] = React.useState<FaqPair[]>([
    { id: uid('q'), question: '', answer: '' },
  ])
  // Organization
  const [oName, setOName] = React.useState('')
  const [oUrl, setOUrl] = React.useState('')
  const [oLogo, setOLogo] = React.useState('')
  const [oSameAs, setOSameAs] = React.useState('')
  // Breadcrumb
  const [crumbs, setCrumbs] = React.useState<BreadcrumbItem[]>([
    { id: uid('b'), name: 'Home', url: '/' },
  ])
  const output = React.useMemo<string>(() => {
    let obj: Record<string, unknown> = {}
    switch (type) {
      case 'Article':
        obj = buildArticle({
          headline: artHeadline,
          author: artAuthor,
          datePublished: artDate,
          image: artImage,
          publisher: artPublisher,
        })
        break
      case 'Product':
        obj = buildProduct({
          name: pName,
          description: pDesc,
          brand: pBrand,
          price: pPrice,
          currency: pCurrency,
          rating: pRating,
          image: pImage,
        })
        break
      case 'FAQPage':
        obj = buildFaq(faqPairs)
        break
      case 'Organization':
        obj = buildOrganization({
          name: oName,
          url: oUrl,
          logo: oLogo,
          sameAs: oSameAs,
        })
        break
      case 'BreadcrumbList':
        obj = buildBreadcrumb(crumbs)
        break
    }
    return JSON.stringify(obj, null, 2)
  }, [
    type,
    artHeadline,
    artAuthor,
    artDate,
    artImage,
    artPublisher,
    pName,
    pDesc,
    pBrand,
    pPrice,
    pCurrency,
    pRating,
    pImage,
    faqPairs,
    oName,
    oUrl,
    oLogo,
    oSameAs,
    crumbs,
  ])
  // FAQ handlers
  const addFaq = (): void => {
    setFaqPairs((prev) => [...prev, { id: uid('q'), question: '', answer: '' }])
  }
  const updateFaq = (id: string, patch: Partial<FaqPair>): void => {
    setFaqPairs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    )
  }
  const removeFaq = (id: string): void => {
    setFaqPairs((prev) => prev.filter((p) => p.id !== id))
  }
  // Breadcrumb handlers
  const addCrumb = (): void => {
    setCrumbs((prev) => [...prev, { id: uid('b'), name: '', url: '' }])
  }
  const updateCrumb = (id: string, patch: Partial<BreadcrumbItem>): void => {
    setCrumbs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    )
  }
  const removeCrumb = (id: string): void => {
    setCrumbs((prev) => prev.filter((c) => c.id !== id))
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>JSON-LD Generator</CardTitle>
          <CardDescription>
            Build structured data for richer search results. Schema types are
            switched via the selector below; only the relevant fields show.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Schema type" htmlFor="jl-type">
            <Select value={type} onValueChange={(v) => setType(v as SchemaType)}>
              <SelectTrigger id="jl-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCHEMA_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Separator />
          {type === 'Article' ? (
            <div className="space-y-3">
              <Field label="Headline" htmlFor="jl-art-h">
                <Input
                  id="jl-art-h"
                  value={artHeadline}
                  onChange={(e) => setArtHeadline(e.target.value)}
                  placeholder="How to Brew Sustainable Coffee at Home"
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Author" htmlFor="jl-art-a">
                  <Input
                    id="jl-art-a"
                    value={artAuthor}
                    onChange={(e) => setArtAuthor(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Date published" htmlFor="jl-art-d">
                  <Input
                    id="jl-art-d"
                    type="date"
                    value={artDate}
                    onChange={(e) => setArtDate(e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Image URL" htmlFor="jl-art-img">
                <Input
                  id="jl-art-img"
                  value={artImage}
                  onChange={(e) => setArtImage(e.target.value)}
                  placeholder="https://example.com/article.jpg"
                  type="url"
                />
              </Field>
              <Field label="Publisher" htmlFor="jl-art-p">
                <Input
                  id="jl-art-p"
                  value={artPublisher}
                  onChange={(e) => setArtPublisher(e.target.value)}
                  placeholder="Fernandes Labs"
                />
              </Field>
            </div>
          ) : null}
          {type === 'Product' ? (
            <div className="space-y-3">
              <Field label="Product name" htmlFor="jl-p-n">
                <Input
                  id="jl-p-n"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="Ceramic Pour-Over Mug"
                />
              </Field>
              <Field label="Description" htmlFor="jl-p-d">
                <Input
                  id="jl-p-d"
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Handmade double-walled ceramic mug."
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Brand" htmlFor="jl-p-b">
                  <Input
                    id="jl-p-b"
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    placeholder="Fernandes Goods"
                  />
                </Field>
                <Field label="Image URL" htmlFor="jl-p-img">
                  <Input
                    id="jl-p-img"
                    value={pImage}
                    onChange={(e) => setPImage(e.target.value)}
                    placeholder="https://example.com/mug.png"
                    type="url"
                  />
                </Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Price" htmlFor="jl-p-pr">
                  <Input
                    id="jl-p-pr"
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    placeholder="24.00"
                    inputMode="decimal"
                  />
                </Field>
                <Field label="Currency" htmlFor="jl-p-c">
                  <Input
                    id="jl-p-c"
                    value={pCurrency}
                    onChange={(e) => setPCurrency(e.target.value)}
                    placeholder="USD"
                  />
                </Field>
                <Field label="Rating (0-5)" htmlFor="jl-p-r">
                  <Input
                    id="jl-p-r"
                    value={pRating}
                    onChange={(e) => setPRating(e.target.value)}
                    placeholder="4.7"
                    inputMode="decimal"
                  />
                </Field>
              </div>
            </div>
          ) : null}
          {type === 'FAQPage' ? (
            <div className="space-y-3">
              {faqPairs.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                  No Q&amp;A pairs yet.
                </p>
              ) : (
                faqPairs.map((p, i) => (
                  <div
                    key={p.id}
                    className="rounded-lg border border-border bg-card p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">
                        Q&amp;A #{i + 1}
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFaq(p.id)}
                        aria-label="Remove Q&A"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <Input
                      aria-label="Question"
                      value={p.question}
                      onChange={(e) =>
                        updateFaq(p.id, { question: e.target.value })
                      }
                      placeholder="What is sustainable coffee?"
                      className="mb-2"
                    />
                    <Input
                      aria-label="Answer"
                      value={p.answer}
                      onChange={(e) =>
                        updateFaq(p.id, { answer: e.target.value })
                      }
                      placeholder="Sustainable coffee is grown using practices that protect the environment."
                    />
                  </div>
                ))
              )}
              <Button type="button" variant="outline" size="sm" onClick={addFaq}>
                <Plus className="size-3.5" />
                Add Q&amp;A
              </Button>
            </div>
          ) : null}
          {type === 'Organization' ? (
            <div className="space-y-3">
              <Field label="Organization name" htmlFor="jl-o-n">
                <Input
                  id="jl-o-n"
                  value={oName}
                  onChange={(e) => setOName(e.target.value)}
                  placeholder="Fernandes Labs"
                />
              </Field>
              <Field label="Website URL" htmlFor="jl-o-u">
                <Input
                  id="jl-o-u"
                  value={oUrl}
                  onChange={(e) => setOUrl(e.target.value)}
                  placeholder="https://fernandeslabs.com"
                  type="url"
                />
              </Field>
              <Field label="Logo URL" htmlFor="jl-o-l">
                <Input
                  id="jl-o-l"
                  value={oLogo}
                  onChange={(e) => setOLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  type="url"
                />
              </Field>
              <Field
                label="Social profiles (sameAs)"
                htmlFor="jl-o-s"
                hint="comma-separated"
              >
                <Input
                  id="jl-o-s"
                  value={oSameAs}
                  onChange={(e) => setOSameAs(e.target.value)}
                  placeholder="https://twitter.com/fernandeslabs, https://github.com/fernandeslabs"
                />
              </Field>
            </div>
          ) : null}
          {type === 'BreadcrumbList' ? (
            <div className="space-y-3">
              {crumbs.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                  No breadcrumb items yet.
                </p>
              ) : (
                crumbs.map((c, i) => (
                  <div
                    key={c.id}
                    className="rounded-lg border border-border bg-card p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">
                        Position {i + 1}
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCrumb(c.id)}
                        aria-label="Remove breadcrumb"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Input
                        aria-label="Name"
                        value={c.name}
                        onChange={(e) =>
                          updateCrumb(c.id, { name: e.target.value })
                        }
                        placeholder="Home"
                      />
                      <Input
                        aria-label="URL"
                        value={c.url}
                        onChange={(e) =>
                          updateCrumb(c.id, { url: e.target.value })
                        }
                        placeholder="https://example.com/"
                        type="url"
                      />
                    </div>
                  </div>
                ))
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCrumb}
              >
                <Plus className="size-3.5" />
                Add breadcrumb
              </Button>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast.success('Output updated')}
            >
              Refresh
            </Button>
            <Label className="text-xs text-muted-foreground">
              JSON updates as you type.
            </Label>
          </div>
        </CardContent>
      </Card>
      <ResultBox
        value={output}
        label="JSON-LD"
        downloadName="json-ld.json"
        rows={14}
        empty="Fill in the fields above to generate JSON-LD."
      />
    </div>
  )
}