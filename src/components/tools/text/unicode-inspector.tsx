'use client'
import * as React from 'react'
import { Type } from 'lucide-react'
import { Input } from '@/components/ui/input'
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
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Field, Stat } from '@/lib/tools/tool-ui'
/** Maximum number of characters rendered in the table (perf guard). */
const MAX_ROWS = 512
/** Names for ASCII code points 0–127 (per Unicode). */
const ASCII_NAMES: string[] = [
  'NULL',
  'START OF HEADING',
  'START OF TEXT',
  'END OF TEXT',
  'END OF TRANSMISSION',
  'ENQUIRY',
  'ACKNOWLEDGE',
  'BELL',
  'BACKSPACE',
  'CHARACTER TABULATION',
  'LINE FEED',
  'LINE TABULATION',
  'FORM FEED',
  'CARRIAGE RETURN',
  'SHIFT OUT',
  'SHIFT IN',
  'DATA LINK ESCAPE',
  'DEVICE CONTROL ONE',
  'DEVICE CONTROL TWO',
  'DEVICE CONTROL THREE',
  'DEVICE CONTROL FOUR',
  'NEGATIVE ACKNOWLEDGE',
  'SYNCHRONOUS IDLE',
  'END OF TRANSMISSION BLOCK',
  'CANCEL',
  'END OF MEDIUM',
  'SUBSTITUTE',
  'ESCAPE',
  'INFORMATION SEPARATOR FOUR',
  'INFORMATION SEPARATOR THREE',
  'INFORMATION SEPARATOR TWO',
  'INFORMATION SEPARATOR ONE',
  'SPACE',
  'EXCLAMATION MARK',
  'QUOTATION MARK',
  'NUMBER SIGN',
  'DOLLAR SIGN',
  'PERCENT SIGN',
  'AMPERSAND',
  'APOSTROPHE',
  'LEFT PARENTHESIS',
  'RIGHT PARENTHESIS',
  'ASTERISK',
  'PLUS SIGN',
  'COMMA',
  'HYPHEN-MINUS',
  'FULL STOP',
  'SOLIDUS',
  'DIGIT ZERO',
  'DIGIT ONE',
  'DIGIT TWO',
  'DIGIT THREE',
  'DIGIT FOUR',
  'DIGIT FIVE',
  'DIGIT SIX',
  'DIGIT SEVEN',
  'DIGIT EIGHT',
  'DIGIT NINE',
  'COLON',
  'SEMICOLON',
  'LESS-THAN SIGN',
  'EQUALS SIGN',
  'GREATER-THAN SIGN',
  'QUESTION MARK',
  'COMMERCIAL AT',
  'LATIN CAPITAL LETTER A',
  'LATIN CAPITAL LETTER B',
  'LATIN CAPITAL LETTER C',
  'LATIN CAPITAL LETTER D',
  'LATIN CAPITAL LETTER E',
  'LATIN CAPITAL LETTER F',
  'LATIN CAPITAL LETTER G',
  'LATIN CAPITAL LETTER H',
  'LATIN CAPITAL LETTER I',
  'LATIN CAPITAL LETTER J',
  'LATIN CAPITAL LETTER K',
  'LATIN CAPITAL LETTER L',
  'LATIN CAPITAL LETTER M',
  'LATIN CAPITAL LETTER N',
  'LATIN CAPITAL LETTER O',
  'LATIN CAPITAL LETTER P',
  'LATIN CAPITAL LETTER Q',
  'LATIN CAPITAL LETTER R',
  'LATIN CAPITAL LETTER S',
  'LATIN CAPITAL LETTER T',
  'LATIN CAPITAL LETTER U',
  'LATIN CAPITAL LETTER V',
  'LATIN CAPITAL LETTER W',
  'LATIN CAPITAL LETTER X',
  'LATIN CAPITAL LETTER Y',
  'LATIN CAPITAL LETTER Z',
  'LEFT SQUARE BRACKET',
  'REVERSE SOLIDUS',
  'RIGHT SQUARE BRACKET',
  'CIRCUMFLEX ACCENT',
  'LOW LINE',
  'GRAVE ACCENT',
  'LATIN SMALL LETTER A',
  'LATIN SMALL LETTER B',
  'LATIN SMALL LETTER C',
  'LATIN SMALL LETTER D',
  'LATIN SMALL LETTER E',
  'LATIN SMALL LETTER F',
  'LATIN SMALL LETTER G',
  'LATIN SMALL LETTER H',
  'LATIN SMALL LETTER I',
  'LATIN SMALL LETTER J',
  'LATIN SMALL LETTER K',
  'LATIN SMALL LETTER L',
  'LATIN SMALL LETTER M',
  'LATIN SMALL LETTER N',
  'LATIN SMALL LETTER O',
  'LATIN SMALL LETTER P',
  'LATIN SMALL LETTER Q',
  'LATIN SMALL LETTER R',
  'LATIN SMALL LETTER S',
  'LATIN SMALL LETTER T',
  'LATIN SMALL LETTER U',
  'LATIN SMALL LETTER V',
  'LATIN SMALL LETTER W',
  'LATIN SMALL LETTER X',
  'LATIN SMALL LETTER Y',
  'LATIN SMALL LETTER Z',
  'LEFT CURLY BRACKET',
  'VERTICAL LINE',
  'RIGHT CURLY BRACKET',
  'TILDE',
  'DELETE',
]
const RE_LETTER = /\p{L}/u
const RE_NUMBER = /\p{N}/u
const RE_PUNCT = /\p{P}/u
const RE_SYMBOL = /\p{S}/u
const RE_SEPARATOR = /\p{Z}/u
type CharCategory =
  | 'Letter'
  | 'Number'
  | 'Punctuation'
  | 'Symbol'
  | 'Space'
  | 'Control'
  | 'Other'
function categoryFor(ch: string): CharCategory {
  if (RE_LETTER.test(ch)) return 'Letter'
  if (RE_NUMBER.test(ch)) return 'Number'
  if (RE_PUNCT.test(ch)) return 'Punctuation'
  if (RE_SYMBOL.test(ch)) return 'Symbol'
  if (RE_SEPARATOR.test(ch)) return 'Space'
  // C0/C1 control characters.
  const cp = ch.codePointAt(0) ?? 0
  if (cp < 0x20 || cp === 0x7f || (cp >= 0x80 && cp <= 0x9f)) return 'Control'
  return 'Other'
}
function categoryName(ch: string, cp: number): string {
  if (cp <= 0x7f) return ASCII_NAMES[cp] ?? `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`
  // Generic name for non-ASCII characters (no full Unicode database available client-side).
  return `Code point U+${cp.toString(16).toUpperCase().padStart(4, '0')}`
}
function utf8BytesHex(ch: string): string {
  const bytes = new TextEncoder().encode(ch)
  return Array.from(bytes, (b) => b.toString(16).toUpperCase().padStart(2, '0')).join(' ')
}
function utf16UnitsHex(ch: string): string {
  // For BMP chars: 1 code unit. For supplementary plane chars: 2 (surrogate pair).
  const units: number[] = []
  for (let i = 0; i < ch.length; i++) {
    units.push(ch.charCodeAt(i))
  }
  return units.map((u) => u.toString(16).toUpperCase().padStart(4, '0')).join(' ')
}
function categoryBadgeClass(cat: CharCategory): string {
  switch (cat) {
    case 'Letter':
      return 'border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
    case 'Number':
      return 'border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-400'
    case 'Punctuation':
      return 'border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400'
    case 'Symbol':
      return 'border-transparent bg-violet-500/15 text-violet-700 dark:text-violet-400'
    case 'Space':
      return 'border-transparent bg-muted text-muted-foreground'
    case 'Control':
      return 'border-transparent bg-rose-500/15 text-rose-700 dark:text-rose-400'
    default:
      return 'border-transparent bg-muted text-muted-foreground'
  }
}
/** A printable representation of the character for display. */
function displayChar(ch: string, cat: CharCategory): string {
  if (cat === 'Control') {
    const cp = ch.codePointAt(0) ?? 0
    if (cp === 0x09) return '\\t'
    if (cp === 0x0a) return '\\n'
    if (cp === 0x0d) return '\\r'
    return `\\x${cp.toString(16).padStart(2, '0')}`
  }
  if (cat === 'Space') {
    const cp = ch.codePointAt(0) ?? 0
    if (cp === 0x20) return '·'
    if (cp === 0xa0) return '␣'
  }
  return ch
}
interface CharRow {
  index: number
  char: string
  cp: number
  cpHex: string
  name: string
  category: CharCategory
  utf8: string
  utf16: string
}
function buildRows(text: string): CharRow[] {
  const rows: CharRow[] = []
  const chars = Array.from(text) // iterates by code point
  for (let i = 0; i < chars.length && i < MAX_ROWS; i++) {
    const ch = chars[i]!
    const cp = ch.codePointAt(0) ?? 0
    const cat = categoryFor(ch)
    rows.push({
      index: i,
      char: ch,
      cp,
      cpHex: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`,
      name: categoryName(ch, cp),
      category: cat,
      utf8: utf8BytesHex(ch),
      utf16: utf16UnitsHex(ch),
    })
  }
  return rows
}
export default function UnicodeInspector(): React.JSX.Element {
  const [text, setText] = React.useState('Hello, 世界! 🌍')
  const rows = React.useMemo(() => buildRows(text), [text])
  const totalCodePoints = React.useMemo(() => Array.from(text).length, [text])
  const totalUtf8Bytes = React.useMemo(
    () => new TextEncoder().encode(text).length,
    [text]
  )
  const totalUtf16Units = React.useMemo(() => text.length, [text])
  const categoryCounts = React.useMemo(() => {
    const counts: Record<CharCategory, number> = {
      Letter: 0,
      Number: 0,
      Punctuation: 0,
      Symbol: 0,
      Space: 0,
      Control: 0,
      Other: 0,
    }
    for (const ch of Array.from(text)) {
      counts[categoryFor(ch)]++
    }
    return counts
  }, [text])
  const truncated = totalCodePoints > MAX_ROWS
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Unicode Inspector</CardTitle>
          <CardDescription>
            Inspect every character in your text: code point, name (full
            names for ASCII; U+XXXX for others), Unicode category, UTF-8
            byte sequence, and UTF-16 code units. Live as you type.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Text"
            htmlFor="uni-text"
            hint={`${totalCodePoints} code points`}
          >
            <Input
              id="uni-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste text…"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </Field>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Code points" value={totalCodePoints} />
        <Stat
          label="UTF-8 bytes"
          value={totalUtf8Bytes}
          accent="oklch(0.6 0.17 150)"
        />
        <Stat label="UTF-16 units" value={totalUtf16Units} />
        <Stat
          label="Letters"
          value={categoryCounts.Letter}
          accent="oklch(0.6 0.17 150)"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(categoryCounts) as CharCategory[]).map((cat) => (
          <Stat key={cat} label={cat} value={categoryCounts[cat]} />
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Type className="size-4" />
            Character breakdown
          </CardTitle>
          {truncated ? (
            <CardDescription className="text-amber-700 dark:text-amber-400">
              Showing first {MAX_ROWS} of {totalCodePoints} characters for
              performance.
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[28rem]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">#</TableHead>
                  <TableHead className="w-[60px]">Char</TableHead>
                  <TableHead>Code point</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>UTF-8 bytes</TableHead>
                  <TableHead>UTF-16 units</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-muted-foreground"
                    >
                      Type some text above to inspect each character.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((r) => (
                    <TableRow key={r.index}>
                      <TableCell className="text-xs text-muted-foreground tabular-nums">
                        {r.index}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-lg">
                          {displayChar(r.char, r.category)}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {r.cpHex}
                      </TableCell>
                      <TableCell className="text-xs">{r.name}</TableCell>
                      <TableCell>
                        <Badge className={categoryBadgeClass(r.category)}>
                          {r.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {r.utf8}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {r.utf16}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}