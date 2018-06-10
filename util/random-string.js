var crypto = require('crypto');

var string = crypto.randomBytes(32).toString('base64')
	.replace(/[^0-9a-zA-Z]/, '');

console.log(string);