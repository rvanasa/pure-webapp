module.exports = function(API, Service, ModelService, Hooks, StellarIntegration)
{
	return Service('wallets')
		.add('get', async (id, {user}) =>
		{
			if(id === 'primary')
			{
				var wallets = await StellarIntegration.getWallets(user);
				if(!wallets.length)
				{
					return await StellarIntegration.createWallet(user);
				}
				return wallets[0];
			}
			else
			{
				throw `Invalid wallet type: ${id}`;
			}
		})
		.build(API);
}