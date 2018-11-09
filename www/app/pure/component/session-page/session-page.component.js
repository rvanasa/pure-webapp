module.exports = {
	template: require('./session-page.html'),
	controller: function($window, $scope, Binder, Alert, SessionService, PeerService, ToolService, UserService)
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
		
		var lastWarning;
		
		function updateTime(apply)
		{
			if(SessionService.current)
			{
				var now = Date.now();
				var session = SessionService.current;
				
				// if(SessionService.current.end)
				// {
				// 	var remainingMins = (new Date(SessionService.current.end) - now) * 1000 * 60;
					
				// 	if(remainingMins <= 0)
				// 	{
				// 		SessionService.close();
				// 	}
				// 	else if(!lastWarning && remainingMins <= .25)
				// 	{
				// 		lastWarning = true;
				// 		Alert.toast(`15 seconds remaining!`, `You can request another session to continue.`, 'info');
				// 	}
				// }
				
				var duration = session.duration * 60;
				var offset = (session.paused ? 0 : now - new Date(session.durationReceived)) / 1000;
				var time = duration + offset;
				
				var remaining = session.interval * 60 - time;
				if(remaining <= 0)
				{
					time = session.interval * 60;
					SessionService.close();
				}
				else if(!lastWarning && remaining <= 15)
				{
					lastWarning = true;
					Alert.toast(`15 seconds remaining!`, `You can always request another session.`, 'info');
				}
				
				var seconds = Math.round(time);
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