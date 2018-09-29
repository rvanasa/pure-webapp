module.exports = function(Hooks)
{
	return Hooks('input', (modify) => ({
		after: {
			all(context)
			{
				if(context.data)
				{
					modify(context.data, context);
				}
			},
		},
	}));
}