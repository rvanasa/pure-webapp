module.exports = function(Model, Database, MoneyProp, SessionModel)
{
	var reasons = {
		paypal: {
			to: true,
			validate(data)
			{
				return data.startsWith('PAY-');
			},
		},
		stellar: {
			to: true,
			validate(data)
			{
				return data.length === 56;
			},
		},
		escrow: {
			to: true,
			from: true,
			validate(data)
			{
				return Database.base.Types.ObjectId.isValid(data);
			},
		},
		session: {
			to: true,
			from: true,
			validate(data)
			{
				return Database.base.Types.ObjectId.isValid(data);
			},
		},
	};
	
	return Model('Transaction')
		.prop('to', 'User').opt().validate(validateUser('to'), 'Receiver must match reason constraints')
		.prop('from', 'User').opt().validate(validateUser('from'), 'Sender must match reason constraints')
		.prop('amount', null, MoneyProp).validate(val => val > 0, '{VALUE} must be a positive number')
		.prop('reason', String).enum(...Object.keys(reasons))
		.prop('data', String).validate(validateData, '{VALUE} is invalid for tx reason')
		.prop('reverted', Boolean).default(false)
		.build(Database);
	
	function validateUser(key)
	{
		return function(user)
		{
			return !!user === !!reasons[this.reason][key];
		}
	}
	
	function validateData(data)
	{
		return data && reasons[this.reason].validate(data);
	}
}
