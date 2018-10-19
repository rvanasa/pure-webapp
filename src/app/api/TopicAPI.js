module.exports = function(API, Service, ModelService, Hooks, TopicModel, TopicView)
{
	// TODO prevent price change during session
	
	// TODO prevent users from being returned on each `find` result (without breaking SearchAPI)
	return Service('topics', ModelService(TopicModel))
		// .add('remove', (id, {filter}) =>
		// {
		// 	TopicModel.
		// })
		// TODO flag instead of deleting topic document
		.hooks(Hooks.owned('user', {public: true}))
		.hooks(Hooks.view(TopicView))
		.build(API);
}