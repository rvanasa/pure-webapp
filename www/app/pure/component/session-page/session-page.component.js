module.exports = {
	template: require('./session-page.html'),
	controller: function(Binder, SessionService)
	{
		var $ctrl = this;
		
		$ctrl.sessions = SessionService;
		
		$ctrl.colors = ['#000', '#FFF', '#59F', '#7F7', '#F68'];
		
		$ctrl.options = {
			background: '#343A40',
		};
		
		$ctrl.whiteboardOptions = {
			cursor: {
				color: $ctrl.colors[1],
			},
		};
		
		$ctrl.history = [];
		
		$ctrl.add = function(item)
		{
			$ctrl.history.push(item);
		}
		
		$ctrl.takeScreenshot = function()
		{
			$ctrl.add({
				type: 'screenshot',
				src: $ctrl.whiteboardOptions.board.screenshot(),
			});
		}
		
		function updateTime()
		{
			if(SessionService.current)
			{
				var seconds = Math.round((Date.now() - new Date(SessionService.current.begin)) / 1000);
				var minutes = Math.floor(seconds / 60);
				var hours = Math.floor(minutes / 60);
				$ctrl.time = [hours, minutes % 60, seconds % 60].map(t => String(t).padStart(2, '0')).join(' : ');
			}
		}
		
		updateTime();
		Binder($ctrl).interval(updateTime, 500);
	}
};