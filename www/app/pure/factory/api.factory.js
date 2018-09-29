var feathers = require('@feathersjs/feathers');
var rest = require('@feathersjs/rest-client');
// var socketio = require('@feathersjs/socketio-client');

module.exports = function API($window)
{
	var API = feathers();
	
	var socket = $window.io();
	
	API.configure(rest('/api').jquery($window.jQuery));
	// API.configure(socketio(socket));
	
	return API;
}
