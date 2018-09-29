module.exports = {
	template: require('./questions-page.html'),
	controller: function($scope, API)
	{
		var $ctrl = this;
		
		var QuestionAPI = API.service('questions');
		
		QuestionAPI.find()
			.then(results =>
			{
				$ctrl.questions = results;
				if(!$ctrl.questions.length)
				{
					$ctrl.startQuestion();
				}
			});
		
		$ctrl.startQuestion = function()
		{
			var question = {selected: true};
			$ctrl.selected = question;
			$ctrl.questions.push(question);
		}
		
		$ctrl.updateQuestion = function(question)
		{
			delete question.selected;
			var promise;
			if(!question._id)
			{
				promise = QuestionAPI.create(question)
					.then(_id => question._id = _id);
			}
			else
			{
				promise = QuestionAPI.update(question._id, question);
			}
			promise.catch(err =>
			{
				question.selected = true;
				throw err;
			});
		}
		
		$ctrl.closeQuestion = function(question)
		{
			if(!question._id)
			{
				$ctrl.deleteQuestion(question);
			}
			else
			{
				delete question.selected;
			}
		}
		
		$ctrl.deleteQuestion = function(question)
		{
			var index = $ctrl.questions.indexOf(question);
			if(index > -1)
			{
				$ctrl.questions.splice(index, 1);
			}
			if(question._id)
			{
				QuestionAPI.remove(question._id);
			}
		}
	}
};