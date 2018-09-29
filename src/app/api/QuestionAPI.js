module.exports = function(API, Service, ModelService, Hooks, QuestionModel)
{
	return Service('questions', ModelService(QuestionModel))
		.hooks(Hooks.owned('user', {public: true}))
		.build(API);
}