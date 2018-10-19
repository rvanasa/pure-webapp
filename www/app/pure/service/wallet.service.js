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
		
		return WalletAPI.get('primary')
			.then(result => this.wallet = result);
	}
}