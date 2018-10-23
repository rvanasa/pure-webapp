var paypal = require('paypal-rest-sdk');

module.exports = function(Config)
{
	var config = Config.provider.paypal;
	paypal.configure({
		mode: config.env,
		client_id: config.key,
		client_secret: config.secret,
	});
	
	return {
		create(payment)
		{
			return new Promise((resolve, reject) =>
			{
				paypal.payment.create(payment, (err, payment) => err ? reject(err) : resolve(payment));
			});
		},
		execute(paymentId, payerId)
		{
			return new Promise((resolve, reject) =>
			{
				paypal.payment.execute(paymentId, {payer_id: payerId}, (err, payment) =>
				{
					return err ? reject(err) : (payment.state !== 'approved' ? err(`Payment ${payment.state}`) : resolve(payment));
				});
			});
		},
	};
}