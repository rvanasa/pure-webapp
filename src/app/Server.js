module.exports = function(App, Config)
{
	return App.listen(Config.server.port || process.env.PORT || 80);
}