module.exports = function(Hooks, Database)
{
	function getSelector(view)
	{
		var selector = {};
		for(var key of Object.keys(view))
		{
			var value = view[key];
			if(typeof value === 'string')
			{
				selector[value] = 1;
			}
			else if(typeof value !== 'function')
			{
				selector[key] = value;
			}
		}
		return selector;
	}
	
	async function rename(result, view)
	{
		result = Object.assign({}, result);
		return Promise.all(Object.keys(view)
			.map(async key =>
			{
				var value = view[key];
				if(typeof value === 'string')
				{
					result[key] = result[value];
					delete result[value];
				}
				else if(typeof value === 'function')
				{
					result[key] = await value.call(result, result[key]);
				}
				else if(typeof value === 'object' && result[key])
				{
					result[key] = await rename(result[key], value);
				}
			})).then(() => result);
	}
	
	function unname(data, view)
	{
		if(Database.base.Types.ObjectId.isValid(data))
		{
			console.log('---',data)///
			return data;
		}
		
		data = Object.assign({}, data);
		for(var key in view)
		{
			var value = view[key];
			if(typeof value === 'string')
			{
				data[value] = data[key];
			}
			else if(typeof value === 'function')
			{
				delete data[key];
			}
			else if(typeof value === 'object' && key in data)
			{
				data[key] = unname(data[key], value);
			}
		}
		return data;
	}
	
	return Hooks('view', (view) => ({
		before: {
			all(context)
			{
				var {method, data, params} = context;
				if(method === 'find' || method === 'get')
				{
					Object.assign(params.select, getSelector(view));
					for(var key in view)
					{
						if(typeof view[key] === 'object')
						{
							delete params.select[key];
							if(!params.options.populate)
							{
								params.options.populate = [];
							}
							params.options.populate.push({path: key, select: getSelector(view[key])});
						}
					}
				}
				else if(data)
				{
					context.data = unname(data, view);
				}
			},
		},
		after: {
			async find(context)
			{
				context.result = await Promise.all(context.result.map(r => rename(r, view)));
			},
			async get(context)
			{
				context.result = await rename(context.result, view);
			},
		},
	}));
}