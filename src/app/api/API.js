var feathers = require('@feathersjs/feathers');
var express = require('@feathersjs/express');
// var socketio = require('@feathersjs/socketio');

var sanitize = require('mongo-sanitize');

module.exports = function(AuthMiddleware)
{
	var API = express(feathers());
	
	API.configure(express.rest());
	// API.configure(socketio());
	
	API.use(express.json());
	
	API.use(AuthMiddleware);
	API.use((req, res, next) =>
	{
		req.body = sanitize(req.body);
		
		req.feathers.user = req.user;
		req.feathers = Object.assign({filter: {}, select: {}, options: {}}, req.feathers);//temp
		next();
	});
	
	setTimeout(() =>
	{
		if(this.env === 'dev')
		{
			API.use(express.errorHandler());
			// API.use((err, req, res, next) =>
			// {
			// 	console.error(err.stack || err);
			// 	res.status(500).send(err.message || err.stack || err);
			// });
		}
		else
		{
			API.use((err, req, res, next) =>
			{
				if(typeof err === 'string')
				{
					return res.status(400).send(err);
				}
				console.error(err.stack || err);
				res.status(500).end();
			});
		}
		
		API.use((req, res, next) => res.status(404).send(`Unknown endpoint: ${req.path}`));
		
		// API.setup()
	});
	
	return API;
}