var mongoose = require('mongoose');

module.exports = function(Config)
{
	mongoose.Promise = Promise;
	mongoose.set('useNewUrlParser', true);
	mongoose.set('useCreateIndex', true);
	
	var config = Config.database;
	return mongoose.createConnection(`mongodb://${encodeURIComponent(config.username)}:${encodeURIComponent(config.password)}@${config.url}`);
}