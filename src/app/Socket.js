var io = require('socket.io');

module.exports = function(Server)
{
	var Socket = io(Server);
	
	return Socket;
}