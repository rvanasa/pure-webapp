module.exports = {
	template: require('./fund-page.html'),
	controller: function($location, $routeParams, Alert, WalletService, ExchangeService, TopicService)
	{
		var $ctrl = this;
		
		var loadPromise = ExchangeService.getBuyRate()
			.then(([rate]) => $ctrl.rate = rate);
		
		$ctrl.amounts = [10, 25, 150];
		
		$ctrl.amount = {
			currency: 'USD',
		};
		
		var minFiat = 10;
		
		var id = $routeParams['topic'];
		if(id)
		{
			TopicService.get(id)
				.then(topic => Promise.all([WalletService.update(), loadPromise]).then(([wallet]) =>
				{
					$ctrl.topic = topic;
					$ctrl.amount.fiat = Math.round(Math.max(minFiat, (topic.rate - wallet.balance) / $ctrl.rate) * 100) / 100;
					$ctrl.amount.token = Math.round($ctrl.amount.fiat * $ctrl.rate);
				}));
		}
		else
		{
			$ctrl.amount.fiat = $ctrl.amounts[0];
			// loadPromise.then(() => $ctrl.amount.token = $ctrl.amount.fiat * $ctrl.rate);
		}
		
		$ctrl.complete = function()
		{
			Alert.toast('Payment processed successfully!', null, 'success');
			
			if($ctrl.topic)
			{
				$location.path('/topic/' + $ctrl.topic._id);
			}
			else
			{
				$location.path('/profile');
			}
		}
	}
};