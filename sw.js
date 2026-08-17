/**
 * AR MULTIPLEX ENTERPRISES - SERVICE WORKER (PWA)
 * Offline First & Cache Management
 */

const CACHE_NAME = 'ar-multiplex-v1.1.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './services.html',
  './gallery.html',
  './manifest.json',
  './assets/css/style.css',
  './assets/js/main.js',
  './assets/images/logo.svg',
  './assets/images/contractor.jpg',
  './assets/images/id-card-portrait.jpg',
  './assets/images/id-card-formal.jpg',
  './assets/images/hero-poster.jpg',
  './assets/images/profile-round.jpg',
  './assets/images/icons/icon-192.png',
  './assets/images/icons/icon-512.png',
  './assets/images/icons/apple-touch-icon.png',
  './assets/images/icons/favicon-96.png',
  './assets/images/gallery/ss-worktable-3tier-front.jpg',
  './assets/images/gallery/ss-worktable-3tier-side.jpg',
  './assets/images/gallery/ss-worktable-workers.jpg',
  './assets/images/gallery/ss-narrow-rack.jpg',
  './assets/images/gallery/ss-workstation-polished.jpg',
  './assets/images/gallery/ss-commercial-sink.jpg',
  './assets/images/gallery/ss-table-workshop.jpg',
  './assets/images/gallery/ss-single-stand.jpg',
  './assets/images/gallery/tig-welding-machine.jpg',
  './assets/images/gallery/sheet-metal-panel-1.jpg',
  './assets/images/gallery/sheet-metal-panel-2.jpg',
  './assets/images/gallery/sheet-metal-panel-3.jpg'
];

// Install Event - Precache Core Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline app shell');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clear Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache version:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate with Offline Fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // For HTML navigation requests: Network First with Cache Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return caches.match('./index.html');
          });
        })
    );
    return;
  }

  // For static assets (CSS, JS, Images, Fonts): Cache First with Background Revalidation
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
