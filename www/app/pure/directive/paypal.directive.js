var paypal = require('paypal-checkout');

module.exports = function($timeout, $parse, API, Config, Alert)
{
	var config = Config.provider.paypal;
	
	var CheckoutAPI = API.service('/checkout');
	
	return {
		restrict: 'A',
		link($scope, $elem, $attrs)
		{
			var amount;
			$attrs.$observe('amount', attr => amount = $scope.$eval(attr));
			
			var env = config.env;
			
			paypal.Button.render({
				env,
				style: {
					layout: 'vertical',
					size:   'responsive',
					shape:  'pill',
					color:  'gold',
				},
				funding: {
					allowed: [paypal.FUNDING.VENMO],
					disallowed: [paypal.FUNDING.CREDIT],
				},
				commit: true,
				payment(data, actions)
				{
					if(config.env === 'sandbox')
					{
						Alert(`Heads up!`, `Because this is a sandbox environment, we will not actually charge your credit card. Please contact the Platform Pure team directly if you would like to buy XP tokens at a discounted price.`);
					}
					
					return CheckoutAPI.create(amount);
				},
				onAuthorize(data, actions)
				{
					return CheckoutAPI.update(data.paymentID, {payer: data.payerID})
						.then(() =>
						{
							$scope.$eval($attrs.callback);
						});
				}
			}, $elem[0]);
		},
	};
}