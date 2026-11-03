/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'
import { ToolContent } from '@/components/hub/tool-content'
import { ToolJsonLd } from '@/components/hub/tool-json-ld'
import { getToolContentOverride } from '@/app/tools/[slug]/tool-content-overrides'
import { generateToolFaq, generateToolHowTo } from '@/app/tools/[slug]/tool-seo'
import { toolMetaList } from '@/lib/tools/tool-meta'

function decodeEntities(html: string): string {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

describe('tool content delivery', () => {
  test('every supplied FAQ and how-to step is rendered and matches JSON-LD', () => {
    // Render the actual components even when no production build exists.
    // The same per-page object must feed the visible text and the schema.
    for (const meta of toolMetaList) {
      const tool = { ...meta, Component: () => null }
      const content = getToolContentOverride(tool.slug)
      expect(content, tool.slug).not.toBeNull()
      const visible = decodeEntities(
        renderToStaticMarkup(<ToolContent tool={tool} content={content} />)
      )
      const schemaHtml = renderToStaticMarkup(<ToolJsonLd tool={tool} content={content} />)
      const graph = JSON.parse(schemaHtml.replace(/^<script[^>]*>|<\/script>$/g, ''))['@graph']
      const faqSchema = graph.find((item: { '@type': string }) => item['@type'] === 'FAQPage')
      const howToSchema = graph.find((item: { '@type': string }) => item['@type'] === 'HowTo')
      for (const [i, faq] of content!.faqs.entries()) {
        expect(visible, tool.slug).toContain(faq.q)
        expect(visible, tool.slug).toContain(faq.a)
        expect(faqSchema.mainEntity[i].name).toBe(faq.q)
        expect(faqSchema.mainEntity[i].acceptedAnswer.text).toBe(faq.a)
      }
      expect(howToSchema.step.map((step: { text: string }) => step.text)).toEqual(content!.howTo)
      for (const step of content!.howTo) expect(visible, tool.slug).toContain(step)
    }
  })

  test('missing editorial content preserves matching visible and schema fallbacks', () => {
    const tool = { ...toolMetaList[0], Component: () => null }
    const visible = decodeEntities(renderToStaticMarkup(<ToolContent tool={tool} content={null} />))
    const schemaHtml = renderToStaticMarkup(<ToolJsonLd tool={tool} content={null} />)
    const graph = JSON.parse(schemaHtml.replace(/^<script[^>]*>|<\/script>$/g, ''))['@graph']
    const faqs = generateToolFaq(tool)
    const faqSchema = graph.find((item: { '@type': string }) => item['@type'] === 'FAQPage')
    expect(faqSchema.mainEntity.map((item: { name: string }) => item.name)).toEqual(faqs.map((faq) => faq.q))
    for (const faq of faqs) expect(visible).toContain(faq.a)
    for (const step of generateToolHowTo(tool)) expect(visible).toContain(step)
  })

  test('the tool client dependency graph does not include all tools editorial content', () => {
    // Follow actual runtime imports, including lazy imports and re-exports.
    // A type-only reference is harmless; a barrel import of the overrides
    // sends nearly a megabyte of unrelated editorial text to each visitor.
    const root = process.cwd()
    const configPath = join(root, 'tsconfig.json')
    const config = ts.readConfigFile(configPath, ts.sys.readFile)
    const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
    const pending = [join(root, 'src/app/tools/[slug]/tool-page-client.tsx')]
    const visited = new Set<string>()
    const offenders: string[] = []
    while (pending.length) {
      const path = pending.pop()!
      if (visited.has(path)) continue
      visited.add(path)
      if (path.endsWith('/tool-content-overrides.ts') || /\/overrides\/(?!types\.ts$)/.test(path)) {
        offenders.push(path.slice(root.length + 1))
      }
      if (!/\.tsx?$/.test(path)) continue
      const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true)
      const dependencies: string[] = []
      function visit(node: ts.Node) {
        if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
          const clause = node.importClause
          const bindings = clause?.namedBindings
          const onlyTypes = clause?.isTypeOnly || (
            !clause?.name && bindings && ts.isNamedImports(bindings) &&
            bindings.elements.every((element) => element.isTypeOnly)
          )
          if (!onlyTypes) dependencies.push(node.moduleSpecifier.text)
        } else if (ts.isExportDeclaration(node) && !node.isTypeOnly && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
          const onlyTypes = node.exportClause && ts.isNamedExports(node.exportClause) &&
            node.exportClause.elements.every((element) => element.isTypeOnly)
          if (!onlyTypes) dependencies.push(node.moduleSpecifier.text)
        } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && ts.isStringLiteral(node.arguments[0])) {
          dependencies.push(node.arguments[0].text)
        }
        ts.forEachChild(node, visit)
      }
      visit(source)
      for (const dependency of dependencies) {
        if (!dependency.startsWith('.') && !dependency.startsWith('@/')) continue
        const resolved = ts.resolveModuleName(dependency, path, options, ts.sys).resolvedModule?.resolvedFileName
        if (resolved && resolved.startsWith(join(root, 'src') + '/')) pending.push(resolved)
      }
    }
    expect(visited.size).toBeGreaterThan(10)
    expect(offenders).toEqual([])
  })
})
