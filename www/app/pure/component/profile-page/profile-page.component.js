module.exports = {
	template: require('./profile-page.html'),
	controller: function($location, API, PageService, QuestionService, InterestService, UserService, WalletService)
	{
		var $ctrl = this;
		
		PageService.info = () => $ctrl.user.displayName;
		
		$ctrl.interests = InterestService;
		
		$ctrl.user = UserService.user;
		$ctrl.wallet = WalletService.wallet;
		WalletService.fetchWallet();
		
		$ctrl.index = 0;
		
		QuestionService.find()
			.then(questions =>
			{
				$ctrl.history = questions;
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
				QuestionService.addNext();
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
				QuestionService.setAnswer($ctrl.question, $ctrl.question.answer)
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
		
		$ctrl.selectLearn = function()
		{
			return $location.path('/search');
		}
		
		$ctrl.selectTeach = function()
		{
			return $location.path('/edit');
		}
	}
};