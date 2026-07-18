'use client'

import * as React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Field, ResultBox, Stat, randomInt } from '@/lib/tools/tool-ui'

interface SameAs {
  id: string
  url: string
}

interface OrgState {
  name: string
  legalName: string
  url: string
  logo: string
  description: string
  foundingDate: string
  founder: string
  email: string
  phone: string
  street: string
  city: string
  region: string
  postal: string
  country: string
  sameAs: SameAs[]
}

function makeId(): string {
  return `sa-${Date.now().toString(36)}-${randomInt(1_000_000).toString(36)}`
}

const DEFAULT: OrgState = {
  name: 'Fernandes Labs',
  legalName: 'Fernandes Labs, Inc.',
  url: 'https://fernandeslabs.com',
  logo: 'https://fernandeslabs.com/logo.png',
  description: 'We build polished developer tools and open-source utilities.',
  foundingDate: '2021-04-01',
  founder: 'Alex Fernandes',
  email: 'hello@fernandeslabs.com',
  phone: '+1-555-0100',
  street: '100 Market Street',
  city: 'San Francisco',
  region: 'CA',
  postal: '94105',
  country: 'US',
  sameAs: [
    { id: 's1', url: 'https://twitter.com/fernandeslabs' },
    { id: 's2', url: 'https://github.com/FernandesLabs' },
  ],
}

function buildJsonLd(s: OrgState): string {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
  }
  if (s.name.trim()) obj.name = s.name.trim()
  if (s.legalName.trim()) obj.legalName = s.legalName.trim()
  if (s.url.trim()) obj.url = s.url.trim()
  if (s.logo.trim()) obj.logo = s.logo.trim()
  if (s.description.trim()) obj.description = s.description.trim()
  if (s.foundingDate.trim()) obj.foundingDate = s.foundingDate.trim()
  if (s.founder.trim()) obj.founder = { '@type': 'Person', name: s.founder.trim() }
  if (s.email.trim()) obj.email = s.email.trim()
  if (s.phone.trim()) obj.telephone = s.phone.trim()

  const hasAddress =
    s.street.trim() ||
    s.city.trim() ||
    s.region.trim() ||
    s.postal.trim() ||
    s.country.trim()
  if (hasAddress) {
    const address: Record<string, string> = { '@type': 'PostalAddress' }
    if (s.street.trim()) address.streetAddress = s.street.trim()
    if (s.city.trim()) address.addressLocality = s.city.trim()
    if (s.region.trim()) address.addressRegion = s.region.trim()
    if (s.postal.trim()) address.postalCode = s.postal.trim()
    if (s.country.trim()) address.addressCountry = s.country.trim()
    obj.address = address
  }

  const sameAs = s.sameAs.map((x) => x.url.trim()).filter((u) => u.length > 0)
  if (sameAs.length > 0) obj.sameAs = sameAs

  return JSON.stringify(obj, null, 2)
}

export default function OrganizationSchemaGenerator(): React.JSX.Element {
  const [state, setState] = React.useState<OrgState>(DEFAULT)

  const update = <K extends keyof OrgState>(key: K, value: string): void => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const updateSameAs = (id: string, url: string): void => {
    setState((prev) => ({
      ...prev,
      sameAs: prev.sameAs.map((x) => (x.id === id ? { ...x, url } : x)),
    }))
  }

  const addSameAs = (): void => {
    if (state.sameAs.length >= 20) {
      toast.error('Maximum of 20 social URLs reached')
      return
    }
    setState((prev) => ({ ...prev, sameAs: [...prev.sameAs, { id: makeId(), url: '' }] }))
  }

  const removeSameAs = (id: string): void => {
    setState((prev) => ({
      ...prev,
      sameAs: prev.sameAs.filter((x) => x.id !== id),
    }))
  }

  const jsonLd = React.useMemo(() => buildJsonLd(state), [state])
  const filledSameAs = state.sameAs.filter((x) => x.url.trim().length > 0).length

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Organization Schema Generator</CardTitle>
          <CardDescription>
            Generate an Organization JSON-LD schema describing your company.
            Search engines use this for knowledge panels and rich results.
            All fields are optional — only filled fields are emitted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor="org-name">
              <Input
                id="org-name"
                value={state.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Fernandes Labs"
              />
            </Field>
            <Field label="Legal name" htmlFor="org-legal">
              <Input
                id="org-legal"
                value={state.legalName}
                onChange={(e) => update('legalName', e.target.value)}
                placeholder="Fernandes Labs, Inc."
              />
            </Field>
            <Field label="URL" htmlFor="org-url">
              <Input
                id="org-url"
                value={state.url}
                onChange={(e) => update('url', e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </Field>
            <Field label="Logo URL" htmlFor="org-logo">
              <Input
                id="org-logo"
                value={state.logo}
                onChange={(e) => update('logo', e.target.value)}
                placeholder="https://example.com/logo.png"
                type="url"
              />
            </Field>
            <Field label="Founding date" htmlFor="org-founding" hint="YYYY-MM-DD">
              <Input
                id="org-founding"
                value={state.foundingDate}
                onChange={(e) => update('foundingDate', e.target.value)}
                placeholder="2021-04-01"
              />
            </Field>
            <Field label="Founder" htmlFor="org-founder">
              <Input
                id="org-founder"
                value={state.founder}
                onChange={(e) => update('founder', e.target.value)}
                placeholder="Alex Fernandes"
              />
            </Field>
            <Field label="Email" htmlFor="org-email">
              <Input
                id="org-email"
                value={state.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="hello@example.com"
                type="email"
              />
            </Field>
            <Field label="Phone" htmlFor="org-phone">
              <Input
                id="org-phone"
                value={state.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+1-555-0100"
                type="tel"
              />
            </Field>
          </div>

          <Field label="Description" htmlFor="org-desc">
            <Textarea
              id="org-desc"
              value={state.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Short description of your organization."
              rows={3}
            />
          </Field>

          <div>
            <div className="mb-2 text-sm font-medium text-foreground">
              Postal address
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Street" htmlFor="org-street">
                <Input
                  id="org-street"
                  value={state.street}
                  onChange={(e) => update('street', e.target.value)}
                  placeholder="100 Market Street"
                />
              </Field>
              <Field label="City" htmlFor="org-city">
                <Input
                  id="org-city"
                  value={state.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="San Francisco"
                />
              </Field>
              <Field label="Region" htmlFor="org-region" hint="state / province">
                <Input
                  id="org-region"
                  value={state.region}
                  onChange={(e) => update('region', e.target.value)}
                  placeholder="CA"
                />
              </Field>
              <Field label="Postal code" htmlFor="org-postal">
                <Input
                  id="org-postal"
                  value={state.postal}
                  onChange={(e) => update('postal', e.target.value)}
                  placeholder="94105"
                />
              </Field>
              <Field label="Country" htmlFor="org-country" hint="ISO 3166-1 alpha-2">
                <Input
                  id="org-country"
                  value={state.country}
                  onChange={(e) => update('country', e.target.value)}
                  placeholder="US"
                />
              </Field>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Same-as social URLs
              </span>
              <Button type="button" variant="outline" size="sm" onClick={addSameAs}>
                <Plus className="size-4" />
                Add URL
              </Button>
            </div>
            <div className="space-y-2">
              {state.sameAs.map((x) => (
                <div key={x.id} className="flex items-center gap-2">
                  <Input
                    value={x.url}
                    onChange={(e) => updateSameAs(x.id, e.target.value)}
                    placeholder="https://twitter.com/handle"
                    type="url"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 text-rose-500 hover:text-rose-600"
                    onClick={() => removeSameAs(x.id)}
                    aria-label="Remove URL"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              {state.sameAs.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No social URLs added yet.
                </p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Name set" value={state.name.trim() ? 'Yes' : 'No'} accent={state.name.trim() ? 'oklch(0.6 0.17 150)' : 'oklch(0.6 0.2 25)'} />
        <Stat label="Has address" value={state.street.trim() || state.city.trim() ? 'Yes' : 'No'} />
        <Stat label="Social URLs" value={filledSameAs} />
        <Stat label="Schema size" value={`${jsonLd.length} chars`} />
      </div>

      <ResultBox
        value={jsonLd}
        label="Organization JSON-LD"
        rows={12}
        downloadName="organization.json"
        empty="Fill in at least one field to generate the schema."
      />

      {filledSameAs > 0 ? (
        <div className="flex flex-wrap gap-2">
          {state.sameAs
            .filter((x) => x.url.trim())
            .map((x) => (
              <Badge key={x.id} variant="outline" className="font-mono text-xs">
                {x.url.trim().replace(/^https?:\/\//, '').slice(0, 40)}
              </Badge>
            ))}
        </div>
      ) : null}
    </div>
  )
}
