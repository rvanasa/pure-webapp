var Push = require('push.js');

module.exports = function PushService($window)
{
	// Push.config({
	// 	serviceWorker: 'https://cdnjs.cloudflare.com/ajax/libs/push.js/1.0.7/serviceWorker.min.js',
	// });
	
	this.create = function(title, options)
	{
		// return Push.create(title, Object.assign({
		// 	icon: '/assets/img/favicon.png',
		// 	// badge: '/assets/img/favicon.png',
		// }, options)).then(notification =>
		// {
		// 	$window.focus();
		// 	notification.close();
		// });
	}
	
	this.createIfAway = function(title, options)
	{
		if($window.document.hasFocus())
		{
			return Promise.resolve();
		}
		
		options = Object.assign({}, options);
		var tag = options.tag || (options.tag = 'away');
		$window.addEventListener('focus', () => Push.close(tag), {once: true});
		return this.create(title, options);
	}
}