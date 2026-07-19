'use client'
import * as React from 'react'
import { Star } from 'lucide-react'
import { useToolHistory } from '@/lib/tools/use-tool-history'
import { cn } from '@/lib/utils'
/** A compact star toggle button for tool cards / headers. */
export function FavoriteButton({
  slug,
  size = 'md',
  className,
  label = 'Toggle favorite',
}: {
  slug: string
  size?: 'sm' | 'md'
  className?: string
  label?: string
}) {
  const { favorites, toggleFavorite } = useToolHistory()
  const isFav = favorites.includes(slug)
  const iconSize = size === 'sm' ? 'size-3.5' : 'size-4'
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isFav}
      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(slug)
      }}
      className={cn(
        'inline-grid place-items-center rounded-md transition',
        size === 'sm' ? 'size-7' : 'size-8',
        isFav
          ? 'text-amber-500 hover:text-amber-600'
          : 'text-muted-foreground/50 hover:bg-muted hover:text-foreground',
        className
      )}
    >
      <Star className={cn(iconSize, isFav && 'fill-current')} />
    </button>
  )
}