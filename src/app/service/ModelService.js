module.exports = function()
{
	function getFilter(filter, id)
	{
		if(arguments.length > 1)
		{
			filter._id = id;
		}
		return filter;
	}
	
	function ensureResult(result)
	{
		if(!result)
		{
			throw 'Not found';
		}
		return result;
	}
	
	return (Model) => ({
		async find({filter, select, options})
		{
			return await Model.find(getFilter(filter), select, options).lean();
		},
		async get(id, {filter, select, options})
		{
			return ensureResult(await Model.findOne(getFilter(filter, id), select, options).lean());
		},
		async create(data, {options})
		{
			var result = ensureResult(await Model.create(data, options));
			return result._id;
		},
		async update(id, data, {filter, options})
		{
			ensureResult(await Model.updateOne(getFilter(filter, id), data, options));
			return 'Updated';
		},
		async remove(id, {filter})
		{
			ensureResult(await Model.deleteOne(getFilter(filter, id)));
			return 'Removed';
		},
	});
}