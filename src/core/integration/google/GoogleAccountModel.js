module.exports = function(Model, Database)
{
	return Model('GoogleAccount')
		.prop('profileID', String).unique()
		.prop('user').ref('User')
		.prop('access', String)
		.prop('refresh', String).opt()
		.prop('email', String).lowercase()
		// .prop('events').array()////?
		.build(Database);
}