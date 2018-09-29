module.exports = function(API, Service, ModelService, Hooks, SessionModel)
{
	return Service('sessions')
		.add('create', async ({}, {user}) =>
		{
			
		})
		.build(API);
}