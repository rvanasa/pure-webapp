module.exports = function(Model, Database, RatingProp)
{
	return Model('Rating')
		.prop('user', 'User')
		.prop('session', 'Session')
		.prop('rating', null, RatingProp).opt()
		.prop('comment', String).opt()
		.build(Database);
}
