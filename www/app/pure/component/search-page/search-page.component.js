module.exports = {
	template: require('./search-page.html'),
	controller: function($location, $routeParams, Binder, PageService, CategoryService, TopicService, FavoriteService)
	{
		var $ctrl = this;
		
		// PageService.info = () => $ctrl.category && $ctrl.category.name;
		
		$ctrl.categories = CategoryService.categories;
		
		TopicService.search({f: 'a'})
			.then(results => $ctrl.availableTopics = results);
		
		FavoriteService.request()
			.then(results => $ctrl.favorites = results);
		
		$ctrl.results = null;
		
		$ctrl.updateResults = function(input)
		{
			if(arguments.length > 0)
			{
				$ctrl.query = input;
			}
			
			if(!$ctrl.query && !$ctrl.category)
			{
				$ctrl.results = null;
				return;
			}
			
			var params = {q: $ctrl.query};
			if($ctrl.category)
			{
				params['c'] = $ctrl.category.id;
			}
			return TopicService.search(params)
				.then(results =>
				{
					$ctrl.results = results;
					for(var topic of results)
					{
						if(topic._id)
						{
							TopicService.register(topic);
						}
					}
				});
		}
		
		$ctrl.setCategory = function(category)
		{
			$location.path(category ? '/search/' + encodeURIComponent(category.id) : '/search');
		}
		
		$ctrl.createTopic = function()
		{
			$location.path('/edit');
		}
		
		var id = $routeParams['category'];
		if(id)
		{
			$ctrl.category = $ctrl.categories.find(cat => cat.id === id);
		}
		
		var params = $location.search();
		$ctrl.query = params['q'];
		$ctrl.updateResults();
		
		$ctrl.onChangeQuery = function()
		{
			$location.search('q', $ctrl.query);
		}
		
		Binder($ctrl).onDestroy(() =>
		{
			$location.search('q', null);
		});
	}
};