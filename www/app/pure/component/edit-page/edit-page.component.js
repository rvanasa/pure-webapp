module.exports = {
	template: require('./edit-page.html'),
	controller: function($routeParams, $location, API, CategoryService)
	{
		var $ctrl = this;
		
		var TopicAPI = API.service('topics');
		
		$ctrl.categories = CategoryService.categories;
		
		var id = $routeParams.id;
		if(id)
		{
			TopicAPI.get(id)
				.then(topic => $ctrl.topic = topic);
		}
		else
		{
			$ctrl.topic = {
				hourly: true,
			};
		}
		
		$ctrl.saveTopic = function()
		{
			var promise;
			if(!id)
			{
				promise = TopicAPI.create($ctrl.topic)
					.then(_id => id = _id);
			}
			else
			{
				promise = TopicAPI.update($ctrl.topic._id, $ctrl.topic);
			}
			promise.then(() => $ctrl.closeTopic());
		}
		
		$ctrl.closeTopic = function()
		{
			$location.path(id ? '/topic/' + id : '/user');
		}
	}
};