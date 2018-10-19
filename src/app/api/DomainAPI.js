module.exports = function(API, Service, ModelService, Hooks, DomainModel)
{
	// TODO
	
	return Service('domains', ModelService(DomainModel))
		.hooks(Hooks.owned('admins', {public: true}))
		.build(API);
}