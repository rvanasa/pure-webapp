module.exports = function(Model, Database, EmailProp)
{
	return Model('User')
		.prop('displayName', String)
		.prop('firstName', String)
		.prop('lastName', String)
		.prop('email', null, EmailProp).unique()
		// .prop('phone', null, PhoneProp).opt()
		.prop('tracking', Boolean).default(true)
		.prop('newsletter', Boolean).default(true)
		.prop('birthdate', Date).opt()
		.prop('interests', [String]).validate(val => val.length <= 50, 'Please select 50 or fewer interests')
		.prop('favorites', 'Topic').array()
		.prop('lastOnline', Date).default(Date.now)
		.prop('available', Boolean).default(false)
		.prop('accepted', Boolean).default(false)
		.build(Database);
}
