// var khan = require('khan');

module.exports = function(Config, ExternalTopicModel)
{
	// var client = khan(Config.provider.khan.key, Config.provider.khan.secret);
	
	async function populateTopics()
	{
		var fs = require('fs');
		
		await ExternalTopicModel.deleteMany();
		
		Promise.resolve(JSON.parse(fs.readFileSync('__khan-topics.json')))
			.then(topics =>
			{
				console.log('::: Loaded ', topics.length);
				return ExternalTopicModel.create(topics);
			})
			.then(() => console.log('::: Added successfully'))
			.catch(err => console.error(err));
	}
	// populateTopics();
	
	return {
		
	};
}