const CACHE_NAME = 'travel-expense-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Sirf GET requests handle karo
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Agar cache mein hai toh woh do, warna network se fetch karo
      return cached || fetch(event.request).then((response) => {
        // Sirf successful responses cache karo
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(() => {
        // Offline hone par fallback
        return caches.match('/');
      });
    })
  );
});