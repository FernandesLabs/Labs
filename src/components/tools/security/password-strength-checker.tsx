'use client'
import * as React from 'react'
import { Eye, EyeOff, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Stat } from '@/lib/tools/tool-ui'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?/|~`'
const COMMON_PASSWORDS: string[] = [
  'password', '123456', 'qwerty', '12345678', 'abc123', '123456789',
  'letmein', 'monkey', 'dragon', 'iloveyou', 'trustno1', 'sunshine',
  'princess', 'football', 'welcome', 'shadow', 'superman', 'michael',
  'nike', 'charlie', 'andrew', 'jones', 'qazwsx', '12345', '1234',
  'password1', 'admin', 'login', 'master', 'hello',
]
const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
interface AttackModel {
  name: string
  rate: number // guesses per second
  description: string
}
const ATTACK_MODELS: AttackModel[] = [
  { name: 'Online attack', rate: 1e10, description: '10¹⁰/s · throttled service' },
  { name: 'Offline fast', rate: 1e12, description: '10¹²/s · single CPU' },
  { name: 'GPU cluster', rate: 1e14, description: '10¹⁴/s · GPU rig' },
  { name: 'Massive', rate: 1e16, description: '10¹⁶/s · state actor' },
]
type Grade = {
  level: 0 | 1 | 2 | 3 | 4
  label: string
  tone: string
  bar: string
}
function gradeForEntropy(bits: number): Grade {
  if (bits < 28)
    return { level: 0, label: 'Very Weak', tone: 'text-red-600', bar: 'bg-red-500' }
  if (bits < 36)
    return {
      level: 1,
      label: 'Weak',
      tone: 'text-orange-600',
      bar: 'bg-orange-500',
    }
  if (bits < 60)
    return {
      level: 2,
      label: 'Fair',
      tone: 'text-yellow-600',
      bar: 'bg-yellow-500',
    }
  if (bits < 128)
    return {
      level: 3,
      label: 'Strong',
      tone: 'text-emerald-600',
      bar: 'bg-emerald-500',
    }
  return {
    level: 4,
    label: 'Very Strong',
    tone: 'text-emerald-700',
    bar: 'bg-emerald-600',
  }
}
function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) return 'instant'
  if (seconds < 1) return 'instant'
  if (seconds < 60) return `${Math.round(seconds)} seconds`
  const minutes = seconds / 60
  if (minutes < 60) return `${Math.round(minutes)} minutes`
  const hours = minutes / 60
  if (hours < 24) return `${Math.round(hours)} hours`
  const days = hours / 24
  if (days < 30) return `${Math.round(days)} days`
  const months = days / 30
  if (months < 12) return `${Math.round(months)} months`
  const years = days / 365.25
  if (years < 100) return `${Math.round(years)} years`
  if (years < 1000) return `${Math.round(years / 100)} centuries`
  if (years < 1e6) return `${Math.round(years / 1000)} millennia`
  if (years < 1e9) return `${(years / 1e6).toExponential(1)} Mn years`
  if (years < 1e12) return `${(years / 1e9).toExponential(1)} Bn years`
  return 'longer than the universe'
}
function analyze(password: string) {
  const length = password.length
  let lower = 0
  let upper = 0
  let digits = 0
  let symbols = 0
  for (const ch of password) {
    if (LOWER.includes(ch)) lower++
    else if (UPPER.includes(ch)) upper++
    else if (DIGITS.includes(ch)) digits++
    else if (ch) symbols++
  }
  let pool = 0
  if (lower > 0) pool += 26
  if (upper > 0) pool += 26
  if (digits > 0) pool += 10
  if (symbols > 0) pool += SYMBOLS.length
  const entropy = pool > 0 && length > 0 ? Math.log2(pool) * length : 0
  const lowercased = password.toLowerCase()
  const isCommon = length > 0 && COMMON_PASSWORDS.includes(lowercased)
  const isCommonSubstring =
    length > 0 &&
    !isCommon &&
    COMMON_PASSWORDS.some((p) => p.length >= 4 && lowercased.includes(p))
  // Repeated-character runs (aaa, 111, !!!)
  const repeatedRuns: string[] = []
  let runChar = ''
  let runLen = 0
  for (const ch of password) {
    if (ch === runChar) {
      runLen++
    } else {
      if (runLen >= 3 && runChar) repeatedRuns.push(runChar.repeat(runLen))
      runChar = ch
      runLen = 1
    }
  }
  if (runLen >= 3 && runChar) repeatedRuns.push(runChar.repeat(runLen))
  // Sequential runs (abc, 123, cba, 321)
  const sequentialRuns: string[] = []
  let seqStart = 0
  for (let i = 1; i <= length; i++) {
    const prev = password.charCodeAt(i - 1)
    const curr = i < length ? password.charCodeAt(i) : -999
    if (i < length && (curr === prev + 1 || curr === prev - 1)) {
      // continue
    } else {
      const seqLen = i - seqStart
      if (seqLen >= 3) sequentialRuns.push(password.slice(seqStart, i))
      seqStart = i
    }
  }
  // Keyboard sequences (qwerty, asdf)
  const keyboardRuns: string[] = []
  for (const row of KEYBOARD_ROWS) {
    for (let i = 0; i + 3 <= row.length; i++) {
      const slice = row.slice(i, i + 3)
      if (lowercased.includes(slice)) keyboardRuns.push(slice)
      const reversed = slice.split('').reverse().join('')
      if (lowercased.includes(reversed)) keyboardRuns.push(reversed)
    }
  }
  return {
    length,
    lower,
    upper,
    digits,
    symbols,
    pool,
    entropy,
    isCommon,
    isCommonSubstring,
    repeatedRuns,
    sequentialRuns,
    keyboardRuns,
  }
}
export default function PasswordStrengthChecker() {
  const [password, setPassword] = React.useState('')
  const [show, setShow] = React.useState(false)
  const a = analyze(password)
  const grade = gradeForEntropy(a.entropy)
  // Warnings
  const warnings: { type: 'danger' | 'warn' | 'info'; text: string }[] = []
  if (a.length === 0) {
    warnings.push({ type: 'info', text: 'Type a password to see its strength.' })
  } else {
    if (a.isCommon)
      warnings.push({
        type: 'danger',
        text: 'This is a commonly-used password — it will be cracked instantly.',
      })
    if (a.isCommonSubstring)
      warnings.push({
        type: 'warn',
        text: 'Contains a common password inside it — easy to guess.',
      })
    if (a.length < 8)
      warnings.push({
        type: 'warn',
        text: 'Shorter than 8 characters — too short for any account.',
      })
    if (a.repeatedRuns.length > 0)
      warnings.push({
        type: 'warn',
        text: `Repeated characters: ${a.repeatedRuns.map((r) => `"${r}"`).join(', ')}.`,
      })
    if (a.sequentialRuns.length > 0)
      warnings.push({
        type: 'warn',
        text: `Sequential characters: ${a.sequentialRuns.map((r) => `"${r}"`).join(', ')}.`,
      })
    if (a.keyboardRuns.length > 0)
      warnings.push({
        type: 'warn',
        text: `Keyboard pattern detected: ${a.keyboardRuns.slice(0, 3).map((r) => `"${r}"`).join(', ')}.`,
      })
    if (a.pool < 26)
      warnings.push({
        type: 'warn',
        text: 'Uses only one character class — mix letters, digits, and symbols.',
      })
    if (a.length >= 16 && a.pool >= 62 && warnings.length === 0)
      warnings.push({
        type: 'info',
        text: 'Excellent length and character variety.',
      })
  }
  const crackTime = (rate: number): string => {
    if (a.length === 0) return '—'
    const guesses = Math.pow(2, a.entropy)
    const seconds = guesses / 2 / rate
    return formatDuration(seconds)
  }
  const progressValue = Math.min(100, (a.entropy / 256) * 100)
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="size-4" />
            Password Strength Checker
          </CardTitle>
          <CardDescription>
            Analysis runs entirely in your browser. Nothing is sent or stored.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pw-input">Password</Label>
            <div className="relative">
              <Input
                id="pw-input"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type or paste a password to analyze"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="pr-12 font-mono"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setShow((s) => !s)}
                className="absolute top-1 right-1 h-8 w-8"
                aria-label={show ? 'Hide password' : 'Show password'}
                aria-pressed={show}
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Strength</span>
              <span className={`font-semibold ${grade.tone}`}>
                {a.length === 0 ? '—' : `${grade.label} · ${a.entropy.toFixed(1)} bits`}
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
      {a.length > 0 && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Estimated crack time</CardTitle>
              <CardDescription>
                Average time to brute-force at four attack rates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Attack model</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ATTACK_MODELS.map((m) => (
                    <TableRow key={m.name}>
                      <TableCell>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {m.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {crackTime(m.rate)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Composition</CardTitle>
              <CardDescription>
                Pool size{' '}
                <span className="font-mono">{a.pool}</span> ·{' '}
                {a.entropy.toFixed(1)} bits of entropy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Length" value={a.length} />
                <Stat label="Lowercase" value={a.lower} />
                <Stat label="Uppercase" value={a.upper} />
                <Stat label="Digits" value={a.digits} />
                <Stat label="Symbols" value={a.symbols} />
                <Stat label="Pool" value={a.pool} />
                <Stat label="Entropy" value={`${a.entropy.toFixed(1)}b`} />
                <Stat
                  label="Grade"
                  value={
                    <Badge variant="secondary" className={grade.tone}>
                      {grade.label}
                    </Badge>
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {warnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4" />
              Analysis notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {warnings.map((w, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 rounded-md border p-3 text-sm ${
                  w.type === 'danger'
                    ? 'border-red-500/40 bg-red-500/5 text-red-700'
                    : w.type === 'warn'
                      ? 'border-yellow-500/40 bg-yellow-500/5 text-yellow-700'
                      : 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700'
                }`}
              >
                {w.type === 'info' ? (
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                )}
                <span>{w.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}