module.exports = function(Model, Database)
{
	return Model('Award')
		.prop('user', 'User')
		.prop('badge', 'Badge')
		.build(Database);
}
