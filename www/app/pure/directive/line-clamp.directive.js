var $clamp = window.$clamp;

module.exports = function($timeout)
{
	return {
		restrict: 'A',
		link($scope, $elem, $attrs)
		{
			var lines = +$attrs.lineClamp;
			
			clamp();
			if($attrs.ngBind)
			{
				$scope.$watch($attrs.ngBind, clamp);
			}
			
			function clamp()
			{
				$timeout(() => $clamp($elem[0], {clamp: lines}), 0, false);
			}
		},
	};
}