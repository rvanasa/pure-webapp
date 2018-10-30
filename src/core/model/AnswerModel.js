module.exports = function(Model, Database, RatingProp)
{
	return Model('Answer')
		.prop('user', 'User')
		.prop('question', 'Question')
		.prop('selected', Number)
		.prop('importance', null, RatingProp)
		.build(Database);
}
