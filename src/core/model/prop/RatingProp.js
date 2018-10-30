module.exports = function()
{
	return {
		type: Number,
		validate: {
			validator(val)
			{
				return val >= 1 && val <= 5 && Number.isInteger(val);
			},
			message: `{PATH} must be a 1-5 rating`,
		},
	};
}