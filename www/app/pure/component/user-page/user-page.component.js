module.exports = {
	template: require('./user-page.html'),
	controller: function($routeParams, $location, API, PageService, UserService, TopicService, WalletService)
	{
		var $ctrl = this;
		
		var StatsAPI = API.service('stats');//TODO combine with topic list API call
		
		PageService.info = () => $ctrl.user && ($ctrl.user.name || $ctrl.user.displayName);
		
		$ctrl.wallet = WalletService.wallet;
		WalletService.fetchWallet();
		
		StatsAPI.get('teacher')
			.then(result => $ctrl.stats = result);
		
		var id = $routeParams.id;
		if(id)
		{
			UserService.get(id)
				.then(user => $ctrl.user = user);
		}
		else
		{
			$ctrl.user = UserService.user;
		}
		
		TopicService.findByUser(id || $ctrl.user._id)
			.then(results => $ctrl.topics = results);
		
		$ctrl.startNewTopic = function(fields)
		{
			$location.path('/edit');
		}
		
		$ctrl.viewTopic = function(topic)
		{
			$location.path('/topic/' + topic._id);
		}
	}
};