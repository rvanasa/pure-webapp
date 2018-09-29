module.exports = {
	template: `
		<span class="btn btn-outline-secondary"
			ng-click="$ctrl.favorites.toggle($ctrl.topic)">
			<i class="fa" ng-class="'fa-'+($ctrl.favorites.has($ctrl.topic) ? 'bookmark text-warning' : 'bookmark-o')"></i>
		</span>`,
	bindings: {
		topic: '<',
	},
	controller: function(FavoriteService)
	{
		var $ctrl = this;
		
		$ctrl.favorites = FavoriteService;
	}
};
