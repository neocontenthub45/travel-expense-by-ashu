const CACHE_NAME = 'travel-expense-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Chrome Android ko install prompt ke liye ek valid fetch handler chahiye
self.addEventListener('fetch', (event) => {
  // Sirf GET requests handle karo
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      // Offline hone par cache se serve karo
      return caches.match(event.request);
    })
  );
});