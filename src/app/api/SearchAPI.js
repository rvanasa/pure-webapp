module.exports = function(API, Endpoint, ModelEndpoint, Hooks, UserModel, TopicAPI, ExternalTopicModel)
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
				var regex = new RegExp(`(^|[^a-zA-Z0-9])${input.trim().replace(/\s+/g, ' ').replace(/[.*+?^${}()|[\]\\]/g, '\\s*')}`, 'i');
				var match = {$regex: regex};
				filter.$or = [{name: match}, {blurb: match}];
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
			if(flags.includes('n') && filter.$or)
			{
				filter.$or.length = 1;
			}
			return [
				...(await TopicAPI.find({query, filter: Object.assign({}, filter), select: {}, options: {}})).reverse(),
				...(filter.user ? [] : (await ExternalTopicModel.find(filter).lean().limit(20))
					.map(topic =>
					{
						delete topic._id;
						return topic;
					})),
			];
		})
		.hooks(Hooks.limit(30))
		.build(API);
}