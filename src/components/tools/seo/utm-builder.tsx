'use client'

import * as React from 'react'
import { ExternalLink, Wand2, AlertTriangle, CheckCircle2 } from 'lucide-react'
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
import { toast } from 'sonner'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'

interface UtmState {
  baseUrl: string
  source: string
  medium: string
  campaign: string
  term: string
  content: string
}

const EMPTY: UtmState = {
  baseUrl: 'https://example.com/blog/summer-sale',
  source: '',
  medium: '',
  campaign: '',
  term: '',
  content: '',
}

interface Preset {
  label: string
  values: Pick<UtmState, 'source' | 'medium' | 'campaign'>
}

const PRESETS: Preset[] = [
  {
    label: 'Newsletter / email / summer2024',
    values: { source: 'newsletter', medium: 'email', campaign: 'summer2024' },
  },
  {
    label: 'Twitter / social / launch',
    values: { source: 'twitter', medium: 'social', campaign: 'product_launch' },
  },
  {
    label: 'Google / cpc / brand_keyword',
    values: { source: 'google', medium: 'cpc', campaign: 'brand_keyword' },
  },
  {
    label: 'Facebook / social / black_friday',
    values: { source: 'facebook', medium: 'social', campaign: 'black_friday' },
  },
  {
    label: 'Github / referral / oss_boost',
    values: { source: 'github', medium: 'referral', campaign: 'oss_boost' },
  },
]

function isValidUrl(url: string): boolean {
  if (!url) return false
  try {
    const u = new URL(url.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function buildTaggedUrl(state: UtmState): string {
  const base = state.baseUrl.trim()
  if (!isValidUrl(base)) return ''
  const params = new URLSearchParams()
  if (state.source.trim()) params.set('utm_source', state.source.trim())
  if (state.medium.trim()) params.set('utm_medium', state.medium.trim())
  if (state.campaign.trim()) params.set('utm_campaign', state.campaign.trim())
  if (state.term.trim()) params.set('utm_term', state.term.trim())
  if (state.content.trim()) params.set('utm_content', state.content.trim())
  const qs = params.toString()
  if (!qs) return base
  // Preserve any existing query/hash on the base URL.
  try {
    const u = new URL(base)
    params.forEach((value, key) => {
      // Skip if the parameter already exists.
      if (!u.searchParams.has(key)) {
        u.searchParams.set(key, value)
      }
    })
    return u.toString()
  } catch {
    return `${base}${base.includes('?') ? '&' : '?'}${qs}`
  }
}

export default function UtmBuilder(): React.JSX.Element {
  const [state, setState] = React.useState<UtmState>(EMPTY)

  const update = <K extends keyof UtmState>(key: K, value: string): void => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const taggedUrl = React.useMemo(() => buildTaggedUrl(state), [state])
  const baseUrlValid = isValidUrl(state.baseUrl.trim())
  const requiredMissing =
    !state.source.trim() || !state.medium.trim() || !state.campaign.trim()
  const tagCount = [
    state.source,
    state.medium,
    state.campaign,
    state.term,
    state.content,
  ].filter((v) => v.trim().length > 0).length

  const applyPreset = (preset: Preset): void => {
    setState((prev) => ({ ...prev, ...preset.values }))
    toast.success(`Preset applied: ${preset.label}`)
  }

  const reset = (): void => {
    setState(EMPTY)
    toast.success('Cleared all fields')
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>UTM Tag Builder</CardTitle>
          <CardDescription>
            Build campaign-tagged URLs for Google Analytics. Fill in the
            base URL and required UTM parameters (source, medium,
            campaign); term and content are optional. The tagged URL
            updates live below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Base URL"
            htmlFor="utm-base"
            hint={baseUrlValid ? 'valid' : 'must be http(s)://…'}
          >
            <Input
              id="utm-base"
              value={state.baseUrl}
              onChange={(e) => update('baseUrl', e.target.value)}
              placeholder="https://example.com/page"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              type="url"
              className={!baseUrlValid ? 'border-rose-500/60' : ''}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="utm_source *"
              htmlFor="utm-source"
              hint="referrer (newsletter, google, twitter)"
            >
              <Input
                id="utm-source"
                value={state.source}
                onChange={(e) => update('source', e.target.value)}
                placeholder="newsletter"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
            <Field
              label="utm_medium *"
              htmlFor="utm-medium"
              hint="channel (email, cpc, social)"
            >
              <Input
                id="utm-medium"
                value={state.medium}
                onChange={(e) => update('medium', e.target.value)}
                placeholder="email"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
            <Field
              label="utm_campaign *"
              htmlFor="utm-campaign"
              hint="campaign name (summer2024)"
            >
              <Input
                id="utm-campaign"
                value={state.campaign}
                onChange={(e) => update('campaign', e.target.value)}
                placeholder="summer2024"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
            <Field
              label="utm_term"
              htmlFor="utm-term"
              hint="optional — paid keywords"
            >
              <Input
                id="utm-term"
                value={state.term}
                onChange={(e) => update('term', e.target.value)}
                placeholder="running+shoes"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
            <Field
              label="utm_content"
              htmlFor="utm-content"
              hint="optional — ad variant"
            >
              <Input
                id="utm-content"
                value={state.content}
                onChange={(e) => update('content', e.target.value)}
                placeholder="top_banner"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Quick presets
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Button
                  key={p.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(p)}
                >
                  <Wand2 className="size-3.5" />
                  {p.label}
                </Button>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={reset}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Tags applied" value={tagCount} />
        <Stat
          label="Required fields"
          value={requiredMissing ? 'missing' : 'complete'}
          accent={requiredMissing ? 'oklch(0.7 0.18 75)' : 'oklch(0.6 0.17 150)'}
        />
        <Stat
          label="Base URL"
          value={baseUrlValid ? 'valid' : 'invalid'}
          accent={baseUrlValid ? 'oklch(0.6 0.17 150)' : 'oklch(0.6 0.22 25)'}
        />
        <Stat label="Final URL length" value={taggedUrl.length} />
      </div>

      {!baseUrlValid ? (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="size-4" />
          Enter a valid base URL (must start with{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            http://
          </code>{' '}
          or{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            https://
          </code>
          ).
        </div>
      ) : requiredMissing ? (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="size-4" />
          utm_source, utm_medium and utm_campaign are required for a valid
          tagged URL.
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          Tagged URL is ready to use.
        </div>
      )}

      <ResultBox
        value={taggedUrl}
        label="Tagged URL"
        rows={3}
        downloadName="tagged-url.txt"
        empty="Fill in the base URL and required UTM parameters to generate the tagged URL."
      />

      {taggedUrl ? (
        <div className="flex flex-wrap gap-2">
          <Button asChild type="button" variant="outline" size="sm">
            <a href={taggedUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5" />
              Open tagged URL
            </a>
          </Button>
          <Badge variant="outline" className="font-mono text-xs">
            {taggedUrl.length} chars
          </Badge>
        </div>
      ) : null}
    </div>
  )
}
