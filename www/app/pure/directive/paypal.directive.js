var paypal = require('paypal-checkout');

module.exports = function($timeout, $parse, Alert, Config)
{
	var config = Config.provider.paypal;
	
	return {
		restrict: 'A',
		link($scope, $elem, $attrs)
		{
			var amount;
			$attrs.$observe('amount', attr => amount = $scope.$eval(attr));
			
			$timeout(() =>
			{
				if(!amount || !amount.total)
				{
					Alert('Heads up:', 'Total must be immediately available!');
				}
			});
			
			var env = config.env;
			var client = {};
			client[env] = config.key;
			
			paypal.Button.render({
				env,
				client,
				style: {
					layout: 'vertical',
					size:   'responsive',
					shape:  'pill',
					color:  'gold',
				},
				funding: {
					// allowed: [paypal.FUNDING.CARD],
					disallowed: [paypal.FUNDING.CREDIT],
				},
				commit: true,
				payment(data, actions)
				{
					return actions.payment.create({
						payment: {
							transactions: [{
								amount,
							}],
						},
						experience: {
							input_fields: {
								no_shipping: 1,
							}
						},
					});
				},
				onAuthorize(data, actions)
				{
					return actions.payment.execute()
						.then(() =>
						{
							console.log('success!')
						});
				}
			}, $elem[0]);
		},
	};
}