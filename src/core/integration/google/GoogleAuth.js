var {callbackify} = require('util');

var GoogleStrategy = require('passport-google-oauth2').Strategy;

module.exports = function(UserModel, GoogleAccountModel)
{
	function getDisplayName(name)
	{
		var parts = name.trim().split(' ');
		if(parts.length >= 2)
		{
			parts[parts.length - 1] = parts[parts.length - 1][0].toUpperCase() + '.';
		}
		return parts.join(' ');
	}
	
	return function(config)
	{
		return new GoogleStrategy({
			clientID: config.id,
			clientSecret: config.secret,
			callbackURL: config.callback,
			scope: ['profile', 'email'],
		}, callbackify(async (accessToken, refreshToken, profile) => 
		{
			profile = profile._json;
			
			var account = await GoogleAccountModel
				.findOne({profileID: profile.id})
				.populate('user');
			
			if(!account) account = new GoogleAccountModel();
			if(!account.user) account.user = new UserModel();
			
			var user = account.user;
			
			Object.assign(account, {
				profileID: profile.id,
				email: profile.emails[0].value,
				// access: accessToken,
				// refresh: refreshToken,
			});
			
			Object.assign(user, {
				email: user.email || account.email,
				displayName: user.displayName || getDisplayName(profile.displayName),
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
			});
			
			[await user.save(), await account.save()];
			
			return user;
		}));
	}
}