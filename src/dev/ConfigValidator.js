var sha256 = require('sha256');
var base58 = require('bs58');

var expected = {
	dev: 'G7bRw8vAynLxbhJpBzGRJDcXnfKBHtfpGXKvgepRJpXb',
};

module.exports = function(Config)
{
	var env = this.env;
	var hash = base58.encode(sha256(JSON.stringify(Config), {asBytes: true}));
	
	if(hash != expected[env])
	{
		console.error(`Unexpected configuration hash [${env}]: ${hash}`);
		process.exit(1);
	}
}