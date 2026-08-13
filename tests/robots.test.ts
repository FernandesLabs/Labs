/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import robots from '@/app/robots'

describe('robots.txt', () => {
  test('allows the site root and only disallows /api/', () => {
    const cfg = robots()
    const rule = cfg.rules[0]
    expect(rule.userAgent).toBe('*')
    expect(rule.allow).toBe('/')
    expect(rule.disallow).toEqual(['/api/'])
  })

  test('does NOT block static assets (CSS/JS) — required for rendering', () => {
    const cfg = robots()
    const disallowed = cfg.rules[0].disallow ?? []
    expect(disallowed).not.toContain('/_next/static/')
    expect(disallowed.some((d) => d.includes('static'))).toBe(false)
  })

  test('points to the sitemap on the canonical domain', () => {
    const cfg = robots()
    expect(cfg.sitemap).toBe('https://www.fernandeslabs.com/sitemap.xml')
    expect(cfg.host).toBe('www.fernandeslabs.com')
  })
})
