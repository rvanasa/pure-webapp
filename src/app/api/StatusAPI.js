module.exports = function(API, Service, ModelService, Hooks, UserModel)
{
	return Service('status')
		.add('create', async ({available}, {user}) =>
		{
			await UserModel.update({_id: user._id}, {
				lastOnline: Date.now(),
				available,
			});
			return 'Notified';
		})
		.build(API);
}