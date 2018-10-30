module.exports = function(API, Endpoint, ModelEndpoint, Hooks, PayPalIntegration, TransactionModel, Config)
{
	// Rate must be an integer
	var rate = 90;
	var minFiat = 10;
	
	return Endpoint('checkout')
		.add('create', async ({fiat, token, currency}, {user}) =>
		{
			if(!currency)
			{
				throw `Must specify 'currency'`;
			}
			else if(fiat)
			{
				if(fiat < minFiat)
				{
					throw 'Purchase value is too small';
				}
				
				var prevToken = token;
				token = Math.ceil(fiat * rate);
				if(prevToken && token !== prevToken)
				{
					throw `Unexpected token/fiat ratio`;
				}
			}
			else if(token)
			{
				fiat = Math.ceil(token / rate * 100) / 100;
			}
			
			var payment = await PayPalIntegration.create({
				intent: 'sale',
				payer: {
					payment_method: 'paypal',
				},
				redirect_urls: {
					return_url: `https://${Config.server.domain}`,
					cancel_url: `https://${Config.server.domain}`,
				},
				transactions: [{
					amount: {
						total: fiat,
						currency,
					},
				}],
				// experience: {
				// 	input_fields: {
				// 		no_shipping: true,
				// 	},
				// },
			});
			return payment.id;
		})
		.add('update', async (id, {payer}, {user}) =>
		{
			var payment = await PayPalIntegration.execute(id, payer);
			try
			{
				var amount = payment.transactions.reduce((n, tx) => n + tx.amount.total, 0) * rate;
				await TransactionModel.create({
					// from: Config.platform.issuer,
					to: user,
					amount,
					reason: 'paypal',
					data: payment.id,
				});
			}
			catch(e)
			{
				// TODO critical error
				throw e;
			}
			return 'Completed';
		})
		.build(API);
}