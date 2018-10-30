module.exports = function ShareService($window)
{
	function open(url, query)
	{
		if(query)
		{
			url += '?' + Object.keys(query).map(k =>
			{
				var value = query[k];
				return encodeURIComponent(k) + '=' + encodeURIComponent(value != null ? value : '');
			}).join('&');
		}
		return $window.open(url);
	}
	
	this.sites = [{
		id: 'twitter',
		color: 'primary',
		icon: 'fab fa-twitter',
		handle({message, url})
		{
			open('https://twitter.com/intent/tweet', {
				text: message,
				url,
			});
		},
	}, {
		id: 'facebook',
		color: 'primary',
		icon: 'fab fa-facebook',
		handle({title, message, url})
		{
			open('https://www.facebook.com/sharer/sharer.php', {
				caption: title,
				quote: message,
				u: url,
			});
		}
	}, {
		id: 'email',
		color: 'secondary',
		icon: 'fa fa-envelope',
		handle({title, message, url})
		{
			open('mailto:', {
				subject: title,
				body: (message || '') + '\n' + (url || ''),
			});
		},
	}];
	
	this.startIntent = function(id, intent)
	{
		if(!intent)
		{
			throw new Error('No intent was provided');
		}
		
		var site = this.sites.find(site => site.id === id);
		if(!site)
		{
			throw new Error(`Unknown site: ${id}`);
		}
		
		if(intent.url === true)
		{
			intent.url = $window.location.href;
		}
		site.handle(intent);
	}
}