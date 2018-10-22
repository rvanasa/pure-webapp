var whiteboard = require('../../whiteboard');

module.exports = function WhiteboardService(SessionService, PeerService)
{
	var storage = sessionStorage;
	var sessionKey = 'session.latest';
	
	this.options = {
		colors: ['#000', '#FFF', '#59F', '#7F7', '#F68'],
		background: '#343A40',
		board: null,
	};
	
	this.options.board = {
		remoteAlpha: .5,
		storage,
		cursor: {
			color: this.options.colors[1],
		},
	};
	
	var board;
	
	PeerService.events.on('peer', (peer, respond) =>
	{
		if(board)
		{
			respond({
				add: board.paths,
			});
		}
		
		peer.on('close', () =>
		{
			if(board)
			{
				board.clear(peer._id);
			}
		});
	});
	
	PeerService.events.on('receive', (packet, peer) =>
	{
		if(board)
		{
			board.packet(packet, peer._id);
		}
	});
	
	SessionService.events.on('join', session =>
	{
		if(storage[sessionKey] !== session._id)
		{
			this.reset();
		}
		storage[sessionKey] = session._id;
	});
	
	SessionService.events.on('leave', session =>
	{
		delete storage[sessionKey];
	});
	
	this.setBoard = function(elem)
	{
		var newBoard = !board;
		board = whiteboard(elem, this.options.board);
		
		if(newBoard)
		{
			board.on('packet', packet => this.onPacket(packet));
		}
	}
	
	this.reset = function()
	{
		if(board)
		{
			board.clear();
		}
	}
	
	this.onPacket = function(packet)
	{
		PeerService.events.emit('send', packet);
	}
}