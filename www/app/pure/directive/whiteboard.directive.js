var whiteboard = require('../../whiteboard');

module.exports = function(SessionService, PeerService)
{
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
	
	return {
		restrict: 'A',
		link($scope, $elem, $attrs)
		{
			var options = $scope.$eval($attrs.options) || {};
			var newBoard = !board;
			options.board = board;
			board = whiteboard($elem[0], options);
			
			if(newBoard)
			{
				board.on('packet', send);
			}
			
			function send(packet)
			{
				PeerService.events.emit('send', packet);
			}
		}
	};
}