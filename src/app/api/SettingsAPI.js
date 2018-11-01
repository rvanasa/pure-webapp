var moment = require('moment');

module.exports = function(Logger, API, Endpoint, ModelEndpoint, Hooks, UserModel, UserView)
{
	return Endpoint('settings')
		.add('update', async (key, {value}, {user}) =>
		{
			if(key === 'displayName')
			{
				if(!value || value.length < 3)
				{
					throw 'That display name is too short!';
				}
				if(value.length > 20)
				{
					throw 'That display name is too long!';
				}
			}
			else if(key === 'birthdate')
			{
				if(!value)
				{
					throw 'Please enter a valid birthdate.';
				}
				
				var age = moment().diff(value, 'years');
				if(age > 120)
				{
					throw `We are impressed that a ${age}-year-old is trying to use this app.`;
				}
				if(age < 5)
				{
					throw `Please double-check your birth year.`;
				}
			}
			else
			{
				throw `Invalid key: ${key}`;
			}
			
			var prev = user[key];
			user[key] = value;
			
			await user.save();
			
			Logger.info('settings.change', {
				user: user._id,
				key,
				value,
				prev,
			});
			
			return 'Updated';
		})
		.hooks(Hooks.view(UserView))
		.build(API);
}