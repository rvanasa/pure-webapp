module.exports = {
	template: require('./fund-page.html'),
	controller: function($location, $routeParams, WalletService, ExchangeService, TopicService)
	{
		var $ctrl = this;
		
		WalletService.getWallet()
			.then(wallet => $ctrl.wallet = wallet);
		
		$ctrl.amounts = [10, 25, 100];
		
		$ctrl.amount = {
			total: $ctrl.amounts[0],
			currency: 'USD',
		};
		
		var id = $routeParams['topic'];
		if(id)
		{
			Promise.all([TopicService.get(id), ExchangeService.getBuyRate(), WalletService.getWallet()])
				.then(([topic, rate, wallet]) =>
				{
					$ctrl.topic = topic;
					$ctrl.amount.total = Math.max(10, (topic.rate - wallet.balance) / rate);
				});
		}
		
		$ctrl.complete = function()
		{
			if($ctrl.topic)
			{
				$location.path('/topic/' + $ctrl.topic._id);
			}
			else
			{
				$location.path('/customize');
			}
		}
	}
};