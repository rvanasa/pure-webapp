module.exports = function(Model, Database, EmailProp)
{
	return Model('AwardOffer')
		.prop('email', null, EmailProp)
		.prop('badge', 'Badge')
		.prop('message', String).opt()
		.build(Database);
}
