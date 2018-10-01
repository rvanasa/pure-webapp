module.exports = function(API, Service, ModelService, Hooks, SessionModel, TopicModel, UserModel, UserEvents)
{
	return Service('sessions')
		.add('find', async ({user}) =>
		{
			return await SessionModel.find({$or: [
				{teacher: user._id},
				{students: user._id},
			], end: {$exists: false}}).lean();
		})
		.add('create', async ({topic: id, request}, {user, connection}) =>
		{
			var [topic] = await Promise.all([(async () =>
			{
				var topic = await TopicModel.findById(id, {user: 1}).lean();
				if(!topic)
				{
					throw 'Topic not found';
				}
				else if(!request)
				{
					if(!user._id.equals(topic.user))
					{
						throw 'Topic owned by another user';
					}
				}
				else if(user._id.equals(topic.user))
				{
					throw 'Topic is owned by the requester';
				}
				return topic;
			})(), (async () =>
			{
				if(await SessionModel.findOne({topic: id/*, begin: {$exists: true}*/, end: {$exists: false}}).lean())
				{
					throw 'Session already in progress';
				}
			})()]);
			
			var session = await SessionModel.create({
				topic: id,
				teacher: topic.user,
				students: request ? [user._id] : [],
			});
			if(request)
			{
				UserEvents.emit(session.teacher, 'session.request', session);
			}
			return session;
		})
		.add('update', async (id, {}, {user}) =>
		{
			var session = await SessionModel.findById(id).populate('topic');
			if(!session)
			{
				throw 'Session not found';
			}
			if(user._id.equals(session.teacher))
			{
				if(!session.students.length)
				{
					throw 'No students';
				}
				session.begin = Date.now();
				var json = session.toJSON();
				json.topic = session.topic._id;
				for(var participant of [session.teacher, ...session.students])
				{
					UserEvents.emit(participant, 'session.begin', json);
				}
			}
			else if(session.students.length < session.topic.maxStudents)
			{
				session.students.addToSet(user._id);
			}
			await session.save();
			return 'Started session';
		})
		.add('remove', async (id, {user}) =>
		{
			var session = await SessionModel.findById(id);
			if(!session)
			{
				throw 'Session not found';
			}
			if(user._id.equals(session.teacher) || session.students.length <= 1)
			{
				session.end = Date.now();
				var users = [session.teacher, ...session.students];
				for(var _id of users)
				{
					UserEvents.emit(_id, 'session.end', session._id);
				}
			}
			session.students.pull(user._id);
			await session.begin ? session.save() : session.remove();
			return 'Exited session';
		})
		.build(API);
}