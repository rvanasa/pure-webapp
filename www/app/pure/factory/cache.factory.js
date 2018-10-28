module.exports = function Cache()
{
	return (find, onRegister) => ({
		cache: {},
		get(id)
		{
			if(this.cache.hasOwnProperty(id))
			{
				return this.cache[id];
			}
			
			return this.cache[id] = Promise.resolve(find(id))
				.then(topic => this.register(topic));
		},
		register(obj)
		{
			this.cache[obj._id] = Promise.resolve(obj);
			if(onRegister)
			{
				onRegister(obj);
			}
			return obj;
		},
	});
}