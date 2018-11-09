module.exports = {
	template: require('./edit-page.html'),
	controller: function($routeParams, $location, API, Alert, PageService, TopicService, CategoryService)
	{
		var $ctrl = this;
		
		PageService.info = () => $ctrl.topic && $ctrl.topic.name;
		
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
			
			if(!$ctrl.topic.name || !$ctrl.topic.blurb)
			{
				return Alert.toast(`Please fill out all fields before submitting.`, null, 'info');
			}
			
			if(!id)
			{
				savePromise = TopicService.create($ctrl.topic);
			}
			else
			{
				savePromise = TopicService.update($ctrl.topic)
					.then(() => id = $ctrl.topic._id);
			}
			return savePromise = savePromise
				.then(() => $ctrl.closeTopic())
				.catch(err =>
				{
					savePromise = null;
					throw err;
				});
		}
		
		$ctrl.closeTopic = function()
		{
			$location.path(id ? '/topic/' + id : '/user');
		}
	}
};