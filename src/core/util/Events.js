var EventEmitter = require('promise-events');

module.exports = function(Log)
{
	var events = new EventEmitter();
	
	events.on('newListener', (id, listener) =>
	{
		Log('Added listener for event:', listener);
	});
	
	return events;
}