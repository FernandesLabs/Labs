'use client'

import * as React from 'react'
import { Sparkles, Eraser, AlertTriangle, FileCode2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, ResultBox, Stat } from '@/lib/tools/tool-ui'
import { toast } from 'sonner'

const SAMPLE_SVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.0.dtd"
   width="100"
   height="100"
   viewBox="0 0 100 100"
   inkscape:version="1.1"
   sodipodi:docname="logo.svg">
  <metadata id="metadata8">
    <rdf:RDF>
      <cc:Work rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <sodipodi:namedview id="namedview2" showgrid="false" />
  <!-- A circle with default attributes -->
  <circle cx="50" cy="50" r="40" fill="black" stroke="none" stroke-width="1" />
  <rect width="100" height="100" fill="none" />
  <g></g>
  <path d="M10 10 H 90 V 90 H 10 Z" fill="#10b981" />
</svg>`

// SVG defaults per the SVG specification. Removing these has no visual effect.
const DEFAULT_ATTRS: Record<string, string[]> = {
  stroke: ['none'],
  fill: ['black'],
  'fill-rule': ['nonzero'],
  'clip-rule': ['nonzero'],
  'stroke-width': ['1'],
  'stroke-linecap': ['butt'],
  'stroke-linejoin': ['miter'],
  'stroke-dasharray': ['none'],
  'stroke-dashoffset': ['0'],
  'stroke-opacity': ['1'],
  'fill-opacity': ['1'],
  opacity: ['1'],
  visibility: ['visible'],
  'stroke-miterlimit': ['4'],
  'text-anchor': ['start'],
  'dominant-baseline': ['auto'],
}

const EDITOR_NS_PATTERNS = [
  'inkscape',
  'sodipodi',
  'purl.org/dc',
  'creativecommons.org',
  '1999/02/22-rdf-syntax-ns',
]

interface OptimizeResult {
  ok: boolean
  output: string
  error?: string
  original: number
  optimized: number
  savings: number
  removedAttrs: number
  removedNodes: number
}

function isEditorNamespace(ns: string): boolean {
  return EDITOR_NS_PATTERNS.some((p) => ns.includes(p))
}

function optimizeSvg(input: string): OptimizeResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return {
      ok: false,
      output: '',
      error: 'Empty input',
      original: 0,
      optimized: 0,
      savings: 0,
      removedAttrs: 0,
      removedNodes: 0,
    }
  }
  const original = new Blob([input]).size

  let doc: Document
  try {
    const parser = new DOMParser()
    doc = parser.parseFromString(input, 'image/svg+xml')
  } catch (e) {
    return {
      ok: false,
      output: '',
      error: e instanceof Error ? e.message : 'Failed to parse SVG',
      original,
      optimized: 0,
      savings: 0,
      removedAttrs: 0,
      removedNodes: 0,
    }
  }
  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    return {
      ok: false,
      output: '',
      error: 'Malformed XML — check for unclosed tags or invalid syntax.',
      original,
      optimized: 0,
      savings: 0,
      removedAttrs: 0,
      removedNodes: 0,
    }
  }
  const svg = doc.documentElement
  if (!svg || svg.nodeName.toLowerCase() !== 'svg') {
    return {
      ok: false,
      output: '',
      error: 'Root element must be <svg>.',
      original,
      optimized: 0,
      savings: 0,
      removedAttrs: 0,
      removedNodes: 0,
    }
  }

  let removedAttrs = 0
  let removedNodes = 0

  // 1. Remove comments and processing instructions (XML declaration).
  const piWalker = doc.createTreeWalker(
    svg,
    NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_PROCESSING_INSTRUCTION
  )
  const toRemove: Node[] = []
  while (piWalker.nextNode()) toRemove.push(piWalker.currentNode)
  for (const n of toRemove) {
    n.parentNode?.removeChild(n)
    removedNodes++
  }

  // 2. Remove <metadata> elements and elements in editor namespaces.
  const allEls = Array.from(svg.querySelectorAll('*'))
  for (const el of allEls) {
    if (!el.parentNode) continue
    const ns = el.namespaceURI || ''
    const localName = el.localName.toLowerCase()
    if (localName === 'metadata' || isEditorNamespace(ns)) {
      el.parentNode.removeChild(el)
      removedNodes++
    }
  }

  // 3. Remove editor-namespace attributes from every element (including root).
  const allEls2 = [svg, ...Array.from(svg.querySelectorAll('*'))]
  for (const el of allEls2) {
    const attrs = Array.from(el.attributes)
    for (const attr of attrs) {
      const ans = attr.namespaceURI || ''
      const prefix = attr.prefix || ''
      const name = attr.name
      // xmlns:foo declarations where foo is an editor prefix
      if (name.startsWith('xmlns:') && isEditorNamespace(attr.nodeValue || '')) {
        el.removeAttributeNode(attr)
        removedAttrs++
        continue
      }
      if (isEditorNamespace(ans) || (prefix && isEditorNamespace(prefix))) {
        el.removeAttributeNode(attr)
        removedAttrs++
      }
    }
  }

  // 4. Remove default-value attributes per the SVG spec.
  const allEls3 = [svg, ...Array.from(svg.querySelectorAll('*'))]
  for (const el of allEls3) {
    for (const [name, defaults] of Object.entries(DEFAULT_ATTRS)) {
      const attr = el.getAttribute(name)
      if (attr !== null && defaults.includes(attr.trim())) {
        el.removeAttribute(name)
        removedAttrs++
      }
    }
  }

  // 5. Remove empty elements (no children AND no attributes).
  //    Iterate to a fixed point: removing one empty element can leave its
  //    parent empty.
  let changed = true
  while (changed) {
    changed = false
    const els = Array.from(svg.querySelectorAll('*'))
    for (const el of els) {
      if (!el.parentNode) continue
      if (el.childNodes.length === 0 && el.attributes.length === 0) {
        el.parentNode.removeChild(el)
        removedNodes++
        changed = true
      }
    }
  }

  // 6. Remove whitespace-only text nodes outside of <text>/<tspan>/<title>/<desc>.
  const TEXT_TAGS = new Set(['text', 'tspan', 'title', 'desc', 'style', 'script'])
  const textWalker = doc.createTreeWalker(svg, NodeFilter.SHOW_TEXT)
  const textsToRemove: Node[] = []
  while (textWalker.nextNode()) {
    const node = textWalker.currentNode as Text
    const parent = node.parentNode
    if (
      parent &&
      !TEXT_TAGS.has(parent.nodeName.toLowerCase()) &&
      node.nodeValue &&
      node.nodeValue.trim() === ''
    ) {
      textsToRemove.push(node)
    }
  }
  for (const n of textsToRemove) {
    n.parentNode?.removeChild(n)
    removedNodes++
  }

  // 7. Serialize and collapse inter-tag whitespace.
  const serializer = new XMLSerializer()
  let out = serializer.serializeToString(svg)
  // Collapse any whitespace runs between tags
  out = out.replace(/>\s+</g, '><').trim()
  // Collapse leading/trailing whitespace inside the root
  out = out.replace(/\s{2,}/g, ' ')

  const optimized = new Blob([out]).size
  const savings =
    original > 0 ? Math.round((1 - optimized / original) * 100) : 0

  return {
    ok: true,
    output: out,
    original,
    optimized,
    savings,
    removedAttrs,
    removedNodes,
  }
}

export default function SvgOptimizer(): React.JSX.Element {
  const [input, setInput] = React.useState<string>(SAMPLE_SVG)

  const result = React.useMemo(() => optimizeSvg(input), [input])

  const handleClear = (): void => {
    setInput('')
    toast.success('Cleared')
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCode2 className="size-4" />
            SVG Optimizer
          </CardTitle>
          <CardDescription>
            Strip comments, XML declarations, Inkscape/Sodipodi/RDF metadata,
            empty elements, default attributes, and redundant whitespace from
            SVG markup. See original vs. optimized size with live savings. All
            processing happens client-side.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setInput(SAMPLE_SVG)}
            >
              <Sparkles className="size-3.5" />
              Load sample
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={input.length === 0}
              className="text-muted-foreground"
            >
              <Eraser className="size-3.5" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Field
        label="SVG markup"
        htmlFor="so-input"
        hint={`${new Blob([input]).size} bytes`}
      >
        <Textarea
          id="so-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot;>...</svg>"
          className="min-h-40 font-mono text-xs"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </Field>

      {!result.ok && input.trim() !== '' ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-400"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <div>
            <div className="font-medium">Could not optimize SVG</div>
            <div className="text-xs">{result.error}</div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Original" value={`${result.original} B`} />
        <Stat
          label="Optimized"
          value={result.ok ? `${result.optimized} B` : '—'}
          accent="oklch(0.6 0.17 150)"
        />
        <Stat
          label="Savings"
          value={result.ok ? `${result.savings}%` : '—'}
          accent={
            result.ok && result.savings >= 25
              ? 'oklch(0.6 0.17 150)'
              : 'oklch(0.7 0.18 75)'
          }
        />
        <Stat
          label="Removed"
          value={result.ok ? `${result.removedAttrs}/${result.removedNodes}` : '—'}
        />
      </div>

      <ResultBox
        value={result.ok ? result.output : ''}
        label="Optimized SVG"
        mono
        rows={10}
        downloadName="optimized.svg"
        empty={
          result.ok
            ? 'Enter SVG markup above to see the optimized output.'
            : 'Fix the SVG errors to see optimized output.'
        }
      />

      {result.ok && result.output ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Optimized preview</CardTitle>
            <CardDescription>
              Renders the optimized SVG inline. Same-origin sandbox — your own
              input only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex max-h-[24rem] min-h-48 items-center justify-center overflow-auto rounded-lg border border-border bg-muted/30 p-6">
              {/* User-entered SVG rendered client-side only — same-origin sandbox. */}
              <div dangerouslySetInnerHTML={{ __html: result.output }} />
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
