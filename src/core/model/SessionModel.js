module.exports = function(Model, Database)
{
	return Model('Session')
		.prop('user', 'User')
		.prop('invited', 'User').array()
		.prop('active', Boolean).default(false)
		.build(Database);
}
