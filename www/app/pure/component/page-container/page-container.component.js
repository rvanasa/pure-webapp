var AOS = require('aos');

module.exports = {
	template: require('./page-container.html'),
	transclude: true,
	controller: function()
	{
		var $ctrl = this;
		
		$ctrl.$onInit = function()
		{
			AOS.refresh();
		}
	}
};