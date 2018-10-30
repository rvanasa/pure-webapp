var EventEmitter = require('events');
var Peer = require('simple-peer');

module.exports = function PeerService($window, Socket, SessionService)
{
	Peer.config.iceServers.push({
		urls: 'turn:pure-rvanasa.c9users.io:8081', // TODO pass from server
		username: 'pure',
		credential: 'pass',
	});
	
	this.events = new EventEmitter();
	
	// TODO use socket event acknowledgements to simplify signaling
	
	this.outbound = {};
	this.inbound = {};
	
	// setInterval(() => console.log(this.outbound, this.inbound), 2000)///
	
	SessionService.events.on('join', session => this.connect());
	SessionService.events.on('leave', session => this.disconnect());
	
	function debug(...args)
	{
		console.log(...args);
	}
	
	Socket.on('signal.peer', ({id}) =>
	{
		this.createPeer(id, true);
	});
	
	Socket.on('signal', ({id, signal, initiator}) =>
	{
		debug('SIG', id, initiator);
		
		var peers = initiator ? this.inbound : this.outbound;
		var peer = peers[id] || this.createPeer(id, !initiator);
		peer.signal(signal);
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
				peer.send(JSON.stringify({_close: true}));
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
		debug('CREATE', id, initiator);
		
		var peer = new Peer({
			initiator,
			stream: audioStream,
			// reconnectTimer: 5000,
		});
		
		var peers = initiator ? this.outbound : this.inbound;
		if(peers[id])
		{
			console.warn('Replace:',peers[id])///
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
			
			this.events.emit('peer', peer, doSend);
		});
		
		peer.on('stream', stream =>
		{
			debug('STREAM', stream);
			stream.oninactive = () => debug('INACTIVE');
			
			var audio = new Audio();
			audio.autoplay = true;
			audio.srcObject = stream;
			
			// doSend({_stream: id});
		});
		
		peer.on('data', data =>
		{
			// debug('DATA', String(data));
			
			var packet = JSON.parse(data);
			if(packet._close)
			{
				peer.destroy();
				return;
			}
			this.events.emit('receive', packet, peer, doSend);
		});
		
		this.events.on('send', doSend);
		
		peer.on('close', data =>
		{
			debug('CLOSE');
			
			var peers = initiator ? this.outbound : this.inbound;
			delete peers[id];
			this.events.removeListener('send', doSend);
		});
		
		function doSend(packet)
		{
			try
			{
				peer.send(JSON.stringify(packet));
			}
			catch(e)
			{
				console.error(e);
			}
		}
		
		return peer;
	}
	
	var audioStream = null;
	
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
		
		return $window.navigator.mediaDevices.getUserMedia({audio: true})
			.then(stream =>
			{
				audioStream = stream;
				
				console.log('add',audioStream);
				for(var peer of this.getPeers())
				{
					if(!peer.streams.includes(audioStream))
					{
						peer.addStream(audioStream);
					}
				}
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