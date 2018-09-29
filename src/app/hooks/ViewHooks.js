module.exports = function(Hooks)
{
	function rename(result, view)
	{
		for(var key in view)
		{
			var value = view[key];
			if(typeof value === 'string')
			{
				result[value] = result[key];
				delete result[key];
			}
			else if(typeof value === 'object' && result[key])
			{
				rename(result[key], view[key]);
			}
		}
	}
	
	function unname(data, view)
	{
		for(var key in view)
		{
			var value = view[key];
			if(typeof value === 'string')
			{
				data[key] = data[value];
				delete data[value];
			}
			else if(typeof value === 'object' && key in data)
			{
				rename(data[key], view[key]);
			}
		}
	}
	
	return Hooks('view', (view) => ({
		before: {
			all({method, data, params})
			{
				if(method === 'find' || method === 'get')
				{
					Object.assign(params.select, view);
					for(var key in view)
					{
						if(typeof view[key] === 'object')
						{
							delete params.select[key];
							if(!params.options.populate)
							{
								params.options.populate = [];
							}
							params.options.populate.push({path: key, select: view[key]});
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
			find(context)
			{
				for(var r of context.result)
				{
					rename(r, view);
				}
			},
			get(context)
			{
				rename(context.result, view);
			},
		},
	}));
}