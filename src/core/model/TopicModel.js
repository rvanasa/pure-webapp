module.exports = function(Model, Database, MoneyProp)
{
	return Model('Topic')
		.prop('user', 'User')
		.prop('name', String)
		.prop('blurb', String)
		.prop('rate', null, MoneyProp)
		.prop('interval', Number).integer().min(0)
		.prop('category', String)
		.prop('maxStudents', Number).integer().min(1).default(1)
		.prop('deleted', Boolean).default(false)
		.build(Database);
}
