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
	};
}