module.exports = {
	template: require('./topic-page.html'),
	controller: function($window, $location, $routeParams, PageService, TopicService, SessionService, StatusService)
	{
		var $ctrl = this;
		
		PageService.info = () => $ctrl.topic && $ctrl.topic.name;
		
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
				title: `Platform Pure`,
				message: `Check out my topic "${$ctrl.topic.name}" on Platform Pure:`,
				url: true,
			};
		}
		
		$ctrl.visitUser = function()
		{
			$location.path('/user/' + $ctrl.topic.user._id);
		}
	}
};