module.exports = function($window)
{
	var Notification = $window.Notification;
	if(!Notification)
	{
		console.log('Your browser does not support browser notifications.');
		return;
	}
	
	if(Notification.permission !== 'granted')
	{
		Notification.requestPermission(perm =>
		{
			if(perm === 'granted')
			{
				
			}
		});
	}
	
	// function startNotifications()
	// {
		
	// }
}