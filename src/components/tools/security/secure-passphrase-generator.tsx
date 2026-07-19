'use client'
import * as React from 'react'
import { RefreshCw, Copy, Check, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, Stat, randomInt } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
// A curated EFF-style word list (~150 common, easy-to-picture words).
const WORD_LIST: string[] = [
  'apple', 'baker', 'camel', 'dance', 'eagle', 'flame', 'globe', 'heart',
  'ivory', 'jelly', 'kneel', 'lemon', 'maple', 'ninja', 'ocean', 'piano',
  'queen', 'river', 'stone', 'tiger', 'umbra', 'viper', 'whale', 'xerox',
  'yacht', 'zebra', 'anchor', 'bridge', 'castle', 'dragon', 'engine', 'forest',
  'garden', 'hammer', 'island', 'jungle', 'kettle', 'ladder', 'mirror', 'needle',
  'ocean', 'orange', 'pepper', 'quartz', 'rabbit', 'saddle', 'temple', 'urchin',
  'violin', 'window', 'yellow', 'zephyr', 'arrow', 'basket', 'candle', 'desert',
  'emblem', 'falcon', 'gasket', 'horizon', 'igloo', 'jacket', 'kingdom', 'lantern',
  'meadow', 'nectar', 'obelisk', 'parrot', 'quiver', 'rocket', 'sunset', 'thunder',
  'rocket', 'uron', 'valley', 'willow', 'yodel', 'zipper', 'almond', 'beacon',
  'cobbler', 'diamond', 'echo', 'feather', 'gizzard', 'helmet', 'indigo', 'jackal',
  'kayak', 'lasso', 'marble', 'nomad', 'opal', 'plum', 'quilt', 'ribbon',
  'spoon', 'thief', 'urn', 'vase', 'wombat', 'yarn', 'zoo', 'antenna',
  'blue', 'cloud', 'dawn', 'elf', 'frost', 'grape', 'honey', 'ice',
  'jet', 'kite', 'leaf', 'mango', 'nest', 'owl', 'palm', 'quiz',
  'rose', 'salt', 'tree', 'umbrella', 'vase', 'wolf', 'yawn', 'zinc',
  'amber', 'birch', 'coral', 'dune', 'ember', 'fern', 'geyser', 'hill',
  'iris', 'jam', 'knot', 'lime', 'mint', 'nook', 'oat', 'pear',
  'quay', 'reed', 'sky', 'tide', 'urn', 'vine', 'wave', 'yurt',
  'acorn', 'badger', 'chipmunk', 'dolphin', 'elk', 'fox', 'gazelle', 'hedgehog',
  'ibex', 'jay', 'koala', 'lynx', 'moose', 'narwhal', 'otter', 'panther',
  'quail', 'raccoon', 'salmon', 'trout', 'urial', 'vole', 'wallaby', 'yak',
]
// De-duplicate while preserving order so entropy math stays accurate.
const WORDS: string[] = Array.from(new Set(WORD_LIST))
type Separator = 'hyphen' | 'space' | 'dot' | 'underscore' | 'none'
const SEPARATORS: Record<Separator, string> = {
  hyphen: '-',
  space: ' ',
  dot: '.',
  underscore: '_',
  none: '',
}
const APPEND_DIGITS = '0123456789'
const APPEND_SYMBOLS = '!@#$%&*?'
const SYMBOL_BITS = Math.log2(APPEND_SYMBOLS.length)
const DIGIT_BITS = Math.log2(APPEND_DIGITS.length)
type Grade = {
  level: 0 | 1 | 2 | 3 | 4
  label: string
  tone: string
}
function gradeForEntropy(bits: number): Grade {
  if (bits < 28) return { level: 0, label: 'Very Weak', tone: 'text-red-600' }
  if (bits < 36) return { level: 1, label: 'Weak', tone: 'text-orange-600' }
  if (bits < 60) return { level: 2, label: 'Fair', tone: 'text-yellow-600' }
  if (bits < 128) return { level: 3, label: 'Strong', tone: 'text-emerald-600' }
  return { level: 4, label: 'Very Strong', tone: 'text-emerald-700' }
}
function pickWord(): string {
  return WORDS[randomInt(WORDS.length)]!
}
function capitalize(w: string): string {
  if (w.length === 0) return w
  return w.charAt(0).toUpperCase() + w.slice(1)
}
function generatePassphrase(opts: {
  count: number
  separator: Separator
  capitalize: boolean
  appendNumber: boolean
  appendSymbol: boolean
}): string {
  if (WORDS.length === 0 || opts.count <= 0) return ''
  const sep = SEPARATORS[opts.separator]
  const words: string[] = []
  for (let i = 0; i < opts.count; i++) {
    const w = pickWord()
    words.push(opts.capitalize ? capitalize(w) : w)
  }
  let out = words.join(sep)
  if (opts.appendNumber) {
    out += APPEND_DIGITS[randomInt(APPEND_DIGITS.length)]
  }
  if (opts.appendSymbol) {
    out += APPEND_SYMBOLS[randomInt(APPEND_SYMBOLS.length)]
  }
  return out
}
export default function SecurePassphraseGenerator() {
  const [count, setCount] = React.useState(4)
  const [separator, setSeparator] = React.useState<Separator>('hyphen')
  const [cap, setCap] = React.useState(false)
  const [appendNumber, setAppendNumber] = React.useState(false)
  const [appendSymbol, setAppendSymbol] = React.useState(false)
  const [passphrase, setPassphrase] = React.useState('')
  const { copied, copy } = useCopy()
  const wordBits = Math.log2(WORDS.length) * count
  const extraBits =
    (appendNumber ? DIGIT_BITS : 0) + (appendSymbol ? SYMBOL_BITS : 0)
  const entropy = wordBits + extraBits
  const grade = gradeForEntropy(entropy)
  const regenerate = React.useCallback(() => {
    if (WORDS.length === 0) {
      toast.error('Word list unavailable')
      return
    }
    setPassphrase(
      generatePassphrase({
        count,
        separator,
        capitalize: cap,
        appendNumber,
        appendSymbol,
      })
    )
  }, [count, separator, cap, appendNumber, appendSymbol])
  // Generate on mount and whenever options change.
  React.useEffect(() => {
    setPassphrase(
      generatePassphrase({
        count,
        separator,
        capitalize: cap,
        appendNumber,
        appendSymbol,
      })
    )
  }, [count, separator, cap, appendNumber, appendSymbol])
  const progressValue = Math.min(100, (entropy / 256) * 100)
  const wordCount = passphrase
    .split(SEPARATORS[separator] || ' ')
    .filter(Boolean).length
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            Generated Passphrase
          </CardTitle>
          <CardDescription>
            Memorable words chosen with Web Crypto — easier to type and recall
            than random symbols.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <pre
            aria-live="polite"
            aria-label="Generated passphrase"
            className="fl-scroll min-h-[3.5rem] overflow-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xl break-all sm:text-2xl"
          >
            {passphrase || (
              <span className="text-sm text-muted-foreground/60">
                Adjust options below to generate a passphrase.
              </span>
            )}
          </pre>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={regenerate}
              className="bg-primary text-primary-foreground"
            >
              <RefreshCw className="size-4" />
              Regenerate
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => copy(passphrase, 'Passphrase copied')}
              disabled={passphrase.length === 0}
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
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
            <CardDescription>Shape your passphrase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Field
              label="Word count"
              htmlFor="pp-count"
              hint={`${count} words`}
            >
              <Slider
                id="pp-count"
                min={3}
                max={10}
                step={1}
                value={[count]}
                onValueChange={(v) => setCount(v[0] ?? 4)}
                aria-label="Word count"
              />
            </Field>
            <Field label="Separator" htmlFor="pp-sep">
              <Select
                value={separator}
                onValueChange={(v) => setSeparator(v as Separator)}
              >
                <SelectTrigger id="pp-sep" className="w-full">
                  <SelectValue placeholder="Choose a separator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hyphen">Hyphen ( - )</SelectItem>
                  <SelectItem value="space">Space ( )</SelectItem>
                  <SelectItem value="dot">Dot ( . )</SelectItem>
                  <SelectItem value="underscore">Underscore ( _ )</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="pp-cap" className="cursor-pointer">
                Capitalize each word
              </Label>
              <Switch
                id="pp-cap"
                checked={cap}
                onCheckedChange={setCap}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="pp-num" className="cursor-pointer">
                Append a number
              </Label>
              <Switch
                id="pp-num"
                checked={appendNumber}
                onCheckedChange={setAppendNumber}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="pp-sym" className="cursor-pointer">
                Append a symbol
              </Label>
              <Switch
                id="pp-sym"
                checked={appendSymbol}
                onCheckedChange={setAppendSymbol}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Entropy Breakdown</CardTitle>
            <CardDescription>
              Built from{' '}
              <span className="font-mono">{WORDS.length}</span> unique words.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat
                label="Word entropy"
                value={`${wordBits.toFixed(1)}b`}
              />
              <Stat
                label="Number extra"
                value={appendNumber ? `${DIGIT_BITS.toFixed(1)}b` : '—'}
              />
              <Stat
                label="Symbol extra"
                value={appendSymbol ? `${SYMBOL_BITS.toFixed(1)}b` : '—'}
              />
              <Stat label="Total bits" value={entropy.toFixed(1)} />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Entropy = <span className="font-mono">log₂(words) × count</span>{' '}
              plus extras. Four words from a {WORDS.length}-word list give ≈{' '}
              {(Math.log2(WORDS.length) * 4).toFixed(0)} bits — strong against
              offline cracking.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Current passphrase has{' '}
              <span className="font-mono">{wordCount}</span> word
              {wordCount === 1 ? '' : 's'} and{' '}
              <span className="font-mono">{passphrase.length}</span> characters.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}