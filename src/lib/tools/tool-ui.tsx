'use client'

import * as React from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { useCopy } from './use-copy'

/** A labelled field wrapper. */
export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        {hint ? (
          <span className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      {children}
    </div>
  )
}

/** Ad unit — shows real AdSense ads when configured, branded placeholder otherwise.
 *  Re-exports the AdUnit component for convenience. Configure in src/lib/site-config.ts. */
import { AdUnit } from '@/components/ads/ad-unit'

export function AdPlaceholder({ slot = 'horizontal' }: { slot?: string }) {
  const validSlot = (['horizontal', 'vertical', 'footer'].includes(slot)
    ? slot
    : 'horizontal') as 'horizontal' | 'vertical' | 'footer'
  return <AdUnit slot={validSlot} />
}

/** Output box with copy + download. */
export function ResultBox({
  value,
  label = 'Result',
  mono = true,
  rows = 6,
  downloadName,
  empty = 'Output will appear here.',
}: {
  value: string
  label?: string
  mono?: boolean
  rows?: number
  downloadName?: string
  empty?: string
}) {
  const { copied, copy } = useCopy()
  const hasValue = value.length > 0

  const download = () => {
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = downloadName || 'result.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => copy(value)}
            disabled={!hasValue}
            className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
          {downloadName ? (
            <button
              type="button"
              onClick={download}
              disabled={!hasValue}
              className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <Download className="size-3.5" />
              Save
            </button>
          ) : null}
        </div>
      </div>
      <pre
        style={{ minHeight: `${rows * 1.5}rem` }}
        className={`fl-scroll overflow-auto rounded-lg border border-border bg-muted/30 p-3 text-sm ${
          mono ? 'font-mono' : 'font-sans'
        } whitespace-pre-wrap break-words`}
      >
        {hasValue ? value : <span className="text-muted-foreground/50">{empty}</span>}
      </pre>
    </div>
  )
}

/** Small stat tile. */
export function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: React.ReactNode
  accent?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className="mt-1 font-mono text-lg font-semibold tabular-nums"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
    </div>
  )
}

/** Download helper for blobs. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** Secure random bytes via Web Crypto (never Math.random). */
export function randomBytes(length: number): Uint8Array {
  const arr = new Uint8Array(length)
  crypto.getRandomValues(arr)
  return arr
}

/** Secure random integer in [0, max) using rejection sampling. */
export function randomInt(max: number): number {
  if (max <= 0) return 0
  const maxUint32 = 0xffffffff
  const limit = maxUint32 - (maxUint32 % max)
  const buf = new Uint32Array(1)
  let x = 0
  do {
    crypto.getRandomValues(buf)
    x = buf[0]
  } while (x >= limit)
  return x % max
}
