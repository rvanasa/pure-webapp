module.exports = function(Model, Database)
{
	return Model('Domain')
		.prop('admins', 'User').array()
		.prop('name', String)
		.prop('webDomains', String).array()
		.build(Database);
}
