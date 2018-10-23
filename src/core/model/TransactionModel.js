module.exports = function(Model, Database, MoneyProperty)
{
	var reasons = {
		paypal(data)
		{
			return data.startsWith('PAY-');
		},
		stellar(data)
		{
			return data.length === 56;
		},
	};
	
	return Model('Transaction')
		.prop('to', 'User')
		.prop('from', 'User').opt()
		.prop('amount', null, MoneyProperty).validate(val => val > 0, '{VALUE} cannot be zero')
		.prop('reason', String).enum(...Object.keys(reasons)).opt()
		.prop('data', String).opt().validate(validateData, '{VALUE} does not match tx reason')
		.build(Database);
	
	function validateData(data)
	{
		return this.reason ? data && reasons[this.reason](data) : !data;
	}
}
