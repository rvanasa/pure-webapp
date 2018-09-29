module.exports = {
	template: require('./search-result.html'),
	bindings: {
		topic: '<',
		selected: '=',
	},
	controller: function($location, SessionService, StatusService)
	{
		var $ctrl = this;
		
		$ctrl.sessions = SessionService;
		
		$ctrl.status = StatusService.status;
		
		$ctrl.viewDetails = function(requestSession)
		{
			if(requestSession)
			{
				SessionService.request($ctrl.topic);
			}
			$location.path('/topic/' + $ctrl.topic._id);
		}
	}
};