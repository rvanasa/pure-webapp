module.exports = function(API, Endpoint, ModelEndpoint, Hooks, QueueService, FundService, SessionModel, SessionActionModel, TopicModel, UserModel, UserEvents, TransactionModel)
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
	
	async function findSessions({user})
	{
		var sessions = await SessionModel.find({
			$or: [{teacher: user._id}, {students: user._id}],
			end: {$exists: false},
		}).lean();
		
		return Promise.all(sessions.map(getJSON));
	}
	
	async function chargeStudent(user, session)
	{
		if(session.rate > 0)
		{
			var balance = await FundService.getSpendableBalance(user);
			if(balance < session.rate)
			{
				throw 'Insufficient balance';
			}
			else
			{
				await FundService.createTransaction({
					from: user,
					to: session.teacher,
					amount: session.rate,
					reason: 'escrow',
					data: session._id,
				});
			}
		}
	}
	
	async function getDuration(session, includeTrailing)
	{
		var users = [session.teacher, ...session.students];
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
		if(includeTrailing && available.size === users.length)
		{
			duration += (Date.now() - unpauseTime) / 1000 / 60;
		}
		return duration;
	}
	
	QueueService.register(async params =>
	{
		return (await findSessions(params))
			.map(session => ['session', session]);
	});
	
	return Endpoint('sessions')
		.add('find', findSessions)
		.add('create', async ({topic: id, request}, {user, connection}) =>
		{
			var [topic] = await Promise.all([(async () =>
			{
				var topic = await TopicModel.findById(id, 'user rate interval').lean();
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
				if(await SessionModel.count({topic: id, end: {$exists: false}}))
				{
					throw 'Session already in progress';
				}
			})()]);
			
			if(await SessionModel.count({$or: [{teacher: topic.user}, {students: topic.user}], end: {$exists: false}}))
			{
				throw 'Teacher is currently unavailable';
			}
			
			var session = await SessionModel.create({
				topic: id,
				teacher: topic.user,
				students: request ? [user._id] : [],
				rate: topic.rate,
				interval: topic.interval,
			});
			var json = await getJSON(session.toJSON());
			if(request)
			{
				if((await FundService.getSpendableBalance(user)) < session.rate)
				{
					throw 'Insufficient funds';
				}
				
				UserEvents.emit(session.teacher, 'session.request', json);
			}
			return json;
		})
		.add('update', async (id, {}, {user}) =>
		{
			var now = Date.now();
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
				await Promise.all(session.students.map(s => chargeStudent(s, session)));
				session.begin = now;
				var json = await getJSON(session.toJSON());
				for(var participant of [session.teacher, ...session.students])
				{
					UserEvents.emit(participant, 'session.begin', json);
				}
				await session.save();
				return 'Started session';
			}
			else if(session.students.length < session.topic.maxStudents)
			{
				await chargeStudent(user, session);
				session.students.addToSet(user._id);
				await session.save();
				return 'Joined session';
			}
			else
			{
				throw 'No available spaces';
			}
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
				var duration = await getDuration(session);
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
			var now = Date.now();
			var session = await SessionModel.findById(id);
			if(!session)
			{
				throw 'Session not found';
			}
			else if(session.end < now)
			{
				return 'Exited session (already closed)';
			}
			
			if(user._id.equals(session.teacher) || session.students.length <= 1)
			{
				session.end = now;
				var users = [session.teacher, ...session.students];
				for(var _id of users)
				{
					UserEvents.emit(_id, 'session.end', session._id);
				}
				
				var duration = await getDuration(session, true);
				await Promise.all((await TransactionModel.find({reason: 'escrow', data: session._id}))
					.map(async tx =>
					{
						tx.reason = 'session';
						if(session.interval)
						{
							var amount = Math.ceil(tx.amount * Math.min(1, duration / session.interval));
							if(amount > 0)
							{
								tx.amount = amount;
							}
							else
							{
								tx.reverted = true;
							}
						}
						else
						{
							//TODO
						}
						return tx.save();
					}));
			}
			session.students.pull(user._id);
			await session.begin ? session.save() : session.remove();
			
			return 'Exited session';
		})
		.build(API);
}