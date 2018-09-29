module.exports = function FavoriteService(API)
{
	var FavoriteAPI = API.service('favorites');
	
	this.favorites = [];
	
	var promise = FavoriteAPI.find()
		.then(results =>
		{
			this.favorites.push(...results);
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
				.then(() => this.favorites.splice(index, 1));
		}
		else if(topic)
		{
			this.favorites.push(topic);
			return FavoriteAPI.create({topic: topic._id})
				.catch(err =>
				{
					this.favorites.splice(this.favorites.indexOf(topic, 1));
					throw err;
				});
		}
		return Promise.resolve();
	}
}