module.exports = function(Model, Database)
{
	return Model('TopicSession')
		.prop('topic', 'Topic')
		.prop('teacher', 'User')
		.prop('students', 'User').array()
		.prop('begin', Date).opt()
		.prop('end', Date).opt()
		.prop('duration', Number).min(0).default(0)
		.build(Database);
}
