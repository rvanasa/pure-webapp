module.exports = function FavoriteService(API, Alert, TopicService)
{
	var FavoriteAPI = API.service('favorites');
	
	this.favorites = [];
	
	var promise = FavoriteAPI.find()
		.then(results =>
		{
			this.favorites.push(...results);
			for(var topic of results)
			{
				TopicService.register(topic);
			}
			return this.favorites;
		});
	
	this.request = function()
	{
		return promise;
	}
	
	this.has = function(topic)
	{
		return topic && this.favorites.some(f => f._id === topic._id);
	}
	
	this.toggle = function(topic)
	{
		if(!topic)
		{
			return;
		}
		
		var index = this.favorites.indexOf(this.favorites.find(f => f._id === topic._id));
		if(index > -1)
		{
			return FavoriteAPI.remove(topic._id)
				.then(() =>
				{
					this.favorites.splice(index, 1);
					Alert.toast(`Removed from favorites.`, null, 'info');
				});
		}
		else if(topic)
		{
			this.favorites.push(topic);
			return FavoriteAPI.create({topic: topic._id})
				.then(() =>
				{
					Alert.toast(`Added to favorites.`, null, 'info');
				})
				.catch(err =>
				{
					this.favorites.splice(this.favorites.indexOf(topic, 1));
					throw err;
				});
		}
		return Promise.resolve();
	}
}