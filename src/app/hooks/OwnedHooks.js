module.exports = function(Hooks)
{
	return Hooks('owned', (id, {public} = {}) => ({
		before: {
			all({method, params, data})
			{
				if(public)
				{
					if(method === 'get' || (method === 'find' && !params.user))
					{
						return;
					}
				}
				
				var userID = (public && method === 'find' && params.query.user) || params.user._id;
				
				params.filter[id] = userID;
				if(data)
				{
					data[id] = userID;
				}
			},
		},
	}));
}