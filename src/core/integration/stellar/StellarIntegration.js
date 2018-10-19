var axios = require('axios');
var StellarSdk = require('stellar-sdk');

module.exports = function(Config, WalletModel)
{
	var retryRate = 3 * 1000;
	
	var config = Config.provider.stellar;
	if(!config.mainnet)
	{
		StellarSdk.Network.useTestNetwork();
	}
	var server = new StellarSdk.Server(config.url);
	
	var issuer = StellarSdk.Keypair.fromSecret(config.issuer);
	var asset = new StellarSdk.Asset('XP', issuer.publicKey());
	
	async function sendTx(tx, keypair)
	{
		tx.sign(keypair);
		return new Promise((resolve, reject) =>
		{
			var received = false;
			var interval = setInterval(async () =>
			{
				try
				{
					var result = await server.submitTransaction(tx);
					if(!received)
					{
						resolve(result);
						clearInterval(interval);
						received = true;
					}
				}
				catch(e)
				{
					reject(e);
				}
			}, retryRate);
		});
	}
	
	async function getWallet(keypair, account)
	{
		if(!account)
		{
			account = await server.loadAccount(keypair.publicKey());
		}
		var tokenBalance = account.balances.find(balance => balance.asset_code === asset.code && balance.asset_issuer === asset.issuer);
		return {
			address: keypair.publicKey(),
			balance: tokenBalance ? tokenBalance.balance : null,
		};
	}
	
	return {
		async findKeypairs(user)
		{
			var wallets = await WalletModel.find({user}).lean();
			return wallets.map(wallet => StellarSdk.Keypair.fromSecret(wallet.data));
		},
		async createWallet(user)
		{
			var keypair = StellarSdk.Keypair.random();
			
			await axios.get(`https://friendbot.stellar.org?addr=${encodeURIComponent(keypair.publicKey())}`);
			
			var account = await server.loadAccount(keypair.publicKey());
			var tx = new StellarSdk.TransactionBuilder(account)
				.addOperation(StellarSdk.Operation.changeTrust({
					asset,
				}))
				.build();
			await sendTx(tx, keypair);
			
			await WalletModel.create({
				user,
				data: keypair.secret(),
			});
			return getWallet(keypair, account);
		},
		async getWallets(user)
		{
			var keypairs = await this.findKeypairs(user);
			return Promise.all(keypairs.map(async keypair => getWallet(keypair)));
		},
	};
}