module.exports = function SessionService($timeout, $location)
{
	this.request = function(topic)
	{
		this.pending = {
			user: 'me',
			topic,
			outbound: true,
		};
		$timeout(() =>
		{
			this.pending = null;
			this.current = {
				startTime: Date.now(),
				topic,
			};
			$location.path('/session');
		}, 2000);
	}
	
	this.close = function()
	{
		if(this.current)
		{
			this.current = null;
			
			// BannerService.addInfo('The session has ended.');
		}
	}
}