var EventEmitter = require('events');

module.exports = function QueueService(API)
{
	var QueueAPI = API.service('queue');
	
	this.events = new EventEmitter();
	
	QueueAPI.find()
		.then(results =>
		{
			for(var event of results)
			{
				this.events.emit(...event);
			}
		});
}