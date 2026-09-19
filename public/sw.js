// Fernandes Labs Tool Network — Service Worker
// Cache-first for static assets, network-first for HTML, stale-while-revalidate fallback.
// v2: precaches the branded /offline fallback page and serves it when a
//     navigation request fails both the network and every cache.
const SW_VERSION = 'fl-v2'
const STATIC_CACHE = `${SW_VERSION}-static`
const RUNTIME_CACHE = `${SW_VERSION}-runtime`
// Assets to precache on install (app shell + shared assets + offline fallback)
const PRECACHE_URLS = [
  '/',
  '/offline',
  '/manifest.webmanifest',
  '/fl-logo.svg',
]
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => undefined))
      .then(() => self.skipWaiting())
  )
})
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(SW_VERSION))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  )
})
self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  // Only handle same-origin requests; let cross-origin (CDN libs) pass through.
  if (url.origin !== self.location.origin) return
  // Navigation requests (HTML pages): network-first, fall back to the cached
  // copy of the requested page, then the cached homepage shell, then the
  // branded /offline page (always precached).
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(RUNTIME_CACHE).then((c) => c.put('/', copy))
          return res
        })
        .catch(() =>
          caches
            .match(req)
            .then((r) => r || caches.match('/'))
            .then((r) => r || caches.match('/offline'))
        )
    )
    return
  }
  // Static assets (JS, CSS, fonts, images): stale-while-revalidate.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone()
            caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy))
          }
          return res
        })
        .catch(() => cached)
      return cached || network
    })
  )
})