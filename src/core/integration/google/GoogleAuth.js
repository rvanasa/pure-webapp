var {callbackify} = require('util');

var GoogleStrategy = require('passport-google-oauth2').Strategy;

module.exports = function(UserModel, GoogleAccountModel)
{
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
				access: accessToken,
				refresh: refreshToken,
				email: profile.emails[0].value,
			});
			
			Object.assign(user, {
				email: user.email || account.email,
				displayName: profile.displayName,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				// iconURL: profile.image ? profile.image.url.replace(/\?sz=[0-9]+$/, '?sz=256') : null,
			});
			
			[await user.save(), await account.save()];
			
			return user;
		}));
	}
}