module.exports = function(Logger, API, Socket, Endpoint, ModelEndpoint, Hooks, UserEvents, SessionAPI)
{
	async function findUsers(user)
	{
		var users = [];
		var sessions = await SessionAPI.find({user: user._id});
		for(var session of sessions)
		{
			if(session.begin)
			{
				users.push(session.teacher, ...session.students);
			}
		}
		return users;
	}
	
	function captureErrors(fn)
	{
		return function()
		{
			return Promise.resolve(fn.apply(this, arguments))
				.catch(err => Logger.error(err.stack));
		}
	}
	
	UserEvents.on('join', (user, connection) =>
	{
		connection.on('signal.ready', captureErrors(async () =>
		{
			for(var _id of await findUsers(user))
			{
				if(!user._id.equals(_id))
				{
					UserEvents.emit(_id, 'signal.peer', {id: connection.id});
				}
			}
		}));
		
		connection.on('signal', captureErrors(async ({id, signal, initiator}) =>
		{
			// TODO ensure in same session
			Socket.to(id).emit('signal', {id: connection.id, signal, initiator});
		}));
	});
}