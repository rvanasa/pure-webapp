module.exports = function(Model, Database)
{
	return Model('User')
		.prop('displayName', String)
		.prop('firstName', String)
		.prop('lastName', String)
		.prop('email', String).lowercase()
		.prop('birthdate', Date).opt()
		.prop('interests', [String]).validate(val => val.length <= 30, 'Please select 30 or fewer interests')
		.prop('favorites', 'Topic').array()
		.prop('lastOnline', Date).default(Date.now)
		.prop('available', Boolean).default(false)
		.build(Database);
}
