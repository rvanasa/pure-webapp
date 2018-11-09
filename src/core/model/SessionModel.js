module.exports = function(Model, Database, MoneyProp)
{
	return Model('TopicSession')
		.prop('topic', 'Topic')
		.prop('teacher', 'User')
		.prop('students', 'User').array()
		.prop('begin', Date).opt()
		.prop('end', Date).opt()
		.prop('rate', null, MoneyProp)
		.prop('interval', Number).integer().min(0)
		.prop('duration', Number).min(0).default(0)
		.build(Database);
}
