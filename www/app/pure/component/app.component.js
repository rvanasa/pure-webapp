module.exports = {
	template: require('./app.html'),
	controller: function(BannerService)
	{
		var $ctrl = this;
		
		$ctrl.banners = BannerService;
	}
};