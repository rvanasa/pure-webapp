var whiteboard = require('../../../whiteboard');

module.exports = function DrawTool($timeout)
{
	var boardResolve;
	var boardPromise = new Promise(resolve =>
	{
		boardResolve = resolve;
	});
	
	return {
		id: 'draw',
		icon: 'chalkboard',
		onConfig(options)
		{
			options.storage = this.service.storage;
			options.storageKey = 'session.draw';
			
			this.getBoard()
				.then(board =>
				{
					board.on('data', packet => this.sendPacket(packet));
				});
		},
		getBoard()
		{
			return boardPromise;
		},
		setBoard(elem)
		{
			var board = whiteboard(elem, this.options);
			
			this.service.getOptions(this.id).handle = board;
			
			if(boardResolve)
			{
				boardResolve(board);
				boardResolve = null;
			}
			boardPromise = Promise.resolve(board);
		},
		onRestart()
		{
			this.getBoard()
				.then(board => board.clear());
		},
		onPeer(peer)
		{
			this.getBoard()
				.then(board =>
				{
					this.sendPacket({
						add: board.paths,
					}, peer);
				});
		},
		onPeerLeave(peer)
		{
			this.getBoard()
				.then(board => board.clear(peer));
		},
		onPacket(packet, peer)
		{
			this.getBoard()
				.then(board => board.data(packet, peer));
		},
	};
}