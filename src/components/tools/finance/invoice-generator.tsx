'use client'

import * as React from 'react'
import { Plus, Trash2, Download, FileText, Printer } from 'lucide-react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Field, Stat, downloadBlob } from '@/lib/tools/tool-ui'

interface LineItem {
  id: number
  description: string
  quantity: string
  unitPrice: string
}

interface InvoiceData {
  companyName: string
  companyAddress: string
  clientName: string
  clientAddress: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  taxRate: string
  currency: string
  notes: string
  items: LineItem[]
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'BRL'] as const
type Currency = (typeof CURRENCIES)[number]

const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  INR: '₹',
  BRL: 'R$',
}

const CURRENCY_LOCALE: Record<Currency, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  CAD: 'en-CA',
  AUD: 'en-AU',
  JPY: 'ja-JP',
  INR: 'en-IN',
  BRL: 'pt-BR',
}

const todayISO = () => new Date().toISOString().slice(0, 10)
const addDaysISO = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function parseNum(value: string): number {
  const trimmed = value.trim()
  if (trimmed === '') return 0
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : 0
}

function formatMoney(amount: number, currency: Currency): string {
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${CURRENCY_SYMBOL[currency]}${amount.toFixed(2)}`
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br />')
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function buildStandaloneHtml(data: InvoiceData, totals: Totals): string {
  const cur = data.currency as Currency
  const symbol = CURRENCY_SYMBOL[cur]
  const rowsHtml = data.items
    .map(
      (item, idx) => `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;">${idx + 1}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;">${esc(item.description) || '&nbsp;'}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">${esc(item.quantity) || '0'}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">${formatMoney(parseNum(item.unitPrice), cur)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:600;">${formatMoney(parseNum(item.quantity) * parseNum(item.unitPrice), cur)}</td>
      </tr>`
    )
    .join('\n')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Invoice ${esc(data.invoiceNumber) || ''}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 2rem; background: #fff; }
  .invoice { max-width: 760px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; }
  .brand-name { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem; }
  .brand-addr { font-size: 0.85rem; color: #64748b; white-space: pre-line; margin: 0; }
  .invoice-meta { text-align: right; }
  .invoice-title { font-size: 2rem; font-weight: 800; letter-spacing: 0.05em; color: #0f172a; margin: 0; text-transform: uppercase; }
  .invoice-no { font-size: 0.85rem; color: #64748b; margin-top: 0.25rem; }
  .parties { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
  .party-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 0.25rem; }
  .party-name { font-weight: 600; color: #0f172a; }
  .party-addr { font-size: 0.85rem; color: #475569; white-space: pre-line; }
  .dates { display: flex; gap: 2rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .date-block .date-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; }
  .date-block .date-value { font-size: 0.95rem; font-weight: 600; color: #0f172a; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
  thead th { background: #0f172a; color: #fff; text-align: left; padding: 10px 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  thead th.right { text-align: right; }
  tbody td { font-size: 0.9rem; }
  .totals { margin-left: auto; width: 100%; max-width: 320px; }
  .totals .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 0.9rem; }
  .totals .row.grand { border-top: 2px solid #0f172a; margin-top: 6px; padding-top: 12px; font-size: 1.1rem; font-weight: 700; }
  .notes { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.8rem; color: #64748b; white-space: pre-line; }
  .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; text-align: center; font-size: 0.75rem; color: #94a3b8; }
  @media print {
    body { padding: 0; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div>
      <h1 class="brand-name">${esc(data.companyName) || 'Your Company'}</h1>
      <p class="brand-addr">${esc(data.companyAddress) || ''}</p>
    </div>
    <div class="invoice-meta">
      <div class="invoice-title">Invoice</div>
      <div class="invoice-no">#${esc(data.invoiceNumber) || '—'}</div>
    </div>
  </div>
  <div class="parties">
    <div>
      <div class="party-label">Bill To</div>
      <div class="party-name">${esc(data.clientName) || '—'}</div>
      <div class="party-addr">${esc(data.clientAddress) || ''}</div>
    </div>
  </div>
  <div class="dates">
    <div class="date-block">
      <div class="date-label">Issue Date</div>
      <div class="date-value">${formatDate(data.issueDate)}</div>
    </div>
    <div class="date-block">
      <div class="date-label">Due Date</div>
      <div class="date-value">${formatDate(data.dueDate)}</div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 40px;">#</th>
        <th>Description</th>
        <th class="right" style="width: 80px;">Qty</th>
        <th class="right" style="width: 120px;">Unit Price</th>
        <th class="right" style="width: 140px;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml || '<tr><td colspan="5" style="padding:20px;text-align:center;color:#94a3b8;">No line items</td></tr>'}
    </tbody>
  </table>
  <div class="totals">
    <div class="row"><span>Subtotal</span><span>${formatMoney(totals.subtotal, cur)}</span></div>
    <div class="row"><span>Tax (${totals.taxRatePct.toFixed(2)}%)</span><span>${formatMoney(totals.tax, cur)}</span></div>
    <div class="row grand"><span>Total</span><span>${formatMoney(totals.total, cur)}</span></div>
  </div>
  ${data.notes ? `<div class="notes">${esc(data.notes)}</div>` : ''}
  <div class="footer">Thank you for your business · ${symbol} amounts in ${cur}</div>
</div>
</body>
</html>`
}

interface Totals {
  subtotal: number
  tax: number
  total: number
  taxRatePct: number
}

const DEFAULT_DATA: InvoiceData = {
  companyName: 'Fernandes Labs LLC',
  companyAddress: '123 Market Street, Suite 400\nSan Francisco, CA 94103\ncontact@fernandeslabs.com',
  clientName: 'Acme Corp',
  clientAddress: '500 Enterprise Way\nAustin, TX 78701',
  invoiceNumber: 'INV-0001',
  issueDate: todayISO(),
  dueDate: addDaysISO(30),
  taxRate: '8.5',
  currency: 'USD',
  notes: 'Payment due within 30 days. Late payments subject to 1.5% monthly interest.',
  items: [
    { id: 1, description: 'Consulting — discovery workshop', quantity: '8', unitPrice: '150' },
    { id: 2, description: 'UI design (5 screens)', quantity: '5', unitPrice: '320' },
    { id: 3, description: 'Frontend development', quantity: '40', unitPrice: '95' },
  ],
}

function computeTotals(data: InvoiceData): Totals {
  let subtotal = 0
  for (const item of data.items) {
    subtotal += parseNum(item.quantity) * parseNum(item.unitPrice)
  }
  const taxRatePct = parseNum(data.taxRate)
  const tax = subtotal * (taxRatePct / 100)
  const total = subtotal + tax
  return { subtotal, tax, total, taxRatePct }
}

export default function InvoiceGenerator() {
  const idCounter = React.useRef(100)
  const [data, setData] = React.useState<InvoiceData>(DEFAULT_DATA)

  const totals = React.useMemo(() => computeTotals(data), [data])
  const currency = data.currency as Currency

  const update = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }))

  const updateItem = (id: number, patch: Partial<LineItem>) =>
    setData((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }))

  const addItem = () =>
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: ++idCounter.current,
          description: '',
          quantity: '1',
          unitPrice: '0',
        },
      ],
    }))

  const removeItem = (id: number) =>
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id),
    }))

  const handleDownload = () => {
    const html = buildStandaloneHtml(data, totals)
    downloadBlob(
      new Blob([html], { type: 'text/html;charset=utf-8' }),
      `invoice-${data.invoiceNumber || 'draft'}.html`
    )
  }

  const handlePrint = () => {
    const html = buildStandaloneHtml(data, totals)
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 250)
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4" />
            Invoice Generator
          </CardTitle>
          <CardDescription>
            Build a professional, printable invoice. Live preview updates as
            you type. Download a standalone HTML file or print directly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Your company
              </h3>
              <Field label="Company name" htmlFor="inv-co-name">
                <Input
                  id="inv-co-name"
                  value={data.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                  placeholder="Fernandes Labs LLC"
                />
              </Field>
              <Field label="Company address" htmlFor="inv-co-addr">
                <Textarea
                  id="inv-co-addr"
                  value={data.companyAddress}
                  onChange={(e) => update('companyAddress', e.target.value)}
                  rows={3}
                  placeholder="Street, city, country, email"
                />
              </Field>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Bill to
              </h3>
              <Field label="Client name" htmlFor="inv-cl-name">
                <Input
                  id="inv-cl-name"
                  value={data.clientName}
                  onChange={(e) => update('clientName', e.target.value)}
                  placeholder="Acme Corp"
                />
              </Field>
              <Field label="Client address" htmlFor="inv-cl-addr">
                <Textarea
                  id="inv-cl-addr"
                  value={data.clientAddress}
                  onChange={(e) => update('clientAddress', e.target.value)}
                  rows={3}
                  placeholder="Street, city, country"
                />
              </Field>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Invoice #" htmlFor="inv-no">
              <Input
                id="inv-no"
                value={data.invoiceNumber}
                onChange={(e) => update('invoiceNumber', e.target.value)}
                placeholder="INV-0001"
              />
            </Field>
            <Field label="Issue date" htmlFor="inv-issue">
              <Input
                id="inv-issue"
                type="date"
                value={data.issueDate}
                onChange={(e) => update('issueDate', e.target.value)}
              />
            </Field>
            <Field label="Due date" htmlFor="inv-due">
              <Input
                id="inv-due"
                type="date"
                value={data.dueDate}
                onChange={(e) => update('dueDate', e.target.value)}
              />
            </Field>
            <Field label="Currency" htmlFor="inv-cur">
              <select
                id="inv-cur"
                value={data.currency}
                onChange={(e) => update('currency', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c} ({CURRENCY_SYMBOL[c]})
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Tax rate" htmlFor="inv-tax" hint="percent">
            <Input
              id="inv-tax"
              inputMode="decimal"
              value={data.taxRate}
              onChange={(e) => update('taxRate', e.target.value)}
              className="w-32"
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Line items</CardTitle>
            <CardDescription>
              Quantity × unit price = line total.
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={addItem}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="size-4" />
            Add row
          </Button>
        </CardHeader>
        <CardContent>
          {data.items.length === 0 ? (
            <div className="rounded-md border border-dashed border-border/70 bg-muted/20 px-3 py-8 text-center text-sm text-muted-foreground">
              No line items yet. Click “Add row” to begin.
            </div>
          ) : (
            <ScrollArea className="max-h-96 rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Description</TableHead>
                    <TableHead className="w-20 text-right">Qty</TableHead>
                    <TableHead className="w-28 text-right">Unit price</TableHead>
                    <TableHead className="w-28 text-right">Total</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((item) => {
                    const lineTotal =
                      parseNum(item.quantity) * parseNum(item.unitPrice)
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) =>
                              updateItem(item.id, {
                                description: e.target.value,
                              })
                            }
                            placeholder="Service or product"
                            className="h-8 border-0 px-1 shadow-none focus-visible:ring-1"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, { quantity: e.target.value })
                            }
                            inputMode="decimal"
                            className="h-8 text-right shadow-none focus-visible:ring-1"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(item.id, {
                                unitPrice: e.target.value,
                              })
                            }
                            inputMode="decimal"
                            className="h-8 text-right shadow-none focus-visible:ring-1"
                          />
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {formatMoney(lineTotal, currency)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove row"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}

          <div className="mt-4 flex flex-col items-end gap-1 text-sm">
            <div className="flex w-56 justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono tabular-nums">
                {formatMoney(totals.subtotal, currency)}
              </span>
            </div>
            <div className="flex w-56 justify-between">
              <span className="text-muted-foreground">
                Tax ({totals.taxRatePct.toFixed(2)}%)
              </span>
              <span className="font-mono tabular-nums">
                {formatMoney(totals.tax, currency)}
              </span>
            </div>
            <div className="flex w-56 justify-between border-t border-border pt-1 text-base font-bold">
              <span>Total</span>
              <span className="font-mono tabular-nums">
                {formatMoney(totals.total, currency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Field label="Notes / payment terms" htmlFor="inv-notes">
        <Textarea
          id="inv-notes"
          value={data.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={3}
          placeholder="Payment due within 30 days. Late payments subject to 1.5% monthly interest."
        />
      </Field>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Items" value={data.items.length} />
        <Stat
          label="Subtotal"
          value={formatMoney(totals.subtotal, currency)}
        />
        <Stat
          label="Tax"
          value={formatMoney(totals.tax, currency)}
          accent="#0ea5e9"
        />
        <Stat
          label="Total"
          value={formatMoney(totals.total, currency)}
          accent="#16a34a"
        />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Live preview</CardTitle>
            <CardDescription>
              Rendered invoice — downloads as a standalone printable HTML
              file.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={data.items.length === 0}
            >
              <Printer className="size-4" />
              Print
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
          <ScrollArea className="max-h-[600px] rounded-lg border border-border bg-white p-6">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-bold text-slate-900">
                    {data.companyName || 'Your Company'}
                  </div>
                  <div className="whitespace-pre-line text-xs text-slate-500">
                    {data.companyAddress}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold uppercase tracking-wider text-slate-900">
                    Invoice
                  </div>
                  <div className="text-xs text-slate-500">
                    #{data.invoiceNumber || '—'}
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Bill To
                </div>
                <div className="font-semibold text-slate-900">
                  {data.clientName || '—'}
                </div>
                <div className="whitespace-pre-line text-xs text-slate-600">
                  {data.clientAddress}
                </div>
              </div>
              <div className="mb-4 flex gap-8">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Issue Date
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {formatDate(data.issueDate)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Due Date
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {formatDate(data.dueDate)}
                  </div>
                </div>
              </div>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-900 text-left text-[10px] font-semibold uppercase tracking-wider text-white">
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Description</th>
                    <th className="px-3 py-2 text-right">Qty</th>
                    <th className="px-3 py-2 text-right">Unit</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-6 text-center text-slate-400"
                      >
                        No line items
                      </td>
                    </tr>
                  ) : (
                    data.items.map((item, idx) => (
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                        <td className="px-3 py-2 text-slate-900">
                          {item.description || '—'}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {item.quantity || '0'}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {formatMoney(parseNum(item.unitPrice), currency)}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold tabular-nums">
                          {formatMoney(
                            parseNum(item.quantity) * parseNum(item.unitPrice),
                            currency
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="mt-4 ml-auto w-full max-w-xs space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-mono tabular-nums">
                    {formatMoney(totals.subtotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Tax ({totals.taxRatePct.toFixed(2)}%)
                  </span>
                  <span className="font-mono tabular-nums">
                    {formatMoney(totals.tax, currency)}
                  </span>
                </div>
                <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-base font-bold">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">
                    {formatMoney(totals.total, currency)}
                  </span>
                </div>
              </div>
              {data.notes ? (
                <div className="mt-6 whitespace-pre-line border-t border-slate-100 pt-4 text-xs text-slate-500">
                  {data.notes}
                </div>
              ) : null}
              <div className="mt-4 border-t border-slate-100 pt-3 text-center text-[11px] text-slate-400">
                Thank you for your business
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
