var EventEmitter = require('events');
var Peer = require('simple-peer');

module.exports = function PeerService($window, Socket)
{
	Peer.config.iceServers.push({
		url: 'turn:pure-rvanasa.c9users.io:8081', // TODO pass from server
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
	
	var audioStream;
	function getAudioStream()
	{
		if(audioStream)
		{
			return Promise.resolve(audioStream);
		}
		
		return $window.navigator.mediaDevices.getUserMedia({audio: true})
			.then(stream => audioStream = stream);
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
	
	this.connect = function()
	{
		debug('ID', Socket.id);
		
		Socket.emit('signal.ready');
	}
	
	this.disconnect = function(peer)
	{
		if(!arguments.length)
		{
			for(peer of [...Object.values(this.inbound), ...Object.values(this.outbound)])
			{
				this.disconnect(peer);
			}
		}
		else if(peer)
		{
			try
			{
				peer.send(JSON.stringify({_close: true}));
			}
			catch(e)
			{
				console.error(e);
			}
			peer.destroy();
		}
	}
	
	this.createPeer = function(id, initiator)
	{
		debug('CREATE', id, initiator);
		
		var peer = new Peer({
			initiator,
			// stream: /*initiator && */audioStream,
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
		
		// getAudioStream()
		// 	.then(stream =>
		// 	{
		// 		console.log('add',stream);
		// 		peer.addStream(stream);
		// 	});
		
		return peer;
	}
}