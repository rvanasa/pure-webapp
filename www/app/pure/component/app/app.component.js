module.exports = {
	template: require('./app.html'),
	controller: function(API, UserService, PageService, SessionService, Alert)
	{
		var $ctrl = this;
		
		var RatingAPI = API.service('ratings');
		
		$ctrl.user = UserService.user;
		
		$ctrl.pages = PageService;
		$ctrl.sessions = SessionService;
		
		$ctrl.sessionPages = ['topic', 'session'];
		$ctrl.menuPages = ['search', 'user', 'profile'];
		
		SessionService.events.on('leave', session =>
		{
			if(session.students.some(user => user._id === UserService.user._id))
			{
				$ctrl.prevSession = session;
			}
		});
		
		
		
		$ctrl.leftPage = function()
		{
			swipePage(-1, 0);
		}
		
		$ctrl.rightPage = function()
		{
			swipePage(1, $ctrl.menuPages.length - 1);
		}
		
		function swipePage(dir, def)
		{
			var index = $ctrl.menuPages.indexOf($route.current && $route.current.id);
			var next = index != -1 ? index + dir : def;
			next = Math.min(Math.max(next, 0), $ctrl.menuPages.length);
			
			$ctrl.setPage($ctrl.menuPages[next]);
		}
		
		$ctrl.submitRating = function()
		{
			var rating = $ctrl.rating;
			var id = $ctrl.prevSession._id;
			
			$ctrl.closeRating();
			return RatingAPI.create(Object.assign(rating, {session: id}))
				.then(() => Alert.toast('Thanks for the feedback!', null, 'success'));
		}
		
		$ctrl.closeRating = function()
		{
			$ctrl.rating = null;
			$ctrl.prevSession = null;
		}
	}
};