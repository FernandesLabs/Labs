'use client'
import * as React from 'react'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Wand2,
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Field, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'
type Level = 'error' | 'warning'
interface Issue {
  level: Level
  rule: string
  element: string
  suggestion: string
}
const SAMPLE_HTML = `<div>
  <img src="/hero.jpg" />
  <button onClick="submit()"></button>
  <a href="/next"></a>
  <input type="text" name="email" />
  <h1>Welcome</h1>
  <h3>Subheading</h3>
  <h2>Another</h2>
  <ul role="button">
    <li>Item 1</li>
  </ul>
  <div onClick="toggle()" class="card">Click me</div>
  <svg width="20" height="20"><path d="M0 0"/></svg>
</div>`
function visibleText(el: Element): string {
  return (el.textContent || '').trim()
}
function getAttr(el: Element, name: string): string | null {
  return el.getAttribute(name)
}
function isInteractive(el: Element): boolean {
  const tag = el.tagName.toLowerCase()
  return ['a', 'button', 'input', 'select', 'textarea', 'summary'].includes(tag)
}
function analyse(doc: Document): Issue[] {
  const issues: Issue[] = []
  // 1. Missing lang on <html>
  const html = doc.documentElement
  if (!html || !html.getAttribute('lang')) {
    issues.push({
      level: 'warning',
      rule: 'missing-lang',
      element: '<html>',
      suggestion:
        'Add a lang attribute (e.g. <html lang="en">) so screen readers pronounce content correctly.',
    })
  }
  // 2. Images without alt
  const imgs = Array.from(doc.querySelectorAll('img'))
  for (const img of imgs) {
    if (!img.hasAttribute('alt')) {
      issues.push({
        level: 'error',
        rule: 'img-missing-alt',
        element: `<img src="${img.getAttribute('src') || ''}">`,
        suggestion:
          'Add an alt attribute. Use alt="" for decorative images, descriptive text for informative ones.',
      })
    } else {
      const alt = (img.getAttribute('alt') || '').trim()
      if (alt.length > 125) {
        issues.push({
          level: 'warning',
          rule: 'img-long-alt',
          element: `<img src="${img.getAttribute('src') || ''}">`,
          suggestion: `Alt text is ${alt.length} chars — keep it under 125 for screen-reader brevity.`,
        })
      }
    }
  }
  // 3. Form inputs without an associated <label for>
  const labelsByFor = new Set(
    Array.from(doc.querySelectorAll('label[for]')).map((l) =>
      l.getAttribute('for')
    )
  )
  const labelable = Array.from(
    doc.querySelectorAll('input, select, textarea')
  ) as HTMLElement[]
  for (const input of labelable) {
    const type = (input.getAttribute('type') || '').toLowerCase()
    if (type === 'hidden' || type === 'submit' || type === 'button') continue
    const id = input.getAttribute('id')
    const hasLabel = id ? labelsByFor.has(id) : false
    const ariaLabel = input.getAttribute('aria-label')
    const ariaLabelledBy = input.getAttribute('aria-labelledby')
    const wrapped = input.closest('label')
    if (!hasLabel && !ariaLabel && !ariaLabelledBy && !wrapped) {
      const name = input.getAttribute('name') || input.tagName.toLowerCase()
      issues.push({
        level: 'error',
        rule: 'input-no-label',
        element: `<${input.tagName.toLowerCase()} name="${name}">`,
        suggestion:
          'Associate a <label for="id">, wrap the input in a <label>, or add an aria-label attribute.',
      })
    }
  }
  // 4. Buttons without accessible text
  const buttons = Array.from(doc.querySelectorAll('button'))
  for (const btn of buttons) {
    const text = visibleText(btn)
    const ariaLabel = btn.getAttribute('aria-label')
    const ariaLabelledBy = btn.getAttribute('aria-labelledby')
    const title = btn.getAttribute('title')
    const hasImgAlt = Array.from(btn.querySelectorAll('img[alt]')).some(
      (i) => (i.getAttribute('alt') || '').trim().length > 0
    )
    if (!text && !ariaLabel && !ariaLabelledBy && !title && !hasImgAlt) {
      issues.push({
        level: 'error',
        rule: 'button-no-text',
        element: '<button>',
        suggestion:
          'Add visible text, an aria-label, or an inner <img alt="..."> describing the action.',
      })
    }
  }
  // 5. Links without text or accessible name
  const links = Array.from(doc.querySelectorAll('a'))
  for (const link of links) {
    const text = visibleText(link)
    const ariaLabel = link.getAttribute('aria-label')
    const ariaLabelledBy = link.getAttribute('aria-labelledby')
    const title = link.getAttribute('title')
    const hasImgAlt = Array.from(link.querySelectorAll('img[alt]')).some(
      (i) => (i.getAttribute('alt') || '').trim().length > 0
    )
    if (!text && !ariaLabel && !ariaLabelledBy && !title && !hasImgAlt) {
      const href = link.getAttribute('href') || ''
      issues.push({
        level: 'error',
        rule: 'link-no-text',
        element: `<a href="${href}">`,
        suggestion:
          'Add link text describing the destination. Avoid "click here" — use descriptive text or aria-label.',
      })
    }
  }
  // 6. Heading hierarchy
  const headings = Array.from(
    doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
  ) as HTMLElement[]
  let lastLevel = 0
  let h1Count = 0
  for (const h of headings) {
    const level = Number(h.tagName.substring(1))
    if (level === 1) h1Count++
    if (lastLevel > 0) {
      if (level > lastLevel + 1) {
        issues.push({
          level: 'warning',
          rule: 'heading-skip',
          element: `<${h.tagName.toLowerCase()}>${visibleText(h).slice(0, 40)}`,
          suggestion: `Heading skips from h${lastLevel} to h${level}. Don't skip levels — use h${lastLevel + 1} instead.`,
        })
      }
    }
    lastLevel = level
  }
  if (h1Count === 0 && headings.length > 0) {
    issues.push({
      level: 'warning',
      rule: 'no-h1',
      element: '<h1>',
      suggestion:
        'No h1 found. Each page should have exactly one h1 describing its main topic.',
    })
  }
  if (h1Count > 1) {
    issues.push({
      level: 'warning',
      rule: 'multiple-h1',
      element: `<h1> × ${h1Count}`,
      suggestion: `${h1Count} h1 elements found. Use exactly one h1 per page for the main topic.`,
    })
  }
  // 7. role="button" on non-interactive elements
  const roleButtons = Array.from(
    doc.querySelectorAll('[role="button"]')
  )
  for (const el of roleButtons) {
    const tag = el.tagName.toLowerCase()
    if (tag !== 'button' && tag !== 'a' && !isInteractive(el)) {
      const text = visibleText(el).slice(0, 40) || tag
      issues.push({
        level: 'warning',
        rule: 'role-button-misuse',
        element: `<${tag}>${text}`,
        suggestion:
          'Using role="button" on a <div> requires tabindex, keyboard handlers (Enter/Space), and focus styling. Prefer a real <button> element.',
      })
    }
  }
  // 8. Interactive elements missing aria-label where there is no visible text
  const interactives = Array.from(
    doc.querySelectorAll('a, button, [role="button"]')
  )
  for (const el of interactives) {
    if (visibleText(el)) continue
    if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) continue
    // skip if it has an img with alt
    const hasImgAlt = Array.from(el.querySelectorAll('img[alt]')).some(
      (i) => (i.getAttribute('alt') || '').trim().length > 0
    )
    if (hasImgAlt) continue
    const tag = el.tagName.toLowerCase()
    issues.push({
      level: 'warning',
      rule: 'interactive-no-name',
      element: `<${tag} role="${el.getAttribute('role') || tag}">`,
      suggestion:
        'Interactive element has no accessible name. Add aria-label or visible text.',
    })
  }
  // 9. SVG without role or aria-label
  const svgs = Array.from(doc.querySelectorAll('svg'))
  for (const svg of svgs) {
    const role = svg.getAttribute('role')
    const ariaLabel = svg.getAttribute('aria-label')
    const ariaHidden = svg.getAttribute('aria-hidden') === 'true'
    if (!role && !ariaLabel && !ariaHidden) {
      issues.push({
        level: 'warning',
        rule: 'svg-no-role',
        element: '<svg>',
        suggestion:
          'Add role="img" and aria-label, or aria-hidden="true" if decorative.',
      })
    }
  }
  // Deduplicate by element+suggestion
  const seen = new Set<string>()
  return issues.filter((i) => {
    const k = `${i.rule}|${i.element}|${i.suggestion}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}
function levelStyles(level: Level): {
  border: string
  bg: string
  text: string
  icon: React.ReactNode
} {
  if (level === 'error') {
    return {
      border: 'border-rose-500/40',
      bg: 'bg-rose-500/10',
      text: 'text-rose-700 dark:text-rose-400',
      icon: <AlertCircle className="mt-0.5 size-4 shrink-0" />,
    }
  }
  return {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
    icon: <AlertTriangle className="mt-0.5 size-4 shrink-0" />,
  }
}
export default function AriaValidator() {
  const [markup, setMarkup] = React.useState(SAMPLE_HTML)
  const { issues, parseError, totalElements } = React.useMemo(() => {
    if (markup.trim() === '') {
      return { issues: [] as Issue[], parseError: null, totalElements: 0 }
    }
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(markup, 'text/html')
      const parserError = doc.querySelector('parsererror')
      if (parserError) {
        return {
          issues: [] as Issue[],
          parseError: parserError.textContent || 'Invalid HTML markup.',
          totalElements: 0,
        }
      }
      const total = doc.querySelectorAll('*').length
      return {
        issues: analyse(doc),
        parseError: null,
        totalElements: total,
      }
    } catch (e) {
      return {
        issues: [] as Issue[],
        parseError: e instanceof Error ? e.message : 'Failed to parse HTML.',
        totalElements: 0,
      }
    }
  }, [markup])
  const errorCount = issues.filter((i) => i.level === 'error').length
  const warningCount = issues.filter((i) => i.level === 'warning').length
  const loadSample = (): void => {
    setMarkup(SAMPLE_HTML)
    toast.success('Sample HTML with intentional issues loaded.')
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>ARIA Validator</CardTitle>
          <CardDescription>
            Parse HTML markup and surface accessibility issues: missing alt
            text, missing labels, empty buttons/links, skipped headings,
            missing lang, and ARIA misuse. All parsing is local via
            DOMParser — no markup leaves the browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="HTML markup"
            htmlFor="av-html"
            hint={`${totalElements} element${totalElements === 1 ? '' : 's'}`}
          >
            <Textarea
              id="av-html"
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
              placeholder="<div>…paste your HTML here…</div>"
              rows={10}
              className="font-mono text-xs"
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={loadSample}>
              <Wand2 className="size-3.5" />
              Load sample (with issues)
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setMarkup('')}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
      <div
        className="grid gap-3 sm:grid-cols-3"
        role="status"
        aria-live="polite"
      >
        <Stat label="Errors" value={errorCount} accent="#dc2626" />
        <Stat label="Warnings" value={warningCount} accent="#f59e0b" />
        <Stat label="Total issues" value={issues.length} />
      </div>
      {parseError ? (
        <div
          role="alert"
          className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-400"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <div>
              <div className="font-medium">Could not parse HTML</div>
              <pre className="mt-1 whitespace-pre-wrap text-xs">
                {parseError}
              </pre>
            </div>
          </div>
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Issues found</CardTitle>
          <CardDescription>
            {issues.length === 0
              ? markup.trim() === ''
                ? 'Paste HTML to begin validation.'
                : 'No issues detected — your markup passes the checks.'
              : `${errorCount} error${errorCount === 1 ? '' : 's'}, ${warningCount} warning${warningCount === 1 ? '' : 's'}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {markup.trim() === '' ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              Paste HTML markup above to validate.
            </div>
          ) : issues.length === 0 && !parseError ? (
            <div className="flex items-start gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              <div>
                <div className="font-medium">All checks passed</div>
                <div className="text-xs">
                  Note: this is a heuristic static check. Run a full audit
                  with a screen reader or axe-core for comprehensive
                  coverage.
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="max-h-[28rem]">
              <ul className="space-y-2">
                {issues.map((issue, i) => {
                  const styles = levelStyles(issue.level)
                  return (
                    <li
                      key={i}
                      className={`flex items-start gap-3 rounded-lg border ${styles.border} ${styles.bg} p-3 text-sm`}
                    >
                      <span className={styles.text}>{styles.icon}</span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`font-mono text-[10px] uppercase ${styles.text}`}
                          >
                            {issue.level}
                          </Badge>
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {issue.rule}
                          </Badge>
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                            {issue.element}
                          </code>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                          {issue.suggestion}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rules checked</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <FileCode className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">img-missing-alt</strong> —
                every <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">&lt;img&gt;</code> needs an alt attribute.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FileCode className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">input-no-label</strong> —
                inputs need a label, aria-label, or aria-labelledby.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FileCode className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">button-no-text</strong> —
                buttons need accessible text or aria-label.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FileCode className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">link-no-text</strong> —
                links need descriptive text or aria-label.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FileCode className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">heading-skip</strong> —
                don&apos;t skip heading levels (h1 → h3).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FileCode className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">no-h1 / multiple-h1</strong>{' '}
                — exactly one h1 per page.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FileCode className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">missing-lang</strong> —
                the <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">&lt;html&gt;</code> tag needs a lang attribute.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FileCode className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">role-button-misuse</strong>{' '}
                — prefer real <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">&lt;button&gt;</code> over <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">role=&quot;button&quot;</code> on divs.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}