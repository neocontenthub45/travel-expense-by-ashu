const CACHE_NAME = 'travel-expense-v1';
const ASSETS = ['/', '/manifest.json', '/icon-192x192.png', '/icon-512x512.png'];

// Install — files cache karo
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

// Activate — purana cache delete
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Fetch — cache se serve karo, Supabase API ko skip karo
self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase.co')) return; // API cache nahi
  e.respondWith(caches.match(e.request).then(cached =>
    cached || fetch(e.request)
  ));
});