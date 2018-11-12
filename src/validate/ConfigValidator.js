var sha256 = require('sha256');
var base58 = require('bs58');

var expected = {
	// dev: 'DbEXPs3nEfmtdQj7Gs1cpM41RCuZohVeUhBYBevRZWQe',
};

module.exports = function(Config)
{
	var env = this.env;
	var hash = base58.encode(sha256(JSON.stringify(Config), {asBytes: true}));
	
	if(expected[env] && hash !== expected[env])
	{
		throw new Error(`Unexpected configuration hash [${env}]: ${hash}`);
	}
}