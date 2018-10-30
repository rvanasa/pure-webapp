module.exports = {
	template: `
		<span class="btn-group d-block">
			<span class="btn text-muted"
				ng-repeat="site in $ctrl.shares.sites"
				ng-class="'btn-light'"
				ng-click="$ctrl.shares.startIntent(site.id, $ctrl.intent())">
				<i class="fa-fw fab-color" ng-class="site.icon"></i>
			</span>
		</span>
	`,
	bindings: {
		intent: '&',
	},
	controller: function(ShareService)
	{
		var $ctrl = this;
		
		$ctrl.shares = ShareService;
	}
};