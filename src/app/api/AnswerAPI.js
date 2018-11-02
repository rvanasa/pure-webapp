module.exports = function(API, Endpoint, ModelEndpoint, Hooks, QuestionModel, AnswerModel)
{
	async function nextQuestions(user, query, limit)
	{
		var filter = {};
		// var select = {prompt: 1, options: 1};
		var promises = [];
		var count = await QuestionModel.estimatedDocumentCount(filter);
		for(var i = 0; i < limit; i++)
		{
			promises.push(QuestionModel.findOne(filter/*, select*/).lean().skip(Math.floor(Math.random() * count)));
		}
		var [questions, answers] = [await Promise.all(promises), await AnswerModel.find({user: user._id}).lean()];
		var ids = answers.map(a => a.question);
		var results = [];
		for(i = questions.length - 1; i >= 0; i--)
		{
			var question = questions[i];
			if(ids.every(id => !question._id.equals(id)))
			{
				results.push(question);
				ids.push(question._id);
			}
		}
		return results;
	}
	
	return Endpoint('answers', ModelEndpoint(AnswerModel))
		.only('create')
		.add('find', async ({user, query}) =>
		{
			var {history, next} = query;
			var answers = await AnswerModel.find({user: user._id}, {user: 0}, history && {populate: 'question'}).lean();
			var results = [];
			if(history)
			{
				for(var answer of answers)
				{
					var {question} = answer;
					if(question)
					{
						question.answer = answer;
						delete answer.question;
						results.push(question);
					}
				}
			}
			results.push(...await nextQuestions(user, query, Math.min(next, 10)));
			return results;
		})
		.hooks(Hooks.owned('user', {public: true}))
		.hooks(Hooks.output(q => delete q.user))
		.build(API);
}