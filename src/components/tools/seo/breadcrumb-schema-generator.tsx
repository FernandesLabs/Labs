'use client'

import * as React from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { Field, ResultBox, Stat, randomInt } from '@/lib/tools/tool-ui'

interface Crumb {
  id: string
  name: string
  url: string
}

function makeId(): string {
  return `crumb-${Date.now().toString(36)}-${randomInt(1_000_000).toString(36)}`
}

function isValidUrl(url: string): boolean {
  if (!url) return false
  try {
    const u = new URL(url.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function buildJsonLd(crumbs: Crumb[]): string {
  const filled = crumbs.filter((c) => c.name.trim() && isValidUrl(c.url))
  if (filled.length === 0) return ''
  const itemList = filled.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name.trim(),
    item: c.url.trim(),
  }))
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: itemList,
    },
    null,
    2
  )
}

const SAMPLE: Crumb[] = [
  { id: 'c1', name: 'Home', url: 'https://example.com/' },
  { id: 'c2', name: 'Blog', url: 'https://example.com/blog' },
  {
    id: 'c3',
    name: 'Sustainable Coffee Guide',
    url: 'https://example.com/blog/sustainable-coffee',
  },
]

export default function BreadcrumbSchemaGenerator(): React.JSX.Element {
  const [crumbs, setCrumbs] = React.useState<Crumb[]>(SAMPLE)

  const update = (id: string, field: 'name' | 'url', value: string): void => {
    setCrumbs((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const add = (): void => {
    if (crumbs.length >= 30) {
      toast.error('Maximum of 30 breadcrumbs reached')
      return
    }
    setCrumbs((prev) => [...prev, { id: makeId(), name: '', url: '' }])
  }

  const remove = (id: string): void => {
    setCrumbs((prev) => (prev.length === 1 ? prev : prev.filter((c) => c.id !== id)))
  }

  const move = (index: number, direction: 'up' | 'down'): void => {
    setCrumbs((prev) => {
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const jsonLd = React.useMemo(() => buildJsonLd(crumbs), [crumbs])
  const validCount = crumbs.filter((c) => c.name.trim() && isValidUrl(c.url)).length
  const invalidCount = crumbs.length - validCount

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Breadcrumb Schema Generator</CardTitle>
          <CardDescription>
            Build a BreadcrumbList JSON-LD schema for rich search results.
            Add, remove, and reorder crumbs; the schema and visual preview
            update live.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {crumbs.map((crumb, index) => {
              const urlValid = !crumb.url.trim() || isValidUrl(crumb.url)
              return (
                <div
                  key={crumb.id}
                  className="rounded-lg border border-border bg-muted/20 p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="font-mono text-xs">
                      #{index + 1}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => move(index, 'up')}
                        disabled={index === 0}
                        aria-label={`Move item ${index + 1} up`}
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => move(index, 'down')}
                        disabled={index === crumbs.length - 1}
                        aria-label={`Move item ${index + 1} down`}
                      >
                        <ArrowDown className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-rose-500 hover:text-rose-600"
                        onClick={() => remove(crumb.id)}
                        disabled={crumbs.length === 1}
                        aria-label={`Remove item ${index + 1}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Name" htmlFor={`n-${crumb.id}`}>
                      <Input
                        id={`n-${crumb.id}`}
                        value={crumb.name}
                        onChange={(e) => update(crumb.id, 'name', e.target.value)}
                        placeholder="Blog"
                      />
                    </Field>
                    <Field
                      label="URL"
                      htmlFor={`u-${crumb.id}`}
                      hint={urlValid ? undefined : 'invalid'}
                    >
                      <Input
                        id={`u-${crumb.id}`}
                        value={crumb.url}
                        onChange={(e) => update(crumb.id, 'url', e.target.value)}
                        placeholder="https://example.com/blog"
                        type="url"
                        className={!urlValid ? 'border-rose-500/60' : ''}
                      />
                    </Field>
                  </div>
                </div>
              )
            })}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={add}>
            <Plus className="size-4" />
            Add breadcrumb
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Visual preview</CardTitle>
          <CardDescription>
            How the breadcrumb trail will appear on your page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-40">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm">
              {crumbs
                .filter((c) => c.name.trim())
                .map((crumb, index, arr) => (
                  <React.Fragment key={crumb.id}>
                    <span
                      className={
                        index === arr.length - 1
                          ? 'font-semibold text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      {crumb.name.trim()}
                    </span>
                    {index < arr.length - 1 ? (
                      <ChevronRight className="size-3.5 text-muted-foreground/60" aria-hidden="true" />
                    ) : null}
                  </React.Fragment>
                ))}
              {crumbs.filter((c) => c.name.trim()).length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  Add named crumbs to see the preview.
                </span>
              ) : null}
            </nav>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total items" value={crumbs.length} />
        <Stat label="Valid items" value={validCount} accent="oklch(0.6 0.17 150)" />
        <Stat
          label="Invalid"
          value={invalidCount}
          accent={invalidCount > 0 ? 'oklch(0.6 0.2 25)' : undefined}
        />
        <Stat label="Schema size" value={`${jsonLd.length} chars`} />
      </div>

      <ResultBox
        value={jsonLd}
        label="BreadcrumbList JSON-LD"
        rows={10}
        downloadName="breadcrumbs.json"
        empty="Add at least one item with both a name and a valid http(s) URL."
      />
    </div>
  )
}
