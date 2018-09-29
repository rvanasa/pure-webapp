module.exports = function($timeout)
{
	return {
		restrict: 'A',
		link($scope, $elem, $attrs)
		{
			if ($attrs.focusIf)
			{
				$scope.$watch($attrs.focusIf, focus);
			}
			else
			{
				focus(true);
			}
			function focus(condition)
			{
				if(condition)
				{
					$timeout(() => $elem.focus(), $scope.$eval($attrs.focusDelay));
				}
			}
		}
	};
}