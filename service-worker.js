const CACHE_NAME = 'nyvya-cache-v2'; // Nom du cache MODIFIÉ (pour forcer l’update)
const OFFLINE_URL = '/';

const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/index.html',
  // Android icons
  '/icons/android-icon-36x36.png',
  '/icons/android-icon-48x48.png',
  '/icons/android-icon-72x72.png',
  '/icons/android-icon-96x96.png',
  '/icons/android-icon-144x144.png',
  '/icons/android-icon-192x192.png',
  '/icons/android-icon-512x512.png',
  // Apple touch icons
  '/icons/apple-icon-57x57.png',
  '/icons/apple-icon-60x60.png',
  '/icons/apple-icon-72x72.png',
  '/icons/apple-icon-76x76.png',
  '/icons/apple-icon-114x114.png',
  '/icons/apple-icon-120x120.png',
  '/icons/apple-icon-144x144.png',
  '/icons/apple-icon-152x152.png',
  '/icons/apple-icon-180x180.png',
  '/icons/apple-icon-precomposed.png',
  // Favicons
  '/icons/favicon-16x16.png',
  '/icons/favicon-32x32.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
  );
});

self.addEventListener('activate', event => {
  // Supprime les anciens caches
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        return cached || fetch(event.request)
          .then(networkResponse => {
            // On ne met en cache que les requêtes GET
            if(event.request.method === "GET"){
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, networkResponse.clone()));
            }
            return networkResponse;
          });
      })
  );
});
