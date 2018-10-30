var $ = require('jquery');

var feathers = require('@feathersjs/feathers');
var rest = require('@feathersjs/rest-client');

module.exports = function API($window, Alert)
{
	var API = feathers();
	API.configure(rest('/api').jquery($));
	
	$($window.document).ajaxError((event, response) =>
	{
		if(!response.status)
		{
			
		}
		else if(response.status === 400)
		{
			Alert.toast(`Invalid input.`, response.responseText, 'info');
		}
		else if(response.status === 500)
		{
			Alert.toast(`Something janky happened.`, `Don't worry; our team has already been notified.`, 'error');
		}
	});
	
	return API;
}
