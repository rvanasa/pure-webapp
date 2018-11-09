module.exports = {
	template: require('./user-page.html'),
	controller: function($routeParams, $location, PageService, UserService, TopicService)
	{
		var $ctrl = this;
		
		PageService.info = () => $ctrl.user && ($ctrl.user.name || $ctrl.user.displayName);
		
		var id = $routeParams.id;
		if(id)
		{
			UserService.get(id)
				.then(user => $ctrl.user = user);
		}
		else
		{
			$ctrl.user = UserService.user;
		}
		
		TopicService.findByUser(id || $ctrl.user._id)
			.then(results =>
			{
				$ctrl.topics = results;
				if(!results.length)
				{
					$ctrl.startNewTopic();
				}
			});
		
		$ctrl.startNewTopic = function(fields)
		{
			$location.path('/edit');
		}
		
		$ctrl.viewTopic = function(topic)
		{
			$location.path('/topic/' + topic._id);
		}
	}
};