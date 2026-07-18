'use client'

import * as React from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Wand2,
  Eraser,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Field, ResultBox, Stat, randomInt } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
import { toast } from 'sonner'

interface CustomParam {
  id: string
  key: string
  value: string
}

interface CampaignState {
  baseUrl: string
  source: string
  medium: string
  campaign: string
  term: string
  content: string
  customs: CustomParam[]
}

interface Preset {
  label: string
  values: Pick<CampaignState, 'source' | 'medium' | 'campaign' | 'term' | 'content'>
}

const PRESETS: Preset[] = [
  {
    label: 'Email newsletter',
    values: {
      source: 'newsletter',
      medium: 'email',
      campaign: 'weekly_digest',
      term: '',
      content: 'header_cta',
    },
  },
  {
    label: 'Google Ads',
    values: {
      source: 'google',
      medium: 'cpc',
      campaign: 'search_brand',
      term: 'running shoes',
      content: 'ad_variant_a',
    },
  },
  {
    label: 'Facebook Ads',
    values: {
      source: 'facebook',
      medium: 'social',
      campaign: 'awareness_q4',
      term: '',
      content: 'video_ad',
    },
  },
  {
    label: 'Affiliate link',
    values: {
      source: 'affiliate',
      medium: 'referral',
      campaign: 'partner_program',
      term: '',
      content: 'partner_id_42',
    },
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

function makeId(): string {
  // Lightweight unique id for list keys (uses secure RNG, no Math.random).
  return `${Date.now().toString(36)}-${randomInt(1_000_000).toString(36)}`
}

interface BuiltUrl {
  final: string
  queryString: string
  params: { key: string; value: string }[]
  displayShort: string
}

function buildUrl(state: CampaignState): BuiltUrl {
  const base = state.baseUrl.trim()
  if (!isValidUrl(base)) {
    return { final: '', queryString: '', params: [], displayShort: '' }
  }
  const pairs: { key: string; value: string }[] = []
  if (state.source.trim()) pairs.push({ key: 'utm_source', value: state.source.trim() })
  if (state.medium.trim()) pairs.push({ key: 'utm_medium', value: state.medium.trim() })
  if (state.campaign.trim()) pairs.push({ key: 'utm_campaign', value: state.campaign.trim() })
  if (state.term.trim()) pairs.push({ key: 'utm_term', value: state.term.trim() })
  if (state.content.trim()) pairs.push({ key: 'utm_content', value: state.content.trim() })
  for (const c of state.customs) {
    const k = c.key.trim()
    const v = c.value.trim()
    if (k && v) pairs.push({ key: k, value: v })
  }

  try {
    const u = new URL(base)
    for (const p of pairs) {
      if (!u.searchParams.has(p.key)) {
        u.searchParams.set(p.key, p.value)
      }
    }
    const final = u.toString()
    const queryString = u.search ? u.search.slice(1) : ''
    // Shortened display: replace query string with ellipsis if very long.
    const displayShort =
      final.length > 80
        ? `${final.slice(0, 50)}…${final.slice(-25)}`
        : final
    return { final, queryString, params: pairs, displayShort }
  } catch {
    return { final: '', queryString: '', params: [], displayShort: '' }
  }
}

const INITIAL: CampaignState = {
  baseUrl: 'https://example.com/landing',
  source: '',
  medium: '',
  campaign: '',
  term: '',
  content: '',
  customs: [],
}

export default function CampaignUrlBuilder(): React.JSX.Element {
  const [state, setState] = React.useState<CampaignState>(INITIAL)
  const { copy } = useCopy()

  const update = <K extends keyof CampaignState>(
    key: K,
    value: CampaignState[K]
  ): void => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const built = React.useMemo(() => buildUrl(state), [state])

  const baseUrlValid = isValidUrl(state.baseUrl.trim())
  const requiredMissing =
    !state.source.trim() || !state.medium.trim() || !state.campaign.trim()
  const totalParams = built.params.length

  const applyPreset = (preset: Preset): void => {
    setState((prev) => ({ ...prev, ...preset.values }))
    toast.success(`Preset applied: ${preset.label}`)
  }

  const reset = (): void => {
    setState(INITIAL)
    toast.success('Cleared all fields')
  }

  const addCustom = (): void => {
    setState((prev) => ({
      ...prev,
      customs: [...prev.customs, { id: makeId(), key: '', value: '' }],
    }))
  }

  const updateCustom = (id: string, field: 'key' | 'value', value: string): void => {
    setState((prev) => ({
      ...prev,
      customs: prev.customs.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }))
  }

  const removeCustom = (id: string): void => {
    setState((prev) => ({
      ...prev,
      customs: prev.customs.filter((c) => c.id !== id),
    }))
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Campaign URL Builder</CardTitle>
          <CardDescription>
            Build comprehensive campaign-tagged URLs with UTM parameters and
            custom key-value pairs. Live output, validation, presets, and a
            parameter breakdown. Everything runs in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Base URL"
            htmlFor="cub-base"
            hint={baseUrlValid ? 'valid' : 'must be http(s)://…'}
          >
            <Input
              id="cub-base"
              value={state.baseUrl}
              onChange={(e) => update('baseUrl', e.target.value)}
              placeholder="https://example.com/landing"
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
              htmlFor="cub-source"
              hint="referrer (google, newsletter)"
            >
              <Input
                id="cub-source"
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
              htmlFor="cub-medium"
              hint="channel (email, cpc, social)"
            >
              <Input
                id="cub-medium"
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
              htmlFor="cub-campaign"
              hint="campaign name"
            >
              <Input
                id="cub-campaign"
                value={state.campaign}
                onChange={(e) => update('campaign', e.target.value)}
                placeholder="summer_launch"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
            <Field
              label="utm_term"
              htmlFor="cub-term"
              hint="optional — paid keywords"
            >
              <Input
                id="cub-term"
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
              htmlFor="cub-content"
              hint="optional — ad variant"
            >
              <Input
                id="cub-content"
                value={state.content}
                onChange={(e) => update('content', e.target.value)}
                placeholder="header_cta"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </Field>
          </div>

          {/* Custom parameters */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Custom parameters</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustom}
              >
                <Plus className="size-3.5" />
                Add parameter
              </Button>
            </div>
            {state.customs.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No custom parameters. Add any extra key-value pairs (e.g.{' '}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                  affiliate_id
                </code>
                ).
              </p>
            ) : (
              <div className="space-y-2">
                {state.customs.map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <Input
                      value={c.key}
                      onChange={(e) => updateCustom(c.id, 'key', e.target.value)}
                      placeholder="key"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className="font-mono text-sm"
                      aria-label="Custom parameter key"
                    />
                    <span className="text-muted-foreground">=</span>
                    <Input
                      value={c.value}
                      onChange={(e) => updateCustom(c.id, 'value', e.target.value)}
                      placeholder="value"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className="font-mono text-sm"
                      aria-label="Custom parameter value"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCustom(c.id)}
                      aria-label="Remove parameter"
                      className="text-muted-foreground hover:text-rose-500"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Presets */}
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
              <Button type="button" variant="ghost" size="sm" onClick={reset}>
                <Eraser className="size-3.5" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Parameters" value={totalParams} />
        <Stat
          label="Base URL"
          value={baseUrlValid ? 'valid' : 'invalid'}
          accent={baseUrlValid ? 'oklch(0.6 0.17 150)' : 'oklch(0.6 0.22 25)'}
        />
        <Stat
          label="Required"
          value={requiredMissing ? 'missing' : 'complete'}
          accent={requiredMissing ? 'oklch(0.7 0.18 75)' : 'oklch(0.6 0.17 150)'}
        />
        <Stat label="URL length" value={built.final.length} />
      </div>

      {!baseUrlValid ? (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="size-4" />
          Enter a valid base URL (must start with{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">http://</code>{' '}
          or{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">https://</code>
          ).
        </div>
      ) : requiredMissing ? (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="size-4" />
          utm_source, utm_medium, and utm_campaign are required for a valid
          tagged URL.
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          Campaign URL is ready.
        </div>
      )}

      <ResultBox
        value={built.final}
        label="Campaign URL"
        rows={3}
        downloadName="campaign-url.txt"
        empty="Fill in the base URL and required UTM parameters to generate the tagged URL."
      />

      {built.final ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copy(built.final, 'Campaign URL copied')}
          >
            <ExternalLink className="size-3.5" />
            Copy URL
          </Button>
          <Button asChild type="button" variant="ghost" size="sm">
            <a href={built.final} target="_blank" rel="noopener noreferrer">
              Open in new tab
            </a>
          </Button>
          <Badge variant="outline" className="font-mono text-xs">
            {built.final.length} chars
          </Badge>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Shortened display" htmlFor="cub-short">
          <Input
            id="cub-short"
            readOnly
            value={built.displayShort}
            className="font-mono text-xs"
          />
        </Field>
        <Field label="Raw query string" htmlFor="cub-qs">
          <Input
            id="cub-qs"
            readOnly
            value={built.queryString}
            className="font-mono text-xs"
          />
        </Field>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parameter breakdown</CardTitle>
          <CardDescription>
            All parameters that will be appended to the final URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {built.params.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No parameters yet. Fill in UTM fields above to see the breakdown.
            </p>
          ) : (
            <div className="fl-scroll max-h-72 overflow-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {built.params.map((p) => (
                    <TableRow key={p.key}>
                      <TableCell className="font-mono text-xs">{p.key}</TableCell>
                      <TableCell className="font-mono text-xs break-all">
                        {p.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
