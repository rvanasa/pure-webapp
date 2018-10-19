var paypal = require('paypal-checkout');

module.exports = function($timeout, $parse, Alert)
{
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
			
			paypal.Button.render({
				env: 'sandbox',
				client: {
					sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
					// production: '',
				},
				style: {
					layout: 'vertical',
					size:   'responsive',
					shape:  'pill',
					color:  'gold',
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