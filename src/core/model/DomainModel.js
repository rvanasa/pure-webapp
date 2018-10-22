module.exports = function(Model, Database)
{
	return Model('Domain')
		.prop('admins', 'User').array()
		.prop('name', String)
		.prop('domainNames', String).array()
		.build(Database);
}
