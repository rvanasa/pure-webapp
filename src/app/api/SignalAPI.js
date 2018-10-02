module.exports = function(API, Socket, Service, ModelService, Hooks, UserEvents, SessionAPI)
{
	UserEvents.on('join', (user, connection) =>
	{
		connection.on('signal.ready', async () =>
		{
			var sessions = await SessionAPI.find({user});
			for(var session of sessions)
			{
				if(session.begin)
				{
					var users = [session.teacher, ...session.students];
					for(var _id of users)
					{
						if(!user._id.equals(_id))
						{
							UserEvents.emit(_id, 'signal.peer', {id: connection.id});
						}
					}
				}
			}
		});
		
		connection.on('signal', async ({id, signal, initiator}) =>
		{
			console.log(id,initiator)
			
			// TODO ensure in same session
			Socket.to(id).emit('signal', {id: connection.id, signal, initiator});
		});
	});
}