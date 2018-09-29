module.exports = function(API, Service, ModelService, Hooks, UserModel, UserView)
{
	return Service('users', ModelService(UserModel))
		.only('get')
		.hooks(Hooks.view(UserView))
		.build(API);
}