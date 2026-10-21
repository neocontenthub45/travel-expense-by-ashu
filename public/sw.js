const CACHE_NAME = 'travel-expense-v2';
const PRECACHE = ['/icon-192x192.png', '/icon-512x512.png'];

self.addEventListener('install', (e) => {
  // ek file fail ho to bhi install fail na ho
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) =>
      Promise.allSettled(PRECACHE.map((u) => c.add(u)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // network-first, offline par cache se
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || Response.error()))
  );
});
