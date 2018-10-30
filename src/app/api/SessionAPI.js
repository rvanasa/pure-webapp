module.exports = function(API, Endpoint, ModelEndpoint, Hooks, QueueService, SessionModel, SessionActionModel, TopicModel, UserModel, UserEvents)
{
	async function getJSON(session)
	{
		var actions = (await SessionActionModel.find({session}).lean().sort({$natural: 1}))
			.map(action =>
			{
				action.time = action._id.getTimestamp();
				delete action._id;
				return action;
			});
		
		var available = [];
		var users = [session.teacher, ...session.students];
		for(var _id of users)
		{
			for(var i = actions.length - 1; i >= 0; i--)
			{
				var action = actions[i];
				if(action.user.equals(_id))
				{
					if(action.key === 'join')
					{
						available.push(_id);
					}
					else if(action.key === 'leave')
					{
						break;
					}
				}
			}
		}
		
		session.topic = session.topic._id;
		session.actions = actions;
		session.available = available;
		return session;
	}
	
	QueueService.register(async ({user}) =>
	{
		var sessions = await SessionModel.find({$or: [
				{teacher: user._id},
				{students: user._id},
			], end: {$exists: false}}).lean();
		
		return (await Promise.all(sessions.map(getJSON)))
			.map(session => ['session', session]);
	});
	
	return Endpoint('sessions')
		// .add('find', async ({user}) =>
		// {
		// 	// TODO migrate to queue
			
		// 	var sessions = await SessionModel.find({$or: [
		// 		{teacher: user._id},
		// 		{students: user._id},
		// 	], end: {$exists: false}}).lean();
			
		// 	return Promise.all(sessions.map(getJSON));
		// })
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
			var json = await getJSON(session.toJSON());
			if(request)
			{
				UserEvents.emit(session.teacher, 'session.request', json);
			}
			return json;
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
				var json = await getJSON(session.toJSON());
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
		.add('patch', async (id, {key, data}, {user}) =>
		{
			var session = await SessionModel.findOne({
				_id: id,
				$or: [{teacher: user}, {students: user}],
				end: {$exists: false},
			});
			if(!session)
			{
				throw 'Not in session';
			}
			
			var users = [session.teacher, ...session.students];
			
			var createPromise = SessionActionModel.create({
				session,
				user,
				key,
				data,
			});
			
			var newAction = {
				session: id,
				time: Date.now(),
				user: user._id,
				key,
				data,
			};
			for(var _id of users)
			{
				UserEvents.emit(_id, 'session.action', newAction);
			}
			
			await createPromise;
			
			if(key === 'join' || key === 'leave')
			{
				var actions = await SessionActionModel.find({session, key: {$in: ['join', 'leave']}})
					.lean().sort({$natural: 1});
				
				var duration = 0;
				var available = new Set();
				var unpauseTime = null;
				for(var action of actions)
				{
					if(!users.some(_id => _id.equals(action.user)))
					{
						continue;
					}
					
					if(action.key === 'join')
					{
						available.add(String(action.user));
						if(available.size === users.length)
						{
							unpauseTime = action._id.getTimestamp();
						}
					}
					else if(action.key === 'leave')
					{
						available.delete(String(action.user));
						if(available.size !== users.length && unpauseTime)
						{
							duration += (action._id.getTimestamp() - unpauseTime) / 1000 / 60;
							unpauseTime = null;
						}
					}
				}
				for(_id of users)
				{
					UserEvents.emit(_id, 'session.time', {duration});
				}
				session.duration = duration;
				await session.save();
			}
			
			return 'Submitted';
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