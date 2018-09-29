module.exports = function(API, Service, ModelService, Hooks, TopicAPI)
{
	return Service('favorites')
		.add('find', async ({user, query}) =>
		{
			var params = {user, query, filter: {}, select: {}, options: {}};
			return await Promise.all(user.favorites.map(id => TopicAPI.get(id, params)));
		})
		.add('create', async ({topic}, {user}) =>
		{
			user.favorites.addToSet(topic);
			await user.save();
			return 'Added';
		})
		.add('remove', async (id, {user}) =>
		{
			user.favorites.pull(id);
			await user.save();
			return 'Removed';
		})
		.build(API);
}