var axios = require('axios');
var StellarSdk = require('stellar-sdk');

module.exports = function(Logger, Config, StellarWalletModel)
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
			var wallets = await StellarWalletModel.find({user}).lean();
			return wallets.map(wallet => StellarSdk.Keypair.fromSecret(wallet.data));
		},
		async findWallets(user)
		{
			var keypairs = await this.findKeypairs(user);
			return Promise.all(keypairs.map(async keypair => getWallet(keypair)));
		},
		async createWallet(user)
		{
			var keypair = StellarSdk.Keypair.random();
			
			// TODO source from platform wallet
			await axios.get(`https://friendbot.stellar.org?addr=${encodeURIComponent(keypair.publicKey())}`);
			
			var account = await server.loadAccount(keypair.publicKey());
			var tx = new StellarSdk.TransactionBuilder(account)
				.addOperation(StellarSdk.Operation.changeTrust({
					asset,
				}))
				.build();
			await sendTx(tx, keypair);
			
			await StellarWalletModel.create({
				user,
				data: keypair.secret(),
			});
			Logger.info('stellar.wallet.created', {user: user._id, address: keypair.publicKey()});
			return getWallet(keypair, account);
		},
	};
}