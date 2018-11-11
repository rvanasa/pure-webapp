/* global workbox, __precacheManifest */

// Offline
workbox.googleAnalytics.initialize();
workbox.precaching.precacheAndRoute(__precacheManifest || []);

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