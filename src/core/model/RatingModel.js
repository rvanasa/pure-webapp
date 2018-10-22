module.exports = function(Model, Database, RatingProperty)
{
	return Model('Rating')
		.prop('user', 'User')
		.prop('session', 'Session')
		.prop('rating', null, RatingProperty).opt()
		.prop('comment', String).opt()
		.build(Database);
}
