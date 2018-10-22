module.exports = function(WhiteboardService)
{
	return {
		restrict: 'A',
		link($scope, $elem, $attrs)
		{
			WhiteboardService.setBoard($elem[0]);
		}
	};
}