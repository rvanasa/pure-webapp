module.exports = function StatusService($window, $interval, API, UserService)
{
	var spacing = 60;
	
	var StatusAPI = API.service('status');
	
	// function notify(available)
	// {
	// 	StatusAPI.create({available});
	// }
	
	// notify(true);
	// $interval(() => notify(true), 1000 * spacing, 0, false);
	// $window.addEventListener('beforeunload', () => notify(false));
	
	this.status = function(user)
	{
		if(!user)
		{
			return 'external';
		}
		else if(user._id === UserService.user._id)
		{
			return 'self';
		}
		return user && user.available ? 'available' : 'offline';
	}
}