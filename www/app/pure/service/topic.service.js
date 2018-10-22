module.exports = function TopicService(API, Cache, UserService)
{
	var TopicAPI = API.service('topics');
	
	Object.assign(this, Cache(
		id => TopicAPI.get(id),
		topic => UserService.register(topic.user),
	));
	
	this.findByUser = function(id)
	{
		return TopicAPI.find(id ? {query: {user: id}} : null)
			.then(results =>
			{
				console.log(results)//
				for(var result of results)
				{
					this.register(result);
				}
				return results;
			});
	}
	
	this.delete = function(topic)
	{
		return TopicAPI.remove(topic._id);
	}
}