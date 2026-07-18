'use client'

import * as React from 'react'
import { Eraser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Field, Stat } from '@/lib/tools/tool-ui'
import { useCopy } from '@/lib/tools/use-copy'
import { toast } from 'sonner'

interface MatchInfo {
  index: number
  value: string
  groups: string[]
}

const FLAGS: { id: string; label: string; desc: string }[] = [
  { id: 'g', label: 'g', desc: 'Global — all matches' },
  { id: 'i', label: 'i', desc: 'Case-insensitive' },
  { id: 'm', label: 'm', desc: 'Multiline (^ and $ per line)' },
  { id: 's', label: 's', desc: 'Dot matches newline' },
  { id: 'u', label: 'u', desc: 'Unicode' },
]

const SAMPLE_PATTERN = '\\b\\w+@\\w+\\.\\w+\\b'
const SAMPLE_TEXT = `Contact us at hello@fernandeslabs.com
or sales@fernandeslabs.io for details.
No email here: not-an-email
Backup: support@fernandeslabs.dev`

function findAllMatches(
  pattern: string,
  flags: string,
  text: string
): { matches: MatchInfo[]; error: string | null } {
  if (!pattern) return { matches: [], error: null }
  let re: RegExp
  try {
    re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
  } catch (e) {
    return {
      matches: [],
      error: e instanceof Error ? e.message : String(e),
    }
  }
  const matches: MatchInfo[] = []
  let m: RegExpExecArray | null
  let safety = 0
  while ((m = re.exec(text)) !== null) {
    matches.push({
      index: m.index,
      value: m[0],
      groups: m.slice(1).map((g) => (g === undefined ? '' : g)),
    })
    if (m.index === re.lastIndex) re.lastIndex++
    if (++safety > 100000) break
  }
  return { matches, error: null }
}

interface HighlightPiece {
  type: 'text' | 'match'
  value: string
  key: string
}

function buildHighlightPieces(
  text: string,
  matches: MatchInfo[]
): HighlightPiece[] {
  if (matches.length === 0) {
    return text
      ? [{ type: 'text', value: text, key: 't0' }]
      : []
  }
  const pieces: HighlightPiece[] = []
  let last = 0
  matches.forEach((mt, i) => {
    if (mt.index > last) {
      pieces.push({
        type: 'text',
        value: text.slice(last, mt.index),
        key: `t${i}`,
      })
    }
    pieces.push({
      type: 'match',
      value: mt.value,
      key: `m${i}`,
    })
    last = mt.index + mt.value.length
  })
  if (last < text.length) {
    pieces.push({
      type: 'text',
      value: text.slice(last),
      key: 'tend',
    })
  }
  return pieces
}

export default function RegexTester() {
  const [pattern, setPattern] = React.useState(SAMPLE_PATTERN)
  const [flagSet, setFlagSet] = React.useState<Set<string>>(new Set(['g', 'i']))
  const [text, setText] = React.useState(SAMPLE_TEXT)
  const { copy } = useCopy()

  const flags = React.useMemo(
    () => ['g', 'i', 'm', 's', 'u'].filter((f) => flagSet.has(f)).join(''),
    [flagSet]
  )

  // Detect /pattern/flags literal form so we can strip the slashes
  // before constructing the RegExp and sync the inline flags.
  const { src, inlineFlags } = React.useMemo(() => {
    if (
      pattern.length >= 2 &&
      pattern.startsWith('/') &&
      pattern.lastIndexOf('/') > 0
    ) {
      const lastSlash = pattern.lastIndexOf('/')
      return {
        src: pattern.slice(1, lastSlash),
        inlineFlags: pattern.slice(lastSlash + 1),
      }
    }
    return { src: pattern, inlineFlags: '' }
  }, [pattern])

  // If user typed /pattern/flags form, sync flags from the trailing part.
  React.useEffect(() => {
    if (inlineFlags) {
      setFlagSet(new Set<string>(inlineFlags.split('')))
    }
  }, [inlineFlags])

  const { matches, error } = React.useMemo(
    () => findAllMatches(src, flags, text),
    [src, flags, text]
  )

  React.useEffect(() => {
    if (error) toast.error('Invalid regex: ' + error)
  }, [error])

  const pieces = React.useMemo(
    () => buildHighlightPieces(text, matches),
    [text, matches]
  )

  const toggleFlag = (f: string) => {
    setFlagSet((prev) => {
      const next = new Set(prev)
      if (next.has(f)) next.delete(f)
      else next.add(f)
      return next
    })
  }

  return (
    <div className="space-y-5">
      <Field
        label="Regular expression"
        htmlFor="rx-pattern"
        hint="Wrap in /…/flags to set flags inline"
      >
        <Input
          id="rx-pattern"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="font-mono text-sm"
          spellCheck={false}
          placeholder="\\b\\w+\\b"
        />
      </Field>

      <Field label="Flags" hint="Toggle standard RegExp flags">
        <div className="flex flex-wrap items-center gap-4">
          {FLAGS.map((f) => (
            <div key={f.id} className="flex items-center gap-1.5">
              <Checkbox
                id={`flag-${f.id}`}
                checked={flagSet.has(f.id)}
                onCheckedChange={() => toggleFlag(f.id)}
              />
              <Label
                htmlFor={`flag-${f.id}`}
                className="cursor-pointer font-mono text-sm"
                title={f.desc}
              >
                {f.label}
              </Label>
            </div>
          ))}
          <span className="ml-2 rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
            /{src || '…'}/{flags}
          </span>
        </div>
      </Field>

      <Field label="Test text" htmlFor="rx-text">
        <Textarea
          id="rx-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="font-mono text-sm"
          spellCheck={false}
          placeholder="Type or paste text to test against…"
        />
      </Field>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setText('')}>
          <Eraser className="size-4" />
          Clear text
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copy(matches.map((m) => m.value).join('\n'), `Copied ${matches.length} matches`)}
          disabled={matches.length === 0}
        >
          Copy matches
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="font-mono text-xs">
            {error}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Match count" value={matches.length} accent="oklch(0.6 0.2 262.6)" />
        <Stat label="Flags" value={flags || '—'} />
        <Stat label="Text chars" value={text.length} />
        <Stat
          label="Matched chars"
          value={matches.reduce((n, m) => n + m.value.length, 0)}
        />
      </div>

      <Field label="Highlighted matches" hint={`${matches.length} found`}>
        <pre
          className="fl-scroll max-h-72 overflow-auto rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm whitespace-pre-wrap break-words"
          aria-live="polite"
        >
          {pieces.length === 0 ? (
            <span className="text-muted-foreground/50">
              Test text will appear here with matches highlighted.
            </span>
          ) : (
            pieces.map((p) =>
              p.type === 'match' ? (
                <mark
                  key={p.key}
                  className="rounded bg-yellow-200 px-0.5 text-foreground dark:bg-yellow-500/40"
                >
                  {p.value}
                </mark>
              ) : (
                <span key={p.key}>{p.value}</span>
              )
            )
          )}
        </pre>
      </Field>

      <Field label="Match list" hint="Index · value · groups">
        <div className="fl-scroll max-h-64 overflow-auto rounded-lg border border-border bg-muted/20">
          {matches.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground">
              No matches yet.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {matches.map((m, i) => (
                <li
                  key={`${m.index}-${i}`}
                  className="flex flex-col gap-1 p-2.5 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid size-5 shrink-0 place-items-center rounded bg-primary/10 font-mono text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      idx {m.index}
                    </span>
                    <code className="ml-auto break-all font-mono text-foreground">
                      {m.value || <em className="text-muted-foreground">(empty)</em>}
                    </code>
                  </div>
                  {m.groups.length > 0 ? (
                    <div className="pl-7 font-mono text-[11px] text-muted-foreground">
                      groups: [
                      {m.groups.map((g, gi) => (
                        <span key={gi}>
                          {gi > 0 ? ', ' : ''}
                          <span className="text-foreground">
                            {g || <em className="text-muted-foreground">∅</em>}
                          </span>
                        </span>
                      ))}
                      ]
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Field>
    </div>
  )
}
