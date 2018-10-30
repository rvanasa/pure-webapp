module.exports = function(API, Endpoint, ModelEndpoint, Hooks)
{
	return Endpoint('interests')
		.add('find', async ({user}) =>
		{
			return user.interests;
		})
		.add('create', async ({interest}, {user}) =>
		{
			user.interests.addToSet(interest);
			await user.save();
			return 'Added';
		})
		.add('remove', async (id, {user}) =>
		{
			user.interests.pull(id);
			await user.save();
			return 'Removed';
		})
		.build(API);
}