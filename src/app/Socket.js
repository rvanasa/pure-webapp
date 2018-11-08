var io = require('socket.io');
var parser = require('socket.io-msgpack-parser');

module.exports = function(Server)
{
	var Socket = io(Server, {
		parser,
	});
	
	return Socket;
}