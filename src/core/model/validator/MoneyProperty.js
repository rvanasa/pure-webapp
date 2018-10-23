module.exports = function()
{
	var maxMoney = Math.pow(2, 63);
	
	return {
		type: Number,
		validate: {
			validator(val)
			{
				return val >= 0 && val < maxMoney && Number.isInteger(val);
			},
			message: `{PATH} must be a valid currency amount`,
		},
	};
}