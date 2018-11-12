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
			if(!$ctrl.topic._id)
			{
				window.open($ctrl.topic.url, '_blank');
			}
			else
			{
				if(requestSession)
				{
					SessionService.request($ctrl.topic);
				}
				$location.path('/topic/' + $ctrl.topic._id);
			}
		}
	}
};