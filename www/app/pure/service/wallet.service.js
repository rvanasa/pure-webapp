module.exports = function WalletService(API, Socket, Alert)
{
	var WalletAPI = API.service('wallets');
	
	Socket.on('wallet.receive', ({from, amount}) =>
	{
		Alert.toast(`Received ${amount} XP`, null, 'success');
	});
	Socket.on('wallet.send', ({to, amount}) =>
	{
		Alert.toast(`Sent ${amount} XP`, null, 'success');
	});
	
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