module.exports = {
	template: require('./topic-page.html'),
	controller: function($routeParams, SessionService)
	{
		var $ctrl = this;
		
		$ctrl.sessions = SessionService;
		
		$ctrl.topic = null;
		
		$ctrl.isShared = function(interest)
		{
			return interest == 'environment'/////
		}
		
		var id = $routeParams.id;
		if(id)
		{
			$ctrl.topic = {
				type: 'tutor',
				user: {
					name: 'Ahmed K.',
					status: 'available',
					interests: ['environment', 'sustainability', 'ecology'],
				},
				name: 'Arabic lessons',
				blurb: 'I\'m a native speaker.',
				lessons: 9,
				reputation: 4.5,
				match: .95,
				rate: 10,
				hourly: true,
				duration: 47,
			};
		}
		else if(SessionService.current)
		{
			$ctrl.topic = SessionService.current.topic;
		}
	}
};