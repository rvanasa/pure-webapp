module.exports = function(Model, Database)
{
	return Model('Award')
		.prop('user', 'User')
		.prop('badge', 'Badge')
		.prop('enabled', Boolean)
		.build(Database);
}
