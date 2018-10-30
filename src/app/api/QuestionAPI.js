module.exports = function(API, Endpoint, ModelEndpoint, Hooks, QuestionModel)
{
	return Endpoint('questions', ModelEndpoint(QuestionModel))
		.hooks(Hooks.owned('user', {public: true}))
		.build(API);
}