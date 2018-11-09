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
				.then(obj => this.register(obj, id));
		},
		register(obj, id)
		{
			this.cache[arguments.length >= 2 ? id : obj._id] = Promise.resolve(obj);
			if(onRegister)
			{
				onRegister(obj);
			}
			return obj;
		},
	});
}