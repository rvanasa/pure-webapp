module.exports = {
	template: require('./app.html'),
	controller: function($route, $location, PageList, BannerService, SessionService)
	{
		var $ctrl = this;
		
		$ctrl.pages = PageList;
		$ctrl.banners = BannerService;
		$ctrl.sessions = SessionService;
		
		$ctrl.sessionPages = ['topic', 'session'];
		$ctrl.menuPages = ['search', 'create', 'customize'];
		
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
	}
};