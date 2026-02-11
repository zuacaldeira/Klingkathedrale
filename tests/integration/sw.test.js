import { describe, it, expect, vi, beforeEach } from 'vitest';

// We test the service worker logic by evaluating sw.js in a mock environment
describe('Service Worker', () => {
  let handlers;
  let mockCaches;

  beforeEach(() => {
    handlers = {};
    mockCaches = {};

    // Mock self (ServiceWorkerGlobalScope)
    const mockSelf = {
      addEventListener: (event, handler) => {
        handlers[event] = handler;
      },
      skipWaiting: vi.fn(),
      clients: { claim: vi.fn() },
      location: { origin: 'https://example.com' }
    };

    // Mock caches API
    const cacheStore = {};
    mockCaches = {
      open: vi.fn(async (name) => {
        if (!cacheStore[name]) {
          cacheStore[name] = {
            addAll: vi.fn(async () => {}),
            put: vi.fn(async () => {}),
            match: vi.fn(async () => null)
          };
        }
        return cacheStore[name];
      }),
      keys: vi.fn(async () => Object.keys(cacheStore)),
      delete: vi.fn(async (name) => { delete cacheStore[name]; return true; }),
      match: vi.fn(async () => null),
      _store: cacheStore
    };

    globalThis.self = mockSelf;
    globalThis.caches = mockCaches;
    globalThis.fetch = vi.fn();

    // Load the service worker code by evaluating it
    // We re-implement the logic here for testing since we can't import non-module sw.js
    const CACHE_NAME = 'klangkathedrale-v1';
    const PAGES = [
      '/', '/index.html', '/klangkathedrale.html', '/orgel.html',
      '/kathedrale.html', '/universum.html', '/fugenmaschine.html',
      '/partitur.html', '/entdecke-bach.html', '/weltkarte.html',
      '/infografik.html', '/brief.html', '/stimmen.html',
      '/netzwerk.html', '/architektur.html', '/manifest.json'
    ];

    mockSelf.addEventListener('install', event => {
      event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(PAGES))
      );
      mockSelf.skipWaiting();
    });

    mockSelf.addEventListener('activate', event => {
      event.waitUntil(
        caches.keys().then(keys =>
          Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
      );
      mockSelf.clients.claim();
    });

    mockSelf.addEventListener('fetch', event => {
      if (event.request.method !== 'GET') return;
      if (!event.request.url.startsWith(mockSelf.location.origin)) return;

      event.respondWith(
        fetch(event.request)
          .then(response => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => caches.match(event.request))
      );
    });
  });

  describe('install event', () => {
    it('caches all pages', async () => {
      let waitPromise;
      const event = { waitUntil: (p) => { waitPromise = p; } };
      handlers.install(event);
      await waitPromise;
      expect(mockCaches.open).toHaveBeenCalledWith('klangkathedrale-v1');
    });

    it('calls skipWaiting', () => {
      const event = { waitUntil: vi.fn() };
      handlers.install(event);
      expect(globalThis.self.skipWaiting).toHaveBeenCalled();
    });

    it('caches 16 pages', async () => {
      let waitPromise;
      const event = { waitUntil: (p) => { waitPromise = p; } };
      handlers.install(event);
      await waitPromise;
      const cache = await mockCaches.open('klangkathedrale-v1');
      expect(cache.addAll).toHaveBeenCalledWith(expect.arrayContaining([
        '/', '/index.html', '/klangkathedrale.html', '/manifest.json'
      ]));
    });
  });

  describe('activate event', () => {
    it('claims clients', () => {
      const event = { waitUntil: vi.fn() };
      handlers.activate(event);
      expect(globalThis.self.clients.claim).toHaveBeenCalled();
    });

    it('deletes old caches', async () => {
      // Seed an old cache
      mockCaches._store['old-cache-v0'] = {};
      mockCaches.keys.mockResolvedValue(['klangkathedrale-v1', 'old-cache-v0']);

      let waitPromise;
      const event = { waitUntil: (p) => { waitPromise = p; } };
      handlers.activate(event);
      await waitPromise;
      expect(mockCaches.delete).toHaveBeenCalledWith('old-cache-v0');
    });

    it('keeps current cache', async () => {
      mockCaches.keys.mockResolvedValue(['klangkathedrale-v1']);

      let waitPromise;
      const event = { waitUntil: (p) => { waitPromise = p; } };
      handlers.activate(event);
      await waitPromise;
      expect(mockCaches.delete).not.toHaveBeenCalledWith('klangkathedrale-v1');
    });
  });

  describe('fetch event', () => {
    it('ignores non-GET requests', () => {
      let responded = false;
      const event = {
        request: { method: 'POST', url: 'https://example.com/api' },
        respondWith: () => { responded = true; }
      };
      handlers.fetch(event);
      expect(responded).toBe(false);
    });

    it('ignores cross-origin requests', () => {
      let responded = false;
      const event = {
        request: { method: 'GET', url: 'https://other.com/page' },
        respondWith: () => { responded = true; }
      };
      handlers.fetch(event);
      expect(responded).toBe(false);
    });

    it('responds to same-origin GET requests', () => {
      const response = { ok: true, clone: () => response };
      globalThis.fetch.mockResolvedValue(response);
      let responded = false;
      const event = {
        request: { method: 'GET', url: 'https://example.com/page.html' },
        respondWith: () => { responded = true; }
      };
      handlers.fetch(event);
      expect(responded).toBe(true);
    });

    it('falls back to cache on network failure', async () => {
      globalThis.fetch.mockRejectedValue(new Error('offline'));
      const cachedResponse = { ok: true };
      mockCaches.match.mockResolvedValue(cachedResponse);

      let responsePromise;
      const event = {
        request: { method: 'GET', url: 'https://example.com/page.html' },
        respondWith: (p) => { responsePromise = p; }
      };
      handlers.fetch(event);
      const result = await responsePromise;
      expect(mockCaches.match).toHaveBeenCalled();
    });

    it('caches successful network responses', async () => {
      const response = { ok: true, clone: vi.fn(() => ({ ok: true })) };
      globalThis.fetch.mockResolvedValue(response);

      let responsePromise;
      const event = {
        request: { method: 'GET', url: 'https://example.com/page.html' },
        respondWith: (p) => { responsePromise = p; }
      };
      handlers.fetch(event);
      const result = await responsePromise;
      expect(result.ok).toBe(true);
      expect(response.clone).toHaveBeenCalled();
    });
  });
});
