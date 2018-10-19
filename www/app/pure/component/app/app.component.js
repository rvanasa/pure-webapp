module.exports = {
	template: require('./app.html'),
	controller: function($route, $location, PageList, UserService, SessionService)
	{
		var $ctrl = this;
		
		$ctrl.user = UserService.user;
		
		$ctrl.pages = PageList;
		$ctrl.sessions = SessionService;
		
		$ctrl.sessionPages = ['topic', 'session'];
		$ctrl.menuPages = ['search', 'user', 'customize'];
		
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
	}
};