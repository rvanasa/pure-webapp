module.exports = {
	template: require('./customize-page.html'),
	controller: function()
	{
		var $ctrl = this;
		
		$ctrl.index = 0;
		$ctrl.history = [{
			prompt: 'What is the answer to this question?',
			options: ['Yes', 'No'],
		}];
		$ctrl.question = $ctrl.history[0];
		
		$ctrl.nextQuestion = function()
		{
			if(!$ctrl.index)
			{
				// load question
				$ctrl.question = {
					prompt: 'A?',
					options: ['B', 'C'],
				};
				$ctrl.history.unshift($ctrl.question);
			}
			else
			{
				$ctrl.question = $ctrl.history[--$ctrl.index];
			}
		}
		
		$ctrl.prevQuestion = function()
		{
			if($ctrl.hasPrev())
			{
				$ctrl.question = $ctrl.history[++$ctrl.index];
			}
		}
		
		$ctrl.answerQuestion = function()
		{
			// save answer
			$ctrl.nextQuestion();
		}
		
		$ctrl.hasPrev = function()
		{
			return $ctrl.index < $ctrl.history.length - 1;
		}
		
		$ctrl.hasAnswer = function()
		{
			return $ctrl.question && $ctrl.question.selected != null && $ctrl.question.importance;
		}
		
		$ctrl.interests = ['environment', 'community'];
		
		$ctrl.addInterest = function()
		{
			var interest = $ctrl.newInterest;
			if(interest)
			{
				$ctrl.newInterest = null;
				
				var index = $ctrl.interests.indexOf(interest);
				if(index != -1)
				{
					$ctrl.interests.splice(index, 1);
				}
				$ctrl.interests.push(interest);
			}
		}
	}
};