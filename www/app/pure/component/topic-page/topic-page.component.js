module.exports = {
	template: require('./topic-page.html'),
	controller: function($location, $routeParams, API, SessionService, StatusService)
	{
		var $ctrl = this;
		
		var TopicAPI = API.service('topics');
		
		$ctrl.sessions = SessionService;
		
		$ctrl.status = function()
		{
			return $ctrl.topic && StatusService.status($ctrl.topic.user);
		}
		
		$ctrl.topic = null;
		
		var id = $routeParams.id;
		if(id)
		{
			TopicAPI.get(id)
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
			$location.path('/edit/' + id);
		}
		
		$ctrl.deleteTopic = function()
		{
			TopicAPI.remove(id)
				.then(() => $location.path('/user'));
		}
	}
};