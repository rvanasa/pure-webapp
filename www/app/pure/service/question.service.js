module.exports = function QuestionService(API)
{
	var QuestionAPI = API.service('questions');
	
	this.questions = [];
	
	var loadPromise = QuestionAPI.find({query: {history: true, next: 3}})
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
		return QuestionAPI.find({query: {next: 1}})
			.then(results => this.questions.unshift(...results));
	}
	
	this.setAnswer = function(question, answer)
	{
		return QuestionAPI.create(Object.assign({}, answer, {question: question._id}));
	}
}