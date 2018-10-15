module.exports = function(Auth, Config)
{
	if(!Config.provider.google.id)
	{
		throw new Error('`provider.google.id` required for one-tap authentication');
	}
	
	return (req, res, next) =>
	{
		if(req.isAuthenticated())
		{
			if(!req.session.redirectURL) return next();
			
			var url = req.session.redirectURL;
			req.session.redirectURL = null;
			res.redirect(url);
		}
		else
		{
			req.session.redirectURL = req.originalUrl;
			res.render('login', {
				googleId: Config.provider.google.id,
			});
		}
	}
}