const CACHE_NAME = 'dam-cache-v1'
const STATIC_ASSETS = [
    '/dashboard',
    '/login',
    '/signup',
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS)
        })
    )
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        })
    )
    self.clients.claim()
})

self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Skip non-GET requests and API calls
    if (request.method !== 'GET' || url.pathname.startsWith('/api/')) {
        return
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                // Clone the response for caching
                const responseClone = response.clone()
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseClone)
                })
                return response
            })
            .catch(() => {
                // Serve from cache if offline
                return caches.match(request).then((cached) => {
                    return cached || caches.match('/dashboard')
                })
            })
    )
})

// Handle notification clicks — open dashboard
self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    const url = event.notification.data?.url || '/dashboard'

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
            // Focus existing tab if found
            for (const client of clients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(url)
                    return client.focus()
                }
            }
            // Otherwise open new tab
            return self.clients.openWindow(url)
        })
    )
})
