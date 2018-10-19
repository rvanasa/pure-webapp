module.exports = {
	template: require('./customize-page.html'),
	controller: function($location, API, InterestService, UserService, WalletService)
	{
		var $ctrl = this;
		
		var AnswerAPI = API.service('answers');
		
		$ctrl.interests = InterestService;
		
		$ctrl.user = UserService.user;
		WalletService.getWallet()
			.then(wallet => $ctrl.wallet = wallet);
		
		$ctrl.index = 0;
		
		// TODO answer service
		AnswerAPI.find({query: {history: true, next: 3}})
			.then(results =>
			{
				$ctrl.history = results.reverse();
				$ctrl.index = 0;
				while($ctrl.index + 1 < $ctrl.history.length && !$ctrl.history[$ctrl.index + 1].answer)
				{
					$ctrl.index++;
				}
				if(!$ctrl.history[$ctrl.index].answer)
				{
					$ctrl.question = $ctrl.history[$ctrl.index];
				}
			});
		
		$ctrl.nextQuestion = function()
		{
			$ctrl.question = $ctrl.history[--$ctrl.index];
			
			if(!$ctrl.index)
			{
				AnswerAPI.find({query: {next: 1}})
					.then(results => $ctrl.history.unshift(...results));
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
			if($ctrl.question && $ctrl.question.answer)
			{
				AnswerAPI.create(Object.assign({}, $ctrl.question.answer, {question: $ctrl.question._id}))
					.catch(err =>
					{
						$ctrl.prevQuestion();
						throw err;
					});
				$ctrl.nextQuestion();
			}
		}
		
		$ctrl.hasPrev = function()
		{
			return $ctrl.index < $ctrl.history.length - 1;
		}
		
		$ctrl.hasAnswer = function()
		{
			return $ctrl.question && $ctrl.question.answer;
		}
		
		$ctrl.createQuestion = function()
		{
			return $location.path('/questions');
		}
		
		$ctrl.addFunds = function()
		{
			return $location.path('/fund');
		}
	}
};