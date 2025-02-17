module.exports = function TopicService(API, Cache, UserService)
{
	var TopicAPI = API.service('topics');
	var SearchAPI = API.service('search');
	
	Object.assign(this, Cache(
		id => TopicAPI.get(id),
		topic => topic.user && UserService.register(topic.user),
	));
	
	var userCache = Cache(id => TopicAPI.find({query: {user: id}}));
	
	this.search = function(query)
	{
		return SearchAPI.find({query});
	}
	
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
	
	this.create = function(topic)
	{
		topic.interval = topic.interval || 0;
		
		var listPromise = userCache.get(UserService.user._id);
		
		return TopicAPI.create(topic)
			.then(id =>
			{
				topic._id = id;
				UserService.get(UserService.user._id)
					.then(user => topic.user = user);
				listPromise.then(results => results.push(topic));
			});
	}
	
	this.update = function(topic)
	{
		return TopicAPI.update(topic._id, Object.assign({}, topic, {
			user: topic.user._id,
		}));
	}
	
	this.delete = function(topic)
	{
		var listPromise = userCache.get(topic.user._id);
		listPromise.then(results =>
		{
			if(results.includes(topic))
			{
				results.splice(results.indexOf(topic), 1);
			}
		});
		
		return TopicAPI.remove(topic._id)
			.catch(err =>
			{
				listPromise.then(results => results.push(topic));
				throw err;
			});
	}
}