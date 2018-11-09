module.exports = function(API, Endpoint, ModelEndpoint, Hooks, UserModel, TopicAPI)
{
	return Endpoint('search')
		.add('find', async ({user, query}) =>
		{
			var input = query['q'];
			var category = query['c'];
			var flags = query['f'] || '';
			
			if(!input && !category && !flags)
			{
				throw 'Invalid query';
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
			if(flags.includes('a'))
			{
				var online = await UserModel.find({available: true}, '_id').lean();
				// var online = [];
				// (await UserModel.find({available: true}, '_id').lean())
				// 	.forEach(u => !user._id.equals(u._id) && online.push(u._id));
				filter.user = {$in: online};
			}
			return (await TopicAPI.find({query, filter, select: {}, options: {}})).reverse();
		})
		.hooks(Hooks.limit(30))
		.build(API);
}