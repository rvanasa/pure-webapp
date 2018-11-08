module.exports = function QuestionService(API)
{
	var AnswerAPI = API.service('answers');
	
	this.questions = [];
	
	var loadPromise = AnswerAPI.find({query: {history: true, next: 2}})
		.then(results =>
		{
			this.questions.length = 0;
			this.questions.push(...results.reverse());
			return this.questions;
		});
	
	this.find = function()
	{
		return loadPromise;
	}
	
	this.addNext = function()
	{
		return AnswerAPI.find({query: {next: 1}})
			.then(results => this.questions.unshift(...results));
	}
	
	this.setAnswer = function(question, answer)
	{
		return AnswerAPI.create(Object.assign({}, answer, {question: question._id}));
	}
}