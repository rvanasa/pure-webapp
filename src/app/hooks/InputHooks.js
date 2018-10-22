module.exports = function(Hooks)
{
	return Hooks('input', (modify) => ({
		after: {
			async all(context)
			{
				if(context.data)
				{
					await modify(context.data, context);
				}
			},
		},
	}));
}