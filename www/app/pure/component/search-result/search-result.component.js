module.exports = {
	template: require('./search-result.html'),
	bindings: {
		topic: '<',
		selected: '=',
	},
	controller: function($scope, $location, UserService, SessionService, StatusService)
	{
		var $ctrl = this;
		
		$ctrl.sessions = SessionService;
		
		$ctrl.status = StatusService.status;
		
		$scope.$watch('$ctrl.topic', topic =>
		{
			if(topic._id && topic.user._id !== UserService.user._id)
			{
				$ctrl.sharedInterests = topic.user.interests.filter(interest => UserService.user.interests.includes(interest));
			}
		});
		
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