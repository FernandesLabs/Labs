'use client'

import * as React from 'react'
import { RefreshCw, Copy, Check, KeyRound, Keyboard } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Field, Stat, randomInt } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?/'
const AMBIGUOUS = 'Il1O0'

type Grade = {
  level: 0 | 1 | 2 | 3 | 4
  label: string
  tone: string
}

function gradeForEntropy(bits: number): Grade {
  if (bits < 28)
    return { level: 0, label: 'Very Weak', tone: 'text-red-600' }
  if (bits < 36)
    return { level: 1, label: 'Weak', tone: 'text-orange-600' }
  if (bits < 60)
    return { level: 2, label: 'Fair', tone: 'text-yellow-600' }
  if (bits < 128)
    return { level: 3, label: 'Strong', tone: 'text-emerald-600' }
  return { level: 4, label: 'Very Strong', tone: 'text-emerald-700' }
}

function buildAlphabet(opts: {
  lower: boolean
  upper: boolean
  digits: boolean
  symbols: boolean
  excludeAmbiguous: boolean
}): string {
  let alphabet = ''
  if (opts.lower) alphabet += LOWER
  if (opts.upper) alphabet += UPPER
  if (opts.digits) alphabet += DIGITS
  if (opts.symbols) alphabet += SYMBOLS
  if (opts.excludeAmbiguous) {
    alphabet = alphabet
      .split('')
      .filter((c) => !AMBIGUOUS.includes(c))
      .join('')
  }
  return alphabet
}

function pickFrom(set: string): string {
  if (set.length === 0) return ''
  return set[randomInt(set.length)]!
}

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    const tmp = out[i]!
    out[i] = out[j]!
    out[j] = tmp
  }
  return out
}

function generatePassword(
  length: number,
  opts: {
    lower: boolean
    upper: boolean
    digits: boolean
    symbols: boolean
    excludeAmbiguous: boolean
  }
): string {
  const alphabet = buildAlphabet(opts)
  if (alphabet.length === 0 || length <= 0) return ''

  const sets: string[] = []
  const filter = (s: string) =>
    opts.excludeAmbiguous
      ? s
          .split('')
          .filter((c) => !AMBIGUOUS.includes(c))
          .join('')
      : s
  if (opts.lower && filter(LOWER).length > 0) sets.push(filter(LOWER))
  if (opts.upper && filter(UPPER).length > 0) sets.push(filter(UPPER))
  if (opts.digits && filter(DIGITS).length > 0) sets.push(filter(DIGITS))
  if (opts.symbols && filter(SYMBOLS).length > 0) sets.push(filter(SYMBOLS))

  const chars: string[] = []
  // Guarantee at least one from each enabled set (if length allows).
  const guaranteeCount = Math.min(sets.length, length)
  for (let i = 0; i < guaranteeCount; i++) {
    chars.push(pickFrom(sets[i]!))
  }
  // Fill remaining slots from the full alphabet.
  for (let i = guaranteeCount; i < length; i++) {
    chars.push(pickFrom(alphabet))
  }
  return shuffle(chars).join('')
}

function composition(pw: string) {
  let lower = 0
  let upper = 0
  let digits = 0
  let symbols = 0
  for (const ch of pw) {
    if (LOWER.includes(ch)) lower++
    else if (UPPER.includes(ch)) upper++
    else if (DIGITS.includes(ch)) digits++
    else if (ch) symbols++
  }
  return { lower, upper, digits, symbols }
}

export default function PasswordGenerator() {
  const [length, setLength] = React.useState(16)
  const [lower, setLower] = React.useState(true)
  const [upper, setUpper] = React.useState(true)
  const [digits, setDigits] = React.useState(true)
  const [symbols, setSymbols] = React.useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const { copied, copy } = useCopy()

  const opts = { lower, upper, digits, symbols, excludeAmbiguous }
  const alphabet = buildAlphabet(opts)
  const poolSize = alphabet.length
  const entropy = poolSize > 0 ? Math.log2(poolSize) * length : 0
  const grade = gradeForEntropy(entropy)
  const comp = composition(password)

  const regenerate = () => {
    if (poolSize === 0) {
      toast.error('Select at least one character set')
      return
    }
    const pw = generatePassword(length, opts)
    if (pw.length === 0) {
      toast.error('Could not generate password')
      return
    }
    setPassword(pw)
  }

  // Generate on mount and whenever options change.
  React.useEffect(() => {
    if (poolSize > 0) {
      setPassword(generatePassword(length, opts))
    } else {
      setPassword('')
    }
  }, [length, lower, upper, digits, symbols, excludeAmbiguous])

  // Keep latest regenerate in a ref so the keyboard listener registers once.
  const regenerateRef = React.useRef(regenerate)
  React.useEffect(() => {
    regenerateRef.current = regenerate
  })

  // Keyboard shortcut: press G to regenerate.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      if (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        target?.isContentEditable
      ) {
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault()
        regenerateRef.current()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const progressValue = Math.min(100, (entropy / 256) * 100)

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-4" />
            Generated Password
          </CardTitle>
          <CardDescription>
            Cryptographically secure. Generated locally with Web Crypto — never
            sent anywhere.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <pre
                aria-live="polite"
                aria-label="Generated password"
                className="fl-scroll min-h-[3.5rem] overflow-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xl break-all sm:text-2xl"
              >
                {password ? (
                  password
                ) : (
                  <span className="text-sm text-muted-foreground/60">
                    Select at least one character set to generate a password.
                  </span>
                )}
              </pre>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={regenerate}
                disabled={poolSize === 0}
                className="bg-primary text-primary-foreground"
              >
                <RefreshCw className="size-4" />
                Regenerate
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => copy(password, 'Password copied')}
                disabled={password.length === 0}
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Badge
                variant="secondary"
                className="ml-auto hidden items-center gap-1 sm:inline-flex"
              >
                <Keyboard className="size-3" /> Press G to regenerate
              </Badge>
            </div>
          </div>

          {/* Strength meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Strength</span>
              <span className={`font-semibold ${grade.tone}`}>
                {grade.label} · {entropy.toFixed(1)} bits
              </span>
            </div>
            <Progress value={progressValue} aria-hidden="true" />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>0</span>
              <span>128 (strong)</span>
              <span>256 bits</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
            <CardDescription>Tune length and character sets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Field
              label="Length"
              htmlFor="pw-length"
              hint={`${length} characters`}
            >
              <Slider
                id="pw-length"
                min={4}
                max={64}
                step={1}
                value={[length]}
                onValueChange={(v) => setLength(v[0] ?? 16)}
                aria-label="Password length"
              />
            </Field>

            <Separator />

            <div className="space-y-3">
              <span className="text-sm font-medium">Character sets</span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(
                  [
                    ['lower', lower, setLower, 'Lowercase (a-z)'],
                    ['upper', upper, setUpper, 'Uppercase (A-Z)'],
                    ['digits', digits, setDigits, 'Numbers (0-9)'],
                    ['symbols', symbols, setSymbols, 'Symbols (!@#$…)'],
                  ] as const
                ).map(([key, val, set, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      id={`pw-${key}`}
                      checked={val}
                      onCheckedChange={(c) => set(c === true)}
                    />
                    <Label htmlFor={`pw-${key}`} className="cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label htmlFor="pw-ambig" className="cursor-pointer">
                  Exclude ambiguous characters
                </Label>
                <p className="text-xs text-muted-foreground">
                  Skip <span className="font-mono">I l 1 O 0</span> to avoid
                  reading mistakes.
                </p>
              </div>
              <Switch
                id="pw-ambig"
                checked={excludeAmbiguous}
                onCheckedChange={setExcludeAmbiguous}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Composition</CardTitle>
            <CardDescription>
              Pool size{' '}
              <span className="font-mono">{poolSize}</span> · entropy{' '}
              <span className="font-mono">{entropy.toFixed(1)}</span> bits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Lowercase" value={comp.lower} />
              <Stat label="Uppercase" value={comp.upper} />
              <Stat label="Numbers" value={comp.digits} />
              <Stat label="Symbols" value={comp.symbols} />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Entropy is calculated as{' '}
              <span className="font-mono">log₂(pool) × length</span>. A 16-char
              password using all four sets yields ≈ 105 bits — strong enough for
              most accounts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
