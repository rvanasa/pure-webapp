module.exports = function(API, Service, ModelService, Hooks, TopicModel, TopicView, SessionModel, RatingModel)
{
	// TODO prevent price change during session
	
	// TODO prevent users from being returned on each `find` result (without breaking SearchAPI)
	return Service('topics', ModelService(TopicModel))
		.add('remove', async (id, {filter}) =>
		{
			filter._id = id;
			await TopicModel.updateOne(filter, {deleted: true});
			return 'Deleted';
		})
		.hooks({
			before: {
				find({params})
				{
					params.filter.deleted = false;
				},
				all({method, params, data})
				{
					if(data)
					{
						delete data.deleted;
					}
				},
			},
		})
		.hooks(Hooks.output(topic => delete topic.deleted))
		.hooks(Hooks.owned('user', {public: true}))
		.hooks(Hooks.view(TopicView))
		.hooks(Hooks.input(topic => delete topic.badges))
		.hooks(Hooks.output(async topic =>
		{
			var sessions = await SessionModel.find({topic}).lean();
			var ratings = await RatingModel.find({session: {$in: sessions}}).lean();
			
			topic.badges = {
				lessons: sessions.length,
				duration: sessions.reduce((n, s) => n + s.duration, 0),
				reputation: ratings.reduce((n, r) => n + r.rating, 0) / ratings.length,
			};
		}))
		.build(API);
}