'use client'
import * as React from 'react'
import { Mail, Phone, Globe, MapPin, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Field, ResultBox, downloadBlob } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
type Template = 'minimal' | 'classic' | 'modern'
interface SignatureData {
  name: string
  title: string
  company: string
  email: string
  phone: string
  website: string
  address: string
  photoUrl: string
  brandColor: string
  linkedin: string
  twitter: string
  github: string
}
const DEFAULT_DATA: SignatureData = {
  name: 'Jordan Rivera',
  title: 'Product Designer',
  company: 'Fernandes Labs',
  email: 'jordan@fernandeslabs.com',
  phone: '+1 (415) 555-0142',
  website: 'fernandeslabs.com',
  address: '123 Market St, San Francisco, CA',
  photoUrl: '',
  brandColor: '#0ea5e9',
  linkedin: 'linkedin.com/in/jordanrivera',
  twitter: 'twitter.com/jordanrivera',
  github: 'github.com/jordanrivera',
}
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
function escMultiline(s: string): string {
  return esc(s).replace(/\n/g, '<br />')
}
function normalizeUrl(url: string): string {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}
function buildSocialLinks(data: SignatureData, color: string): string {
  const links: string[] = []
  if (data.linkedin) {
    links.push(
      `<a href="${esc(normalizeUrl(data.linkedin))}" style="color:${color};text-decoration:none;">LinkedIn</a>`
    )
  }
  if (data.twitter) {
    links.push(
      `<a href="${esc(normalizeUrl(data.twitter))}" style="color:${color};text-decoration:none;">Twitter</a>`
    )
  }
  if (data.github) {
    links.push(
      `<a href="${esc(normalizeUrl(data.github))}" style="color:${color};text-decoration:none;">GitHub</a>`
    )
  }
  return links.join(
    ` <span style="color:#cbd5e1;margin:0 4px;">·</span> `
  )
}
function buildMinimal(data: SignatureData): string {
  const color = data.brandColor || '#0ea5e9'
  const rows: string[] = []
  rows.push(
    `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#0f172a;padding:0 0 2px;">${esc(data.name) || 'Your Name'}</td></tr>`
  )
  if (data.title || data.company) {
    rows.push(
      `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#64748b;padding:0 0 6px;">${esc(data.title)}${data.title && data.company ? ' · ' : ''}${esc(data.company)}</td></tr>`
    )
  }
  const contact: string[] = []
  if (data.email) {
    contact.push(
      `<a href="mailto:${esc(data.email)}" style="color:${color};text-decoration:none;">${esc(data.email)}</a>`
    )
  }
  if (data.phone) {
    contact.push(`<span style="color:#475569;">${esc(data.phone)}</span>`)
  }
  if (data.website) {
    contact.push(
      `<a href="${esc(normalizeUrl(data.website))}" style="color:${color};text-decoration:none;">${esc(data.website)}</a>`
    )
  }
  if (contact.length > 0) {
    rows.push(
      `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;padding:0 0 4px;">${contact.join(' <span style="color:#cbd5e1;margin:0 4px;">·</span> ')}</td></tr>`
    )
  }
  if (data.address) {
    rows.push(
      `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#94a3b8;padding:0 0 4px;">${escMultiline(data.address)}</td></tr>`
    )
  }
  const social = buildSocialLinks(data, color)
  if (social) {
    rows.push(
      `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;padding:4px 0 0;">${social}</td></tr>`
    )
  }
  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows.join(
    ''
  )}</table>`
}
function buildClassic(data: SignatureData): string {
  const color = data.brandColor || '#0ea5e9'
  const photoCell = data.photoUrl
    ? `<td style="padding-right:14px;vertical-align:top;"><img src="${esc(
        data.photoUrl
      )}" width="72" height="72" alt="${esc(
        data.name
      )}" style="border-radius:50%;width:72px;height:72px;display:block;border:2px solid ${color};" /></td>`
    : ''
  const infoRows: string[] = []
  infoRows.push(
    `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#0f172a;padding:0 0 2px;">${esc(data.name) || 'Your Name'}</td></tr>`
  )
  if (data.title || data.company) {
    infoRows.push(
      `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${color};font-weight:600;padding:0 0 8px;">${esc(data.title)}${data.title && data.company ? ' · ' : ''}${esc(data.company)}</td></tr>`
    )
  }
  const contact: string[] = []
  if (data.email) {
    contact.push(
      `<a href="mailto:${esc(data.email)}" style="color:#475569;text-decoration:none;">${esc(data.email)}</a>`
    )
  }
  if (data.phone) {
    contact.push(
      `<a href="tel:${esc(data.phone.replace(/\s+/g, ''))}" style="color:#475569;text-decoration:none;">${esc(data.phone)}</a>`
    )
  }
  if (data.website) {
    contact.push(
      `<a href="${esc(normalizeUrl(data.website))}" style="color:#475569;text-decoration:none;">${esc(data.website)}</a>`
    )
  }
  if (contact.length > 0) {
    infoRows.push(
      `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#475569;padding:0 0 4px;line-height:1.5;">${contact.join('<br />')}</td></tr>`
    )
  }
  if (data.address) {
    infoRows.push(
      `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#94a3b8;padding:0 0 6px;line-height:1.5;">${escMultiline(data.address)}</td></tr>`
    )
  }
  const social = buildSocialLinks(data, color)
  if (social) {
    infoRows.push(
      `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;padding:4px 0 0;">${social}</td></tr>`
    )
  }
  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${photoCell}<td style="border-left:${data.photoUrl ? `3px solid ${color}` : '0'};${data.photoUrl ? 'padding-left:14px;' : ''}vertical-align:top;"><table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${infoRows.join(
    ''
  )}</table></td></tr></table>`
}
function buildModern(data: SignatureData): string {
  const color = data.brandColor || '#0ea5e9'
  const photoCell = data.photoUrl
    ? `<td style="padding-right:16px;vertical-align:middle;"><img src="${esc(
        data.photoUrl
      )}" width="84" height="84" alt="${esc(
        data.name
      )}" style="border-radius:12px;width:84px;height:84px;display:block;object-fit:cover;" /></td>`
    : ''
  const infoRows: string[] = []
  infoRows.push(
    `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;color:${color};padding:0 0 1px;letter-spacing:-0.01em;">${esc(data.name) || 'Your Name'}</td></tr>`
  )
  if (data.title || data.company) {
    infoRows.push(
      `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#64748b;font-weight:500;padding:0 0 8px;">${esc(data.title)}${data.title && data.company ? ' at ' : ''}<span style="color:#0f172a;font-weight:600;">${esc(data.company)}</span></td></tr>`
    )
  }
  const contact: string[] = []
  if (data.email) {
    contact.push(
      `<a href="mailto:${esc(data.email)}" style="color:#475569;text-decoration:none;font-weight:500;">${esc(data.email)}</a>`
    )
  }
  if (data.phone) {
    contact.push(
      `<a href="tel:${esc(data.phone.replace(/\s+/g, ''))}" style="color:#475569;text-decoration:none;font-weight:500;">${esc(data.phone)}</a>`
    )
  }
  if (data.website) {
    contact.push(
      `<a href="${esc(normalizeUrl(data.website))}" style="color:${color};text-decoration:none;font-weight:600;">${esc(data.website)}</a>`
    )
  }
  if (contact.length > 0) {
    infoRows.push(
      `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;padding:0 0 6px;line-height:1.6;">${contact.join('<br />')}</td></tr>`
    )
  }
  if (data.address) {
    infoRows.push(
      `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#94a3b8;padding:0 0 6px;line-height:1.5;">${escMultiline(data.address)}</td></tr>`
    )
  }
  const social = buildSocialLinks(data, color)
  if (social) {
    infoRows.push(
      `<tr><td style="padding-top:6px;border-top:1px solid #e2e8f0;font-family:Arial,Helvetica,sans-serif;font-size:11px;padding-top:8px;">${social}</td></tr>`
    )
  }
  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${photoCell}<td style="vertical-align:middle;"><table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${infoRows.join(
    ''
  )}</table></td></tr></table>`
}
function buildSignature(template: Template, data: SignatureData): string {
  if (template === 'minimal') return buildMinimal(data)
  if (template === 'classic') return buildClassic(data)
  return buildModern(data)
}
export default function EmailSignatureGenerator() {
  const [data, setData] = React.useState<SignatureData>(DEFAULT_DATA)
  const [template, setTemplate] = React.useState<Template>('modern')
  const { copied, copy } = useCopy()
  const update = <K extends keyof SignatureData>(
    key: K,
    value: SignatureData[K]
  ) => setData((prev) => ({ ...prev, [key]: value }))
  const html = React.useMemo(
    () => buildSignature(template, data),
    [template, data]
  )
  const handleDownload = () => {
    const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Email signature — ${esc(data.name)}</title>
</head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
<div style="background:#ffffff;padding:24px;border-radius:8px;max-width:600px;">
${html}
</div>
<p style="font-size:11px;color:#94a3b8;margin-top:12px;">Right-click the signature above and select "Copy" to paste into your email client.</p>
</body>
</html>`
    downloadBlob(
      new Blob([doc], { type: 'text/html;charset=utf-8' }),
      `email-signature.html`
    )
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email Signature Generator</CardTitle>
          <CardDescription>
            Build a table-based HTML signature compatible with Gmail,
            Outlook, Apple Mail and other clients. Switch templates and
            copy the generated HTML.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name" htmlFor="sig-name">
              <Input
                id="sig-name"
                value={data.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Jordan Rivera"
              />
            </Field>
            <Field label="Job title" htmlFor="sig-title">
              <Input
                id="sig-title"
                value={data.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Product Designer"
              />
            </Field>
            <Field label="Company" htmlFor="sig-company">
              <Input
                id="sig-company"
                value={data.company}
                onChange={(e) => update('company', e.target.value)}
                placeholder="Fernandes Labs"
              />
            </Field>
            <Field label="Email" htmlFor="sig-email">
              <Input
                id="sig-email"
                type="email"
                value={data.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="jordan@example.com"
              />
            </Field>
            <Field label="Phone" htmlFor="sig-phone">
              <Input
                id="sig-phone"
                value={data.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+1 (415) 555-0142"
              />
            </Field>
            <Field label="Website" htmlFor="sig-website">
              <Input
                id="sig-website"
                value={data.website}
                onChange={(e) => update('website', e.target.value)}
                placeholder="example.com"
              />
            </Field>
            <Field label="Address" htmlFor="sig-address" hint="optional">
              <Textarea
                id="sig-address"
                value={data.address}
                onChange={(e) => update('address', e.target.value)}
                rows={2}
                placeholder="123 Market St, San Francisco, CA"
              />
            </Field>
            <Field label="Photo URL" htmlFor="sig-photo" hint="optional">
              <Input
                id="sig-photo"
                type="url"
                value={data.photoUrl}
                onChange={(e) => update('photoUrl', e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand color" htmlFor="sig-color">
              <div className="flex items-center gap-2">
                <input
                  id="sig-color"
                  type="color"
                  value={data.brandColor}
                  onChange={(e) => update('brandColor', e.target.value)}
                  className="size-9 cursor-pointer rounded-md border border-input bg-transparent p-1"
                  aria-label="Pick brand color"
                />
                <Input
                  value={data.brandColor}
                  onChange={(e) => update('brandColor', e.target.value)}
                  className="w-32 font-mono"
                  aria-label="Brand color hex"
                />
              </div>
            </Field>
          </div>
          <div>
            <Label className="mb-2 block text-sm font-medium">
              Social links
            </Label>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="LinkedIn" htmlFor="sig-linkedin">
                <Input
                  id="sig-linkedin"
                  value={data.linkedin}
                  onChange={(e) => update('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/username"
                />
              </Field>
              <Field label="Twitter / X" htmlFor="sig-twitter">
                <Input
                  id="sig-twitter"
                  value={data.twitter}
                  onChange={(e) => update('twitter', e.target.value)}
                  placeholder="twitter.com/username"
                />
              </Field>
              <Field label="GitHub" htmlFor="sig-github">
                <Input
                  id="sig-github"
                  value={data.github}
                  onChange={(e) => update('github', e.target.value)}
                  placeholder="github.com/username"
                />
              </Field>
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs
        value={template}
        onValueChange={(v) => setTemplate(v as Template)}
      >
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="minimal">Minimal</TabsTrigger>
            <TabsTrigger value="classic">Classic</TabsTrigger>
            <TabsTrigger value="modern">Modern</TabsTrigger>
          </TabsList>
          <div className="hidden gap-3 text-xs text-muted-foreground sm:flex">
            <span className="inline-flex items-center gap-1">
              <Mail className="size-3" /> Email
            </span>
            <span className="inline-flex items-center gap-1">
              <Phone className="size-3" /> Phone
            </span>
            <span className="inline-flex items-center gap-1">
              <Globe className="size-3" /> Web
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" /> Address
            </span>
          </div>
        </div>
        <TabsContent value="minimal" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Minimal — clean one-column</CardTitle>
              <CardDescription>
                No photo, text-only, subtle middle-dot separators.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="classic" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Classic — photo + accent bar</CardTitle>
              <CardDescription>
                Round photo with brand-color border, vertical accent bar.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="modern" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Modern — bold name, rounded photo</CardTitle>
              <CardDescription>
                Brand-colored name, larger rounded-square photo, divider
                above social links.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Live preview</CardTitle>
            <CardDescription>
              How your signature will look in most email clients.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(html, 'Signature HTML copied')}
            >
              {copied ? 'Copied' : 'Copy HTML'}
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="bg-primary text-primary-foreground"
            >
              <Download className="size-4" />
              Download HTML
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="overflow-auto rounded-lg border border-border bg-white p-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </CardContent>
      </Card>
      <ResultBox
        value={html}
        label="Signature HTML"
        downloadName="email-signature.html"
        rows={12}
        empty="Fill in the fields above to generate your signature."
      />
    </div>
  )
}