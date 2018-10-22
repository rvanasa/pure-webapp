module.exports = function(Model, Database)
{
	return Model('StellarWallet')
		.prop('user', 'User')
		.prop('data', String)
		.build(Database);
}
