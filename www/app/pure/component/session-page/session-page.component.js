module.exports = {
	template: require('./session-page.html'),
	controller: function($window, $scope, Binder, SessionService, PeerService, ToolService, UserService)
	{
		var $ctrl = this;
		
		$ctrl.sessions = SessionService;
		
		$ctrl.board = ToolService.getOptions('draw');
		
		$ctrl.screenshotPrefix = 'data:image/png;base64,';
		
		$ctrl.takeScreenshot = function()
		{
			// $ctrl.board.handle.blob().then(data => console.log(data))////
			$ctrl.sessions.sendAction('screenshot', $ctrl.board.handle.screenshot().substring($ctrl.screenshotPrefix.length));
		}
		
		$ctrl.microphone = false;
		$ctrl.audioLoaded = false;
		
		PeerService.events.on('audio', () => $ctrl.audioLoaded = true);
		
		$ctrl.toggleMicrophone = function(state)
		{
			$ctrl.audioLoaded = false;
			
			state = arguments.length > 0 ? !!state : !$ctrl.microphone;
			$window.localStorage['microphone'] = state;
			if(!$ctrl.isPausing())
			{
				var promise;
				if(state)
				{
					promise = PeerService.enableAudio();
				}
				else
				{
					promise = PeerService.disableAudio();
				}
				promise.then(() => $ctrl.microphone = state);
			}
		}
		
		$ctrl.isPausing = function()
		{
			return SessionService.current && !SessionService.current.available.includes(UserService.user._id);
		}
		
		$ctrl.togglePause = function(state)
		{
			state = arguments.length > 0 ? !!state : !$ctrl.isPausing();
			if(state)
			{
				SessionService.sendAction('leave');
				PeerService.disableAudio();
			}
			else
			{
				SessionService.sendAction('join');
				$ctrl.toggleMicrophone($ctrl.microphone);
			}
		}
		
		$ctrl.tools = ToolService.tools;
		$ctrl.selectedTool = $ctrl.tools[0];
		
		function updateTime(apply)
		{
			if(SessionService.current)
			{
				var duration = SessionService.current.duration * 60;
				var offset = (SessionService.current.paused ? 0 : Date.now() - new Date(SessionService.current.durationReceived)) / 1000;
				var seconds = Math.round(duration + offset);
				if(Number.isNaN(seconds))
				{
					return;
				}
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
		
		if($window.localStorage['microphone'] === 'true')
		{
			$ctrl.toggleMicrophone();
		}
		
		updateTime();
		Binder($ctrl).interval(() => updateTime(true), 500, null, false);
	}
};