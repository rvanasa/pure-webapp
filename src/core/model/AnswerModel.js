module.exports = function(Model, Database, RatingProperty)
{
	return Model('Answer')
		.prop('user', 'User')
		.prop('question', 'Question')
		.prop('selected', Number)
		.prop('importance', null, RatingProperty)
		.build(Database);
}
