module.exports = function()
{
	return function(Model, list, syncList)
	{
		var syncMap = {};
		for(var i = 0; i < list.length; i++)
		{
			var entry = list[i];
			if(entry.sync)
			{
				syncMap[entry.sync] = entry;
			}
		}
		
		return Promise.all(syncList.map(value =>
		{
			var entry = syncMap[value.sync];
			if(entry)
			{
				Object.assign(entry, value);
				// Model.update(entry);
			}
			else
			{
				return Model.create(value)
					.then(value => list.push(value));
			}
		}));
	}
}