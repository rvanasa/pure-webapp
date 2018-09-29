module.exports = function(Model, Database)
{
	return Model('Topic')
		.prop('user', 'User')
		.prop('name', String)
		.prop('blurb', String)
		.prop('rate', Number)
		.prop('hourly', Boolean)
		.prop('category', String)
		// .prop('spectate', Boolean).default(false)
		.build(Database);
}
