// Budget Cockpit — service worker
// Caches the app shell so it opens instantly and works offline.
// Your actual budget data still needs a live connection to sync
// with your backend — this only caches the app's own files, not
// your transactions.

const CACHE_NAME = 'budget-cockpit-v5';
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
    caches.open(CACHE_NAME).then((cache) => {
      // Previously used cache.addAll(), which is all-or-nothing: if a single
      // file in APP_SHELL 404s (e.g. an icon that was never uploaded), the
      // whole install silently fails and the service worker never activates
      // — with no visible error, since register().catch() only catches
      // failures in the registration call itself, not inside this promise.
      // Caching each file independently means one missing icon can't take
      // down offline support for the rest of the app.
      return Promise.all(
        APP_SHELL.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[sw] could not cache', url, err);
          })
        )
      );
    })
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
// AI assistant, quote/FX APIs) are deliberately left alone — intercepting
// those caused save/load failures, since opaque cross-origin responses
// don't cache reliably and were breaking the fetch chain.
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
