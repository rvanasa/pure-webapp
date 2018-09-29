module.exports = function InterestService(API, UserService)
{
	var InterestAPI = API.service('interests');
	
	var interests = UserService.user.interests;
	
	this.has = function(interest)
	{
		return interests.includes(interest);
	}
	
	this.add = function(interest)
	{
		if(interest)
		{
			var index = interests.indexOf(interest);
			if(index > -1)
			{
				interests.splice(index, 1);
			}
			interests.push(interest);
			
			InterestAPI.create({interest})
				.catch(err =>
				{
					if(index > -1)
					{
						interests.splice(index, 0, interest);
					}
					throw err;
				});
		}
	}
	
	this.remove = function(interest)
	{
		interests.splice(interests.indexOf(interest), 1);
		InterestAPI.remove(interest)
			.catch(err =>
			{
				interests.push(interest);
				throw err;
			});
	}
}