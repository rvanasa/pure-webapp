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
	});
	
	PeerService.events.on('receive', (packet, respond) =>
	{
		if(board)
		{
			board.packet(packet);
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
			
			function send(packet)
			{
				PeerService.events.emit('send', packet);
			}
			
			if(newBoard)
			{
				board.on('add', path => send({add: [path]}));
				board.on('remove', path => send({remove: [path.id]}));
				board.on('clear', () => send({clear: true}));
			}
			
			if(SessionService.current)
			{
				
				
				$scope.$on('$destroy', () =>
				{
					
				});
			}
		}
	};
}