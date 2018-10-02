var $ = require('jquery');

var feathers = require('@feathersjs/feathers');
var rest = require('@feathersjs/rest-client');

module.exports = function API()
{
	var API = feathers();
	API.configure(rest('/api').jquery($));
	
	return API;
}
