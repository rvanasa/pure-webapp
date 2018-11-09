module.exports = function(Model, Database)
{
	var keys = ['join', 'leave', 'screenshot', 'chat'];
	
	return Model('SessionAction')
		.prop('session', 'Session')
		.prop('user', 'User')
		.prop('key', String).enum(...keys)
		.prop('data', String).opt().validate(validateData)
		.build(Database);
	
	function validateData(val)
	{
		if(this.key === 'screenshot')
		{
			// TODO store screenshot URL
			return !!val;
		}
		else if(this.key === 'chat')
		{
			return !!val;
		}
		else
		{
			return val == null;
		}
	}
}
