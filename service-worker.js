const CACHE_NAME = 'nyvya-cache-v1';
const OFFLINE_URL = '/';

const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/index.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        return cached || fetch(event.request)
          .then(networkResponse => {
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, networkResponse.clone()));
            return networkResponse;
          });
      })
  );
});
