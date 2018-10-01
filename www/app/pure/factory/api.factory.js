var $ = require('jquery');

var feathers = require('@feathersjs/feathers');
var rest = require('@feathersjs/rest-client');
// var socketio = require('@feathersjs/socketio-client');

module.exports = function API()
{
	var API = feathers();
	
	API.configure(rest('/api').jquery($));
	// API.configure(socketio(Socket));
	
	return API;
}
