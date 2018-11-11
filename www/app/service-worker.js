/* global workbox, __precacheManifest, Request, fetch, caches */

// Offline
workbox.googleAnalytics.initialize();
workbox.precaching.precacheAndRoute(__precacheManifest || []);

addEventListener('install', event =>
{
	var request = new Request('/offline');
	event.waitUntil(fetch(request)
		.then(response =>
		{
			if(!response.status || response.status === 200)
			{
				return caches.open('offline')
					.then(cache => cache.put(request, response));
			}
		}));
});
	
addEventListener('fetch', event =>
{
	var request = event.request;
	if (request.method === 'GET' && request.headers.get('accept').includes('text/html'))
	{
		event.respondWith(fetch(request)
			.catch(error =>
			{
				return caches.open('offline')
					.then(cache => cache.match('/offline'));
			}));
	}
});

// Google
workbox.routing.registerRoute(/^https:\/\/fonts\.googleapis\.com/, workbox.strategies.staleWhileRevalidate({
	cacheName: 'google-fonts-stylesheets',
}));
workbox.routing.registerRoute(/^https:\/\/fonts\.gstatic\.com/, workbox.strategies.cacheFirst({
	cacheName: 'google-fonts-webfonts',
	plugins: [
		new workbox.cacheableResponse.Plugin({
			statuses: [0, 200],
		}),
		new workbox.expiration.Plugin({
			maxAgeSeconds: 60 * 60 * 24 * 365,
			maxEntries: 30,
		}),
	],
}));
workbox.routing.registerRoute(/.*(?:googleapis|gstatic)\.com/, workbox.strategies.staleWhileRevalidate({
	cacheName: 'google-static',
}));

// Images
workbox.routing.registerRoute(/\.(?:png|jpg|jpeg|svg|gif)$/, workbox.strategies.cacheFirst({
	cacheName: 'images',
	plugins: [
		new workbox.expiration.Plugin({
			maxEntries: 20,
			maxAgeSeconds: 60 * 60 * 24 * 7,
		}),
	],
}));

// Webapp
workbox.routing.registerRoute(/\.(?:js|css)$/, workbox.strategies.staleWhileRevalidate({
	cacheName: 'static',
}));