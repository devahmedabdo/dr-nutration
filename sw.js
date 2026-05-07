const CACHE = 'drnutrition-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/launchericon-48x48.png',
  '/launchericon-72x72.png',
  '/launchericon-96x96.png',
  '/launchericon-144x144.png',
  '/launchericon-192x192.png',
  '/launchericon-512x512.png',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // For API calls — always go network first
  if(e.request.url.includes('drnutrition.com/api') || e.request.url.includes('data.drnutrition')){
    e.respondWith(fetch(e.request).catch(() => new Response('{"error":"offline"}', {headers:{'Content-Type':'application/json'}})));
    return;
  }
  // For app shell — cache first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
