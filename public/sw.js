const CACHE_NAME = 'travel-expense-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch handler - Chrome iske bina PWA install nahi hone deta
self.addEventListener('fetch', (event) => {
  // Abhi ke liye kuch cache nahi kar rahe, bas handler hona zaroori hai
  return;
});