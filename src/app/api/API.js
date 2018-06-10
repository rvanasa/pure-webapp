var express = require('express');

module.exports = function(App, AuthMiddleware)
{
	console.log('Loading API...');
	
	var router = express.Router();
	
	router.use(AuthMiddleware);
	
	setTimeout(() =>
	{
		router.use((err, req, res, next) =>
		{
			console.error(err instanceof Error ? err.stack : err);
			res.status(500).send(err instanceof Error ? 'Something unexpected happened' : err);
		});
	});
	
	return router;
}