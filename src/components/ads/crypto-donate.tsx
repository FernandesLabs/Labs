'use client'

import * as React from 'react'
import { Heart, Copy, Check, Bitcoin, Coins } from 'lucide-react'
import { siteConfig, isCryptoConfigured } from '@/lib/site-config'
import { useCopy } from '@/lib/tools/use-copy'

/**
 * Crypto donation widget. Only renders when wallet addresses are configured
 * in site-config.ts. Shows a "Support us" button that expands to reveal
 * wallet addresses with copy buttons.
 */
export function CryptoDonate() {
  const [open, setOpen] = React.useState(false)
  const { copied, copy } = useCopy()

  if (!isCryptoConfigured()) return null

  const wallets = Object.entries(siteConfig.crypto.wallets).filter(
    ([, addr]) => addr
  ) as [string, string][]

  const labels: Record<string, string> = {
    bitcoin: 'Bitcoin (BTC)',
    ethereum: 'Ethereum (ETH)',
    usdc_base: 'USDC (Base)',
    solana: 'Solana (SOL)',
  }

  const icons: Record<string, React.ReactNode> = {
    bitcoin: <Bitcoin className="size-4" />,
    ethereum: <Coins className="size-4" />,
    usdc_base: <Coins className="size-4" />,
    solana: <Coins className="size-4" />,
  }

  return (
    <div className="rounded-xl border border-border/60 bg-gradient-to-br from-muted/40 to-muted/10 p-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Heart className="size-4 text-rose-500" />
          Support Fernandes Labs
        </span>
        <span className="text-xs text-muted-foreground">
          {open ? 'Hide' : 'Donate crypto'}
        </span>
      </button>

      {open ? (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-muted-foreground">
            If these tools save you time, consider sending a tip. All donations
            go directly to development.
          </p>
          {wallets.map(([key, addr]) => (
            <div
              key={key}
              className="flex items-center gap-2 rounded-lg border border-border/50 bg-background p-2"
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                {icons[key] || <span className="size-4" />}
                {labels[key] || key}
              </span>
              <code className="flex-1 truncate font-mono text-xs text-foreground">
                {addr}
              </code>
              <button
                type="button"
                onClick={() => copy(addr, `${labels[key]} address copied`)}
                className="rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label={`Copy ${labels[key]} address`}
              >
                {copied ? (
                  <Check className="size-3.5 text-success" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          ))}
          <p className="pt-1 text-[10px] text-muted-foreground/60">
            Transactions are public on the blockchain. Thanks for your support!
          </p>
        </div>
      ) : null}
    </div>
  )
}
