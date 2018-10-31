var $ = require('jquery');

module.exports = function($window, $timeout)
{
	function handleResize(editor, elem)
	{
		var lineHeight = editor.renderer.lineHeight;
		var rows = editor.getSession().getLength();
		
		$(elem).height(rows * lineHeight);
		editor.resize();
	}
	
	return {
		restrict: 'A',
		require: '?ngModel',
		scope: true,
		link(scope, elem, attrs, ngModel)
		{
			var editor = $window.ace.edit(elem[0]);
			editor.$blockScrolling = Infinity;
			
			editor.setShowPrintMargin(false);
			editor.setTheme('ace/theme/tomorrow_night_bright');
			editor.setOptions({
				fontSize: 14,
				enableBasicAutocompletion: true,
				enableLiveAutocompletion: false,
			});
			
			editor.getSession().setMode('ace/mode/javascript');
			editor.getSession().setUseWorker(false);
			
			ngModel.$render = () =>
			{
				var shouldDeselect = editor.getValue() == '';
				
				editor.setValue(ngModel.$viewValue || '');
				handleResize(editor, elem);
				
				if(shouldDeselect)
				{
					editor.selection.clearSelection();
				}
			};
			
			editor.on('change', () =>
			{
				$timeout(() =>
				{
					scope.$apply(() =>
					{
						var value = editor.getValue();
						ngModel.$setViewValue(value);
					});
				});
				handleResize(editor, elem);
			});
		}
	};
}