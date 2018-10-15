module.exports = function SessionService($location, API, Socket, TopicService, UserService, PushService, PeerService)
{
	var SessionAPI = API.service('sessions');
	
	this.pending = null;
	this.current = null;
	
	function populate(session)
	{
		return Promise.all([
			TopicService.get(session.topic)
				.then(topic => session.topic = topic),
			...session.students.map((id, index) => UserService.get(id)
				.then(user => session.students[index] = user)),
		]).then(() =>
		{
			return UserService.get(session.teacher)
				.then(user => session.teacher = user)
		}).then(() => session);
	}
	
	Socket.on('session.request', session =>
	{
		populate(session).then(() =>
		{
			this.pending = session;
			PushService.createIfAway(`Are you ready?`, {
				body: `${session.students[0].name} is requesting a session on ${session.topic.name}.`,
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
	});
	
	Socket.on('session.begin', session =>
	{
		populate(session).then(() =>
		{
			this.pending = null;
			this.current = session;
			$location.path('/session');
			PushService.createIfAway(`The session has begun!`);
			
			PeerService.connect();
		});
	});
	
	Socket.on('session.end', id =>
	{
		var prevPending = this.pending;
		this.pending = null;
		this.current = null;
		PushService.createIfAway(prevPending ? `${prevPending.teacher.name} isn\'t ready at the moment.` : `The session has ended.`);
		
		PeerService.disconnect();
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
			topic,
			teacher: topic.user,
		};
		return SessionAPI.create({topic: topic._id, request})
			.then(session => populate(session))
			.then(session => this.pending = session)
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
			Promise.all(results.map(populate)).then(() =>
			{
				for(var session of results)
				{
					if(!session.begin)
					{
						this.pending = session;
					}
					else
					{
						this.current = session;
						$location.path('/session');
						
						PeerService.connect();
					}
				}
			});
		});
}