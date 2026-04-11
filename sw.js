const CACHE_NAME = 'pokeed-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/audio.js',
  '/js/data.js',
  '/js/engine.js',
  '/js/encounter.js',
  '/js/pokedex.js',
  '/js/battle.js',
  '/js/rocket.js',
  '/js/guide.js',
  '/js/pokecenter.js',
  '/js/training.js',
  '/js/settings.js',
  '/js/activities.js',
  '/js/reading-activities.js',
  '/js/reading-activities-advanced.js',
  '/js/systems.js',
  '/assets/pokeball-icon.svg',
  '/manifest.json'
];

// Install: precache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for same-origin, network-first for CDN resources
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // For same-origin requests: cache-first
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        // Return cache hit, but also update cache in background
        const fetchPromise = fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // For external resources (sprites, fonts): network-first with cache fallback
  event.respondWith(
    fetch(event.request).then(response => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});
