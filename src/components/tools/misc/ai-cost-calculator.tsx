'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Field, Stat } from '@/lib/tools/tool-ui'

interface Model {
  id: string
  label: string
  inputPerM: number
  outputPerM: number
}

// Approximate public pricing in USD per 1M tokens (input / output).
const MODELS: Model[] = [
  { id: 'gpt-4o', label: 'GPT-4o', inputPerM: 5, outputPerM: 15 },
  { id: 'gpt-4o-mini', label: 'GPT-4o mini', inputPerM: 0.15, outputPerM: 0.6 },
  { id: 'gpt-4-turbo', label: 'GPT-4 Turbo', inputPerM: 10, outputPerM: 30 },
  { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', inputPerM: 0.5, outputPerM: 1.5 },
  { id: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', inputPerM: 3, outputPerM: 15 },
  { id: 'claude-3-haiku', label: 'Claude 3 Haiku', inputPerM: 0.25, outputPerM: 1.25 },
  { id: 'llama-3.1-70b', label: 'Llama 3.1 70B', inputPerM: 0.59, outputPerM: 0.79 },
  { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', inputPerM: 1.25, outputPerM: 5 },
]

function parseNum(value: string): number {
  if (value == null) return NaN
  const trimmed = value.trim()
  if (trimmed === '') return NaN
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : NaN
}

function fmtUSD(n: number): string {
  if (!Number.isFinite(n)) return '—'
  if (n === 0) return '$0.00'
  if (n < 0.01) return '<$0.01'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: n < 1 ? 4 : 2,
  }).format(n)
}

function fmtTokens(n: number): string {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

/**
 * AI Cost Calculator
 * Estimate LLM API spend across providers. Pick a model with hardcoded
 * input/output prices per 1M tokens, enter tokens per request and requests
 * per day. Live cost per request, day, month, and year plus a breakdown table.
 */
export default function AiCostCalculator() {
  const [modelId, setModelId] = React.useState(MODELS[0].id)
  const [inputTokens, setInputTokens] = React.useState('1000')
  const [outputTokens, setOutputTokens] = React.useState('500')
  const [reqPerDay, setReqPerDay] = React.useState('100')

  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0]
  const it = parseNum(inputTokens)
  const ot = parseNum(outputTokens)
  const rpd = parseNum(reqPerDay)

  const validIt = Number.isFinite(it) && it >= 0 ? it : 0
  const validOt = Number.isFinite(ot) && ot >= 0 ? ot : 0
  const validRpd = Number.isFinite(rpd) && rpd > 0 ? rpd : 0

  const inputCostPerReq = (validIt / 1_000_000) * model.inputPerM
  const outputCostPerReq = (validOt / 1_000_000) * model.outputPerM
  const costPerReq = inputCostPerReq + outputCostPerReq
  const daily = costPerReq * validRpd
  const monthly = daily * 30
  const yearly = daily * 365

  const valid = validRpd > 0 && (validIt > 0 || validOt > 0)

  const rows: {
    label: string
    perReq: number
    perDay: number
    perMonth: number
    perYear: number
  }[] = [
    {
      label: `Input tokens ($${model.inputPerM.toFixed(2)}/M)`,
      perReq: inputCostPerReq,
      perDay: inputCostPerReq * validRpd,
      perMonth: inputCostPerReq * validRpd * 30,
      perYear: inputCostPerReq * validRpd * 365,
    },
    {
      label: `Output tokens ($${model.outputPerM.toFixed(2)}/M)`,
      perReq: outputCostPerReq,
      perDay: outputCostPerReq * validRpd,
      perMonth: outputCostPerReq * validRpd * 30,
      perYear: outputCostPerReq * validRpd * 365,
    },
  ]

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Model &amp; usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Model" htmlFor="ai-model">
              <Select value={modelId} onValueChange={setModelId}>
                <SelectTrigger id="ai-model" className="w-full" aria-label="LLM model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field
              label="Input tokens / req"
              htmlFor="ai-input"
              hint={`$${model.inputPerM.toFixed(2)}/M`}
            >
              <Input
                id="ai-input"
                inputMode="numeric"
                value={inputTokens}
                onChange={(e) => setInputTokens(e.target.value)}
                aria-label="Input tokens per request"
              />
            </Field>
            <Field
              label="Output tokens / req"
              htmlFor="ai-output"
              hint={`$${model.outputPerM.toFixed(2)}/M`}
            >
              <Input
                id="ai-output"
                inputMode="numeric"
                value={outputTokens}
                onChange={(e) => setOutputTokens(e.target.value)}
                aria-label="Output tokens per request"
              />
            </Field>
            <Field label="Requests / day" htmlFor="ai-rpd">
              <Input
                id="ai-rpd"
                inputMode="numeric"
                value={reqPerDay}
                onChange={(e) => setReqPerDay(e.target.value)}
                aria-label="Requests per day"
              />
            </Field>
          </div>

          {Number.isFinite(it) && it < 0 ? (
            <p className="text-sm text-destructive">Input tokens cannot be negative.</p>
          ) : null}
          {Number.isFinite(ot) && ot < 0 ? (
            <p className="text-sm text-destructive">Output tokens cannot be negative.</p>
          ) : null}
          {Number.isFinite(rpd) && rpd <= 0 ? (
            <p className="text-sm text-destructive">Requests per day must be greater than zero.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            role="status"
            aria-live="polite"
            aria-label="Cost summary"
          >
            <Stat label="Cost / request" value={valid ? fmtUSD(costPerReq) : '—'} />
            <Stat label="Daily cost" value={valid ? fmtUSD(daily) : '—'} accent="#16a34a" />
            <Stat label="Monthly cost" value={valid ? fmtUSD(monthly) : '—'} accent="#f59e0b" />
            <Stat label="Yearly cost" value={valid ? fmtUSD(yearly) : '—'} accent="#dc2626" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{model.label}</Badge>
            <Badge variant="outline">
              {fmtTokens(validIt)} in · {fmtTokens(validOt)} out ·{' '}
              {fmtTokens(validRpd)} req/day
            </Badge>
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cost component</TableHead>
                  <TableHead className="text-right">Per request</TableHead>
                  <TableHead className="text-right">Per day</TableHead>
                  <TableHead className="text-right">Per month</TableHead>
                  <TableHead className="text-right">Per year</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="text-muted-foreground">{row.label}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {fmtUSD(row.perReq)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {fmtUSD(row.perDay)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {fmtUSD(row.perMonth)}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {fmtUSD(row.perYear)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-medium">Total</TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    {fmtUSD(costPerReq)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    {fmtUSD(daily)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    {fmtUSD(monthly)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    {fmtUSD(yearly)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground">
            Pricing is approximate (USD per 1M tokens) and varies by provider,
            tier, and region. Monthly = daily × 30; yearly = daily × 365. Verify
            current pricing with each provider before budgeting.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
