var io = require('socket.io');

module.exports = function(Server, Auth)
{
	var Socket = io(Server);
	
	Socket.use((socket, next) => Auth(socket.request, {}, next));
	
	return Socket;
}