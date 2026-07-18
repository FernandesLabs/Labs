'use client'

import * as React from 'react'
import { Clock, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, Stat } from '@/lib/tools/tool-ui'

type UnixResult = {
  local: string
  utc: string
  iso: string
  ms: number
  seconds: number
  valid: boolean
}

type DtResult = {
  seconds: number
  ms: number
  valid: boolean
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function toLocalDatetimeInput(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function interpretUnix(raw: string): UnixResult {
  const trimmed = raw.trim()
  if (!trimmed) return emptyUnix()
  const n = Number(trimmed)
  if (!Number.isFinite(n)) return emptyUnix()
  // Heuristic: values > 1e12 are likely milliseconds.
  const ms = n > 1e12 ? n : n * 1000
  const d = new Date(ms)
  if (Number.isNaN(d.getTime())) return emptyUnix()
  return {
    local: d.toLocaleString(),
    utc: d.toUTCString(),
    iso: d.toISOString(),
    ms,
    seconds: Math.floor(ms / 1000),
    valid: true,
  }
}

function emptyUnix(): UnixResult {
  return { local: '', utc: '', iso: '', ms: 0, seconds: 0, valid: false }
}

function interpretDt(raw: string): DtResult {
  if (!raw) return { seconds: 0, ms: 0, valid: false }
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return { seconds: 0, ms: 0, valid: false }
  return { seconds: Math.floor(d.getTime() / 1000), ms: d.getTime(), valid: true }
}

export default function UnixTimestampConverter() {
  const [unixInput, setUnixInput] = React.useState('')
  const [dtInput, setDtInput] = React.useState('')

  // Initialise both sides to "now" once on mount.
  React.useEffect(() => {
    const now = new Date()
    setUnixInput(String(Math.floor(now.getTime() / 1000)))
    setDtInput(toLocalDatetimeInput(now))
  }, [])

  const setNow = () => {
    const now = new Date()
    setUnixInput(String(Math.floor(now.getTime() / 1000)))
    setDtInput(toLocalDatetimeInput(now))
  }

  const unix = React.useMemo(() => interpretUnix(unixInput), [unixInput])
  const dt = React.useMemo(() => interpretDt(dtInput), [dtInput])

  const copyToUnix = () => {
    if (dt.valid) setUnixInput(String(dt.seconds))
  }
  const copyToDt = () => {
    if (unix.valid) {
      const d = new Date(unix.ms)
      setDtInput(toLocalDatetimeInput(d))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Convert between Unix timestamps and human-readable dates. Two-way, live updates.
        </p>
        <Button
          type="button"
          onClick={setNow}
          className="bg-primary text-primary-foreground"
          size="sm"
        >
          <Clock className="size-4" />
          Now
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Timestamp → Date</CardTitle>
            <CardDescription>
              Enter a Unix timestamp in seconds (or milliseconds).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              label="Unix timestamp"
              htmlFor="unix-input"
              hint="seconds or ms"
            >
              <Input
                id="unix-input"
                value={unixInput}
                onChange={(e) => setUnixInput(e.target.value)}
                inputMode="numeric"
                placeholder="1700000000"
                className="font-mono"
              />
            </Field>

            {unix.valid ? (
              <div className="space-y-2">
                <Stat label="Local time" value={unix.local} />
                <Stat label="UTC (RFC 7231)" value={unix.utc} />
                <Stat label="ISO 8601" value={unix.iso} />
                <Stat label="Seconds" value={unix.seconds} />
                <Stat label="Milliseconds" value={unix.ms} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {unixInput ? 'Enter a valid numeric timestamp.' : 'Awaiting input.'}
              </p>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyToDt}
              disabled={!unix.valid}
            >
              <ArrowLeftRight className="size-4" />
              Send to date picker
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date → Timestamp</CardTitle>
            <CardDescription>
              Pick a local date and time to compute the Unix value.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Local date & time" htmlFor="dt-input">
              <Input
                id="dt-input"
                type="datetime-local"
                value={dtInput}
                onChange={(e) => setDtInput(e.target.value)}
                step={1}
              />
            </Field>

            {dt.valid ? (
              <div className="space-y-2">
                <Stat label="Unix (seconds)" value={dt.seconds} />
                <Stat label="Unix (milliseconds)" value={dt.ms} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {dtInput ? 'Select a valid date and time.' : 'Awaiting input.'}
              </p>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyToUnix}
              disabled={!dt.valid}
            >
              <ArrowLeftRight className="size-4" />
              Send to timestamp
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
