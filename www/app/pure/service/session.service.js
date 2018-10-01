module.exports = function SessionService($location, API, Socket, UserService, PushService)
{
	var SessionAPI = API.service('sessions');
	
	Socket.on('session.request', session =>
	{
		this.pending = session;
		PushService.createIfAway('Are you ready?', {
			body: `___ has requested a session of ___.`,
			vibrate: [200, 200],
			// actions: [{
			// 	action: 'start',
			// 	title: 'Start Session',
			// }, {
			// 	action: 'cancel',
			// 	title: 'Cancel',
			// }],
		});
	});
	
	Socket.on('session.begin', session =>
	{
		this.pending = null;
		this.current = session;
		$location.path('/session');
		PushService.createIfAway(`The session has begun!`);
	});
	
	Socket.on('session.end', id =>
	{
		var prevPending = this.pending;
		this.pending = null;
		this.current = null;
		PushService.createIfAway(prevPending ? `${prevPending.teacher.name} isn\'t ready at the moment.` : `The session has ended.`);
	});
	
	this.request = function(topic)
	{
		return this.create(topic, true);
	}
	
	this.create = function(topic, request)
	{
		if(this.pending || this.current)
		{
			return Promise.resolve();
		}
		
		this.pending = {
			topic: topic._id,
			teacher: topic.user._id,
			outbound: request,
		};
		return SessionAPI.create({topic: topic._id, request})
			.then(result => Object.assign(this.pending, result))
			.catch(err =>
			{
				this.pending = null;
				throw err;
			});
	}
	
	this.accept = function()
	{
		if(!this.pending)
		{
			return;
		}
		
		return SessionAPI.update(this.pending._id, {});
	}
	
	this.close = function()
	{
		if(this.pending)
		{
			return SessionAPI.remove(this.pending._id);
		}
		if(this.current)
		{
			return SessionAPI.remove(this.current._id);
				// .then(() => BannerService.addInfo('The session has ended.'));
		}
	}
	
	SessionAPI.find()
		.then(results =>
		{
			for(var session of results)
			{
				if(!session.begin)
				{
					this.pending = session;
					if(UserService.user._id !== session.teacher)
					{
						session.outbound = true;
					}
				}
				else
				{
					this.current = session;
					$location.path('/session');
				}
			}
		});
}