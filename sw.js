// Klangkathedrale Service Worker
const CACHE_NAME = 'klangkathedrale-v1';
const PAGES = [
  '/',
  '/index.html',
  '/klangkathedrale.html',
  '/orgel.html',
  '/kathedrale.html',
  '/universum.html',
  '/fugenmaschine.html',
  '/partitur.html',
  '/entdecke-bach.html',
  '/weltkarte.html',
  '/infografik.html',
  '/brief.html',
  '/stimmen.html',
  '/netzwerk.html',
  '/architektur.html',
  '/manifest.json'
];

// Install: cache all pages
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PAGES))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first, fall back to cache
self.addEventListener('fetch', event => {
  // Only handle same-origin GET requests
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
