var express = require('express');
var morgan = require('morgan');

module.exports = function(App, API, Config, AuthMiddleware)
{
	if(Config.resourcePath)
	{
		App.use(express.static(Config.resourcePath));
	}
	else
	{
		var webpack = require('webpack');
		var devMiddleware = require('webpack-dev-middleware');
		
		var compiler = webpack(require(this.config.basePath + '/webpack.config'));
		App.use(require('webpack-hot-middleware')(compiler, {
			log: console.log,
		}));
		App.use(devMiddleware(compiler, {
			stats: {colors: true},
			inline: true,
			hot: true,
		}));
	}
	
	App.use(morgan('dev'));
	
	App.use('/assets', express.static(this.config.basePath + '/www/assets'), (req, res, next) => res.status(404).send('Unknown asset'));
	App.use('/api', API);
	
	App.get('*', AuthMiddleware, (req, res) => res.render('webapp', {user: req.user.toJSON()}));
	
	App.use((err, req, res, next) =>
	{
		if(err.stack) console.error(err.stack);
		res.render('error', {
			error: err,
			status: res.statusCode,
		});
	});
}