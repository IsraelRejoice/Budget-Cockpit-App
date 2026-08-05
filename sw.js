// Budget Cockpit — service worker
// Caches the app shell so it opens instantly and works offline.
// Your actual budget data still needs a live connection to sync
// with your backend (or Claude's storage) — this only caches the
// app's own files, not your transactions.

const CACHE_NAME = 'budget-cockpit-v4';
const APP_SHELL = [
  './',
  './index.html',
  './app.js',
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

// Network-first for the app's OWN files only, so the app shell loads fast
// and works offline. Cross-origin requests (your Apps Script backend, the
// AI assistant, quote API) are deliberately left alone — intercepting those
// caused save/load failures, since opaque cross-origin responses don't
// cache reliably and were breaking the fetch chain.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return; // never cache POST (saves/AI calls)

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // let the browser handle this natively

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
