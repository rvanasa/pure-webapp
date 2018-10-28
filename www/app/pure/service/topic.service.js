module.exports = function TopicService(API, Cache, UserService)
{
	var TopicAPI = API.service('topics');
	
	Object.assign(this, Cache(
		id => TopicAPI.get(id),
		topic => !topic.user.displayName /*TEMP*/ && UserService.register(topic.user),
	));
	
	var userCache = Cache(id => TopicAPI.find(id ? {query: {user: id}} : null));
	
	this.findByUser = function(id)
	{
		return userCache.get(id)
			.then(results =>
			{
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