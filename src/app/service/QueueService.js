module.exports = function()
{
	var providers = [];
	
	return {
		register(provider)
		{
			providers.push(provider);
		},
		async findAll(params)
		{
			return (await Promise.all(providers.map(f => f(params))))
				.reduce((a, b) => a.concat(b), []);
		},
	};
}