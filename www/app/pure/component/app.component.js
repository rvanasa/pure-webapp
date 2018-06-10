module.exports = {
	template: require('./app.html'),
	controller: function($route, $location, BannerService, PageList)
	{
		var $ctrl = this;
		
		$ctrl.banners = BannerService;
		$ctrl.pages = PageList;
		
		$ctrl.topPages = ['checklist', 'course', 'school', 'settings'];
		
		$ctrl.isSelected = function(id)
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
			$ctrl.pulldown = false;
		}
	}
};