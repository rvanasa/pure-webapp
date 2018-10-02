module.exports = function Cache()
{
	return (find, onRegister) => ({
		cache: {},
		get(id)
		{
			if(this.cache.hasOwnProperty(id))
			{
				return Promise.resolve(this.cache[id]);
			}
			
			return Promise.resolve(find(id))
				.then(topic => this.register(topic));
		},
		register(obj)
		{
			this.cache[obj._id] = obj;
			if(onRegister)
			{
				onRegister(obj);
			}
			return obj;
		},
	});
}