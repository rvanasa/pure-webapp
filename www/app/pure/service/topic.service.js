module.exports = function TopicService(API, Cache, UserService)
{
	var TopicAPI = API.service('topics');
	
	Object.assign(this, Cache(
		id => TopicAPI.get(id),
		topic => UserService.register(topic.user)
	));
	
	this.delete = function(topic)
	{
		return TopicAPI.remove(topic._id);
	}
}