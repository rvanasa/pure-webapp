module.exports = {
	template: require('./edit-page.html'),
	controller: function($routeParams, $location, API, TopicService, CategoryService)
	{
		var $ctrl = this;
		
		var TopicAPI = API.service('topics');
		
		$ctrl.categories = CategoryService.categories;
		
		var id = $routeParams.id;
		if(id)
		{
			TopicAPI.get(id)
				.then(topic => $ctrl.topic = topic)
				.then(topic => TopicService.register(topic));
		}
		else
		{
			$ctrl.topic = {
				category: CategoryService.categories[0].id,
				hourly: true,
				rate: 0,
				interval: 60,
			};
		}
		
		var savePromise;
		$ctrl.saveTopic = function()
		{
			if(savePromise)
			{
				return savePromise;
			}
			
			// Temp?
			$ctrl.topic.interval = $ctrl.topic.interval || 0;
			
			if(!id)
			{
				savePromise = TopicService.create($ctrl.topic);
			}
			else
			{
				savePromise = TopicService.update($ctrl.topic)
					.then(() => id = $ctrl.topic._id);
			}
			return savePromise = savePromise.then(() => $ctrl.closeTopic());
		}
		
		$ctrl.closeTopic = function()
		{
			$location.path(id ? '/topic/' + id : '/user');
		}
	}
};