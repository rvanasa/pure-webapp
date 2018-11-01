module.exports = {
	template: `
		<span class="btn btn-outline-secondary bg-light"
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
