module.exports = function(API, Endpoint, ModelEndpoint, Hooks, RatingModel, SessionModel, SessionActionModel)
{
	return Endpoint('ratings')
		.add('create', async (data, {user}) =>
		{
			var [/*session, */participated, already] = [
				// await SessionModel.findById(data.session).lean(),
				await SessionActionModel.count({session: data.session, user}),
				await RatingModel.count({user, session: data.session}),
			];
			if(already)
			{
				throw 'Already rated';
			}
			else if(!participated)
			{
				throw 'Must participate to rate';
			}
			
			await RatingModel.create(Object.assign(data, {user}));
			return 'Updated';
		})
		.build(API);
}