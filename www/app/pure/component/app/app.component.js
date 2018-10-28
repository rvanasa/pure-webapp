module.exports = {
	template: require('./app.html'),
	controller: function($route, $location, API, PageList, UserService, SessionService, Alert)
	{
		var $ctrl = this;
		
		var RatingAPI = API.service('ratings');
		
		$ctrl.user = UserService.user;
		
		$ctrl.pages = PageList;
		$ctrl.sessions = SessionService;
		
		$ctrl.sessionPages = ['topic', 'session'];
		$ctrl.menuPages = ['search', 'user', 'customize'];
		
		SessionService.events.on('leave', session =>
		{
			if(session.students.some(user => user._id === UserService.user._id))
			{
				$ctrl.prevSession = session;
			}
		});
		
		$ctrl.isPage = function(id)
		{
			return $route.current && $route.current.id == id;
		}
		
		$ctrl.getPage = function(id)
		{
			for(var i = 0; i < $ctrl.pages.length; i++)
			{
				var page = $ctrl.pages[i];
				if(page.id == id) return page;
			}
		}
		
		$ctrl.setPage = function(id)
		{
			$location.path('/' + id);
		}
		
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