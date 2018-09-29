module.exports = {
	template: require('./search-page.html'),
	controller: function($location, Binder, API, CategoryService, FavoriteService)
	{
		var $ctrl = this;
		
		var SearchAPI = API.service('search');
		
		$ctrl.categories = CategoryService.categories;
		
		FavoriteService.request()
			.then(results => $ctrl.favorites = results);
		
		$ctrl.results = [];
		
		$ctrl.updateResults = function(query)
		{
			if(arguments.length > 0)
			{
				$ctrl.query = query;
			}
			
			if(!$ctrl.query && !$ctrl.category)
			{
				$ctrl.results.length = 0;
				return;
			}
			
			var query = {q: $ctrl.query};
			if($ctrl.category)
			{
				query['c'] = $ctrl.category.id;
			}
			return SearchAPI.find({query})
				.then(results =>
				{
					$ctrl.results.length = 0;
					$ctrl.results.push(...results);
				});
		}
		
		$ctrl.setCategory = function(category)
		{
			$ctrl.category = category;
			$ctrl.updateResults();
		}
		
		var params = $location.search();
		$ctrl.query = params['q'];
		$ctrl.category = params['c'];
		$ctrl.updateResults();
		
		Binder($ctrl).onDestroy(() =>
		{
			$location.search('q', null);
			$location.search('c', null);
		});
	}
};