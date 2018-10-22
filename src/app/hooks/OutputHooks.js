module.exports = function(Hooks)
{
	return Hooks('output', (modify) => ({
		after: {
			async get(context)
			{
				await modify(context.result, context);
			},
			async find(context)
			{
				await Promise.all(context.result.map((elem, i) => modify(elem, context, i)));
			},
		},
	}));
}