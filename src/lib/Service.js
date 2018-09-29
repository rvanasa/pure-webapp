module.exports = function()
{
	class Service
	{
		constructor(name, methods, hooksArray)
		{
			this.name = name;
			this.methods = methods || {};
			this.hooksArray = hooksArray || [];
		}
		
		add(id, fn)
		{
			if(typeof id === 'object')
			{
				Object.assign(this.methods, id);
			}
			else
			{
				this.methods[id] = fn;
			}
			return this;
		}
		
		remove(...methods)
		{
			for(var id of methods)
			{
				this.methods[id] = null;
			}
			return this;
		}
		
		only(...methods)
		{
			for(var id of Object.keys(this.methods))
			{
				if(!methods.includes(id))
				{
					this.remove(id);
				}
			}
			return this;
		}
		
		hooks(...hooks)
		{
			this.hooksArray.push(...hooks);
			return this;
		}
		
		build(api)
		{
			api.use(this.name, this.methods);
			var service = api.service(this.name);
			for(var hook of this.hooksArray)
			{
				service.hooks(hook);
			}
			return service;
		}
	}
	
	return (name, methods, filters) => new Service(name, methods, filters);
}