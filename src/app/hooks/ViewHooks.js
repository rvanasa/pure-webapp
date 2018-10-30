module.exports = function(Hooks)
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
					await rename(result[key], view[key]);
				}
			}));
	}
	
	function unname(data, view)
	{
		for(var key in view)
		{
			var value = view[key];
			if(typeof value === 'string')
			{
				data[value] = data[key];
				delete data[key];
			}
			else if(typeof value === 'function')
			{
				delete data[key];
			}
			else if(typeof value === 'object' && key in data)
			{
				unname(data[key], view[key]);
			}
		}
	}
	
	return Hooks('view', (view) => ({
		before: {
			all({method, data, params})
			{
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
					unname(data, view);
				}
			},
		},
		after: {
			async find(context)
			{
				for(var r of context.result)
				{
					await rename(r, view);
				}
			},
			async get(context)
			{
				await rename(context.result, view);
			},
		},
	}));
}