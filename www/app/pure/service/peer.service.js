var EventEmitter = require('events');
var Peer = require('simple-peer');
var freeice = require('freeice');

module.exports = function PeerService($window, Socket)
{
	this.events = new EventEmitter();
	
	this.outbound = {};
	this.inbound = {};
	
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
		var peer = peers[id];
		if(!peer)
		{
			// if(initiator)
			// {
				peer = this.createPeer(id, !initiator);
			// }
			// else
			// {
				// this.connect();/////
				// return;
			// }
		}
		peer.signal(signal);
	});
	
	this.connect = function()
	{
		debug('ID', Socket.id);
		
		Socket.emit('signal.ready');
	}
	
	this.createPeer = function(id, initiator)
	{
		debug('CREATE', id, initiator);
		
		var peer = new Peer({
			initiator,
			stream: /*initiator && */audioStream,
			options: {
				iceServers: freeice(),
			},
			reconnectTimer: 5000,
			trickle: false,
		});
		
		var peers = initiator ? this.outbound : this.inbound;
		if(peers[id])
		{
			console.warn('Replace:',peers[id])///
			peers[id].destroy();
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
			debug('DATA', String(data));
			
			this.events.emit('receive', JSON.parse(data), doSend);
		});
		
		this.events.on('send', doSend);
		
		peer.on('close', data =>
		{
			debug('CLOSE');
			
			var peers = initiator ? this.outbound : this.inbound;
			delete peers[id];
			this.events.removeListener(doSend);
		});
		
		function doSend(packet)
		{
			peer.send(JSON.stringify(packet));
		}
		
		if(initiator)///?
		{
			getAudioStream()
				.then(stream =>
				{
					console.log('add',stream);
					peer.addStream(stream);
				});
		}
		
		return peer;
	}
}