module.exports = function PageList($routeProvider)
{
	var pages = [];
	
	this.addPage = function(page)
	{
		var template = page.template;
		if(!template)
		{
			var elem = page.elem || page.id + '-page';
			template = '<' + elem + '></' + elem + '>';
		}
		
		var path = page.path || '/' + page.id;
		
		$routeProvider.when(path, {
			id: page.id,
			template: template,
		});
		
		if(page.default) $routeProvider.otherwise(page.id);
		
		pages.push(page);
	}
	
	this.$get = function()
	{
		return pages;
	}
}