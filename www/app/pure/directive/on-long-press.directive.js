module.exports = function($timeout)
{
	return {
		restrict: 'A',
		link($scope, $elem, $attrs)
		{
			$elem.on('touchstart', evt =>
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
			
			$elem.on('touchend', evt =>
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