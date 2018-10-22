module.exports = {
	template: `
		<span ng-class="'btn btn-'+($ctrl.favorites.has($ctrl.topic) ? 'secondary' : 'outline-secondary')"
			ng-click="$ctrl.favorites.toggle($ctrl.topic)">
			<i class="fa-bookmark text-warning" ng-class="$ctrl.favorites.has($ctrl.topic) ? 'fa' : 'far'"></i>
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
