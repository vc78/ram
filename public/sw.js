// Minimal service worker stub to prevent 404s during development
self.addEventListener('install', (event) => {
    self.skipWaiting()
})
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim())
})
self.addEventListener('fetch', (event) => {
    // noop — avoid interfering with normal requests
})
