var io = require('socket.io-client');

module.exports = function Socket($rootScope)
{
	var connection = io();
	
	return {
		on(id, listener)
		{
			connection.on(id, function()
			{
				$rootScope.$apply(() => listener.apply(this, arguments));
			});
		},
		emit(...args)
		{
			connection.emit(...args);
		},
	};
}