module.exports = {
	template: require('./resource-page.html'),
	controller: function($location, $routeParams)
	{
		var $ctrl = this;
		
		// PageService.info = () => $ctrl.;
		
		var id = $routeParams.id;
		if(id)
		{
			
		}
		else
		{
			$location.path('/user');
		}
		
		// $ctrl.resource = ResourceService.get(id);
	}
};