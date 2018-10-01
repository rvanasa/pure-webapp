module.exports = function(Model, Database)
{
	return Model('Topic')
		.prop('user', 'User')
		.prop('name', String)
		.prop('blurb', String)
		.prop('rate', Number)
		.prop('hourly', Boolean)
		.prop('category', String)
		.prop('maxStudents', Number).default(1).validate(val => val > 1 && val === Math.floor(val), '{PATH} must be an integer greater than 1')
		// .prop('spectate', Boolean).default(false)
		.build(Database);
}
