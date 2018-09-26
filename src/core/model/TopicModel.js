module.exports = function(Model, Database)
{
	return Model('Topic')
		.prop('user', 'User')
		.prop('name', String)
		.prop('blurb', String)
		.prop('rate', String)
		.prop('hourly', Boolean)
		.prop('group', Boolean)
		.build(Database);
}
