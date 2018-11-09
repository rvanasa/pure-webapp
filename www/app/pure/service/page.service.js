module.exports = function PageService($rootScope, $route, $location, PageList)
{
	this.current = null;
	this.info = null;
	
	this.isPage = function(id)
	{
		return $route.current && $route.current.id === id;
	}
	
	this.getPage = function(id)
	{
		return PageList.find(page => page.id === id);
	}
	
	this.setPage = function(id)
	{
		$location.path('/' + id);
	}
	
	$rootScope.$on('$routeChangeStart', (event, next, current) =>
	{
		this.current = this.getPage(next.id);
		this.info = null;
	});
}