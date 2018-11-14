module.exports = {
	template: `
		<span class="fa-stack">
			<i class="fa fa-stack-2x fa-circle text-light"></i>
			<i class="fa fa-stack-2x fa-certificate text-brand"></i>
			<i class="fa fa-stack-1x text-light" ng-class="'fa-'+$ctrl.badge.icon"></i>
		</span>
	`,
	bindings: {
		badge: '<',
	},
};