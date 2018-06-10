module.exports = function(Model, Database)
{
	return Model('User')
		.prop('displayName', String)
		.prop('firstName', String)
		.prop('lastName', String)
		.prop('email', String).lowercase()
		.prop('iconURL', String).opt() // TODO switch to Gravatar
		.prop('settings', Object).default(getDefaultSettings)
		.build(Database);
}

function getDefaultSettings()
{
	return {};
}