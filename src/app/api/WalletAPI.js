module.exports = function(API, Endpoint, ModelEndpoint, Hooks, StellarIntegration, FundService)
{
	async function loadActive(user)
	{
		return {
			balance: await FundService.getSpendableBalance(user),
		};
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