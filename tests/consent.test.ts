/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test'
import {
  getConsentChoice,
  isConsentGranted,
  pushConsentSignal,
  loadAdsenseScript,
} from '@/lib/ads/consent'

describe('consent helpers (SSR-safe)', () => {
  test('getConsentChoice returns null when window is unavailable', () => {
    expect(getConsentChoice()).toBeNull()
  })

  test('isConsentGranted is false when no choice is stored', () => {
    expect(isConsentGranted()).toBe(false)
  })

  test('pushConsentSignal is a safe no-op without window.gtag', () => {
    // Should not throw when gtag is undefined (server/CI environment).
    expect(() => pushConsentSignal('update', 'granted')).not.toThrow()
  })

  test('loadAdsenseScript is a safe no-op without document', () => {
    // Should not throw when document is undefined.
    expect(() => loadAdsenseScript()).not.toThrow()
  })
})