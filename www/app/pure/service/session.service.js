var EventEmitter = require('events');

module.exports = function SessionService($window, $location, API, Socket, QueueService, TopicService, PushService, UserService, WalletService)
{
	var SessionAPI = API.service('sessions');
	
	this.events = new EventEmitter();
	
	// TODO join on WebRTC connection established
	this.events.on('join', () => this.sendAction('join'));
	$window.addEventListener('beforeunload', () =>
	{
		if(this.current)
		{
			this.sendAction('leave');
		}
	});
	
	this.pending = null;
	this.current = null;
	
	function populate(session)
	{
		return Promise.all([
			TopicService.get(session.topic)
				.then(topic => session.topic = topic),
			...session.students.map((id, index) => UserService.get(id)
				.then(user => session.students[index] = user)),
			...session.actions.map(populateAction),
		]).then(() =>
		{
			return UserService.get(session.teacher)
				.then(user => session.teacher = user);
		}).then(() => session);
	}
	
	function populateAction(action)
	{
		return UserService.get(action.user)
			.then(user =>
			{
				action.user = user;
				return action;
			});
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
			
			this.events.emit('join', session);
		});
	});
	
	Socket.on('session.end', id =>
	{
		var session = this.current;
		var prevPending = this.pending;
		this.pending = null;
		this.current = null;
		PushService.createIfAway(prevPending ? `${prevPending.teacher.name} isn\'t ready at the moment.` : `The session has ended.`);
		
		if(session)
		{
			this.events.emit('leave', session);
		}
	});
	
	Socket.on('session.time', ({duration}) =>
	{
		console.log('TIME', duration)//
		
		this.current.duration = duration;
		this.current.durationReceived = new Date();
	});
	
	Socket.on('session.action', action =>
	{
		var onAction = () =>
		{
			populateAction(action)
				.then(() =>
				{
					this.current.actions.push(action);
					this.events.emit('action', action.key, action.user);
					this.events.emit('action.' + action.key, action.user);
				});
		}
		
		if(this.current)
		{
			onAction();
		}
		else
		{
			this.events.once('join', ({_id}) =>
			{
				if(_id === action.session)
				{
					onAction();
				}
			});
		}
	});
	
	QueueService.events.on('session', session =>
	{
		populate(session).then(() =>
		{
			if(!session.begin)
			{
				this.pending = session;
			}
			else
			{
				this.current = session;
				$location.path('/session');
				
				this.events.emit('join', session);
			}
		});
	});
	
	this.events.on('action.join', user =>
	{
		console.log('JOIN',user._id)//
		
		var available = this.current.available;
		if(!available.includes(user._id))
		{
			available.push(user._id);
		}
		if(available.length === this.current.students.length + 1)
		{
			this.current.paused = false;
		}
		
		console.log(available)
	});
	
	this.events.on('action.leave', user =>
	{
		console.log('LEAVE',user._id)//
		
		var available = this.current.available;
		if(available.includes(user._id))
		{
			available.splice(available.indexOf(user._id), 1);
		}
		if(available.length !== this.current.students.length + 1)
		{
			this.current.paused = true;
		}
		
		console.log(available)
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
		
		WalletService.checkFundsForTopic(topic)
			.then(sufficient =>
			{
				if(!sufficient)
				{
					$location.path('/fund/' + topic._id);
					return;
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
	
	this.sendAction = function(key, data)
	{
		if(!this.current)
		{
			return Promise.reject(new Error('No session available for action'));
		}
		
		return SessionAPI.patch(this.current._id, {key, data});
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
}