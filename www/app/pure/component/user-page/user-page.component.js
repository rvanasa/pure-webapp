module.exports = {
	template: require('./user-page.html'),
	controller: function($routeParams, $location, API, UserService)
	{
		var $ctrl = this;
		
		var TopicAPI = API.service('topics');
		
		var id = $routeParams.id;
		if(id)
		{
			//TODO
		}
		else
		{
			$ctrl.user = UserService.user;
		}
		
		TopicAPI.find(id ? {query: {user: id}} : null)
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