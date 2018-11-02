var feathers = require('@feathersjs/feathers');
var express = require('@feathersjs/express');

var sanitize = require('mongo-sanitize');

module.exports = function(Logger)
{
	function setupFeathers(req)
	{
		Object.assign(req.feathers, {user: req.user, filter: {}, select: {}, options: {}});
	}
	
	var API = express(feathers());
	API.configure(express.rest());
	
	API.use(express.json());
	API.use((req, res, next) =>
	{
		if(!req.isAuthenticated())
		{
			return res.status(403).send('Not authenticated');
		}
		req.body = sanitize(req.body);
		setupFeathers(req);
		next();
	});
	
	this.queue(() =>
	{
		API.use((err, req, res, next) =>
		{
			if(typeof err === 'string')
			{
				return res.status(400).send(err);
			}
			Logger.error(err.stack || err);
			next(err);
		});
		
		if(this.env === 'dev')
		{
			API.use((err, req, res, next) => res.status(500).send(err.message/* || err.stack*/ || err));
		}
		else
		{
			API.use((_, req, res, next) => res.status(500).end());
		}
		
		API.use((req, res) => res.status(404).send(`Unknown endpoint: ${req.path}`));
	});
	
	return API;
}