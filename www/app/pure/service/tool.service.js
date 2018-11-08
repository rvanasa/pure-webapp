module.exports = function ToolService(SessionService, PeerService, DrawTool, TextTool)
{
	this.storage = sessionStorage;
	
	var latestKey = 'session.latest';
	
	this.tools = [DrawTool, TextTool];
	
	var colors = ['#000', '#FFF', '#59F', '#7F7', '#F68'];
	
	this.options = {
		draw: {
			colors,
			background: '#343A40',
			remoteAlpha: .5,
			cursor: {
				color: colors[1],
			},
		},
		text: {
			
		},
	};
	
	this.getTool = function(id)
	{
		var tool = this.tools.find(tool => tool.id === id);
		if(!tool)
		{
			throw new Error(`Tool not found with id: ${id}`);
		}
		return tool;
	}
	
	this.getOptions = function(id)
	{
		if(!this.options.hasOwnProperty(id))
		{
			throw new Error(`Options not found for ${id}`);
		}
		// return Object.assign({}, commonOptions, this.options[id]);
		return this.options[id];
	}
	
	this.notifyAll = function(key, ...args)
	{
		for(var tool of this.tools)
		{
			this.notify(tool, key, ...args);
		}
	}
	
	this.notify = function(tool, key, ...args)
	{
		if(typeof tool === 'string')
		{
			tool = this.getTool(tool);
		}
		
		if(tool[key])
		{
			tool[key](...args);
		}
	}
	
	for(var tool of this.tools)
	{
		Object.assign(tool, {
			options: Object.assign(tool.options || {}, this.getOptions(tool.id)),
			service: this,
			sendPacket(data, peer)
			{
				return this.service.sendPacket(this, data, peer);
			},
		});
		this.notify(tool, 'onConfig', tool.options, tool.service);
	}
	
	PeerService.events.on('peer', peer =>
	{
		this.notifyAll('onPeer', peer);
	});
	
	PeerService.events.on('peer.leave', peer =>
	{
		this.notifyAll('onPeerLeave', peer);
	});
	
	PeerService.events.on('receive', (packet, peer) =>
	{
		if(!peer)
		{
			console.warn('No peer specified');
		}
		
		if(Array.isArray(packet))
		{
			var [id, value] = packet;
			this.notify(id, 'onPacket', value, peer);
		}
	});
	
	SessionService.events.on('join', session =>
	{
		if(this.storage[latestKey] !== session._id)
		{
			this.notifyAll('onRestart', session);
		}
		this.storage[latestKey] = session._id;
		this.notifyAll('onConnect', session);
	});
	
	SessionService.events.on('leave', session =>
	{
		delete this.storage[latestKey];
	});
	
	this.sendPacket = function(tool, packet, peer)
	{
		PeerService.events.emit('send', [typeof tool === 'string' ? tool : tool.id, packet], peer);
	}
}