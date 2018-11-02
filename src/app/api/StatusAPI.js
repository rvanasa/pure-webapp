module.exports = function(API, Endpoint, ModelEndpoint, Hooks, UserEvents)
{
	UserEvents.on('join', user =>
	{
		user.lastOnline = Date.now();
		user.available = true;
		user.save();
	});
	
	UserEvents.on('leave', user =>
	{
		user.lastOnline = Date.now();
		user.available = false;
		user.save();
	});
	
	// return Endpoint('status')
		// .add('create', async ({available}, {user}) =>
		// {
		// 	user.lastOnline = Date.now();
		// 	user.available = available;
		// 	await user.save();
		// 	return 'Notified';
		// })
		// .build(API);
}