module.exports = function(Model, Database)
{
	return Model('Wallet')
		.prop('user', 'User')
		.prop('data', String)
		.build(Database);
}
