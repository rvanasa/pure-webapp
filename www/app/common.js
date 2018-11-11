window.jQuery = window.$ = require('jquery');

require('bootstrap');

window.$(() => require('aos').init({
	offset: 60,
}));

if('serviceWorker' in window.navigator)
{
	window.addEventListener('load', () => window.navigator.serviceWorker.register('/sw.js'));
}