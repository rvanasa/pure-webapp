module.exports = {
	template: require('./session-page.html'),
	controller: function($window, $scope, Binder, Alert, PageService, SessionService, UserService, PeerService, ToolService)
	{
		var $ctrl = this;
		
		PageService.info = () => SessionService.current && SessionService.current.topic.name;
		
		$ctrl.sessions = SessionService;
		$ctrl.user = UserService.user;
		
		$ctrl.board = ToolService.getOptions('draw');
		
		$ctrl.screenshotPrefix = 'data:image/png;base64,';
		
		$ctrl.chatInput = null;
		
		$ctrl.sendChat = function()
		{
			if(!$ctrl.chatInput)
			{
				return;
			}
			
			$ctrl.sessions.sendAction('chat', $ctrl.chatInput);
			$ctrl.chatInput = null;
		}
		
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
				
				var duration = session.duration * 60;
				var offset = (session.paused ? 0 : now - new Date(session.durationReceived)) / 1000;
				var time = duration + offset;
				
				// TODO keep active while away from session page
				if(session.interval)
				{
					var remaining = session.interval * 60 - time;
					if(remaining <= 0)
					{
						time = session.interval * 60;
						SessionService.close();
					}
					else if(!(lastWarning <= 60) && remaining <= 60)
					{
						lastWarning = 60;
						Alert.toast(`One minute remaining!`, null, 'warning');
					}
					else if(!(lastWarning <= 15) && remaining <= 15)
					{
						lastWarning = 15;
						Alert.toast(`15 seconds remaining!`, `You can always request another session.`, 'warning');
					}
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