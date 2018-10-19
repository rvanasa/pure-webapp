module.exports = function(Config)
{
	return {
		provider: {
			paypal: {
				env: Config.provider.paypal.env,
				key: Config.provider.paypal.key,
			},
		},
	};
}