module.exports = function(API, Endpoint, ModelEndpoint, Hooks, DomainModel)
{
	// TODO
	
	return Endpoint('domains', ModelEndpoint(DomainModel))
		.hooks(Hooks.owned('admins', {public: true}))
		.build(API);
}