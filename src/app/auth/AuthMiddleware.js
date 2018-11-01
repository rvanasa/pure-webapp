module.exports = function(Auth, Config, ClientConfig)
{
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
			// TODO only add redirectURL if on webapp path/////
			
			req.session.redirectURL = req.originalUrl;
			if(req.originalUrl === '/')
			{
				res.render('login', {
					config: ClientConfig,
				});
			}
			else
			{
				res.redirect('/login');
			}
		}
	}
}