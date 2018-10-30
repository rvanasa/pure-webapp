module.exports = function(API, Endpoint, ModelEndpoint, Hooks, BadgeModel)
{
	return Endpoint('badges', ModelEndpoint(BadgeModel))
		.hooks(Hooks.owned('issuer', {public: true}))
		.build(API);
}