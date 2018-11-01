var express = require('express');
var morgan = require('morgan');

module.exports = function(Logger, App, Auth, API, Config, ClientConfig, AuthMiddleware)
{
	App.set('views', 'view');
	App.set('view engine', 'ejs');
	
	var config = Config.server;
	
	if(config.resourcePath)
	{
		App.use(express.static(config.resourcePath));
	}
	else
	{
		var webpack = require('webpack');
		var devMiddleware = require('webpack-dev-middleware');
		
		var compiler = webpack(require(`${this.config.basePath}/webpack.config`));
		// App.use(require('webpack-hot-middleware')(compiler, {
		// 	log: console.log,
		// }));
		App.use(devMiddleware(compiler, {
			stats: {colors: true},
			inline: true,
			hot: true,
		}));
	}
	
	Auth.setup(App);
	Auth.routes(App);
	
	App.use(morgan('dev'));
	
	App.use('/assets', express.static(`${this.config.basePath}/www/assets`), (req, res, next) => res.status(404).send('Unknown asset'));
	App.use('/api', API);
	
	App.get('*', AuthMiddleware, (req, res) => res.render('webapp', {
		user: req.user.toJSON(),
		config: ClientConfig
	}));
	
	App.use((err, req, res, next) =>
	{
		Logger.error(err.stack || err);
		res.render('error', {
			error: err,
			status: res.statusCode,
		});
	});
}