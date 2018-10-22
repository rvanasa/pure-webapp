module.exports = function(Model, Database, MoneyProperty)
{
	return Model('Topic')
		.prop('user', 'User')
		.prop('name', String)
		.prop('blurb', String)
		.prop('rate', null, MoneyProperty)
		.prop('hourly', Boolean)
		.prop('category', String)
		.prop('maxStudents', Number).integer().min(1).default(1)
		.prop('deleted', Boolean).default(false)
		.build(Database);
}
