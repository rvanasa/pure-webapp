var EventEmitter = require('events');
var Peer = require('simple-peer');
var notepack = require('notepack.io');

module.exports = function PeerService($window, Config, Socket, SessionService, Alert)
{
	var config = Config.turn;
	
	Peer.config.iceServers.push({
		urls: config.url,
		username: 'pure',
		credential: 'pass',
	});
	
	this.events = new EventEmitter();
	
	this.outbound = {};
	this.inbound = {};
	
	// setInterval(() => console.log(this.outbound, this.inbound), 2000)///
	
	function debug(...args)
	{
		console.log(...args);
	}
	
	var packetPeers = new Set();
	Socket.on('packet', (packet, id) => this.events.emit('receive', packet, id));
	Socket.on('packet.peer', (id, isNotify) =>
	{
		if(!packetPeers.has(id))
		{
			this.events.emit('peer', id);
		}
		packetPeers.add(id);
		if(!isNotify)
		{
			Socket.emit('packet.notify', id);
		}
	});
	Socket.on('packet.leave', id =>
	{
		this.events.emit('peer.leave', id);
		packetPeers.delete(id);
	});
	
	this.events.on('send', (packet, peer) => Socket.emit('packet', packet, peer));
	SessionService.events.on('join', session => Socket.emit('packet.ready'));
	
	// SessionService.events.on('join', session => this.connect());
	SessionService.events.on('leave', session => this.disconnect());
	
	Socket.on('signal.peer', ({id, initiator}) =>
	{
		this.createPeer(id, initiator);
	});
	
	Socket.on('signal', ({id, signal, initiator}) =>
	{
		debug('SIG', id, initiator);
		
		var peers = initiator ? this.outbound : this.inbound;
		Promise.resolve(peers[id] || this.createPeer(id, initiator))
			.then(peer => peer.signal(signal));
	});
	
	$window.addEventListener('beforeunload', () => this.disconnect());
	
	this.getPeers = function()
	{
		return [...Object.values(this.inbound), ...Object.values(this.outbound)];
	}
	
	this.connect = function()
	{
		debug('ID', Socket.id);
		
		Socket.emit('signal.ready');
	}
	
	this.disconnect = function(peer)
	{
		if(!arguments.length)
		{
			for(peer of this.getPeers())
			{
				this.disconnect(peer);
			}
		}
		else if(peer)
		{
			try
			{
				peer.send(notepack.encode('close'));
				peer.destroy();
			}
			catch(e)
			{
				console.error(e);
			}
		}
	}
	
	this.createPeer = function(id, initiator)
	{
		return loadingPromise.then(() =>
		{
			debug('CREATE', id, initiator);
			
			var peer = new Peer({
				initiator,
				stream: /*!initiator && */audioStream,
			});
			
			var peers = initiator ? this.outbound : this.inbound;
			if(peers[id])
			{
				console.warn('Replace:', peers[id])///
				this.disconnect(peers[id]);
			}
			peers[id] = peer;
			
			peer.on('signal', signal =>
			{
				Socket.emit('signal', {id, signal, initiator});
			});
			
			peer.on('connect', () =>
			{
				debug('CONNECT');
				
				// this.events.emit('peer', peer._id);
				// peer.on('close', () => this.events.emit('peer.leave', peer._id));
			});
			
			peer.on('stream', stream =>
			{
				debug('STREAM', stream);
				stream.oninactive = () => debug('INACTIVE');
				
				var audio = new Audio();
				audio.autoplay = true;
				audio.srcObject = stream;
				
				peer.send(notepack.encode('audio'));
				
				// doSend({_stream: id});
			});
			
			peer.on('data', data =>
			{
				// debug('DATA', String(data));
				
				var packet = notepack.decode(data);
				if(packet === 'close')
				{
					peer.destroy();
				}
				else if(packet === 'audio')
				{
					this.events.emit('audio');
				}
				else
				{
					// this.events.emit('receive', packet, peer._id);
				}
			});
			
			peer.on('error', err =>
			{
				console.error(err);
				Alert(`*Development intensifies*`, `
					For highly complicated technical reasons, certain grumpy networks have trouble transmitting session data.
					We can usually work around this for you, but our backup servers are currently at full capacity.
					Sorry for the inconvenience! Please try refreshing the page.
				`, 'error');
				require('@sentry/browser').captureException(err);
			});
			
			// this.events.on('send', doSend);
			
			peer.on('close', data =>
			{
				debug('CLOSE');
				
				var peers = initiator ? this.outbound : this.inbound;
				delete peers[id];
				// this.events.removeListener('send', doSend);
			});
			
			// function doSend(packet, receiver)
			// {
			// 	if(receiver && receiver !== peer._id)
			// 	{
			// 		return;
			// 	}
				
			// 	try
			// 	{
			// 		peer.send(notepack.encode(packet));
			// 	}
			// 	catch(e)
			// 	{
			// 		console.error(e);
			// 	}
			// }
			
			return peer;
		});
	}
	
	var audioStream = null;
	var loadingPromise = Promise.resolve();
	
	this.enableAudio = function()
	{
		if(audioStream)
		{
			for(var track of audioStream.getTracks())
			{
				track.enabled = true;
			}
			
			return Promise.resolve();
		}
		
		return loadingPromise = $window.navigator.mediaDevices.getUserMedia({audio: true})
			.then(stream =>
			{
				audioStream = stream;
				
				console.log('stream', audioStream);
				// for(var peer of this.getPeers())
				// {
				// 	if(!peer.streams.includes(audioStream))
				// 	{
				// 		peer.addStream(audioStream);
				// 	}
				// }
				
				this.connect();
			})
			.catch(() =>
			{
				console.warn('Failed to load audio');
			});
	}
	
	this.disableAudio = function()
	{
		if(!audioStream)
		{
			return Promise.resolve();
		}
		
		for(var track of audioStream.getTracks())
		{
			// track.stop();
			track.enabled = false;
		}
		// for(var peer of this.getPeers())
		// {
		// 	if(peer.streams.includes(audioStream))
		// 	{
		// 		peer.removeStream(audioStream);
		// 	}
		// }
		// audioStream = null;
		
		return Promise.resolve();
	}
}