self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('smu-restaurant-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/css/styles.css',
          '/js/app.js',
          '/images/icons/icon-192x192.png',
          '/images/icons/icon-512x512.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });