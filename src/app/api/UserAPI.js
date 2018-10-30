module.exports = function(API, Endpoint, ModelEndpoint, Hooks, UserModel, UserView)
{
	return Endpoint('users', ModelEndpoint(UserModel))
		.only('get')
		.hooks(Hooks.view(UserView))
		.build(API);
}