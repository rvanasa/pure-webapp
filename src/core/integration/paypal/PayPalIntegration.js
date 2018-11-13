var bs58 = require('bs58');
var crypto = require('crypto');

var paypal = require('paypal-rest-sdk');

module.exports = function(Logger, Config)
{
	var config = Config.provider.paypal;
	paypal.configure({
		mode: config.env,
		client_id: config.key,
		client_secret: config.secret,
	});
	
	var profilePromise;
	function loadProfile()
	{
		if(!profilePromise)
		{
			profilePromise = new Promise((resolve, reject) =>
			{
				paypal.webProfile.create({
					name: bs58.encode(crypto.randomBytes(16)),
					presentation: {
						brand_name: 'Platform Pure',
						logo_image: 'https://www.platformpure.com/assets/img/share.png',
						locale_code: 'US',
					},
					input_fields: {
						no_shipping: 1,
						address_override: 0,
					},
				}, (err, profile) => err ? reject(err) : resolve(profile));
			})
			.catch(err => (Logger.error(err), profilePromise = null, loadProfile()));
		}
		return profilePromise;
	}
	
	if(config.env !== 'sandbox')
	{
		loadProfile();
	}
	
	return {
		create(payment)
		{
			return loadProfile().then(profile => new Promise((resolve, reject) =>
			{
				console.log(profile)
				payment.experience_profile_id = profile.id;
				paypal.payment.create(payment, (err, payment) => err ? reject(err) : resolve(payment));
			}));
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