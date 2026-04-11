const CACHE_NAME = 'pokeed-v4';

// All 151 Pokemon sprite URLs
const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const SPRITE_URLS = Array.from({ length: 151 }, (_, i) => SPRITE_BASE + (i + 1) + '.png');

const PRECACHE_URLS = [
  './',
  './index.html',
  './css/style.css',
  './js/audio.js',
  './js/data.js',
  './js/engine.js',
  './js/encounter.js',
  './js/pokedex.js',
  './js/battle.js',
  './js/rocket.js',
  './js/guide.js',
  './js/pokecenter.js',
  './js/training.js',
  './js/settings.js',
  './js/activities.js',
  './js/reading-activities.js',
  './js/reading-activities-advanced.js',
  './js/systems.js',
  './assets/pokeball-icon.svg',
  './manifest.json',
  // Local assets
  './assets/grass-bg.webp',
  './assets/battle-bg.webp',
  './assets/title-bg.webp',
  './assets/team-rocket-bg.webp',
  './assets/loc-pokecenter.webp',
  './assets/loc-grass.webp',
  './assets/loc-rocket.webp',
  './assets/loc-gym.webp',
  './assets/loc-lab.webp',
  './assets/leader-blaine.webp',
  './assets/leader-brock.webp',
  './assets/leader-erika.webp',
  './assets/leader-giovanni.webp',
  './assets/leader-koga.webp',
  './assets/leader-lt-surge.webp',
  './assets/leader-misty.webp',
  './assets/leader-sabrina.webp',
  './assets/rocket-james.webp',
  './assets/rocket-jessie.webp',
  './assets/badge-boulder.webp',
  './assets/badge-cascade.webp',
  './assets/badge-earth.webp',
  './assets/badge-marsh.webp',
  './assets/badge-rainbow.webp',
  './assets/badge-soul.webp',
  './assets/badge-thunder.webp',
  './assets/badge-volcano.webp',
  './assets/elite-lorelei.webp',
  './assets/elite-bruno.webp',
  './assets/elite-agatha.webp',
  './assets/elite-lance.webp',
  './assets/elite-blue.webp',
  './assets/trainer-ash.webp',
  './assets/training-ground.webp',
  './assets/training-dummy.webp',
  './assets/training-dummy-hit.webp',
  './assets/training-bg.webp',
];

// Install: precache app shell and assets, then sprites (individual failures won't block)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(PRECACHE_URLS).then(() =>
        Promise.all(SPRITE_URLS.map(url =>
          cache.add(url).catch(err => console.warn('Failed to cache sprite:', url, err))
        ))
      )
    ).then(() => self.skipWaiting())
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

// Fetch: cache-first for everything (we precache it all)
self.addEventListener('fetch', event => {
  event.respondWith(
    // ignoreSearch so style.css?v=3 matches cached style.css
    caches.match(event.request, { ignoreSearch: true }).then(cached => {
      if (cached) return cached;
      // Not in cache — fetch from network and cache for next time
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
