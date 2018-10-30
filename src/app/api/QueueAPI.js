module.exports = function(API, Endpoint, ModelEndpoint, Hooks, QueueService)
{
	return Endpoint('queue')
		.add('find', async (params) =>
		{
			return QueueService.findAll(params);
		})
		.hooks(Hooks.owned('user', {public: true}))
		.hooks(Hooks.output(q => delete q.user))
		.build(API);
}