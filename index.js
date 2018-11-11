'use strict'

require('use-strict');

var argv = require('yargs').argv;

global.Promise = require('bluebird').Promise;

var config = require('./sorc.config');
// var env = argv._[0];
// if(!env)
// {
// 	console.error('Please specify environment (e.g. `node index dev`)');
// 	process.exit(1);
// }

var env = process.NODE_ENV === 'production' ? 'prod' : 'dev';

config.argv = argv;

require('sorc')(config, env, 'Server')
	.then(() =>
	{
		console.log(`Started server with environment [${env}]`);
	})
	.catch(err =>
	{
		console.error(err.stack);
		process.exit(1);
	});