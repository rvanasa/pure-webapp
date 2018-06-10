module.exports = function($timeout)
{
	return {
		restrict: 'A',
		link($scope, $elem, $attrs)
		{
			$elem.bind('touchstart', evt =>
			{
				$scope.longPress = true;
				$timeout(() =>
				{
					if($scope.longPress)
					{
						$scope.$apply(() => $scope.$eval($attrs.onLongPress));
					}
				}, 500);
			});
			
			$elem.bind('touchend', evt =>
			{
				$scope.longPress = false;
				if($attrs.onTouchEnd)
				{
					$scope.$apply(() => $scope.$eval($attrs.onTouchEnd));
				}
			});
		}
	};
}