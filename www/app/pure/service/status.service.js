module.exports = function StatusService($window, $interval, API)
{
	var spacing = 60;
	
	var StatusAPI = API.service('status');
	
	function notify(available)
	{
		StatusAPI.create({available});
	}
	
	// notify(true);
	// $interval(() => notify(true), 1000 * spacing, 0, false);
	// $window.addEventListener('beforeunload', () => notify(false));
	
	this.status = function(user)
	{
		// if(!user || +new Date(user.lastOnline) + 1000 * (spacing + 10) < Date.now())
		// {
		// 	return 'offline';
		// }
		// return user.available ? 'available' : 'busy';
		
		return user && user.available ? 'available' : 'offline';
	}
}