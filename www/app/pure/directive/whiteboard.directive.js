module.exports = function(DrawTool)
{
	return {
		restrict: 'A',
		link($scope, $elem, $attrs)
		{
			DrawTool.setBoard($elem[0]);
		}
	};
}