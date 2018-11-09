var EventEmitter = require('events');

module.exports = function(Socket, Auth)
{
	var UserEvents = new EventEmitter();
	
	Auth.setup(Socket, middleware => (socket, next) => middleware(socket.request, {}, next));
	
	Socket.use((socket, next) => next(socket.request.isAuthenticated() ? null : 'Not authenticated'));
	
	Socket.on('connection', (connection) =>
	{
		var user = connection.request.user;
		var fn = (...args) => connection.emit(...args);
		UserEvents.on(user._id, fn);
		UserEvents.emit('join', user, connection);
		connection.on('disconnect', () =>
		{
			UserEvents.removeListener(user._id, fn);
			UserEvents.emit('leave', user, connection);
		});
	});
	
	return UserEvents;
}