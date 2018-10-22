module.exports = {
	template: `
		<span class="btn-group d-block">
			<span class="btn mx-1"
				ng-repeat="(id, site) in $ctrl.socials.sites"
				ng-class="'btn-'+site.color"
				ng-click="$ctrl.socials.startIntent(id, $ctrl.intent())">
				<i class="fa-fw" ng-class="site.icon"></i>
			</span>
		</span>
	`,
	bindings: {
		intent: '&',
	},
	controller: function(SocialService)
	{
		var $ctrl = this;
		
		$ctrl.socials = SocialService;
	}
};