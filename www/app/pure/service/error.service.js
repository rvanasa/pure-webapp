var sentry = require('@sentry/browser');

var UserData = window.UserData;
var ClientConfig = window.ClientConfig;

var config = ClientConfig.provider.sentry;
if(config)
{
	sentry.init({
		dsn: config.dsn,
	});
	sentry.configureScope(scope =>
	{
		scope.setUser({
			name: UserData.displayName,
			email: UserData.email,
		});
	});
}

module.exports = function ErrorService()
{
	
}