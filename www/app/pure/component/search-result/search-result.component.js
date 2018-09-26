module.exports = {
	template: require('./search-result.html'),
	bindings: {
		topic: '<',
		selected: '=',
	},
	controller: function($location, SessionService)
	{
		var $ctrl = this;
		
		$ctrl.sessions = SessionService;
		
		$ctrl.viewDetails = function(requestSession)
		{
			if(requestSession)
			{
				SessionService.request($ctrl.topic);
			}
			$location.path('/topic/' + encodeURIComponent(123));
		}
	}
};