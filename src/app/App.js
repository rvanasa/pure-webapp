var express = require('express');

var compression = require('compression');
// var bodyParser = require('body-parser');

module.exports = function()
{
	var app = express();
	
	app.set('views', 'view');
	app.set('view engine', 'ejs');
	
	app.use(compression());
	// app.use(bodyParser.urlencoded({extended: true}));
	// app.use(bodyParser.json());
	
	return app;
}