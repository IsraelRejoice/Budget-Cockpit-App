// Budget Cockpit — service worker
// Caches the app shell so it opens instantly and works offline.
// Your actual budget data still needs a live connection to sync
// with your backend (or Claude's storage) — this only caches the
// app's own files, not your transactions.

const CACHE_NAME = 'budget-cockpit-v1';
const APP_SHELL = [
  './budget_app.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Network-first for everything so you always get live data when online;
// falls back to the cached app shell when offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return; // never cache POST (saves/AI calls)

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
