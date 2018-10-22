module.exports = {
	template: require('./session-page.html'),
	controller: function($window, $scope, Binder, SessionService, PeerService, WhiteboardService)
	{
		var $ctrl = this;
		
		$ctrl.sessions = SessionService;
		
		$ctrl.options = WhiteboardService.options;
		
		$ctrl.colors = $ctrl.options.colors;
		$ctrl.board = $ctrl.options.board;
		
		// TODO clear whiteboard on new session
		
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
		
		$ctrl.microphone = false;
		
		$ctrl.toggleMicrophone = function()
		{
			var state = !$ctrl.microphone;
			var promise;
			if(state)
			{
				promise = PeerService.enableAudio();
			}
			else
			{
				promise = PeerService.disableAudio();
			}
			$window.localStorage['microphone'] = state;
			promise.then(() => $ctrl.microphone = state);
		}
		
		if($window.localStorage['microphone'] === 'true')
		{
			$ctrl.toggleMicrophone();
		}
		
		function updateTime(apply)
		{
			if(SessionService.current)
			{
				var seconds = Math.round((Date.now() - new Date(SessionService.current.begin)) / 1000);
				var minutes = Math.floor(seconds / 60);
				var hours = Math.floor(minutes / 60);
				var prevTime = $ctrl.time;
				$ctrl.time = [hours, minutes % 60, seconds % 60].map(t => String(t).padStart(2, '0')).join(' : ');
				if(apply && $ctrl.time !== prevTime)
				{
					$scope.$apply();
				}
			}
		}
		
		updateTime();
		Binder($ctrl).interval(() => updateTime(true), 500, null, false);
	}
};