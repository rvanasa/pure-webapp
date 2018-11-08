var io = require('socket.io-client');
var parser = require('socket.io-msgpack-parser');

module.exports = function Socket($rootScope)
{
	var connection = io({
		parser,
	});
	
	var _on = connection.on;
	var _emit = connection.emit;
	return Object.assign(connection, {
		on(id, listener)
		{
			return _on.call(this, id, function()
			{
				$rootScope.$apply(() => listener.apply(this, arguments));
			});
		},
		emit(...args)
		{
			return _emit.apply(this, args);
		},
	});
}