module.exports = function(API, Service, ModelService, Hooks, RatingModel, SessionModel)
{
	return Service('ratings')
		.add('create', async (data, {user}) =>
		{
			var [session, already] = [await SessionModel.findById(data.session).lean(), await RatingModel.count({user, session: data.session})];
			if(already)
			{
				throw 'Already rated';
			}
			else if(!session.students.some(id => user._id.equals(id)))
			{
				throw 'Cannot rate this session';
			}
			
			await RatingModel.create(Object.assign(data, {user}));
			return 'Updated';
		})
		.build(API);
}