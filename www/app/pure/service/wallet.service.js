module.exports = function WalletService(API)
{
	var WalletAPI = API.service('wallets');
	
	this.getWallet = function()
	{
		return WalletAPI.get('primary');
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