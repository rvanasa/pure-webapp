module.exports = function(Model, Database)
{
	return Model('Badge')
		.prop('issuer', 'User')
		.prop('name', String)
		.prop('blurb', String).opt()
		.prop('icon', String)
		.build(Database);
}
