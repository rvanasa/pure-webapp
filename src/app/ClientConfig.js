module.exports = function(Config)
{
	return {
		env: this.env,
		domain: Config.server.domain,
		provider: {
			paypal: {
				env: Config.provider.paypal.env,
			},
		},
		social: {
			links: [{
				icon: 'facebook',
				url: 'https://www.facebook.com/PlatformPure',
			}, {
				icon: 'instagram',
				url: 'https://www.instagram.com/PlatformPure',
			}, {
				icon: 'twitter',
				url: 'https://www.twitter.com/@PlatformPure',
			}, {
				icon: 'telegram',
				url: 'https://t.me/PlatformPure',
			}, {
				icon: 'medium',
				url: 'https://medium.com/platform-pure',
			}, {
				icon: 'github',
				url: 'https://github.com/PlatformPure',
			}, {
				icon: 'reddit',
				url: 'https://www.reddit.com/r/PlatformPure',
			}, {
				icon: 'youtube',
				url: 'https://www.youtube.com/channel/UC2JRzURTKb0a3A1dkmHFBAw',
			// }, {
			// 	icon: 'twitch',
			// 	url: 'https://www.twitch.tv/PlatformPure',
			}],
		},
	};
}