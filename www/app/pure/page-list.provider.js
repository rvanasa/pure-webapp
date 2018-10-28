module.exports = function PageList($routeProvider)
{
	var pages = [];
	
	this.addPage = function(page)
	{
		var template = page.template;
		if(!template)
		{
			var elem = page.elem || page.id + '-page';
			template = `<page-container><${elem}></${elem}></page-container>`;
		}
		
		var data = {
			id: page.id,
			template: template,
		};
		
		var path = page.path || '/' + page.id;
		$routeProvider.when(path, data);
		if(page.params)
		{
			$routeProvider.when(path + page.params.map(s => '/' + s).join(''), data);
		}
		
		if(page.default) $routeProvider.otherwise(page.id);
		
		pages.push(page);
	}
	
	this.$get = function()
	{
		return pages;
	}
}