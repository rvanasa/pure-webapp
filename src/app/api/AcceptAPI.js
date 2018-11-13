module.exports = function(API, Endpoint, ModelEndpoint, Hooks)
{
	return Endpoint('accept')
		.add('create', async ({}, {user}) =>
		{
			user.accepted = true;
			await user.save();
			
			return 'Accepted';
		})
		.build(API);
}