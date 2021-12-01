/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-dadae22';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./dcerka_001.html","./dcerka_002.html","./dcerka_005.html","./dcerka_006.html","./dcerka_007.html","./dcerka_008.html","./dcerka_009.html","./dcerka_010.html","./dcerka_011.html","./dcerka_012.html","./dcerka_013.html","./dcerka_014.html","./dcerka_015.html","./favicon.png","./index.html","./manifest.json","./resources.html","./resources/image001.jpg","./resources/image003.jpg","./resources/image004.jpg","./resources/index.xml","./resources/obalka_dcerka2.jpg","./resources/upoutavka_eknihy.jpg","./scripts/bundle.js","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
