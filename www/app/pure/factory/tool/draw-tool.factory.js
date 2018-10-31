var whiteboard = require('../../../whiteboard');

module.exports = function DrawTool()
{
	var board;
	
	return {
		id: 'draw',
		icon: 'chalkboard',
		onConfig(options)
		{
			options.storage = this.service.storage;
		},
		setBoard(elem)
		{
			var isFirst = !board;
			board = whiteboard(elem, this.options);
			
			this.service.getOptions(this.id).handle = board;
			
			if(isFirst)
			{
				board.on('packet', packet => this.sendPacket(packet));
			}
		},
		onRestart()
		{
			if(board)
			{
				board.clear();
			}
		},
		onPeer(peer)
		{
			if(board)
			{
				this.sendPacket({
					add: board.paths,
				}, peer);
			}
			
			peer.on('close', () =>
			{
				if(board)
				{
					board.clear(peer._id);
				}
			});
		},
		onPacket(packet, peer)
		{
			if(board)
			{
				board.packet(packet, peer._id);
			}
		},
	};
}