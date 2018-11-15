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
	
	this.wallet = {};
	
	this.fetchWallet = function()
	{
		return WalletAPI.get('primary')
			.then(result => Object.assign(this.wallet, result));
	}
	
	this.checkFundsForTopic = function(topic)
	{
		return this.fetchWallet()
			.then(wallet => wallet.balance >= topic.rate);
	}
}