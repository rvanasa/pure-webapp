module.exports = function(Hooks)
{
	return Hooks('output', (modify) => ({
		after: {
			get(context)
			{
				modify(context.result, context);
			},
			find(context)
			{
				for(var i = 0; i < context.result.length; i++)
				{
					modify(context.result[i], context, i);
				}
			},
		},
	}));
}