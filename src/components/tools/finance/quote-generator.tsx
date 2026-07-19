'use client'
import * as React from 'react'
import { RefreshCw, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Field, randomInt, downloadBlob } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
import { toast } from 'sonner'
type Category = 'motivation' | 'wisdom' | 'success' | 'life'
interface Quote {
  text: string
  author: string
  category: Category
}
const QUOTES: Quote[] = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'motivation' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', category: 'motivation' },
  { text: 'Believe you can and you are halfway there.', author: 'Theodore Roosevelt', category: 'motivation' },
  { text: 'It always seems impossible until it is done.', author: 'Nelson Mandela', category: 'motivation' },
  { text: 'Don&apos;t watch the clock; do what it does. Keep going.', author: 'Sam Levenson', category: 'motivation' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', category: 'motivation' },
  { text: 'Hardships often prepare ordinary people for an extraordinary destiny.', author: 'C.S. Lewis', category: 'motivation' },
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes', category: 'motivation' },
  { text: 'Knowing yourself is the beginning of all wisdom.', author: 'Aristotle', category: 'wisdom' },
  { text: 'The only true wisdom is in knowing you know nothing.', author: 'Socrates', category: 'wisdom' },
  { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein', category: 'wisdom' },
  { text: 'Turn your wounds into wisdom.', author: 'Oprah Winfrey', category: 'wisdom' },
  { text: 'Patience is bitter, but its fruit is sweet.', author: 'Aristotle', category: 'wisdom' },
  { text: 'The journey of a thousand miles begins with a single step.', author: 'Lao Tzu', category: 'wisdom' },
  { text: 'We suffer more often in imagination than in reality.', author: 'Seneca', category: 'wisdom' },
  { text: 'He who has a why to live can bear almost any how.', author: 'Friedrich Nietzsche', category: 'wisdom' },
  { text: 'Success usually comes to those who are too busy to be looking for it.', author: 'Henry David Thoreau', category: 'success' },
  { text: 'Opportunities do not happen, you create them.', author: 'Chris Grosser', category: 'success' },
  { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney', category: 'success' },
  { text: 'Don&apos;t be afraid to give up the good to go for the great.', author: 'John D. Rockefeller', category: 'success' },
  { text: 'I find that the harder I work, the more luck I seem to have.', author: 'Thomas Jefferson', category: 'success' },
  { text: 'Success is walking from failure to failure with no loss of enthusiasm.', author: 'Winston Churchill', category: 'success' },
  { text: 'The road to success and the road to failure are almost exactly the same.', author: 'Colin R. Davis', category: 'success' },
  { text: 'Whether you think you can or you think you can&apos;t, you&apos;re right.', author: 'Henry Ford', category: 'success' },
  { text: 'Life is what happens when you&apos;re busy making other plans.', author: 'John Lennon', category: 'life' },
  { text: 'In the end, it is not the years in your life that count. It is the life in your years.', author: 'Abraham Lincoln', category: 'life' },
  { text: 'Life is really simple, but we insist on making it complicated.', author: 'Confucius', category: 'life' },
  { text: 'The purpose of our lives is to be happy.', author: 'Dalai Lama', category: 'life' },
  { text: 'Get busy living or get busy dying.', author: 'Stephen King', category: 'life' },
  { text: 'You only live once, but if you do it right, once is enough.', author: 'Mae West', category: 'life' },
  { text: 'Life is 10% what happens to me and 90% how I react to it.', author: 'Charles R. Swindoll', category: 'life' },
]
const CATEGORY_FILTERS: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All categories' },
  { value: 'motivation', label: 'Motivation' },
  { value: 'wisdom', label: 'Wisdom' },
  { value: 'success', label: 'Success' },
  { value: 'life', label: 'Life' },
]
const CATEGORY_LABEL: Record<Category, string> = {
  motivation: 'Motivation',
  wisdom: 'Wisdom',
  success: 'Success',
  life: 'Life',
}
/** Strip HTML entities that we used to keep the source readable as JSX text. */
function cleanText(s: string): string {
  return s
    .replace(/&apos;/g, '\u2019')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}
/**
 * Quote Generator
 * Hardcoded ~30 inspirational quotes across four categories. Generate picks
 * a quote at random via Web Crypto (`randomInt`). Filter by category, copy
 * the text, or render the quote to a PNG canvas with a gradient background.
 */
export default function QuoteGenerator() {
  const [category, setCategory] = React.useState<Category | 'all'>('all')
  const [index, setIndex] = React.useState(0)
  const { copy } = useCopy()
  const pool = React.useMemo(() => {
    if (category === 'all') return QUOTES
    return QUOTES.filter((q) => q.category === category)
  }, [category])
  // Keep index in range when the pool changes.
  React.useEffect(() => {
    if (pool.length === 0) return
    setIndex((prev) => prev % pool.length)
  }, [pool.length])
  const quote = pool.length > 0 ? pool[index % pool.length] : null
  const generate = () => {
    if (pool.length === 0) {
      toast.error('No quotes available in this category')
      return
    }
    if (pool.length === 1) {
      setIndex(0)
      return
    }
    const current = index % pool.length
    let next = randomInt(pool.length)
    // Avoid immediately repeating the same quote when pool > 1.
    let guard = 0
    while (next === current && guard < 8) {
      next = randomInt(pool.length)
      guard += 1
    }
    setIndex(next)
  }
  const copyQuote = () => {
    if (!quote) return
    copy(`"${cleanText(quote.text)}" — ${quote.author}`, 'Quote copied')
  }
  const downloadImage = () => {
    if (!quote) return
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1080
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      toast.error('Canvas not supported in this browser')
      return
    }
    // Warm gradient — no blue/indigo per project styling rules.
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grad.addColorStop(0, '#134e4a')
    grad.addColorStop(0.5, '#831843')
    grad.addColorStop(1, '#7c2d12')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // Decorative quote mark.
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ctx.font = 'bold 280px Georgia, serif'
    ctx.textBaseline = 'top'
    ctx.fillText('\u201C', 90, 60)
    // Quote text.
    const text = cleanText(quote.text)
    const maxWidth = canvas.width - 200
    ctx.font = 'bold 52px Georgia, serif'
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'alphabetic'
    const lineHeight = 72
    const lines = wrapText(ctx, text, maxWidth)
    const totalHeight = lines.length * lineHeight
    const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2
    lines.forEach((ln, i) => {
      ctx.fillText(ln, 100, startY + i * lineHeight)
    })
    // Author.
    ctx.font = 'italic 34px Georgia, serif'
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.textAlign = 'right'
    ctx.fillText(`— ${quote.author}`, canvas.width - 100, startY + totalHeight + 60)
    ctx.textAlign = 'left'
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error('Could not render quote image')
        return
      }
      downloadBlob(blob, `quote-${Date.now()}.png`)
      toast.success('Quote image downloaded')
    }, 'image/png')
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Field label="Category" htmlFor="quote-category">
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as Category | 'all')}
            >
              <SelectTrigger id="quote-category" className="w-full sm:w-72" aria-label="Quote category filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_FILTERS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {quote ? (
            <div
              className="relative overflow-hidden rounded-xl border border-border p-8 sm:p-12"
              style={{
                background:
                  'linear-gradient(135deg, #134e4a 0%, #831843 50%, #7c2d12 100%)',
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-6 left-4 select-none font-serif text-[180px] leading-none text-white/15"
              >
                {'\u201C'}
              </div>
              <div className="relative">
                <Badge
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm"
                >
                  {CATEGORY_LABEL[quote.category]}
                </Badge>
                <blockquote className="mt-4 font-serif text-2xl font-medium leading-snug text-white sm:text-3xl">
                  {cleanText(quote.text)}
                </blockquote>
                <p className="mt-4 text-right font-serif text-lg italic text-white/85 sm:text-xl">
                  — {quote.author}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              No quotes match this filter.
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={generate}
              className="bg-primary text-primary-foreground"
              disabled={pool.length === 0}
            >
              <RefreshCw className="size-4" />
              Generate
            </Button>
            <Button
              variant="outline"
              onClick={copyQuote}
              disabled={!quote}
            >
              <Copy className="size-4" />
              Copy
            </Button>
            <Button
              variant="outline"
              onClick={downloadImage}
              disabled={!quote}
            >
              <Download className="size-4" />
              Download image
            </Button>
          </div>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Showing quote{' '}
        <span className="font-mono">{quote ? index % pool.length + 1 : 0}</span>{' '}
        of <span className="font-mono">{pool.length}</span> in the current
        category. Random selection uses the Web Crypto API — never Math.random.
      </p>
    </div>
  )
}