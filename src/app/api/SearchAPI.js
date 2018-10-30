module.exports = function(API, Endpoint, ModelEndpoint, Hooks, TopicAPI)
{
	return Endpoint('search')
		.add('find', async ({query}) =>
		{
			var input = query['q'];
			var category = query['c'];
			
			if(!input && !category)
			{
				throw 'Invalid query string';
			}
			
			var filter = {};
			if(input)
			{
				var regex = new RegExp(input.replace(/\s/g, ''), 'i');
				filter.name = {$regex: regex};
			}
			if(category)
			{
				filter.category = category;
			}
			return TopicAPI.find({query, filter, select: {}, options: {}});
		})
		.hooks(Hooks.limit(30))
		.build(API);
}