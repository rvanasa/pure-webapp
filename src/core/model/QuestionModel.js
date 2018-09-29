module.exports = function(Model, Database)
{
	return Model('Question')
		.prop('user', 'User')
		.prop('prompt', String)
		.prop('options', [String]).validate(val => val.length >= 2, '{PATH} must have at least 2 items')
		.build(Database);
}
