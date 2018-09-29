module.exports = function(Hooks)
{
	return Hooks('limit', (n) => ({
		before: {
			all({params})
			{
				params.options.limit = n;
			},
		},
	}));
}