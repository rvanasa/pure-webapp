var Turn = require('node-turn');

module.exports = function()
{
	var server = new Turn({
		listeningPort: 8081,
		credentials: {
			pure: 'pass',
		},
	});
	server.start();
	
	return server;
}