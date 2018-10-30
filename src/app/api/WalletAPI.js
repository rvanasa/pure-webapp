module.exports = function(API, Endpoint, ModelEndpoint, Hooks, StellarIntegration, TransactionModel)
{
	async function loadActive(user)
	{
		var balance = 0;
		for(var tx of await TransactionModel.find({$or: [{from: user}, {to: user}]}))
		{
			// console.log(user._id, '::',tx.from, tx.to,tx.amount)
			if(user._id.equals(tx.from))
			{
				balance -= tx.amount;
			}
			if(user._id.equals(tx.to))
			{
				balance += tx.amount;
			}
		}
		return {balance};
	}
	
	async function loadCrypto(user)
	{
		var wallets = await StellarIntegration.findWallets(user);
		if(!wallets.length)
		{
			return await StellarIntegration.createWallet(user);
		}
		return wallets[0];
	}
	
	return Endpoint('wallets')
		.add('get', async (id, {user}) =>
		{
			if(id === 'primary')
			{
				var [active, crypto] = [await loadActive(user), await loadCrypto(user)];
				active.crypto = crypto;
				return active;
			}
			else
			{
				throw `Invalid wallet type: ${id}`;
			}
		})
		.build(API);
}