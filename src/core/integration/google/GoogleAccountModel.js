module.exports = function(Model, Database)
{
	return Model('GoogleAccount')
		.prop('profileID', String).unique()
		.prop('user').ref('User')
		.prop('email', String).lowercase()
		// .prop('access', String)
		// .prop('refresh', String).opt()
		.build(Database);
}