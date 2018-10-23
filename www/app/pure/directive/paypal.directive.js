var paypal = require('paypal-checkout');

module.exports = function($timeout, $parse, API, Config)
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
			// var client = {};
			// client[env] = config.key;
			
			paypal.Button.render({
				env,
				// client,
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
					// return actions.payment.create({
					// 	payment: {
					// 		transactions: [{
					// 			amount,
					// 		}],
					// 	},
					// 	experience: {
					// 		input_fields: {
					// 			no_shipping: 1,
					// 		}
					// 	},
					// });
					
					console.log(amount)
					
					return CheckoutAPI.create(amount);
				},
				onAuthorize(data, actions)
				{
					return CheckoutAPI.update(data.paymentID, {payer: data.payerID})
						.then(() =>
						{
							$scope.$eval($attrs.callback);
						});
					
					// return actions.payment.execute()
					// 	.then(payment =>
					// 	{
					// 		console.log(payment)////
					// 	});
				}
			}, $elem[0]);
		},
	};
}