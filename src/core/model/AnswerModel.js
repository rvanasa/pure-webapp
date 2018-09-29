module.exports = function(Model, Database)
{
	var ratings = [1, 2, 3, 4, 5];
	function isRating(val)
	{
		return ratings.includes(val);
	}
	
	return Model('Answer')
		.prop('user', 'User')
		.prop('question', 'Question')
		.prop('selected', Number)
		.prop('importance', Number).validate(isRating, '{PATH} must be a 1-5 rating')
		.build(Database);
}
