'use client'
import * as React from 'react'
/**
 * Registers the service worker for offline/PWA support.
 * Only registers in production builds to avoid caching dev assets.
 */
export function ServiceWorkerRegister() {
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    // Skip in dev — the SW would cache HMR assets and break hot reload.
    if (process.env.NODE_ENV !== 'production') return
    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .catch(() => {
          // SW registration failed — app still works online. Silent.
        })
    }
    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register, { once: true })
    }
  }, [])
  return null
}