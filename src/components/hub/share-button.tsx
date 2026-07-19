'use client'
import * as React from 'react'
import { Share2, Link2, Check, Twitter, Facebook, Linkedin } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

/**
 * ShareButton — a dropdown that lets the user copy the current tool URL to the
 * clipboard or share it to Twitter / Facebook / LinkedIn.
 *
 * Uses the Web Share API on supported devices (mobile / Safari) when the user
 * clicks the main button; falls back to a dropdown menu on desktop.
 */
export function ShareButton({
  url,
  title,
  description,
  size = 'md',
}: {
  url: string
  title: string
  description?: string
  size?: 'sm' | 'md'
}) {
  const [copied, setCopied] = React.useState(false)
  const fullUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return url
    try {
      return new URL(url, window.location.origin).toString()
    } catch {
      return url
    }
  }, [url])

  const copyLink = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy link')
    }
  }, [fullUrl])

  const nativeShare = React.useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.share) return false
    try {
      await navigator.share({
        title,
        text: description,
        url: fullUrl,
      })
      return true
    } catch {
      // user cancelled — ignore
      return true
    }
  }, [title, description, fullUrl])

  const shareTwitter = React.useCallback(() => {
    const text = encodeURIComponent(`${title} — free online tool`)
    const u = encodeURIComponent(fullUrl)
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${u}`,
      '_blank',
      'noopener,noreferrer,width=600,height=500'
    )
  }, [title, fullUrl])

  const shareFacebook = React.useCallback(() => {
    const u = encodeURIComponent(fullUrl)
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      '_blank',
      'noopener,noreferrer,width=600,height=500'
    )
  }, [fullUrl])

  const shareLinkedIn = React.useCallback(() => {
    const u = encodeURIComponent(fullUrl)
    const t = encodeURIComponent(title)
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${u}&title=${t}`,
      '_blank',
      'noopener,noreferrer,width=600,height=500'
    )
  }, [fullUrl, title])

  const trigger = (
    <button
      type="button"
      aria-label="Share this tool"
      title="Share"
      className={`inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background font-medium text-foreground transition hover:bg-muted ${
        size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-9 px-3 text-sm'
      }`}
    >
      <Share2 className={size === 'sm' ? 'size-3.5' : 'size-4'} />
      <span className="hidden sm:inline">Share</span>
    </button>
  )

  // On devices with the Web Share API, the main click triggers native share.
  const hasNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  if (hasNativeShare) {
    return (
      <button
        type="button"
        onClick={nativeShare}
        aria-label="Share this tool"
        title="Share"
        className={`inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background font-medium text-foreground transition hover:bg-muted ${
          size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-9 px-3 text-sm'
        }`}
      >
        <Share2 className={size === 'sm' ? 'size-3.5' : 'size-4'} />
        <span className="hidden sm:inline">Share</span>
      </button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Share this tool
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyLink} className="cursor-pointer gap-2">
          {copied ? (
            <Check className="size-4 text-emerald-500" />
          ) : (
            <Link2 className="size-4" />
          )}
          {copied ? 'Copied!' : 'Copy link'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={shareTwitter} className="cursor-pointer gap-2">
          <Twitter className="size-4" />
          Share on Twitter / X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareFacebook} className="cursor-pointer gap-2">
          <Facebook className="size-4" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareLinkedIn} className="cursor-pointer gap-2">
          <Linkedin className="size-4" />
          Share on LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
