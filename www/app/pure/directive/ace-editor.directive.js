var $ = require('jquery');

module.exports = function($window, $timeout, TextTool)
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
			
			if(ngModel)
			{
				ngModel.$render = () =>
				{
					// var shouldDeselect = !editor.getValue();
					
					var value = String(ngModel.$viewValue || '');
					if(value !== editor.getValue())
					{
						editor.setValue(value, 1);
					}
					handleResize(editor, elem);
					
					// if(shouldDeselect)
					// {
					// 	editor.selection.clearSelection();
					// }
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
			
			TextTool.setEditor(editor);
		}
	};
}