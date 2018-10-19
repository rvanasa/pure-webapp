module.exports = function(Hooks)
{
	return Hooks('owned', (id, config = {}) => ({
		before: {
			all({method, params, data})
			{
				if(config.public)
				{
					if(method === 'get' || (method === 'find' && !params.user))
					{
						return;
					}
				}
				
				var userID = (config.public && method === 'find' && params.query.user) || params.user._id;
				
				params.filter[id] = userID;
				if(data)
				{
					data[id] = userID;
				}
			},
		},
	}));
}