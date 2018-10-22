module.exports = {
	template: require('./topic-page.html'),
	controller: function($window, $location, $routeParams, TopicService, SessionService, StatusService)
	{
		var $ctrl = this;
		
		$ctrl.sessions = SessionService;
		
		$ctrl.status = function()
		{
			return $ctrl.topic && StatusService.status($ctrl.topic.user);
		}
		
		$ctrl.topic = null;
		
		var id = $routeParams.id;
		if(id)
		{
			TopicService.get(id)
				.then(topic => $ctrl.topic = topic);
		}
		else if(SessionService.current)
		{
			$ctrl.topic = SessionService.current.topic;
		}
		else
		{
			$location.path('/user');
		}
		
		$ctrl.editTopic = function(topic)
		{
			$location.path('/edit/' + $ctrl.topic._id);
		}
		
		$ctrl.deleteTopic = function()
		{
			TopicService.delete($ctrl.topic)
				.then(() => $location.path('/user'));
		}
		
		$ctrl.getShareIntent = function()
		{
			return {
				title: `Pure Learning Platform`,
				message: `Check out my topic "${$ctrl.topic.name}" on Pure Learning Platform:`,
				url: true,
			};
		}
	}
};