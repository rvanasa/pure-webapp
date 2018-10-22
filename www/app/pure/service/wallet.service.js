module.exports = function WalletService(API)
{
	var WalletAPI = API.service('wallets');
	
	this.wallet = null;
	
	this.getWallet = function()
	{
		if(this.wallet)
		{
			return Promise.resolve(this.wallet);
		}
		
		return WalletAPI.get('stellar')
			.then(result => this.wallet = result);
	}
	
	this.checkFundsForTopic = function(topic)
	{
		return this.getWallet()
			.then(wallet =>
			{
				return wallet.balance >= topic.rate;
			});
	}
}