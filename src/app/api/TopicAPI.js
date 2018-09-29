module.exports = function(API, Service, ModelService, Hooks, TopicModel, TopicView)
{
	// TODO prevent users from being returned on each `find` result (without breaking SearchAPI)
	return Service('topics', ModelService(TopicModel))
		.hooks(Hooks.owned('user', {public: true}))
		.hooks(Hooks.view(TopicView))
		.build(API);
}